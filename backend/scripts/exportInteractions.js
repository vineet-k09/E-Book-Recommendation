//scripts/exportInteractions.js

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Books = require("../models/Book");

const MONGO_URI = "mongodb://localhost:27017/ebooks";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

async function exportInteractions() {
    try {
        const books = await Books.find({ interactions: { $exists: true, $ne: [] } }).lean();
        const allInteractions = [];

        for (const book of books) {
            for (const interaction of book.interactions) {
                allInteractions.push({
                    bookId: book._id,
                    title: book.title,
                    userId: interaction.userId,
                    action: interaction.action,
                    timestamp: interaction.timestamp,
                });
            }
        }

        const exportPath = path.join(__dirname, "exports", "hdfs", "interactions.json");
        fs.writeFileSync(exportPath, JSON.stringify(allInteractions, null, 2));

        console.log(`✅ Exported ${allInteractions.length} interactions to ${exportPath}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error exporting interactions:", error);
        process.exit(1);
    }
}

exportInteractions();


// Remove These(If They Exist)
// To avoid collision or legacy junk:

// hdfs dfs - rm - r / user / root / output(or any output /)

// hdfs dfs - rm / user / root / interactions.json

// Clean up output directories if you previously used them for MapReduce


// Hive table creation:

// sql
// Copy
// Edit
// CREATE EXTERNAL TABLE interactions(
//     bookId STRING,
//     bookTitle STRING,
//     userId STRING,
//     action STRING,
//     timestamp STRING
// )
// ROW FORMAT DELIMITED
// FIELDS TERMINATED BY ','
// STORED AS TEXTFILE
// LOCATION '/data/interactions/';