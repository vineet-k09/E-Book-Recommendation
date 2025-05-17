const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// 🚀 Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({
            msg: "User registered successfully",
            user: {
                id: user.id,
                name: user.username,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error: authController.js" });
    }
};

// 🚀 Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "Invalid username" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        // Create JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // front end will store thet token in local storage
        res.json({
            msg: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.username,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error: authController.js" });
    }
};
