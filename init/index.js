const mongoose = require('mongoose');
const Listing = require('../models/listing'); // Adjust path as per your project structure
const initData = require('./data'); // Assuming this is where your data is defined

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderer";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        await initDB(); // Call initDB after connecting to MongoDB
    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        mongoose.connection.close(); // Close connection after initialization
        console.log("Disconnected from DB");
    }
}

async function initDB() {
    try {
        await Listing.deleteMany({});

        const listings = initData.data.map((listing) => {
            // Ensure listing has image object with url property
            if (listing.image && typeof listing.image === 'object' && listing.image.url) {
                return {
                    ...listing,
                    image: listing.image // Should be { url: listing.image.url, filename: listing.image.filename }
                };
            }
            return listing; // Return unchanged if no valid image URL found
        });

        // Add owner property to each listing object
        const listingsWithOwner = listings.map((obj) => ({
            ...obj,
            owner: "66898557e874904c63af58ec" // Assuming this is a valid owner ID
        }));

        await Listing.insertMany(listingsWithOwner);
        console.log("Data was initialized successfully.");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
}

main();

