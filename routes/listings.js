const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index)) // Index route
    .post(isLoggedIn, 
          upload.single('listing[image]'), 
          validateListing, 
          wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.get("/trending", wrapAsync(listingController.showTrendingListings));

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show route
    .put(isLoggedIn, 
         upload.single('listing[image]'), 
         isOwner, 
         validateListing, 
         wrapAsync(listingController.updateListing)
    ) // Update route
    .delete(isLoggedIn, 
            isOwner, 
            wrapAsync(listingController.destroyListing)
    ); // Delete route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
