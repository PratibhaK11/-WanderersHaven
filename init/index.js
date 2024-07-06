
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderer";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = initData.data.map((listing) => {
    if (typeof listing.image === 'object' && listing.image.url) {
      // Update image to be the URL string
      return {
        ...listing,
        image: listing.image.url
      };
    }
    return listing; // Return unchanged if image is not an object with a URL
  });

  try {
    await Listing.insertMany(listings);
    console.log("Data was initialized successfully.");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};


initDB();






// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing"); 

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("Connected to DB");
//     initDB();
//   })
//   .catch((err) => {
//     console.error("Error connecting to DB:", err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// async function initDB() {
//   try {
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");
//   } catch (err) {
//     console.error("Error initializing data:", err);
//   }
// }

