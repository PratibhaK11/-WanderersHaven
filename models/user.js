const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        sparse: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
  
    githubId: {
        type: String,
        sparse: true
    }
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
