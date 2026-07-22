import { Schema, model, Document, Types } from "mongoose";

export interface IConversation extends Document {
    type: "direct" | "group";
    participantIds: Types.ObjectId[];
    participantKey?: string;
    groupId?: Types.ObjectId;
    createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        type: { type: String, enum: ["direct", "group"], required: true },
        participantIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        participantKey: { type: String, default: null },
        groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

conversationSchema.index({ participantKey: 1 }, { unique: true, sparse: true });

export const Conversation = model<IConversation>("Conversation", conversationSchema);