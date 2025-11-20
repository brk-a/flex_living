const mongoose = require('mongoose')

const selectedReviewSchema = new mongoose.Schema({
  reviewId: { type: Number, required: true, unique: true },
  listingName: { type: String, required: true },
  // additional fields like approval date or managerId can be added if needed
}, { timestamps: true })

module.exports = mongoose.model('SelectedReview', selectedReviewSchema)
