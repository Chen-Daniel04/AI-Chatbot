import {type Request, type Response} from 'express';
import ChatMessage from '../models/chatMessage.js';
import { generateResponse } from '../services/geminiService.js';


export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userMessage } = req.body;
      if (!userMessage) {
        res.status(400).json({ error: 'User message is required' });
        return;
      }

    //Save user's message
    await ChatMessage.create({ role: 'user', content: userMessage });

    // Get AI reply
    const botReply = await generateResponse(userMessage);

    // Save bot's reply
    await ChatMessage.create({ role: 'bot', content: botReply });

    res.status(200).json({ botReply });
    } catch (error: any) {
    res.status(500).json({ error: error.message });
    }
}