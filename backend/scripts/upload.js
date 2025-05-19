// scripts/upload.js
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const Book = require("../models/Book");

// Local path to store exported interactions
const EXPORT_FOLDER = path.join(__dirname, "exports", "hdfs");
const EXPORT_FILE = path.join(EXPORT_FOLDER, "interactions_lines.json");

// HDFS path (you can change this if needed)
const HDFS_PATH = "/user/vineet/interactions/interactions_lines.json";


// Main logic
async function exportAndUpload() {
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