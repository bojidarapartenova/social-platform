import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useGetNotificationsQuery, useMarkAllReadMutation, useMarkOneReadMutation } from "./notificationApiSlice";
import "../../styles/search.css";

const MESSAGES: Record<string, string> = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    group_request: "requested to join your group",
    group_accept: "accepted your request to join their group",
    group_invite: "invited you to a group",
    message: "sent you a message",
};

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function isSameDay(iso1: string, iso2: string) {
    const d1 = new Date(iso1);
    const d2 = new Date(iso2);
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

function formatDateHeader(iso: string) {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(iso, today.toISOString())) return "Today";
    if (isSameDay(iso, yesterday.toISOString())) return "Yesterday";

    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function NotificationsPage() {
    const { data: notifications, isLoading } = useGetNotificationsQuery();
    const [markAllRead] = useMarkAllReadMutation();
    const [markOneRead] = useMarkOneReadMutation();

    function linkFor(n: any) {
        if (n.type === "follow") return `/profile/${n.actorId._id}`;
        if ((n.type === "group_request" || n.type === "group_accept") && n.entityRef) return `/groups/${n.entityRef}`;
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
                    {notifications?.map((n, index) => {
                        const prevNotification = notifications[index - 1];
                        const showDateSeparator = !prevNotification || !isSameDay(prevNotification.createdAt, n.createdAt);

                        return (
                            <Fragment key={n._id}>
                                {showDateSeparator && (
                                    <div className="chatDateSeparator">
                                        <span>{formatDateHeader(n.createdAt)}</span>
                                    </div>
                                )}
                                <div
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

                                    <span className="chatTime">{formatTime(n.createdAt)}</span>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}