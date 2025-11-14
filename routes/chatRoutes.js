import express from "express";
const router = express.Router();
import QAPair from "../models/QApair.js";
import stringSimilarity from "string-similarity"; // For typo tolerance (Levenshtein)

// Minimal similarity threshold (0.0 to 1.0)
const SIMILARITY_THRESHOLD = 0.6; 

// MAIN CHAT ENDPOINT
router.post("/", async (req, res) => {
    const userMessage = req.body.message?.toLowerCase().trim();
    const regexQuery = new RegExp(userMessage, 'i');

    try {
        // I. PRIMARY SEARCH: Fast MongoDB query ($or)
        const directMatch = await QAPair.findOne({
            $or: [
                { question: userMessage }, 
                { synonyms: regexQuery },
                { question: regexQuery } 
            ]
        });

        if (directMatch) {
            return res.json({ reply: directMatch.answer });
        }
        
        // II. SECONDARY SEARCH: Levenshtein distance for typos (only if the fast query fails)
        const allPairs = await QAPair.find();
        
        // Create a list of all possible search phrases (questions + synonyms)
        const allTargets = allPairs.flatMap(qa => [
            qa.question, 
            ...(qa.synonyms || [])
        ]).map(s => s.toLowerCase());

        const matches = stringSimilarity.findBestMatch(userMessage, allTargets);
        const bestMatch = matches.bestMatch;

        if (bestMatch.rating >= SIMILARITY_THRESHOLD) {
            // Find the original QA object based on the best matching phrase
            const originalQA = allPairs.find(qa => 
                qa.question.toLowerCase() === bestMatch.target || 
                (qa.synonyms && qa.synonyms.map(s => s.toLowerCase()).includes(bestMatch.target))
            );
            
            if (originalQA) {
                return res.json({ reply: originalQA.answer });
            }
        }
        
        // III. FALLBACK
        return res.json({
            reply: "I'm not sure how to answer that yet, but Luka is teaching me more! 😊"
        });

    } catch (err) {
        console.error("GREŠKA U BAZI/PRETRAŽIVANJU:", err);
        res.status(500).json({ reply: "Server error 🤖" });
    }
});


// ADD NEW Q&A ENDPOINT
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