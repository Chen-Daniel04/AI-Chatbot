import mongoose, { Document, Schema} from "mongoose";

export interface IChatMessage extends Document {
    role: 'user' | 'bot';
    content: string;
    createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
    role: { type: String, enum: ['user', 'bot'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);