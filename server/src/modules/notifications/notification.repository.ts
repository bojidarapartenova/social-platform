import { Notification, INotification } from "./notification.model";

export class NotificationRepository {
    create(data: Partial<INotification>) {
        return Notification.create(data);
    }
    findByUser(userId: string, limit = 30) {
        return Notification.find({ recipientId: userId, type: { $ne: "message" } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("actorId", "username avatarUrl")
            .exec();
    }
    countUnread(userId: string) {
        return Notification.countDocuments({ recipientId: userId, isRead: false, type: { $ne: "message" } });
    }
    markAllRead(userId: string) {
        return Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
    }
    markOneRead(id: string, userId: string) {
        return Notification.findOneAndUpdate({ _id: id, recipientId: userId }, { isRead: true }, { new: true });
    }
}