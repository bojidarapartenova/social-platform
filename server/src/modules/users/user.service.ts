import { UserRepository } from "./user.repository";

export class UserService {
    constructor(private userRepo: UserRepository = new UserRepository()) { }

    async getUserById(id: string) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("User not found");
        const { password, ...safeUser } = user.toObject();
        return safeUser;
    }

    async updateUser(id: string, data: { name?: string; bio?: string; avatarUrl?: string }) {
        const user = await this.userRepo.updateById(id, data);
        if (!user) throw new Error("User not found");
        const { password, ...safeUser } = user.toObject();
        return safeUser;
    }
}