import { type Request, type Response } from "express";
import ChatMessage from "../models/chatMessage.js";
import { generateResponse } from "../services/geminiService.js";
import { getRelevantFAQs } from "../services/faqService.js";


export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      res.status(400).json({ error: "User message is required" });
      return;
    }

    await ChatMessage.create({ role: "user", content: userMessage });

    const faqs = await getRelevantFAQs(userMessage);
    console.log("📚 FAQs context fetched:", faqs);
    
    const faqContext = faqs.map(f => `Q: ${f.Questions}\nA: ${f.Answers}`).join("\n\n");

    const prompt = `
      You are an AI assistant that must answer ONLY based on the provided FAQ context.
      If the user's question is not covered in the context, respond with:
      "I don’t know about that. It’s not in my FAQ database."

      FAQ Context:
      ${faqContext}

      User Question: ${userMessage}
    `;

    const botReply = await generateResponse(prompt);

    // 6️⃣ Save bot's reply
    await ChatMessage.create({ role: "bot", content: botReply });

    // 7️⃣ Send result back to frontend
    res.status(200).json({ botReply });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
