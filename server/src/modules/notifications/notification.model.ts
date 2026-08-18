import { Schema, model, Document, Types } from "mongoose";

export type NotificationType = "like" | "comment" | "follow" | "group_invite" | "group_request" | "group_accept" | "message";

export interface INotification extends Document {
    recipientId: Types.ObjectId;
    actorId: Types.ObjectId;
    type: NotificationType;
    entityRef?: string;
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["like", "comment", "follow", "group_invite", "group_request", "group_accept", "message"], required: true },
        entityRef: { type: String, default: "" },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

export const Notification = model<INotification>("Notification", notificationSchema);