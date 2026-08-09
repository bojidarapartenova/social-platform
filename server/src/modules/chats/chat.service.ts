import { ConversationRepository } from "./conversation.repository";
import { MessageRepository } from "./message.repository";
import { Friendship } from "../follows/friendship.model";
import { NotificationService } from "../notifications/notification.service";

function sortedPair(a: string, b: string) {
    return a < b ? [a, b] : [b, a];
}

export class ChatService {
    constructor(
        private conversationRepo: ConversationRepository = new ConversationRepository(),
        private messageRepo: MessageRepository = new MessageRepository(),
        private notificationService: NotificationService = new NotificationService()
    ) { }

    async startConversation(userId: string, otherUserId: string) {
        if (userId === otherUserId) throw new Error("You can't message yourself");

        const [a, b] = sortedPair(userId, otherUserId);
        const isFriend = await Friendship.exists({ userAId: a, userBId: b });
        if (!isFriend) throw new Error("You can only message people you're friends with");

        const participantKey = `${a}_${b}`;
        return this.conversationRepo.findOrCreateDirect(participantKey, [userId, otherUserId]);
    }

    async getConversations(userId: string) {
        const conversations = await this.conversationRepo.findByUser(userId);
        const ids = conversations.map((c) => c._id.toString());
        const latestMessages = await this.messageRepo.findLatestForConversations(ids);
        const latestMap = new Map(latestMessages.map((m: any) => [m._id.toString(), m]));

        const summaries = conversations.map((c) => {
            const other = (c.participantIds as any[]).find((p) => p._id.toString() !== userId);
            const latest = latestMap.get(c._id.toString());
            return {
                _id: c._id,
                otherUser: other,
                lastMessage: latest?.text ?? "",
                lastMessageAt: latest?.createdAt ?? c.createdAt,
            };
        });

        return summaries.sort(
            (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
    }

    async getMessages(conversationId: string, requesterId: string) {
        const conversation = await this.conversationRepo.findById(conversationId);
        if (!conversation) throw new Error("Conversation not found");
        if (!conversation.participantIds.some((p) => p.toString() === requesterId)) {
            throw new Error("Forbidden");
        }
        return this.messageRepo.findByConversation(conversationId);
    }

    async sendMessage(conversationId: string, senderId: string, text: string) {
        if (!text.trim()) throw new Error("Message cannot be empty");
        const conversation = await this.conversationRepo.findById(conversationId);
        if (!conversation) throw new Error("Conversation not found");
        if (!conversation.participantIds.some((p) => p.toString() === senderId)) {
            throw new Error("Forbidden");
        }
        const message = await this.messageRepo.create({ conversationId, senderId, text: text.trim() } as any);

        const recipientId = conversation.participantIds.find((p) => p.toString() !== senderId);
        if (recipientId) await this.notificationService.notify(recipientId.toString(), senderId, "message", conversationId);

        return message;
    }
}