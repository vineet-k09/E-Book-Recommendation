// this is our express server
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/config");

require("dotenv").config();
connectDB(); // Connect to MongoDB -- async function from config/config.js

const app = express();
app.use(express.json()); // Allow JSON requests
app.use(cors());

// Load routes
app.use("/api/books", require("./routes/bookRoutes")); //loads the page bookRoutes.js

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
