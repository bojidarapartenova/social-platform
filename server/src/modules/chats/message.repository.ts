import { Types } from "mongoose";
import { Message, IMessage } from "./message.model";

export class MessageRepository {
    create(data: Partial<IMessage>) {
        return Message.create(data);
    }

    findByConversation(conversationId: string) {
        return Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .populate("senderId", "username avatarUrl")
            .exec();
    }

    findLatestForConversations(conversationIds: string[]) {
        return Message.aggregate([
            { $match: { conversationId: { $in: conversationIds.map((id) => new Types.ObjectId(id)) } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$conversationId", text: { $first: "$text" }, createdAt: { $first: "$createdAt" } } },
        ]);
    }

    markReadForConversation(conversationId: string, readerId: string) {
        return Message.updateMany(
            { conversationId, senderId: { $ne: readerId }, isRead: false },
            { isRead: true }
        );
    }

    countUnreadGrouped(conversationIds: string[], userId: string) {
        return Message.aggregate([
            {
                $match: {
                    conversationId: { $in: conversationIds.map((id) => new Types.ObjectId(id)) },
                    senderId: { $ne: new Types.ObjectId(userId) },
                    isRead: false,
                },
            },
            { $group: { _id: "$conversationId", count: { $sum: 1 } } },
        ]);
    }
}