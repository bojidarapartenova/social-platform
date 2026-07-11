import { Schema, model, Document, Types } from "mongoose";

export interface IBookmark extends Document {
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    createdAt: Date
}

const bookmarkSchema = new Schema<IBookmark>({
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
},
    { timestamps: { createdAt: true, updatedAt: false } }
);

bookmarkSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Bookmark = model<IBookmark>("Bookmark", bookmarkSchema);