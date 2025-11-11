import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
import { getRelevantFAQs } from './faqService.js';

dotenv.config();

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION;

if (!PROJECT_ID || !LOCATION) {
  throw new Error(
    'FATAL: GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION environment variables are not set. Cannot initialize client.'
  );
}

const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash'
});


export async function generateResponse(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Extract the plain text from the model response
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    console.log('Gemini (Vertex AI) Response:', responseText);
    return responseText;
  } catch (error) {
    console.error('Error generating Gemini content:', error);
    throw error;
  }
}