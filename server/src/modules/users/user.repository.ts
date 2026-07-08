import { User, IUser } from "./user.model";
import { IRepository } from "../../common/repository";

export class UserRepository implements IRepository<IUser> {
    findById(id: string) {
        return User.findById(id).exec();
    }
    findOne(filter: Partial<IUser>) {
        return User.findOne(filter).exec();
    }
    create(data: Partial<IUser>) {
        return User.create(data);
    }
}