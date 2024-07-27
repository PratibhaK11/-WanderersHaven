const Listing = require('../models/listing');

// Function to handle search logic
const searchListings = async (req, res, next) => {
    try {
        const { q, sort } = req.query;
        const regex = new RegExp(escapeRegex(q || ''), 'gi'); // Default to empty string if q is not provided

        console.log('Search Query:', q);
        console.log('Sort Parameter:', sort);

        // Set sorting options based on the `sort` parameter
        const sortOptions = {};
        switch (sort) {
            case 'location':
                sortOptions.location = 1; // Ascending
                break;
            case 'price_asc':
                sortOptions.price = 1; // Ascending
                break;
            case 'price_desc':
                sortOptions.price = -1; // Descending
                break;
            default:
                // Default sorting (optional)
                break;
        }

        console.log('Sort Options:', sortOptions);

        // Query by title or other fields
        const listings = await Listing.find({ title: regex }).sort(sortOptions).exec();

        // Increment search count
        for (let listing of listings) {
            if (listing.searchCount < 10) {
                listing.searchCount = (listing.searchCount || 0) + 1;
                await listing.save();
            }
        }

        res.json(listings);
    } catch (err) {
        console.error('Error searching listings:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper function to escape special regex characters
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
    searchListings
};
