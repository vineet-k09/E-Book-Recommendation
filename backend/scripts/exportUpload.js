// scripts/exportUpload.js

// 📚 Fetching books with interactions...
// ✅ Connected to MongoDB
// ✅ Exported 646 interactions to: E: \GithubRepo\E - Book - Recommendation\backend\scripts\exports\hdfs\interactions.json
// ⏫ Uploading to HDFS: /user/vineet / interactions / interactions.json ...
// ✅ Successfully uploaded to HDFS at / user / vineet / interactions / interactions.json

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const Book = require("../models/Book");

// MongoDB URI
const MONGO_URI = "mongodb://localhost:27017/ebooks";

// Local path to store exported interactions
const EXPORT_FOLDER = path.join(__dirname, "exports", "hdfs");
const EXPORT_FILE = path.join(EXPORT_FOLDER, "interactions_lines.json");

// HDFS path (you can change this if needed)
const HDFS_PATH = "/user/vineet/interactions/interactions_lines.json";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// Main logic
async function exportAndUpload() {
    try {
        // Create export folder if not exists
        if (!fs.existsSync(EXPORT_FOLDER)) {
            fs.mkdirSync(EXPORT_FOLDER, { recursive: true });
        }

        console.log("📚 Fetching books with interactions...");
        const books = await Book.find({ interactions: { $exists: true, $ne: [] } }).lean();
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

        // Save to local JSON
        fs.writeFileSync(EXPORT_FILE, JSON.stringify(allInteractions, null, 2));
        console.log(`✅ Exported ${allInteractions.length} interactions to: ${EXPORT_FILE}`);

        // Upload to HDFS
        console.log(`⏫ Uploading to HDFS: ${HDFS_PATH} ...`);

        const putCommand = `hdfs dfs -mkdir -p ${path.dirname(HDFS_PATH)} && hdfs dfs -put -f "${EXPORT_FILE}" "${HDFS_PATH}"`;

        exec(putCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Error uploading to HDFS: ${error.message}`);
                process.exit(1);
            }
            if (stderr) {
                console.warn(`⚠️ HDFS stderr: ${stderr}`);
                // process.exit(0);
            }
            console.log(`✅ Successfully uploaded to HDFS at ${HDFS_PATH}`);
            process.exit(0);
        });

    } catch (err) {
        console.error("❌ Error during export/upload:", err);
        process.exit(1);
    }
}

exportAndUpload();


// Fetching books with interactions...
// ✅ Connected to MongoDB
// ✅ Exported 646 interactions to: E: \GithubRepo\E - Book - Recommendation\backend\scripts\exports\hdfs\interactions.json
// ⏫ Uploading to HDFS: /user/vineet / interactions / interactions.json ... 
// ⚠️ HDFS stderr: mkdir: Call From Vineet / 192.168.75.176 to localhost: 90000 failed on connection exception: java.net.ConnectException: Connection refused: no further information; For more details see: http://wiki.apache.org/hadoop/ConnectionRefused
// put: Call From Vineet / 192.168.75.176 to localhost: 9000 failed on connection exception: java.net.ConnectException: Connection refused: no further information; For more details see: http://wiki.apache.org/hadoop/ConnectionRefused

// ✅ Successfully uploaded to HDFS at / user / vineet / interactions / interactions.json
// PS E: \GithubRepo\E - Book - Recommendation > 