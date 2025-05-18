// routes/interactRoutes.js 
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/interact", async (req, res) => {
    const { bookId, action, userId } = req.body;

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

router.get("/interact", async (req, res) => {
    const userId = req.query.userId; // <-- So we only send *this user's* logs

    try {
        const booksWithInteractions = await Book.find(
            { "interactions.0": { $exists: true } },
            { _id: 1, interactions: 1 }
        ).lean();

        const logs = [];

        for (const book of booksWithInteractions) {
            for (const interaction of book.interactions) {
                if (interaction.userId === userId) {
                    logs.push({
                        bookId: book._id.toString(),
                        action: interaction.action,
                    });
                }
            }
        }

        res.json({ logs });
    } catch (err) {
        console.error("Error fetching interaction logs (interactRoutes.js):", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
