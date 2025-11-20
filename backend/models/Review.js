const mongoose = require('mongoose')

const reviewCategorySchema = new mongoose.Schema({
  category: String,
  rating: Number
})

const reviewSchema = new mongoose.Schema({
  id: Number,
  type: String,
  status: String,
  rating: Number,
  publicReview: String,
  reviewCategory: [reviewCategorySchema],
  submittedAt: Date,
  guestName: String,
  listingName: String
})

module.exports = mongoose.model('Review', reviewSchema)
