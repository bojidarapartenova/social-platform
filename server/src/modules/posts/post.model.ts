import { Schema, model, Document, Types } from "mongoose"

export type PostType = "photo" | "text";
export type FilterName = "none" | "negative" | "blur" | "sobel";

export interface IMediaItem {
    url: string;
    filter: FilterName;
}

export interface IPost extends Document {
    authorId: Types.ObjectId;
    type: PostType;
    caption?: string;
    media: IMediaItem[];
    groupId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const mediaItemSchema = new Schema<IMediaItem>(
    {
        url: { type: String, required: true },
        filter: { type: String, enum: ["none", "negative", "blur", "sobel"], default: "none" },
    },
    { _id: false }
);

const postSchema = new Schema<IPost>(
    {
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["photo", "text"], required: true },
        caption: { type: String, default: "" },
        media: { type: [mediaItemSchema], default: [] },
        groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    },
    { timestamps: true }
);

postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ groupId: 1, createdAt: -1 });

export const Post = model<IPost>("Post", postSchema);