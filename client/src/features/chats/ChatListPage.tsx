import { Link, useParams } from "react-router-dom";
import { useGetConversationsQuery } from "./chatApiSlice";

export function ChatListPage() {
    const { data: conversations, isLoading } = useGetConversationsQuery();
    const { userId: activeUserId } = useParams<{ userId: string }>();

    return (
        <div className="conversationList">
            {isLoading && <p className="conversationEmpty">Loading...</p>}
            {conversations?.length === 0 && (
                <p className="conversationEmpty">No conversations yet. Message a friend from their profile.</p>
            )}
            {conversations?.map((c) => (
                <Link
                    key={c._id}
                    to={`/messages/${c.otherUser._id}`}
                    className={c.otherUser._id === activeUserId ? "conversationRow active" : "conversationRow"}
                >
                    <img src={c.otherUser.avatarUrl || "/default-avatar.png"} alt={c.otherUser.username} />
                    <div>
                        <span className="conversationName">{c.otherUser.name || c.otherUser.username}</span>
                        <p className="conversationPreview">{c.lastMessage || "Say hi 👋"}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}