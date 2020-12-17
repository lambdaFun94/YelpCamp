const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/wrapAsync");
const { isReviewAuthor, validateReview, isLoggedIn } = require("../middleware");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const Campground = require("../models/campground");
const ExpressError = require("../utilities/ExpressError");

//Routes
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviews.createNewReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.destroyReview)
);

module.exports = router;
