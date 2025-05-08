// this is our express server
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/config");
const bookRoutes = require("./routes/bookRoutes"); //imports book routessss
const authRoutes = require("./routes/authRoutes"); //for authentication

require("dotenv").config();
connectDB(); // Connect to MongoDB -- async function from config/config.js

const app = express();
app.use(express.json()); // Allow JSON requests
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.75.176:3000'],
    credentials: true,
}));
// “Hey browser, I approve requests coming from these two origins:
// http://localhost:3000 and http://192.168.75.176:3000.”
// backend is on port 5000

app.use("/api/auth", authRoutes); //loads the page authRoutes.js

// Load routes
app.use("/api/books", bookRoutes); //loads the page bookRoutes.js

app.get("/", (req, res) => {
    res.send("Welcome to the Book API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`),
    console.log(`http://localhost:5000/`)
);


/////////////////////////////////////////
////////////////////////////////////////
// const User = require("./models/User");
// const bcrypt = require("bcryptjs");

// const createAdminUser = async () => {
//     const adminExists = await User.findOne({ username: process.env.ADMIN_USERNAME });
//     if (adminExists) return;

//     const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
//     await new User({ username: process.env.ADMIN_USERNAME, password: hashedPassword, role: "admin" }).save();
//     console.log("Admin user created!");
// };

// createAdminUser();