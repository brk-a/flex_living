const express = require('express')
const router = express.Router()
const axios = require('axios')
const SelectedReview = require('../models/SelectedReview')
const asyncHandler = require('../middlewares/asyncHandler')

const HOSTAWAY_API_URL = process.env.HOSTAWAY_API_URL
const ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID
const API_KEY = process.env.HOSTAWAY_API_KEY

// Mock data for tests
const mockHostawayReviews = [
  {
    id: 7453,
    type: "host-to-guest",
    status: "published",
    rating: null,
    publicReview: "Goat Matata and family are wonderful! Would definitely host again :)",
    reviewCategory: [
      { category: "cleanliness", rating: 10 },
      { category: "communication", rating: 10 },
      { category: "respect_house_rules", rating: 10 }
    ],
    submittedAt: "2020-08-21 22:45:14",
    guestName: "Goat Matata",
    listingName: "2B N1 A - 29 Rocky Dam Heights"
  }
];

// Helper function: normalise reviews
function normaliseReviews(rawReviews) {
  return rawReviews.map(r => ({
    id: r.id,
    type: r.type,
    status: r.status,
    rating: r.rating,
    publicReview: r.publicReview,
    reviewCategory: r.reviewCategory,
    submittedAt: new Date(r.submittedAt),
    guestName: r.guestName,
    listingName: r.listingName
  }))
}

// Helper function: Apply filters
function applyFilters(reviews, { rating, category, channel, from, to }) {
  let result = reviews

  if (rating) {
    const ratingNum = Number(rating)
    result = result.filter(r =>
      r.rating === ratingNum || r.reviewCategory.some(c => c.rating === ratingNum)
    )
  }

  if (category) {
    result = result.filter(r => r.reviewCategory.some(c => c.category === category))
  }

  if (channel) {
    result = result.filter(r => r.type === channel)
  }

  if (from) {
    const fromDate = new Date(from)
    result = result.filter(r => r.submittedAt >= fromDate)
  }

  if (to) {
    const toDate = new Date(to)
    result = result.filter(r => r.submittedAt <= toDate)
  }

  return result
}

// GET /api/reviews/hostaway
router.get('/hostaway', asyncHandler(async (req, res) => {
  const { rating, category, channel, from, to, selectedOnly } = req.query

  let reviewsData;
  if (process.env.NODE_ENV === 'test') {
    reviewsData = mockHostawayReviews;
  } else {
    const response = await axios.get(HOSTAWAY_API_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Account-ID': ACCOUNT_ID
      }
    });
    reviewsData = response.data.result || [];
  }

  let reviews = normaliseReviews(reviewsData)

  // If filtering by selected only
  if (selectedOnly === 'true') {
    const selected = await SelectedReview.find({}).distinct('reviewId')
    reviews = reviews.filter(r => selected.includes(r.id))
  }

  // Apply other filters
  reviews = applyFilters(reviews, { rating, category, channel, from, to })

  res.json({ status: 'success', result: reviews })
}))


// POST /api/reviews/selection
router.post('/selection', asyncHandler(async (req, res) => {
  const { reviewId, listingName } = req.body

  if (!reviewId || !listingName) {
    return res.status(400).json({ status: 'error', message: 'reviewId and listingName required' })
  }

  const exists = await SelectedReview.findOne({ reviewId })
  if (exists) {
    return res.status(200).json({ status: 'success', message: 'Already selected' })
  }

  const selectedReview = new SelectedReview({ reviewId, listingName })
  await selectedReview.save()

  res.status(201).json({ status: 'success', message: 'Review marked as selected' })
}))


// DELETE /api/reviews/selection/:reviewId
router.delete('/selection/:reviewId', asyncHandler(async (req, res) => {
  const reviewId = Number(req.params.reviewId)
  const deleted = await SelectedReview.findOneAndDelete({ reviewId })

  if (deleted) {
    res.json({ status: 'success', message: 'Review unmarked as selected' })
  } else {
    res.status(404).json({ status: 'error', message: 'Selected review not found' })
  }
}))

module.exports = router
