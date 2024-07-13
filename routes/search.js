// const express = require('express');
// const router = express.Router();
// const Listing = require('../models/listing');

// // Helper function to escape special regex characters
// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// }

// // Search route
// router.get('/', async (req, res, next) => {
//     try {
//         const { q } = req.query; // Assuming search query parameter is 'q'
//         if (!q) {
//             // If no search query is provided, handle accordingly
//             return res.redirect('/'); // Redirect to homepage or handle appropriately
//         }
//         const regex = new RegExp(escapeRegex(q), 'gi'); // Creating case-insensitive regex pattern
//         const listings = await Listing.find({ title: regex }).exec(); // Example: searching by listing title
//         res.render('search/results.ejs', { listings }); // Render search results page
//     } catch (err) {
//         console.error('Error searching listings:', err);
//         next(err); // Pass error to Express error handler
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

// Helper function to escape special regex characters
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Search route
router.get('/', async (req, res, next) => {
    try {
        const { q } = req.query;

        let query = {};

        // Handle search by title or location
        if (q) {
            const regexQuery = new RegExp(escapeRegex(q), 'gi');
            query = {
                $or: [
                    { title: regexQuery },
                    { location: regexQuery }
                ]
            };
        }

        // Perform the search query
        const listings = await Listing.find(query).exec();

        res.render('search/results.ejs', { listings });

    } catch (err) {
        console.error('Error searching listings:', err);
        next(err); // Pass error to Express error handler
    }
});

module.exports = router;
