import { IConversation, Conversation } from "./conversation.model";

export class ConversationRepository {
    findDirectBetween(userAId: string, userBId: string) {
        return Conversation.findOne({
            type: "direct",
            participantIds: { $all: [userAId, userBId], $size: 2 }
        }).exec();
    }

    create(data: Partial<IConversation>) {
        return Conversation.create(data);
    }

    findById(id: string) {
        return Conversation.findById(id).exec();
    }

    findByUser(userId: string) {
        return Conversation.find({ participantIds: userId })
            .populate("participantIds", "username name avatarUrl")
            .exec();
    }

    findOrCreateDirect(participantKey: string, participantIds: string[]) {
        return Conversation.findOneAndUpdate(
            { participantKey },
            { $setOnInsert: { type: "direct", participantIds, participantKey } },
            { upsert: true, new: true }
        ).exec();
    }
}