const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createNewReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  review.author = req.user._id;
  await review.save();
  await campground.save();
  req.flash("success", "New review submitted");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { reviewId, id } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/campgrounds/${id}`);
};
