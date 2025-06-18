// this is our express server
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/config");
const bookRoutes = require("./routes/bookRoutes"); //imports book routessss
const authRoutes = require("./routes/authRoutes"); //for authentication
const userRoutes = require("./routes/userRoutes");
const interactRoutes = require("./routes/interactRoutes");


require("dotenv").config();
connectDB(); // Connect to MongoDB -- async function from config/config.js

const app = express();
app.use(express.json()); // Allow JSON requests
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.75.176:3000', 'https://e-book-recommendation.vercel.app'],
    credentials: true,
}));
// “Hey browser, I approve requests coming from these two origins:
// http://localhost:3000 and http://192.168.75.176:3000.”
// backend is on port 5000

app.use("/api/auth", authRoutes); //loads the page authRoutes.js
app.get("/api/auth", (req, res) => {
    res.send("Welcome to the auth api!")
})
// Load routes
app.use("/api/books", bookRoutes); //loads the page bookRoutes.js
app.get("/api/books", (req, res) => {
    res.send("Welcome to the books api!")
})

app.use("/api/user", userRoutes);       // So /api/user/preferences, /api/user/recommendations
app.get("/api/user", (req, res) => {
    res.send("Welcome to the user api!")
})

app.use("/api", interactRoutes);  // /api/interact/...
app.get("/api/interact", (req, res) => {
    res.send("Welcome to the interact api!")
})

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`),
    console.log(`http://localhost:5000/`)
);
