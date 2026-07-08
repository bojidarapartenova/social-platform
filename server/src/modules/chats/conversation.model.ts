import { Schema, model, Document, Types } from "mongoose";

export interface IConversation extends Document {
    type: "direct" | "group";
    participantIds: Types.ObjectId[];
    groupId?: Types.ObjectId;
    createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        type: { type: String, enum: ["direct", "group"], required: true },
        participantIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Conversation = model<IConversation>("Conversation", conversationSchema);