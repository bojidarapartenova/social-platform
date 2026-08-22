import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminCommentsQuery, useDeleteCommentAsAdminMutation } from "./adminApiSlice";

export function AdminCommentsPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetAdminCommentsQuery({ page });
    const [deleteComment] = useDeleteCommentAsAdminMutation();

    function handleDelete(id: string) {
        if (confirm("Permanently delete this comment?")) {
            deleteComment(id);
        }
    }

    return (
        <div>
            <h1>Comments</h1>
            {isLoading && <p>Loading...</p>}

            <table className="adminTable">
                <thead>
                    <tr><th>Author</th><th>Text</th><th>Posted</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data?.comments.map((c) => (
                        <tr key={c._id}>
                            <td><Link to={`/profile/${c.authorId._id}`}>@{c.authorId.username}</Link></td>
                            <td>{c.text}</td>
                            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td><button className="adminDangerBtn" onClick={() => handleDelete(c._id)}>Delete</button></td>
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