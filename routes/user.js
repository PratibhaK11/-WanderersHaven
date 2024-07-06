const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try{
        let {username, email, password} =req.body;
    const newUser = new User({email, username});

    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderer's Haven");
        res.redirect("/listing");
    })
    
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}));

router.get("/login", (req, res) =>{
    res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), 
    async(req, res) =>{
        req.flash("success", "Welcome back to Wanderer's Haven");
        res.redirect("/listing");
});


router.get("/logout", async(req, res, next) =>{
    req.logout((err) =>{
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    })
})

module.exports = router;