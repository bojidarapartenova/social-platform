import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    username: string,
    name?: string,
    email: string,
    password: string,
    role: "user" | "admin",
    bio?: string,
    avatarUrl?: string
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, lowercase: true },
        name: { type: String, default: "" },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        bio: { type: String, default: "" },
        avatarUrl: { type: String, default: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" }
    },
    { timestamps: true }
);

export const User = model<IUser>("User", userSchema);