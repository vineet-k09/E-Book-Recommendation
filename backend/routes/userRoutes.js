//for storing user preference from recoomend.ysx
//routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // your user model
const authenticate = require("../middleware/authMiddleware"); // middleware to verify token
const Book = require("../models/Book");


// for adding prefrence in mongodb from recommed page
router.post('/preferences', authenticate, async (req, res) => {
    const { genres } = req.body;
    console.log("Genres received:", genres);
    if (!genres || !Array.isArray(genres)) return res.status(400).json({ error: "Invalid genres" });
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $set: { preferredGenres: genres }
        },
            { new: true }
        );
        res.status(200).json({ message: "Preferences saved" });
    } catch (err) {
        console.error("Error saving preferences:(userRoutes.js)", err);
        res.status(500).json({ error: "Failed to save preferences" });
    }
});

// for showing recommend from mongodb in index page
router.get('/recommendations', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ error: 'No user found' });
        }
        if (!user.preferredGenres) {
            console.log(`${preferredGenres}`)
            return res.status(400).json({ error: 'No preferred genres found' });
        }

        const recommendedBooks = await Book.find({
            genre: { $in: user.preferredGenres }
        }).limit(15);

        console.log(
            "Recommended books sent to client:",
            recommendedBooks.map(book => book.title),
            user.preferredGenres
        );

        const exploreBooks = await Book.find({
            genre: { $nin: user.preferredGenres }
        }).limit(15);

        res.json({ recommended: recommendedBooks, explore: exploreBooks });
    } catch (err) {
        console.error("Error fetching recommended books:(userRoutes.js)", err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
