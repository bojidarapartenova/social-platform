import { Schema, model, Document, Types } from "mongoose";

export interface IGroup extends Document {
    name: string,
    description?: string;
    coverImage?: string;
    ownerId: Types.ObjectId;
    privacy: "public" | "private";
    createdAt: Date;
}

const groupSchema = new Schema<IGroup>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        coverImage: { type: String, default: "" },
        ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        privacy: { type: String, enum: ["public", "private"], default: "public" },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Group = model<IGroup>("Group", groupSchema);