const Book = require("../models/Book");

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books); //response is json of all the books
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Add a book
exports.addBook = async (req, res) => {
    try {
        const newBook = new Book(req.body); //creates a new book with the body of the request
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
