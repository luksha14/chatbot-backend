import express from "express";
const router = express.Router();
import QAPair from "../models/QApair.js";

// Chat endpoint
router.post("/", async (req, res) => {
    const userMessage = req.body.message?.toLowerCase().trim();

    // --- DODAJ LOGIRANJE ---
    console.log(`[DEBUG] Primljena poruka: ${userMessage}`);

    try {
        // Trazi Egzaktan Match (Sada testiramo ovu logiku)
        const match = await QAPair.findOne({
            question: userMessage
        });

        // --- DODAJ LOGIRANJE ---
        console.log(`[DEBUG] Pronađen match:`, match ? match.answer : "Nije pronađen.");

        if (match) {
            return res.json({ reply: match.answer });
        }

        return res.json({
            reply: "I'm not sure how to answer that yet, but Luka is teaching me more! 😊"
        });

    } catch (err) {
        console.error("GREŠKA U BAZI/PRETRAZIVANJU:", err);
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
