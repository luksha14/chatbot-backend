import express from "express";
const router = express.Router();
import QAPair from "../models/QApair.js";

// MAIN CHAT ENDPOINT
router.post("/", async (req, res) => {
    const userMessage = req.body.message?.toLowerCase().trim();

    console.log(`[DEBUG] Primljena poruka: ${userMessage}`);

    try {
        // 1) EXACT MATCH
        const exactMatch = await QAPair.findOne({
            question: userMessage
        });

        console.log(`[DEBUG] Exact match:`, exactMatch ? exactMatch.answer : "Nema");

        if (exactMatch) {
            return res.json({ reply: exactMatch.answer });
        }

        // 2) SYNONYM / PARTIAL MATCH
        const allPairs = await QAPair.find();

        let bestMatch = null;

        for (const qa of allPairs) {
            const questionLower = qa.question.toLowerCase();

            // direct contains match
            if (userMessage.includes(questionLower)) {
                bestMatch = qa;
                break;
            }

            // synonyms match
            if (qa.synonyms && Array.isArray(qa.synonyms)) {
                for (const syn of qa.synonyms) {
                    if (userMessage.includes(syn.toLowerCase())) {
                        bestMatch = qa;
                        break;
                    }
                }
            }

            if (bestMatch) break;
        }

        console.log(`[DEBUG] Synonym/partial match:`, bestMatch ? bestMatch.answer : "Nema");

        if (bestMatch) {
            return res.json({ reply: bestMatch.answer });
        }

        // 3) FALLBACK
        return res.json({
            reply: "I'm not sure how to answer that yet, but Luka is teaching me more! 😊"
        });

    } catch (err) {
        console.error("GREŠKA U BAZI/PRETRAŽIVANJU:", err);
        res.status(500).json({ reply: "Server error 🤖" });
    }
});

// ADD NEW Q&A
router.post("/learn", async (req, res) => {
    const { question, answer, synonyms } = req.body;

    try {
        await QAPair.create({ question, answer, synonyms: synonyms || [] });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

export default router;
