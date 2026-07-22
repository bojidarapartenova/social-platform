import { Types } from "mongoose";
import { IMessage, Message } from "./message.model";

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
}