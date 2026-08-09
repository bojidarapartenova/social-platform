import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkOneReadMutation } from "./notificationApiSlice";
import "../../styles/search.css";

const MESSAGES: Record<string, string> = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    message: "sent you a message",
    group_invite: "invited you to a group",
};

export function NotificationsPage() {
    const { data: notifications, isLoading } = useGetNotificationsQuery();
    const [markAllRead] = useMarkAllReadMutation();
    const [markOneRead] = useMarkOneReadMutation();

    function linkFor(n: any) {
        if (n.type === "message") return `/messages/${n.actorId._id}`;
        if (n.type === "follow") return `/profile/${n.actorId._id}`;
        if (n.entityRef) return `/posts/${n.entityRef}`;
        return "#";
    }

    return (
        <div className="forYou">
            <div className="groupsHeader">
                <p className="feedScopeSelect">Activity</p>
                <button type="button" className="profileBtn groupsNewBtn" onClick={() => markAllRead()}>
                    Mark all read
                </button>
            </div>

            <div className="feed">
                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {notifications?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            Nothing yet.
                        </p>
                    )}
                    {notifications?.map((n) => (
                        <Link
                            key={n._id}
                            to={linkFor(n)}
                            className="searchResultRow"
                            onClick={() => !n.isRead && markOneRead(n._id)}
                            style={{ background: n.isRead ? "transparent" : "var(--color-hover)" }}
                        >
                            <img src={n.actorId.avatarUrl || "/default-avatar.png"} alt={n.actorId.username} />
                            <div>
                                <span className="searchResultName">{n.actorId.username}</span>
                                <p className="searchResultSub">{MESSAGES[n.type] ?? "sent you a notification"}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}