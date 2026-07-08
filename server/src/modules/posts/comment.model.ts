import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
    postId: Types.ObjectId,
    authorId: Types.ObjectId,
    text: string,
    createdAt: Date
};

const commentSchema = new Schema<IComment>(
    {
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

commentSchema.index({ postId: 1, createdAt: 1 });

export const Comment = model<IComment>("Comment", commentSchema);