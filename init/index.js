require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/listing'); 
const initData = require('./data'); 

const MONGO_URL="mongodb+srv:";

const User = require('../models/user'); 
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
        let user;
        // Find an existing user or create a new one
        user = await User.findOne(); 

        if (!user) {
            // If no user found, create one
            user = new User({
                username: 'testUser',
                email: 'test@example.com',
                password: 'password' 
            });
            await user.setPassword('password'); // Set and hash password
            await user.save();
        }

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
            owner: user._id // Use the user's ObjectId
        }));
        
        await Listing.insertMany(listingsWithOwner);
        console.log("Data was initialized successfully.");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
}
main();