import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminGroupsQuery, useDeleteGroupAsAdminMutation } from "./adminApiSlice";

export function AdminGroupsPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetAdminGroupsQuery({ page });
    const [deleteGroup] = useDeleteGroupAsAdminMutation();

    function handleDelete(id: string, name: string) {
        if (confirm(`Permanently delete "${name}" and all its posts?`)) {
            deleteGroup(id);
        }
    }

    return (
        <div>
            <h1>Groups</h1>
            {isLoading && <p>Loading...</p>}

            <table className="adminTable">
                <thead>
                    <tr><th>Group</th><th>Owner</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data?.groups.map((g) => (
                        <tr key={g._id}>
                            <td><Link to={`/groups/${g._id}`}>{g.name}</Link></td>
                            <td><Link to={`/profile/${g.ownerId._id}`}>@{g.ownerId.username}</Link></td>
                            <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                            <td><button className="adminDangerBtn" onClick={() => handleDelete(g._id, g.name)}>Delete</button></td>
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