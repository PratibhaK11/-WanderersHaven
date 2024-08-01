const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

exports.showTrendingListings = async (req, res) => {
    console.log('Trending route hit');
    try {
        const listings = await Listing.find()
            .sort({ searchCount: -1, bookingCount: -1 }) // Sort by search count and booking count
            .exec();

        res.json(listings); // Return JSON response
    } catch (err) {
        console.error('Error fetching trending listings:', err);
        res.status(500).json({ error: 'Failed to fetch trending listings' });
    }
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    console.log("Populated Listing:", listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    try {
        // Geocode the location
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        // Extract the image file information
        const { path: url, filename } = req.file;

        // Create a new listing object
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;

        // Ensure category is an array (handles single/multiple category cases)
        if (!Array.isArray(newListing.category)) {
            newListing.category = [newListing.category];
        }

        // Save the new listing to the database
        let savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing Created!");
        res.redirect("/listing");

    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Failed to create listing.");
        res.redirect("/listing/new");
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let { path: url, filename } = req.file;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listing");
    } catch (err) {
        console.error("Error deleting listing:", err);
        req.flash("error", "Failed to delete listing.");
        res.redirect("/listing");
    }
}
