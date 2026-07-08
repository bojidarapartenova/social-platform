import { Schema, model, Document, Types } from "mongoose";

export interface IGroupMembership extends Document {
    groupId: Types.ObjectId;
    userId: Types.ObjectId;
    role: "admin" | "member";
    joinedAt: Date;
}

const groupMembershipSchema = new Schema<IGroupMembership>(
    {
        groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["admin", "member"], default: "member" },
    },
    { timestamps: { createdAt: "joinedAt", updatedAt: false } }
);

groupMembershipSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export const GroupMembership = model<IGroupMembership>("GroupMembership", groupMembershipSchema);