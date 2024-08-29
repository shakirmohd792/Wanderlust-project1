const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwned, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.createListing));
  

// New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn, 
    isOwned,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwned, wrapAsync(listingController.destroyListing));

// Edit Route 
router.get("/:id/edit", isLoggedIn, isOwned, wrapAsync(listingController.renderEditForm));

module.exports = router;