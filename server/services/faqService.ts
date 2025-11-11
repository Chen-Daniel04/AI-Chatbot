import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  "Module Title": { type: String },
  Q: { type: Object },
  Questions: { type: String },
  Answers: { type: String },
});

const FAQ = mongoose.model("FAQ", faqSchema, "faq_content_list");

export async function getRelevantFAQs(userQuestion: string, limit: number = 3) {
  const regex = new RegExp(userQuestion, "i"); // case-insensitive partial match
  console.log("🔍 Searching with regex:", regex);

  const results = await FAQ.find({
    $or: [
      { Questions: { $regex: regex } },
      { Answers: { $regex: regex } },
    ],
  })
    .limit(limit)
    .lean();

  console.log("📄 Matched FAQs:", results);
  return results;
}
