import express from "express";
const router = express.Router();
import QAPair from "../models/QApair.js";

// Chat endpoint
router.post("/", async (req, res) => {
    const userMessage = req.body.message?.toLowerCase().trim();

    try {
        const match = await QAPair.findOne({
            question: { $regex: userMessage, $options: 'i' }
        }).sort({ _id: 1 }); 

        if (match) {
            return res.json({ reply: match.answer });
        }

        const specificMatch = await QAPair.findOne({
             question: userMessage 
        });

        return res.json({
            reply: "I'm not sure how to answer that yet, but Luka is teaching me more! 😊"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Server error 🤖" });
    }
});

// Add new Q&A manually
router.post("/learn", async (req, res) => {
    const { question, answer } = req.body;

    try {
        await QAPair.create({ question, answer });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

export default router;
