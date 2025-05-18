//this is to store the book details also this will store what the user did to this book - user action could be bookmark like dislike or read
//model/book.js
const mongoose = require("mongoose");
//basically a schmea for mongodb
const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: [{ type: String, required: true }], //array containing strings for multiple genre
    description: { type: String },
    interactions: [{
        userId: { type: String, required: true },
        action: { type: String, enum: ['bookmark', 'like', 'dislike', 'read', 'click'], required: true },
        timestamp: { type: Date, default: Date.now },
    }]
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;