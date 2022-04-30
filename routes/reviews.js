const express = require('express');
const router = express();
const { validateReview } = require('../middleware/validatereview');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewControllers = require('../controllers/reviews');

router.post(
  '/campgrounds/:id/reviews',
  isLoggedIn,
  validateReview,
  catchAsync(reviewControllers.createReview)
);

router.delete(
  '/campgrounds/:id/reviews/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewControllers.deleteReview)
);

module.exports = router;
