const Listing = require('../models/listing');

// Function to handle search logic
const searchListings = async (req, res, next) => {
    try {
        const { q } = req.query;
        const regex = new RegExp(escapeRegex(q), 'gi');
        const listings = await Listing.find({ title: regex }).exec();
        res.render('search/results', { listings });
    } catch (err) {
        console.error('Error searching listings:', err);
        next(err);
    }
};

// Helper function to escape special regex characters
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
    searchListings
};
