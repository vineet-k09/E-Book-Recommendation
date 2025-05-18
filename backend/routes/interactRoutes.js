// routes/interactRoutes.js or a similar file
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/interact", async (req, res) => {
    const { bookId, action } = req.body;
    const userId = req.user.id;

    if (!bookId || !action || !userId) {
        return res.status(400).json({ error: `Missing fields - interactRoute.js ${bookId}, ${action}, ${userId}` });
    }

    try {
        await Book.findByIdAndUpdate(bookId, {
            $push: {
                interactions: { userId, action }
            }
        });
        res.json({ message: "Interaction logged" });
    } catch (err) {
        console.error("Error logging interaction(interactRoutes.js):", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
