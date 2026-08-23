import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import { useGetUserQuery, useGetUserPostsQuery } from "./userApiSlice";
import { useFollowUserMutation, useUnfollowUserMutation } from "../follows/followApiSlice";
import { PostCard } from "../posts/PostCard";
import { HashtagText } from "../../components/HashtagText";
import { resetDraft } from "../posts/postDraftSlice";
import { ReportModal } from "../reports/ReportModal";
import "../../styles/profile.css";

export function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: userLoading } = useGetUserQuery(id!);
    const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery(id!);

    const isAdmin = useSelector((state: RootState) => state.auth.user?.role === "admin");

    const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
    const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showReportModal, setShowReportModal] = useState(false);

    if (userLoading) return <p>Loading profile...</p>;
    if (!user) return <p>User not found.</p>;

    function handleEdit() {
        navigate("/profile/edit");
    }

    function startNewPost() {
        dispatch(resetDraft());
        navigate("/create");
    }

    function renderActionButton() {
        switch (user!.relationshipStatus) {
            case "self":
                return <button type="button" onClick={handleEdit} className="profileBtn">Edit profile</button>;
            case "friend":
                return (
                    <div className="btnRow">
                        <button
                            className="profileBtn"
                            onClick={() => unfollowUser(user!._id)}
                            disabled={isUnfollowing}
                        >
                            Unfollow
                        </button>
                        <Link to={`/messages/${user!._id}`} className="profileBtn primary">Message</Link>
                    </div>
                );
            case "following":
                return (
                    <button
                        className="profileBtn"
                        onClick={() => unfollowUser(user!._id)}
                        disabled={isUnfollowing}
                    >
                        Unfollow
                    </button>
                );
            case "none":
            default:
                return (
                    <button
                        className="profileBtn primary"
                        onClick={() => followUser(user!._id)}
                        disabled={isFollowing}
                    >
                        {user!.followsMe ? "Follow back" : "Follow"}
                    </button>
                );
        }
    }

    return (
        <div className="forYou">
            <p className="feedScopeSelect">{user.username}</p>

            <div className="feed">
                <div className="profileHeader">
                    <div className="profileTop">
                        <div className="profileNames">
                            <h2>{user.name || user.username}</h2>
                            <p className="username">@{user.username}</p>
                        </div>
                        <img className="profilePfp" src={user.avatarUrl || "/default-avatar.png"} alt={user.username} />
                    </div>

                    {user.bio && <p className="profileBio"><HashtagText text={user.bio} /></p>}

                    <div className="profileStats">
                        <Link to={`/profile/${user._id}/followers`}><strong>{user.followerCount}</strong> followers</Link>
                        <Link to={`/profile/${user._id}/following`}><strong>{user.followingCount}</strong> following</Link>
                    </div>

                    {renderActionButton()}

                    {user.relationshipStatus !== "self" && !isAdmin && (
                        <button
                            type="button"
                            onClick={() => setShowReportModal(true)}
                            style={{ background: "none", border: "none", color: "var(--color-text-muted)", fontSize: "0.8rem", marginTop: "0.6rem", cursor: "pointer", padding: 0 }}
                        >
                            Report this user
                        </button>
                    )}

                    {user.relationshipStatus === "self" && (
                        <div className="postForm" style={{ marginTop: "1rem", border: "none", padding: 0 }}>
                            <div className="postFormLeft">
                                <p>What's new?</p>
                            </div>
                            <button type="button" onClick={startNewPost} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>+</button>
                        </div>
                    )}
                </div>

                <div className="postList">
                    {postsLoading && <p>Loading posts...</p>}
                    {posts?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
                            No posts yet.
                        </p>
                    )}
                    {posts?.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>

            {showReportModal && (
                <ReportModal targetType="user" targetId={user._id} onClose={() => setShowReportModal(false)} />
            )}
        </div>
    );
}