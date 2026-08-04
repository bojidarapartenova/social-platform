import { GroupMembership, IGroupMembership } from "./groupMembership.model";

export class GroupMembershipRepository {
    create(data: Partial<IGroupMembership>) {
        return GroupMembership.create(data);
    }
    findOne(filter: Partial<IGroupMembership>) {
        return GroupMembership.findOne(filter).exec();
    }
    findByGroupAndUser(groupId: string, userId: string) {
        return GroupMembership.findOne({ groupId, userId }).exec();
    }
    findApprovedGroupsForUser(userId: string) {
        return GroupMembership.find({ userId, status: "approved" })
            .populate("groupId", "name description avatarUrl ownerId")
            .exec();
    }
    findPendingForGroup(groupId: string) {
        return GroupMembership.find({ groupId, status: "pending" })
            .populate("userId", "username name avatarUrl")
            .exec();
    }
    findApprovedForGroup(groupId: string) {
        return GroupMembership.find({ groupId, status: "approved" })
            .populate("userId", "username name avatarUrl")
            .exec();
    }
    updateStatus(id: string, status: string) {
        return GroupMembership.findByIdAndUpdate(id, { status }, { new: true }).exec();
    }
    deleteOne(filter: Partial<IGroupMembership>) {
        return GroupMembership.deleteOne(filter).exec();
    }
}