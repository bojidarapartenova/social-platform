import { apiSlice } from "../../app/apiSlice";

export interface ChatUser {
    _id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
}

export interface ConversationSummary {
    _id: string;
    otherUser: ChatUser;
    lastMessage: string;
    lastMessageAt: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    senderId: { _id: string; username: string; avatarUrl?: string };
    text: string;
    createdAt: string;
}

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getConversations: builder.query<ConversationSummary[], void>({
            query: () => "/chats",
            providesTags: ["Chat"],
        }),
        startConversation: builder.mutation<{ _id: string }, string>({
            query: (userId) => ({ url: `/chats/with/${userId}`, method: "POST" }),
            invalidatesTags: ["Chat"],
        }),
        getMessages: builder.query<Message[], string>({
            query: (conversationId) => `/chats/${conversationId}/messages`,
            providesTags: (_r, _e, conversationId) => [{ type: "Message", id: conversationId }],
        }),
        sendMessage: builder.mutation<Message, { conversationId: string; text: string }>({
            query: ({ conversationId, text }) => ({
                url: `/chats/${conversationId}/messages`,
                method: "POST",
                body: { text },
            }),
            invalidatesTags: (_r, _e, { conversationId }) => [{ type: "Message", id: conversationId }, "Chat"],
        }),
    }),
});

export const {
    useGetConversationsQuery, useStartConversationMutation,
    useGetMessagesQuery, useSendMessageMutation,
} = chatApiSlice;