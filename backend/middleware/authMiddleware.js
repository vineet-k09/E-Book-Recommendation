// 📌 5. Middleware to Protect Route
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied -- authMiddleware.js" });
    }

    const token = authHeader.split(" ")[1]; // Extract just the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

exports.adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied -- admin -- authMiddleware.js" });
    }
    next();
};
