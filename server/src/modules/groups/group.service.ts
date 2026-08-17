import { GroupRepository } from "./group.repository";
import { GroupMembershipRepository } from "./groupMembership.repository";
import { NotificationService } from "../notifications/notification.service";

export class GroupService {
    constructor(
        private groupRepo: GroupRepository = new GroupRepository(),
        private membershipRepo: GroupMembershipRepository = new GroupMembershipRepository(),
        private notificationService: NotificationService = new NotificationService()
    ) { }

    async createGroup(ownerId: string, data: { name: string; description?: string; avatarUrl?: string }) {
        const group = await this.groupRepo.create({
            name: data.name,
            description: data.description ?? "",
            avatarUrl: data.avatarUrl ?? "",
            ownerId,
        } as any);

        await this.membershipRepo.create({
            groupId: group._id,
            userId: ownerId,
            role: "owner",
            status: "approved",
        } as any);

        return group;
    }

    async getGroup(groupId: string, viewerId?: string) {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new Error("Group not found");

        let membershipStatus: "owner" | "approved" | "pending" | "banned" | "none" = "none";
        if (viewerId) {
            const membership = await this.membershipRepo.findByGroupAndUser(groupId, viewerId);
            if (membership) {
                membershipStatus = membership.role === "owner" ? "owner" : (membership.status as any);
            }
        }

        const memberCount = (await this.membershipRepo.findApprovedForGroup(groupId)).length;
        return { ...group.toObject(), membershipStatus, memberCount };
    }

    private async assertOwner(groupId: string, requesterId: string) {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new Error("Group not found");
        if (group.ownerId.toString() !== requesterId) throw new Error("Only the group owner can do this");
        return group;
    }

    async updateGroup(groupId: string, requesterId: string, data: { name?: string; description?: string; avatarUrl?: string }) {
        await this.assertOwner(groupId, requesterId);
        return this.groupRepo.updateById(groupId, data);
    }

    async getMyGroups(userId: string) {
        const memberships = await this.membershipRepo.findApprovedGroupsForUser(userId);
        return memberships.map((m: any) => m.groupId);
    }

    async requestToJoin(groupId: string, userId: string) {
        const existing = await this.membershipRepo.findByGroupAndUser(groupId, userId);
        if (existing) {
            if (existing.status === "banned") throw new Error("You have been banned from this group");
            throw new Error("You already have a pending or active membership");
        }
        const membership = await this.membershipRepo.create({ groupId, userId, role: "member", status: "pending" } as any);

        const group = await this.groupRepo.findById(groupId);
        if (group) {
            await this.notificationService.notify(group.ownerId.toString(), userId, "group_request", groupId);
        }

        return membership;
    }

    async getPendingRequests(groupId: string, requesterId: string) {
        await this.assertOwner(groupId, requesterId);
        return this.membershipRepo.findPendingForGroup(groupId);
    }

    async getMembers(groupId: string) {
        return this.membershipRepo.findApprovedForGroup(groupId);
    }

    async approveRequest(groupId: string, targetUserId: string, requesterId: string) {
        await this.assertOwner(groupId, requesterId);
        const membership = await this.membershipRepo.findByGroupAndUser(groupId, targetUserId);
        if (!membership) throw new Error("Request not found");
        return this.membershipRepo.updateStatus(membership._id.toString(), "approved");
    }

    async rejectRequest(groupId: string, targetUserId: string, requesterId: string) {
        await this.assertOwner(groupId, requesterId);
        return this.membershipRepo.deleteOne({ groupId, userId: targetUserId } as any);
    }

    async kickMember(groupId: string, targetUserId: string, requesterId: string) {
        const group = await this.assertOwner(groupId, requesterId);
        if (group.ownerId.toString() === targetUserId) throw new Error("Cannot remove the owner");
        return this.membershipRepo.deleteOne({ groupId, userId: targetUserId } as any);
    }

    async leaveGroup(groupId: string, userId: string) {
        const group = await this.groupRepo.findById(groupId);
        if (!group) throw new Error("Group not found");
        if (group.ownerId.toString() === userId) {
            throw new Error("As the owner, you can't leave your own group");
        }
        return this.membershipRepo.deleteOne({ groupId, userId } as any);
    }
}