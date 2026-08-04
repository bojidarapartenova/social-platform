import { Schema, model, Document, Types } from "mongoose";

export type MembershipRole = "owner" | "member";
export type MembershipStatus = "pending" | "approved" | "banned";

export interface IGroupMembership extends Document {
    groupId: Types.ObjectId;
    userId: Types.ObjectId;
    role: MembershipRole;
    status: MembershipStatus;
    createdAt: Date;
}

const groupMembershipSchema = new Schema<IGroupMembership>(
    {
        groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["owner", "member"], default: "member" },
        status: { type: String, enum: ["pending", "approved", "banned"], default: "pending" },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

groupMembershipSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export const GroupMembership = model<IGroupMembership>("GroupMembership", groupMembershipSchema);