const Book = require("../models/Book");

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books); //response is json of all the books
    } catch (err) {
        res.status(500).send("Server Error - getBooks");
    }
};

// Add a book
exports.addBook = async (req, res) => {
    try {
        const newBook = new Book(req.body); //creates a new book with the body of the request
        await newBook.save();
        res.json(newBook);
    } catch (err) {
        res.status(500).send("Server Error - addBook");
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
        res.status(500).send("Server Error: bookController.js - getBookById");
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
        res.status(500).send("Server Error - deleteBook");
    }
};

////////////////////////////  important part
// Add interaction (like, bookmark, etc.)
exports.addInteraction = async (req, res) => {
    try {
        const { userId, action } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        // Check if the user has already interacted with this book
        const existingInteraction = book.interactions.find(interaction => interaction.userId === userId);
        if (existingInteraction) {
            return res.status(400).json({ msg: "User has already interacted with this book" });
        }

        // Add the new interaction
        book.interactions.push({ userId, action });
        await book.save();

        res.json(book);
    } catch (err) {
        res.status(500).send("Server Error: addInteraction");
    }
};

//////////////////////
exports.updateInteraction = async (req, res) => {
    try {
        const { userId, action } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        // Find the interaction to update
        const interaction = book.interactions.find(interaction => interaction.userId === userId);
        if (!interaction) {
            return res.status(404).json({ msg: "No interaction found for this user" });
        }

        // Update the action
        interaction.action = action;
        await book.save();

        res.json(book);
    } catch (err) {
        res.status(500).send("Server Error: updateInteraction");
    }
};
//////////////////////////////
exports.removeInteraction = async (req, res) => {
    try {
        const { userId } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: "Book not found" });
        }

        // Remove the interaction for the user
        const index = book.interactions.findIndex(interaction => interaction.userId === userId);
        if (index === -1) {
            return res.status(404).json({ msg: "No interaction found for this user" });
        }

        book.interactions.splice(index, 1);
        await book.save();

        res.json({ msg: "Interaction removed successfully" });
    } catch (err) {
        res.status(500).send("Server Error: removeInteraction");
    }
};
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