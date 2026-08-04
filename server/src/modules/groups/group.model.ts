import { Schema, model, Document, Types } from "mongoose";

export interface IGroup extends Document {
    name: string;
    description: string;
    avatarUrl: string;
    ownerId: Types.ObjectId;
    createdAt: Date;
}

const groupSchema = new Schema<IGroup>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        avatarUrl: { type: String, default: "" },
        ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Group = model<IGroup>("Group", groupSchema);