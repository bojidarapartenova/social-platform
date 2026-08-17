import { Group, IGroup } from "./group.model";

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
}