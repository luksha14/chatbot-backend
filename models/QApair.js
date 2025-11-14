import mongoose from "mongoose";

const QAPairSchema = new mongoose.Schema({
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true }
});

export default mongoose.model("QAPair", QAPairSchema);
