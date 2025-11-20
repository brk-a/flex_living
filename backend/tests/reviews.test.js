const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../server/app')
const SelectedReview = require('../models/SelectedReview')

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await SelectedReview.deleteMany()
})

describe('GET /api/reviews/hostaway', () => {
  it('should return reviews without filters', async () => {
    const res = await request(app).get('/api/reviews/hostaway')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('success')
    expect(Array.isArray(res.body.result)).toBe(true)
  })

  it('should filter reviews by exact rating', async () => {
    const res = await request(app).get('/api/reviews/hostaway?rating=10')
    expect(res.statusCode).toBe(200)
    expect(res.body.result.every(r => r.rating === 10 || r.reviewCategory.some(c => c.rating === 10))).toBe(true)
  })

  it('should filter reviews by nonexistent rating and return empty', async () => {
    const res = await request(app).get('/api/reviews/hostaway?rating=999')
    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBe(0)
  })

  it('should filter reviews by category', async () => {
    const res = await request(app).get('/api/reviews/hostaway?category=cleanliness')
    expect(res.statusCode).toBe(200)
    expect(res.body.result.every(r => r.reviewCategory.some(c => c.category === 'cleanliness'))).toBe(true)
  })

  it('should return empty for non-existent category', async () => {
    const res = await request(app).get('/api/reviews/hostaway?category=fakecategory')
    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBe(0)
  })

  it('should filter reviews by channel', async () => {
    const res = await request(app).get('/api/reviews/hostaway?channel=host-to-guest')
    expect(res.statusCode).toBe(200)
    expect(res.body.result.every(r => r.type === 'host-to-guest')).toBe(true)
  })

  it('should filter reviews by date range', async () => {
    const from = '2020-01-01'
    const to = '2021-01-01'
    const res = await request(app).get(`/api/reviews/hostaway?from=${from}&to=${to}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.every(r => {
      const date = new Date(r.submittedAt)
      return date >= new Date(from) && date <= new Date(to)
    })).toBe(true)
  })

  it('should filter reviews by selectedOnly=true', async () => {
    await SelectedReview.create({ reviewId: 7453, listingName: '2B N1 A - 29 Shoreditch Heights' })
    const res = await request(app).get('/api/reviews/hostaway?selectedOnly=true')
    expect(res.statusCode).toBe(200)
    expect(res.body.result.every(r => r.id === 7453)).toBe(true)
  })
})

describe('POST /api/reviews/selection', () => {
  it('should create a new selected review entry', async () => {
    const res = await request(app).post('/api/reviews/selection').send({ reviewId: 1234, listingName: 'Test Listing' })
    expect(res.statusCode).toBe(201)
    expect(res.body.status).toBe('success')
    const record = await SelectedReview.findOne({ reviewId: 1234 })
    expect(record).not.toBeNull()
  })

  it('should return 400 for missing required fields', async () => {
    const res = await request(app).post('/api/reviews/selection').send({})
    expect(res.statusCode).toBe(400)
  })

  it('should not allow duplicate selection entries', async () => {
    await SelectedReview.create({ reviewId: 1, listingName: 'Test' })
    const res = await request(app).post('/api/reviews/selection').send({ reviewId: 1, listingName: 'Test' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message.toLowerCase()).toContain('already selected')
  })
})

describe('DELETE /api/reviews/selection/:reviewId', () => {
  it('should delete an existing selected review', async () => {
    await SelectedReview.create({ reviewId: 2, listingName: 'DeleteTest' })
    const res = await request(app).delete('/api/reviews/selection/2')
    expect(res.statusCode).toBe(200)
    const record = await SelectedReview.findOne({ reviewId: 2 })
    expect(record).toBeNull()
  })

  it('should return 404 for deleting non-existing selection', async () => {
    const res = await request(app).delete('/api/reviews/selection/9999')
    expect(res.statusCode).toBe(404)
  })
})
