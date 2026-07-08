import { Schema, model, Document, Types } from "mongoose";

export interface IFriendship extends Document {
    userAId: Types.ObjectId,
    userBId: Types.ObjectId,
    since: Date
};

const friendshipSchema = new Schema<IFriendship>(
    {
        userAId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        userBId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        since: { type: Date, default: Date.now },
    }
);

export const Friendship = model<IFriendship>("Friendship", friendshipSchema);