import { Group, IGroup } from "./group.model";
import { Types } from "mongoose";

export class GroupRepository {
    create(data: Partial<IGroup>) {
        return Group.create(data);
    }

    findById(id: string) {
        return Group.findById(id).exec();
    }

    updateById(id: string, data: Partial<IGroup>) {
        return Group.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    findSuggestions(excludeGroupIds: string[], limit = 20) {
        return Group.aggregate([
            { $match: { _id: { $nin: excludeGroupIds.map((id) => new Types.ObjectId(id)) } } },
            {
                $lookup: {
                    from: "groupmemberships",
                    let: { groupId: "$_id" },
                    pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$groupId", "$$groupId"] }, { $eq: ["$status", "approved"] }] } } }],
                    as: "members",
                },
            },
            { $addFields: { memberCount: { $size: "$members" } } },
            { $project: { members: 0 } },
            { $sort: { memberCount: -1, createdAt: -1 } },
            { $limit: limit },
        ]);
    }

    deleteById(id: string) {
        return Group.findByIdAndDelete(id).exec();
    }
}