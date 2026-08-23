import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminReportsQuery, useDismissReportMutation, useResolveReportMutation } from "../reports/reportApiSlice";

export function AdminReportsPage() {
    const [status, setStatus] = useState("pending");
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetAdminReportsQuery({ status, page });
    const [dismissReport] = useDismissReportMutation();
    const [resolveReport] = useResolveReportMutation();

    function targetLink(r: any) {
        if (r.targetType === "post") return `/posts/${r.targetId}`;
        if (r.targetType === "user") return `/profile/${r.targetId}`;
        return null;
    }

    function handleResolve(id: string) {
        if (confirm("Delete the reported content and mark this resolved?")) {
            resolveReport(id);
        }
    }

    return (
        <div>
            <h1>Reports</h1>

            <select className="adminSearchInput" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
            </select>

            {isLoading && <p>Loading...</p>}

            <table className="adminTable">
                <thead>
                    <tr><th>Type</th><th>Content</th><th>Reason</th><th>Reported by</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data?.reports.map((r) => (
                        <tr key={r._id}>
                            <td>{r.targetType}</td>
                            <td>
                                {r.preview ? (
                                    targetLink(r) ? (
                                        <Link to={targetLink(r)!}>{r.preview.text?.slice(0, 60) || "(view)"}</Link>
                                    ) : (
                                        r.preview.text?.slice(0, 60)
                                    )
                                ) : (
                                    <span style={{ color: "var(--color-text-muted)" }}>Content no longer exists</span>
                                )}
                            </td>
                            <td>{r.reason}{r.details && ` — ${r.details}`}</td>
                            <td>@{r.reporterId.username}</td>
                            <td>
                                {r.status === "pending" && (
                                    <>
                                        <button onClick={() => dismissReport(r._id)}>Dismiss</button>
                                        <button className="adminDangerBtn" onClick={() => handleResolve(r._id)}>Delete content</button>
                                    </>
                                )}
                                {r.status !== "pending" && <span style={{ color: "var(--color-text-muted)" }}>{r.status}</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {data && (
                <div className="adminPagination">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                    <span>Page {page} of {Math.max(1, Math.ceil(data.total / data.limit))}</span>
                    <button disabled={page * data.limit >= data.total} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
            )}
        </div>
    );
}