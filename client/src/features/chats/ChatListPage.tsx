import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetConversationsQuery } from "./chatApiSlice";

export function ChatListPage() {
    const { data: conversations, isLoading } = useGetConversationsQuery();
    const { userId: activeUserId } = useParams<{ userId: string }>();
    const [filterText, setFilterText] = useState("");

    const filtered = conversations?.filter((c) => {
        const q = filterText.trim().toLowerCase();
        if (!q) return true;
        return c.otherUser.username.toLowerCase().includes(q) || (c.otherUser.name ?? "").toLowerCase().includes(q);
    });

    return (
        <>
            <div className="conversationSearchRow">
                <input
                    className="conversationSearchInput"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Search"
                />
            </div>

            <div className="conversationList">
                {isLoading && <p className="conversationEmpty">Loading...</p>}
                {conversations?.length === 0 && (
                    <p className="conversationEmpty">No conversations yet. Message a friend from their profile.</p>
                )}
                {conversations && conversations.length > 0 && filtered?.length === 0 && (
                    <p className="conversationEmpty">No matches for "{filterText}"</p>
                )}
                {filtered?.map((c) => (
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
        </>
    );
}