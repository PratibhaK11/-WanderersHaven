const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schemas.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else{
        next();
    }
};

//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}));

//new Route
router.get("/new", isLoggedIn, wrapAsync(async (req, res) =>{
    res.render("listings/new.ejs");
}));

//show route
router.get("/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", {listing});
}));

//create Route
router.post("/", isLoggedIn, validateListing,
     wrapAsync(async (req, res) =>{
    //let {title, description, image, price, country, location} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", {listing});

}));

//Update Route
router.put("/:id", isLoggedIn, validateListing, 
    wrapAsync(async (req,res) =>{
    
    let {id} = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}));

module.exports = router;