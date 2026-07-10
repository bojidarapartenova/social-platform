import { Schema, model, Document, Types } from "mongoose"

export type PostType = "photo" | "text";
export type FilterName = "none" | "negative" | "blur" | "sobel";

export interface IPost extends Document {
    authorId: Types.ObjectId;
    type: PostType;
    caption?: string;
    mediaUrls: string[];
    appliedFilter: FilterName;
    groupId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["photo", "text"], required: true },
        caption: { type: String, default: "" },
        mediaUrls: { type: [String], default: [] },
        appliedFilter: { type: String, enum: ["none", "negative", "blur", "sobel"], default: "none" },
        groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    },
    { timestamps: true }
);

postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ groupId: 1, createdAt: -1 });

export const Post = model<IPost>("Post", postSchema);