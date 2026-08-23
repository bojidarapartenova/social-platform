import { useState } from "react";
import { useCreateReportMutation } from "./reportApiSlice";
import type { ReportTargetType, ReportReason } from "./reportApiSlice";
import "../../styles/reportModal.css";

interface Props {
    targetType: ReportTargetType;
    targetId: string;
    onClose: () => void;
}

export function ReportModal({ targetType, targetId, onClose }: Props) {
    const [reason, setReason] = useState<ReportReason>("spam");
    const [details, setDetails] = useState("");
    const [createReport, { isLoading }] = useCreateReportMutation();
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await createReport({ targetType, targetId, reason, details });
        setSubmitted(true);
        setTimeout(onClose, 1200);
    }

    return (
        <div className="reportModalOverlay" onClick={onClose}>
            <div className="reportModalCard" onClick={(e) => e.stopPropagation()}>
                {submitted ? (
                    <p>Thanks, we'll take a look.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3>Report this {targetType}</h3>

                        <label>Reason</label>
                        <select value={reason} onChange={(e) => setReason(e.target.value as ReportReason)}>
                            <option value="spam">Spam</option>
                            <option value="harassment">Harassment</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="other">Other</option>
                        </select>

                        <label>Additional details (optional)</label>
                        <textarea value={details} onChange={(e) => setDetails(e.target.value)} />

                        <div className="reportModalActions">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit" disabled={isLoading}>Submit report</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}