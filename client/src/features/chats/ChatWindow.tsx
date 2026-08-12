import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useStartConversationMutation, useGetMessagesQuery, useSendMessageMutation } from "./chatApiSlice";
import { useGetUserQuery } from "../users/userApiSlice";
import "../../styles/feed.css";
import "../../styles/chat.css";

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function ChatWindow() {
    const { userId } = useParams<{ userId: string }>();
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const [startConversation] = useStartConversationMutation();
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const { data: otherUser } = useGetUserQuery(userId!, { skip: !userId });

    useEffect(() => {
        let cancelled = false;
        setError("");
        setConversationId(null);
        startConversation(userId!)
            .unwrap()
            .then((conversation) => {
                if (!cancelled) setConversationId(conversation._id);
            })
            .catch(() => {
                if (!cancelled) setError("You can only message people you're friends with.");
            });
        return () => { cancelled = true; };
    }, [userId]);

    const { data: messages } = useGetMessagesQuery(conversationId!, {
        skip: !conversationId,
        pollingInterval: 3000,
    });
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim() || !conversationId) return;
        await sendMessage({ conversationId, text });
        setText("");
    }

    if (error) {
        return (
            <div className="chatEmpty">
                <p>{error}</p>
            </div>
        );
    }

    const lastMineIndex = messages ? [...messages].reverse().findIndex((m) => m.senderId._id === currentUserId) : -1;
    const lastMineId = lastMineIndex >= 0 && messages ? messages[messages.length - 1 - lastMineIndex]._id : null;
    const lastMineIsRead = lastMineId ? messages?.find((m) => m._id === lastMineId)?.isRead : false;

    return (
        <>
            {otherUser && (
                <div className="chatHeader">
                    <Link to={`/profile/${otherUser._id}`} className="chatHeaderLink">
                        <img src={otherUser.avatarUrl || "/default-avatar.png"} alt={otherUser.username} />
                        <span>{otherUser.name || otherUser.username}</span>
                    </Link>
                </div>
            )}

            <div className="chatMessages">
                {messages?.map((m) => {
                    const isMine = m.senderId._id === currentUserId;
                    return (
                        <div key={m._id} className={isMine ? "chatRow mine" : "chatRow"}>
                            {!isMine && (
                                <img className="chatAvatar" src={m.senderId.avatarUrl || "/default-avatar.png"} alt={m.senderId.username} />
                            )}
                            <div className="chatBubbleGroup">
                                <div className={isMine ? "chatBubble mine" : "chatBubble"}>{m.text}</div>
                                <span className="chatTime">{formatTime(m.createdAt)}</span>
                                {isMine && m._id === lastMineId && lastMineIsRead && (
                                    <span className="chatSeen">Seen</span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form className="chatInputRow" onSubmit={handleSend}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Message..."
                    disabled={isSending}
                />
                <button type="submit" disabled={isSending || !text.trim()}>Send</button>
            </form>
        </>
    );
}