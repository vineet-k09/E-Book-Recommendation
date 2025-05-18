// 📌 5. Middleware to Protect Route
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied -- authMiddleware.js" });
    }

    const token = authHeader.split(" ")[1]; // Extract just the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // check this!
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;