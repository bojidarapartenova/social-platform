import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetConversationsQuery } from "./chatApiSlice";
import { useGetFriendsQuery } from "../follows/followApiSlice";

export function ChatListPage() {
    const { data: conversations, isLoading } = useGetConversationsQuery(undefined, { pollingInterval: 5000 });
    const { data: friends } = useGetFriendsQuery();
    const { userId: activeUserId } = useParams<{ userId: string }>();
    const [filterText, setFilterText] = useState("");

    const conversationUserIds = new Set(conversations?.map((c) => c.otherUser._id));
    const friendsWithoutChat = friends?.filter((f) => !conversationUserIds.has(f._id));

    const filtered = conversations?.filter((c) => {
        const q = filterText.trim().toLowerCase();
        if (!q) return true;
        return c.otherUser.username.toLowerCase().includes(q) || (c.otherUser.name ?? "").toLowerCase().includes(q);
    });

    const filteredFriends = friendsWithoutChat?.filter((f) => {
        const q = filterText.trim().toLowerCase();
        if (!q) return true;
        return f.username.toLowerCase().includes(q) || (f.name ?? "").toLowerCase().includes(q);
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
                        {c.unreadCount > 0 && <span className="conversationUnreadBadge">{c.unreadCount}</span>}
                    </Link>
                ))}

                {conversations?.length === 0 && (!friendsWithoutChat || friendsWithoutChat.length === 0) && (
                    <p className="conversationEmpty">No conversations or friends yet.</p>
                )}
            </div>
        </>
    );
}