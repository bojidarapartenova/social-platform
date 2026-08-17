import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetGroupQuery, useGetMembersQuery, useKickMemberMutation } from "./groupApiSlice";
import "../../styles/search.css";

export function GroupMembersPage() {
    const { id } = useParams<{ id: string }>();
    const [filterText, setFilterText] = useState("");
    const { data: group } = useGetGroupQuery(id!);
    const { data: members, isLoading } = useGetMembersQuery(id!);
    const [kickMember] = useKickMemberMutation();

    const isOwner = group?.membershipStatus === "owner";

    const filtered = members?.filter((m) => {
        const q = filterText.trim().toLowerCase();
        if (!q) return true;
        return m.userId.username.toLowerCase().includes(q) || (m.userId.name ?? "").toLowerCase().includes(q);
    });

    function handleKick(userId: string, username: string) {
        if (confirm(`Remove ${username} from this group?`)) {
            kickMember({ groupId: id!, userId });
        }
    }

    return (
        <div className="forYou">
            <p className="feedScopeSelect">{group?.name ? `${group.name} · Members` : "Members"}</p>
            <div className="feed">
                <div className="searchBarRow">
                    <input
                        className="searchInput"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="Search members"
                    />
                </div>

                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {members && members.length > 0 && filtered?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            No matches for "{filterText}"
                        </p>
                    )}

                    {filtered?.map((m) => (
                        <div key={m._id} className="searchResultRow">
                            <Link to={`/profile/${m.userId._id}`} className="followRowLink">
                                <img src={m.userId.avatarUrl || "/default-avatar.png"} alt={m.userId.username} />
                                <div>
                                    <span className="searchResultName">
                                        {m.userId.name || m.userId.username}{m.role === "owner" ? " · Owner" : ""}
                                    </span>
                                    <p className="searchResultSub">@{m.userId.username}</p>
                                </div>
                            </Link>

                            {isOwner && m.role !== "owner" && (
                                <button
                                    type="button"
                                    className="followListBtn"
                                    onClick={() => handleKick(m.userId._id, m.userId.username)}
                                >
                                    Kick
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}