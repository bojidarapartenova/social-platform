import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        bio: {
            type: String,
            default: ""
        },

        avatarUrl: {
            type: String,
            default: ""
        },

        coverUrl: {
            type: String,
            default: ""
        }

    },
    {
        timestamps: true
    }
);


export const User =
    mongoose.model("User", userSchema);