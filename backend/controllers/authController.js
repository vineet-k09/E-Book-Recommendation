//authentication controllers for new user registration and login
// // GET / api / books /: id → Fetch a book by ID
const User = require("../models/User"); //importing user model
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");  // Needed for password hashing

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: "User already exists" }); // if is true if it exists

        const salf = await bcrypt.genSalt(10); //generates a salt for the password
        const hashedPassword = await bcrypt.hash(password, salt); //hashes the password

        user = new User({ username, password: hashedPassword }); //creates a new instace of user model - using the input username and paass
        await user.save(); // saves it to the database

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error: authcontroller.js" });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ msg: "Server Error: authController.js" });
    }
};