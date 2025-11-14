const mongoose = require("mongoose");

const QAPairSchema = new mongoose.Schema({
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true }
});

module.exports = mongoose.model("QAPair", QAPairSchema);
