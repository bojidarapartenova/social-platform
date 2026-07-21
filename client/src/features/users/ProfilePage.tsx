import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetUserQuery, useGetUserPostsQuery } from "./userApiSlice";
import { useFollowUserMutation, useUnfollowUserMutation } from "../follows/followApiSlice";
import { PostCard } from "../posts/PostCard";
import "../../styles/profile.css";

export function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: userLoading } = useGetUserQuery(id!);
    const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery(id!);
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();
    const navigate = useNavigate();

    if (userLoading) return <p>Loading profile...</p>;
    if (!user) return <p>User not found.</p>;

    function handleEdit() {
        navigate("/profile/edit");
    }

    function renderActionButton() {
        switch (user!.relationshipStatus) {
            case "self":
                return <button type="button" onClick={handleEdit} className="profileBtn">Edit profile</button>;
            case "friend":
                return (
                    <div className="btnRow">
                        <button className="profileBtn" onClick={() => unfollowUser(user!._id)}>Unfollow</button>
                        <Link to={`/chat/${user!._id}`} className="profileBtn primary">Message</Link>
                    </div>
                );
            case "following":
                return <button className="profileBtn" onClick={() => unfollowUser(user!._id)}>Unfollow</button>;
            case "none":
            default:
                return <button className="profileBtn primary" onClick={() => followUser(user!._id)}>Follow</button>;
        }
    }

    return (
        <div className="profilePage">
            <div className="profileTop">
                <div className="profileNames">
                    <h2>{user.name || user.username}</h2>
                    <p className="username">@{user.username}</p>
                </div>
                <img className="profilePfp" src={user.avatarUrl || "/default-avatar.png"} alt={user.username} />
            </div>

            {user.bio && <p className="profileBio">{user.bio}</p>}

            <div className="profileStats">
                <span><strong>{user.followerCount}</strong> followers</span>
                <span><strong>{user.followingCount}</strong> following</span>
            </div>

            {renderActionButton()}

            <div className="profileDivider" />

            <p className="postsLabel">Posts</p>

            <div className="profilePosts">
                {postsLoading && <p>Loading posts...</p>}
                {posts?.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
        </div>
    );
}