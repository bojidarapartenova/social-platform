import { useParams, Link } from "react-router-dom";
import { useGetGroupQuery, useRequestToJoinMutation, useGetGroupPostsQuery } from "./groupApiSlice";
import { PostCard } from "../posts/PostCard";
import { GroupRequestsPanel } from "./GroupRequestsPanel";
import { GroupMembersPanel } from "./GroupMembersPanel";
import { HashtagText } from "../../components/HashtagText";
import "../../styles/groups.css";

export function GroupPage() {
    const { id } = useParams<{ id: string }>();
    const { data: group, isLoading } = useGetGroupQuery(id!);
    const { data: posts, isLoading: postsLoading } = useGetGroupPostsQuery(id!);
    const [requestToJoin, { isLoading: isJoining }] = useRequestToJoinMutation();

    if (isLoading) return <p>Loading group...</p>;
    if (!group) return <p>Group not found.</p>;

    const isOwner = group.membershipStatus === "owner";
    const isMember = isOwner || group.membershipStatus === "approved";

    function renderActionButton() {
        if (isOwner) return null;
        if (group!.membershipStatus === "approved") return <span className="groupBadge">Member</span>;
        if (group!.membershipStatus === "pending") return <span className="groupBadge">Request pending</span>;
        if (group!.membershipStatus === "banned") return <span className="groupBadge banned">You've been banned from this group</span>;
        return (
            <button className="profileBtn primary" onClick={() => requestToJoin(group!._id)} disabled={isJoining}>
                Request to join
            </button>
        );
    }

    return (
        <div className="forYou">
            <p className="feedScopeSelect">{group.name}</p>

            <div className="feed">
                <div className="profileHeader">
                    <div className="profileTop">
                        <div className="profileNames">
                            <h2>{group.name}</h2>
                            <p className="username">{group.memberCount} members</p>
                        </div>
                        <img className="profilePfp" src={group.avatarUrl || "/default-avatar.png"} alt={group.name} />
                    </div>

                    {group.description && (
                        <p className="profileBio"><HashtagText text={group.description} /></p>
                    )}

                    {renderActionButton()}

                    {isOwner && <GroupRequestsPanel groupId={group._id} />}
                    {isOwner && <GroupMembersPanel groupId={group._id} />}

                    {isMember && (
                        <Link to={`/create?group=${group._id}`} className="profileBtn" style={{ marginTop: "0.6rem" }}>
                            + New post in this group
                        </Link>
                    )}
                </div>

                <div className="postList">
                    {postsLoading && <p>Loading posts...</p>}
                    {isMember
                        ? posts?.map((post) => <PostCard key={post._id} post={post} isGroupOwner={isOwner} />)
                        : <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
                            Join this group to see its posts.
                        </p>}
                </div>
            </div>
        </div>
    );
}