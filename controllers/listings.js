const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    try {
        const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });
    } catch (error) {
        console.error('Error fetching listings:', error);
        req.flash('error', 'Failed to fetch listings');
        res.redirect('/'); // Redirect to a safe route
    }
};

module.exports.showTrendingListings = async (req, res) => {
    console.log('Trending route hit');
    try {
        const listings = await Listing.find()
            .sort({ searchCount: -1, bookingCount: -1 }) // Sort by search count and booking count
            .exec();
        res.json(listings); // Return JSON response
    } catch (error) {
        console.error('Error fetching trending listings:', error);
        res.status(500).json({ error: 'Failed to fetch trending listings' });
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
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
            return res.redirect("/listings");
        }
        console.log("Populated Listing:", listing);
        const mapboxToken = process.env.MAP_TOKEN;
        res.render("listings/show.ejs", { listing, mapboxToken }); // render listing with map
    } catch (error) {
        console.error('Error showing listing:', error);
        req.flash('error', 'Failed to show listing');
        res.redirect('/listings');
    }
};

module.exports.createListing = async (req, res) => {
    try {
        const { title, description, price, location, country } = req.body.listing;
        const image = req.file ? { url: req.file.path, filename: req.file.filename } : undefined;
        
        const newListing = new Listing({
            title,
            description,
            price,
            location,
            country,
            image,
            owner: req.user._id,
            geometry: {
                type: 'Point',
                coordinates: [/* Longitude, Latitude */]
            }
        });

        await newListing.save();
        req.flash('success', 'Listing created successfully!');
        res.redirect('/listing');
    } catch (error) {
        console.error('Error creating listing:', error);
        req.flash('error', 'Failed to create listing');
        res.redirect('/listing/new');
    }
};

module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (error) {
        console.error('Error rendering edit form:', error);
        req.flash('error', 'Failed to load edit form');
        res.redirect('/listings');
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        const { title, description, price, location, country } = req.body.listing;
        const image = req.file ? { url: req.file.path, filename: req.file.filename } : undefined;
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                price,
                location,
                country,
                image: image ? image : undefined,
            },
            { new: true }
        );

        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listing/${updatedListing._id}`);
    } catch (error) {
        console.error('Error updating listing:', error);
        req.flash('error', 'Failed to update listing');
        res.redirect(`/listing/${req.params.id}/edit`);
    }
};

module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    } catch (error) {
        console.error('Error deleting listing:', error);
        req.flash('error', 'Failed to delete listing');
        res.redirect('/listings');
    }
};
