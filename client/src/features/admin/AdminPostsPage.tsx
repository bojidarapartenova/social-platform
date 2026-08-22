import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAdminPostsQuery, useDeletePostAsAdminMutation } from "./adminApiSlice";

export function AdminPostsPage() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetAdminPostsQuery({ page });
    const [deletePost] = useDeletePostAsAdminMutation();

    function handleDelete(id: string) {
        if (confirm("Permanently delete this post?")) {
            deletePost(id);
        }
    }

    return (
        <div>
            <h1>Posts</h1>
            {isLoading && <p>Loading...</p>}

            <table className="adminTable">
                <thead>
                    <tr><th>Author</th><th>Caption</th><th>Group</th><th>Posted</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data?.posts.map((p) => (
                        <tr key={p._id}>
                            <td>
                                <Link to={`/profile/${p.authorId._id}`}>@{p.authorId.username}</Link>
                            </td>
                            <td>
                                <Link to={`/posts/${p._id}`}>{p.caption?.slice(0, 60) || "(no caption)"}</Link>
                            </td>
                            <td>{p.groupId ? p.groupId.name : "—"}</td>
                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td><button className="adminDangerBtn" onClick={() => handleDelete(p._id)}>Delete</button></td>
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