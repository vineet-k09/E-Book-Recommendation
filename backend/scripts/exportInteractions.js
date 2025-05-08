// const mongoose = require("mongoose");

// const Books = require("../models/Book");

// const MONGO_URI = "mongodb://localhost:27017/ebooks"

// mongoose.connect(MONGO_URI)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.error("MongoDB connection error:", err));


// async function getBooks() {
//     console.log("Fetching books...");
//     try {

//         console.log("Fetching books...2");
//         const books = await Books.find().lean();

//         for (let i of books) {
//             if (i.interactions) {
//                 console.log("Fetching books...3");
//                 console.log(i.interactions);
//             }
//         }
//     } catch (error) {
//         console.error("Error fetching books:", error);
//     }
// }

// getBooks();