//this is for setting up the routes for navigation
const express = require("express");
const { getBooks, addBook } = require("../controllers/bookController");
//require book controller
const router = express.Router();
router.get("/", getBooks);
router.post("/", addBook);

module.exports = router;
