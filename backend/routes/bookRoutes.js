//this is for setting up the routes for navigation
const express = require("express");
const router = express.Router();

//modifying bookroutes to protect the routes
const authMiddleware = require("../middleware/authMiddleware");

const { getBooks,
    addBook,
    getBookById,
    updateBook,
    deleteBook,
    // addDefaultBook
} = require("../controllers/bookController");

//require book controller
router.get("/", authMiddleware, getBooks);
router.post("/", authMiddleware, addBook);
router.get("/:id", authMiddleware, getBookById); // exported from bookController.js
router.put("/:id", authMiddleware, updateBook); // exported from bookController.js
router.delete("/:id", authMiddleware, deleteBook); // exported from bookController.js
// router.post("/addSample", addDefaultBook); //sample -- delete later
module.exports = router;