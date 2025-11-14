import mongoose from "mongoose";

const QAPairSchema = new mongoose.Schema({
    question: { type: String, required: true },
    synonyms: { type: [String], default: [] },
    answer: { type: String, required: true }
});

export default mongoose.model("QAPair", QAPairSchema);
