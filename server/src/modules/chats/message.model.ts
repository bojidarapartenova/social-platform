import { Schema, model, Document, Types } from "mongoose";
import { boolean } from "yup";

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    text?: string;
    isRead: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, default: "" },
        isRead: { type: Boolean, default: false }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message = model<IMessage>("Message", messageSchema);