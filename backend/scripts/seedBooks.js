const mongoose = require("mongoose");
const axios = require("axios");
const Book = require("../models/Book");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Genres and their Open Library subjects
const genres = [
    { subject: "horror", name: "Horror" },
    { subject: "humor", name: "Comedy" },
    { subject: "mystery", name: "Mystery" },
    { subject: "thriller", name: "Crime Thriller" },
    { subject: "romance", name: "Romance" },
    { subject: "fantasy", name: "Fantasy" },
    { subject: "science_fiction", name: "Sci-Fi" },
    { subject: "adventure", name: "Adventure" },
    { subject: "historical_fiction", name: "Historical Fiction" },
];

const fetchLimit = 20; // books per genre

const seedBooks = async () => {
    try {
        for (const genre of genres) {
            const response = await axios.get(`https://openlibrary.org/subjects/${genre.subject}.json?limit=${fetchLimit}`);
            const books = response.data.works;

            for (const item of books) {
                // Mix in extra genres for ~70% of books
                const randomGenres = [genre.name];
                if (Math.random() < 0.7) {
                    const otherGenres = genres
                        .filter(g => g.name !== genre.name)
                        .sort(() => 0.5 - Math.random()) // shuffle
                        .slice(0, 2)
                        .map(g => g.name);
                    randomGenres.push(...otherGenres);
                }

                const bookData = {
                    title: item.title,
                    author: item.authors[0]?.name || "Unknown Author",
                    genre: [...new Set(randomGenres)], // remove duplicates
                    description: item.subject ? item.subject.join(", ") : "No description available",
                    interactions: [],
                };

                const existingBook = await Book.findOne({ title: bookData.title, author: bookData.author });
                if (!existingBook) {
                    await Book.create(bookData);
                    console.log(`Inserted: ${bookData.title} [${bookData.genre.join(", ")}]`);
                } else {
                    console.log(`Skipped (exists): ${bookData.title}`);
                }
            }
        }

        console.log("✅ Seeding completed!");
    } catch (err) {
        console.error("❌ Error during seeding:", err);
    } finally {
        mongoose.disconnect();
    }
};

seedBooks();
