const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const campgrounds = require("../controllers/campgrounds");
const { validateCampground, isAuthor, isLoggedIn } = require("../middleware");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.createNewCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    wrapAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.destroyCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.renderEditForm)
);

module.exports = router;
