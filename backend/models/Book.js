//this is to store the book details also this will store what the user did to this book - user action could be bookmark like dislike or read
const mongoose = require("mongoose");
//basically a schmea for mongodb
const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: [String], //array containing strings for multiple genre
    interactions: [{ userId: String, action: String, timestamp: Date }]
});

module.exports = mongoose.model("Book", BookSchema);
