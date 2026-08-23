import { Schema, model, Document, Types } from "mongoose";

export type ReportTargetType = "post" | "comment" | "user";
export type ReportReason = "spam" | "harassment" | "inappropriate" | "other";
export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface IReport extends Document {
    targetType: ReportTargetType;
    targetId: Types.ObjectId;
    reporterId: Types.ObjectId;
    reason: ReportReason;
    details: string;
    status: ReportStatus;
    createdAt: Date;
}

const reportSchema = new Schema<IReport>(
    {
        targetType: { type: String, enum: ["post", "comment", "user"], required: true },
        targetId: { type: Schema.Types.ObjectId, required: true },
        reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, enum: ["spam", "harassment", "inappropriate", "other"], required: true },
        details: { type: String, default: "" },
        status: { type: String, enum: ["pending", "resolved", "dismissed"], default: "pending" },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Report = model<IReport>("Report", reportSchema);