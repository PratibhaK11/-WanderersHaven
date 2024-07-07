const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


//index route
router.get("/", wrapAsync(listingController.index));

//new Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//create Route
router.post("/", isLoggedIn, validateListing,
     wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, 
    wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner,
    validateListing, 
    wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn,isOwner, 
    wrapAsync(listingController.destroyListing));

module.exports = router;