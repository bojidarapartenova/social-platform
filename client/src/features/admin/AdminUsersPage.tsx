import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";
import { useGetAdminUsersQuery, useSetUserRoleMutation, useDeleteUserAsAdminMutation } from "./adminApiSlice";

export function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGetAdminUsersQuery({ search, page });
    const [setUserRole] = useSetUserRoleMutation();
    const [deleteUser] = useDeleteUserAsAdminMutation();
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

    function handleRoleToggle(id: string, currentRole: string) {
        setUserRole({ id, role: currentRole === "admin" ? "user" : "admin" });
    }

    function handleDelete(id: string, username: string) {
        if (confirm(`Permanently delete ${username}'s account and all their content?`)) {
            deleteUser(id);
        }
    }

    return (
        <div>
            <h1>Users</h1>
            <input
                className="adminSearchInput"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by username or email"
            />

            {isLoading && <p>Loading...</p>}

            <table className="adminTable">
                <thead>
                    <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {data?.users.map((u) => (
                        <tr key={u._id}>
                            <td>
                                <div className="adminUserCell">
                                    <img src={u.avatarUrl || "/default-avatar.png"} alt={u.username} />
                                    <span>{u.name || u.username} (@{u.username})</span>
                                </div>
                            </td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td>
                                {u._id === currentUserId ? (
                                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.82rem" }}>You</span>
                                ) : (
                                    <>
                                        <button onClick={() => handleRoleToggle(u._id, u.role)}>
                                            {u.role === "admin" ? "Demote" : "Promote"}
                                        </button>
                                        <button className="adminDangerBtn" onClick={() => handleDelete(u._id, u.username)}>Delete</button>
                                    </>
                                )}
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