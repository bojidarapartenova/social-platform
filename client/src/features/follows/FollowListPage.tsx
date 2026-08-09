import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetFollowersQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from "./followApiSlice";
import "../../styles/search.css";

export function FollowListPage({ type }: { type: "followers" | "following" }) {
    const { id } = useParams<{ id: string }>();
    const [filterText, setFilterText] = useState("");
    const followersQuery = useGetFollowersQuery(id!, { skip: type !== "followers" });
    const followingQuery = useGetFollowingQuery(id!, { skip: type !== "following" });
    const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
    const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();

    const { data: users, isLoading } = type === "followers" ? followersQuery : followingQuery;

    const filtered = users?.filter((u) => {
        const q = filterText.trim().toLowerCase();
        if (!q) return true;
        return u.username.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q);
    });

    return (
        <div className="forYou">
            <p className="feedScopeSelect">{type === "followers" ? "Followers" : "Following"}</p>
            <div className="feed">
                <div className="searchBarRow">
                    <input
                        className="searchInput"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="Search"
                    />
                </div>

                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {users?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            Nobody here yet.
                        </p>
                    )}
                    {users && users.length > 0 && filtered?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            No matches for "{filterText}"
                        </p>
                    )}

                    {filtered?.map((u) => (
                        <div key={u._id} className="searchResultRow">
                            <Link to={`/profile/${u._id}`} className="followRowLink">
                                <img src={u.avatarUrl || "/default-avatar.png"} alt={u.username} />
                                <div>
                                    <span className="searchResultName">{u.name || u.username}</span>
                                    <p className="searchResultSub">@{u.username}</p>
                                </div>
                            </Link>

                            {!u.isSelf && (
                                u.isFollowedByMe ? (
                                    <button type="button" className="followListBtn" onClick={() => unfollowUser(u._id)} disabled={isUnfollowing}>
                                        Unfollow
                                    </button>
                                ) : (
                                    <button type="button" className="followListBtn primary" onClick={() => followUser(u._id)} disabled={isFollowing}>
                                        Follow
                                    </button>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}