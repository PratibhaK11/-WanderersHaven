const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middleware.js'); 
const passport = require("passport");

const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm) // GET request to "/signup" - render signup form
    .post(wrapAsync(userController.signup)); // POST request to "/signup" - handle signup process

    router.route("/login")
    .get(userController.renderLoginForm) // GET request to "/login" - render login form
    .post(
        saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        userController.login
    ); // POST request to "/login" - handle login process

router.get("/logout", userController.logout)

module.exports = router;