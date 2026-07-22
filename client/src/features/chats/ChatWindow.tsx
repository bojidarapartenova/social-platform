import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useStartConversationMutation, useGetMessagesQuery, useSendMessageMutation } from "./chatApiSlice";
import { MessagesLayout } from "./MessagesLayout";

export function ChatWindow() {
    const { userId } = useParams<{ userId: string }>();
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const [startConversation] = useStartConversationMutation();
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [error, setError] = useState("");

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
        pollingInterval: 3000, // stand-in for real-time until Socket.IO gets added
    });
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim() || !conversationId) return;
        await sendMessage({ conversationId, text });
        setText("");
    }

    if (error) {
        return <div className="chatEmpty"><p>{error}</p></div>;
    }

    return (
        <>
            <div className="chatMessages">
                {messages?.map((m) => (
                    <div key={m._id} className={m.senderId._id === currentUserId ? "chatBubble mine" : "chatBubble"}>
                        {m.text}
                    </div>
                ))}
            </div>

            <form className="chatInputRow" onSubmit={handleSend}>
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message..." />
                <button type="submit" disabled={isSending || !text.trim()}>Send</button>
            </form>
        </>
    );
}