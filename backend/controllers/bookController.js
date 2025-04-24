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
// so api/books dumps all the books at once... but as it is the backend we would need it to send books one by one by thier ids
exports.getBookById = async (req, res) => {
    try {
        //console.log("Requested ID:", req.params.id);
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ msg: "BOok not found" });
        }
        res.json(book);
    } catch (err) {
        res.status(500).send("Server Error: bookController.js")
    }
}

/////////////////////////////
//now for updateing a book by its id
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //it will return updated book
            runValidators: true, //validates the updates
        })
        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        res.json(book);
    } catch (err) {
        res.status(500).send("Server Error: bookController.js - updateBook")
    }
}

///////////////////////////
//delete that thang
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        res.json({ msg: "Book deleted successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
//////////////////////
//adding a proxy book to get started
// exports.addDefaultBook = async (req, res) => {
//     try {
//         const book = new Book({
//             title: "Sample Book",
//             author: "John Doe",
//             genre: ["Fiction"],
//             description: "A sample book added manually.",
//             interactions: [],
//         });

//         await book.save();
//         res.json(book);
//     } catch (err) {
//         res.status(500).send("Server Error");
//     }
// };