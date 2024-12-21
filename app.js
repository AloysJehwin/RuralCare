// Filename: App.js

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/User"); // Make sure you have a model/User.js file
require("dotenv").config();

const app = express();

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/auth_demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: process.env.SESSION_SECRET || "This is a secret key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
// Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// Secret Page (protected route)
app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
});

// Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// Register User
app.post("/register", async (req, res) => {
    try {
        const user = await User.register(new User({ username: req.body.username }), req.body.password);
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secret");
        });
    } catch (err) {
        console.error(err);
        res.render("register");
    }
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// Login User
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}));

// Logout User
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Middleware for Protected Routes
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
