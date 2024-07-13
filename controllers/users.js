// users.js (controller)

const passport = require("passport");
const User = require("../models/user");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            req.flash("error", "Username or email is already taken. Please choose another one.");
            return res.redirect("/signup");
        }

        // Create a new user
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        // Log in the new user
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderer's Haven!");
            res.redirect("/listing");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};



// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// users.js - Handle login logic
module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.flash('error', 'Authentication error');
            return res.redirect('/login');
        }
        if (!user) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/login');
        }
        req.login(user, err => {
            if (err) {
                req.flash('error', 'Session error');
                return res.redirect('/login');
            }
            req.flash('success', 'Welcome back!');
            return res.redirect('/listing');
        });
    })(req, res, next);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error logging out:", err);
            // Optionally handle the error here, such as logging it or sending a response
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            req.flash("success", "You are logged out!");
            res.redirect("/listing");
        });
    });
};
