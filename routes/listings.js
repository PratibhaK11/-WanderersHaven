const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route: Lists all listings
router.get("/", wrapAsync(listingController.index));

// Create route: Creates a new listing
router.post("/", 
    isLoggedIn, 
    upload.single('listing[image]'), 
    validateListing, 
    wrapAsync(listingController.createListing)
);

// New listing form: Renders the form to create a new listing
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

// Trending listings: Shows trending listings
router.get("/trending", wrapAsync(listingController.showTrendingListings));

// Show a specific listing
router.get("/:id", wrapAsync(listingController.showListing));

// Edit form for a specific listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update a specific listing
router.put("/:id", 
    isLoggedIn, 
    upload.single('listing[image]'), 
    isOwner, 
    validateListing, 
    wrapAsync(listingController.updateListing)
);

// Delete a specific listing
router.delete("/:id", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.destroyListing)
);

module.exports = router;
