// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const Review = require("./reviews.js");

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     url: String,
//     filename: String,
// },
//   price: Number,
//   location: String,
//   country: String,
//   reviews: [
//     {
//         type: Schema.Types.ObjectId,
//         ref: "Review"
//     }
//   ],

//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User"
//   },

// });

// listingSchema.post("findOneAndDelete", async (listing) => {
//   if(listing){
//     await Review.deleteMany({_id: {$in: listing.reviews}});
//   }

// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;



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
      
    },
    coordinates: {
      type: [Number],
     
    }
  },
  bookingCount: {
    type: Number,
    default: 0
  },
 
  category: {
    type: [String],
    enum: ['Castles', 'Mountains', 'Iconic Cities', 'Room', 'Boats', 'Arctic', 'Farms', 'Camping', 'Amazing Pools'],
    required: true
  }

});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
