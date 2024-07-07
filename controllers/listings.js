const Listing = require("../models/listing.js")

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
};

module.exports.renderNewForm = async (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res) =>{
    //let {title, description, image, price, country, location} = req.body;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", {listing});

};

module.exports.updateListing = async (req,res) =>{
    
    let {id} = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}