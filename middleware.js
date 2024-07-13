const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schemas.js");




module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (!req.isAuthenticated() && !req.session.redirectUrl) {
        req.session.redirectUrl = req.originalUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req, res, next) =>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
