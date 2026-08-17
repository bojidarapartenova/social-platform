import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkOneReadMutation } from "./notificationApiSlice";
import "../../styles/search.css";

const MESSAGES: Record<string, string> = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    group_request: "requested to join your group",
    group_invite: "invited you to a group",
    message: "sent you a message",
};

export function NotificationsPage() {
    const { data: notifications, isLoading } = useGetNotificationsQuery();
    const [markAllRead] = useMarkAllReadMutation();
    const [markOneRead] = useMarkOneReadMutation();

    function linkFor(n: any) {
        if (n.type === "follow") return `/profile/${n.actorId._id}`;
        if (n.type === "group_request" && n.entityRef) return `/groups/${n.entityRef}`;
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
                        <div
                            key={n._id}
                            className="notificationRow"
                            style={{ background: n.isRead ? "transparent" : "var(--color-hover)" }}
                        >
                            <Link to={`/profile/${n.actorId._id}`} className="notificationActor">
                                <img src={n.actorId.avatarUrl || "/default-avatar.png"} alt={n.actorId.username} />
                                <span>{n.actorId.username}</span>
                            </Link>

                            <Link
                                to={linkFor(n)}
                                className="notificationText"
                                onClick={() => !n.isRead && markOneRead(n._id)}
                            >
                                {MESSAGES[n.type] ?? "sent you a notification"}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}