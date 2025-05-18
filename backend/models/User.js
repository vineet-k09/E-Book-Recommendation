//models basically specify the collection structure for each dataset in given collection like books or user under the database ebooks
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Default is user
    preferredGenres: [{ type: String }]
});

module.exports = mongoose.model("User", UserSchema);