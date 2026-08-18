import { NotificationRepository, } from "./notification.repository";
import type { NotificationType } from "./notification.model";

export class NotificationService {
    constructor(private notifRepo: NotificationRepository = new NotificationRepository()) { }

    async notify(recipientId: string, actorId: string, type: NotificationType, entityRef?: string) {
        if (recipientId === actorId) return;
        return this.notifRepo.create({ recipientId, actorId, type, entityRef, isRead: false } as any);
    }

    async getForUser(userId: string) {
        return this.notifRepo.findByUser(userId);
    }

    async getUnreadCount(userId: string) {
        return this.notifRepo.countUnread(userId);
    }

    async markAllRead(userId: string) {
        return this.notifRepo.markAllRead(userId);
    }

    async markOneRead(id: string, userId: string) {
        return this.notifRepo.markOneRead(id, userId);
    }

    async markReadForGroupRequest(ownerId: string, requesterId: string, groupId: string) {
        return this.notifRepo.markReadByActorTypeEntity(ownerId, requesterId, "group_request", groupId);
    }
}