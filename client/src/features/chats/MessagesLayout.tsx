import { Outlet } from "react-router-dom";
import { ChatListPage } from "./ChatListPage";
import "../../styles/chat.css";

export function MessagesLayout() {
    return (
        <div className="messagesPage">
            <aside className="conversations-sidebar">
                <div className="conversationsSidebarHeader">
                    <h2>Messages</h2>
                </div>
                <ChatListPage />
            </aside>
            <main className="chat-content">
                <Outlet />
            </main>
        </div>
    );
}