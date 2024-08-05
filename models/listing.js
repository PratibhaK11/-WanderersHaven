const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  bookingCount: {
    type: Number,
    default: 0
  },
  category: {
    type: [String],
    enum: ['Castles', 'Mountains', 'Iconic Cities', 'Room', 'Boats', 'Arctic', 'Farms', 'Camping', 'Amazing Pools'],
    required: true,
    default: [] // Default to an empty array if not provided
}

});

// Post hook to delete related reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function(listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
