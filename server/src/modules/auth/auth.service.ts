import bcrypt from "bcryptjs";
import { UserRepository } from "../users/user.repository";

export class AuthService {
    constructor(private userRepo: UserRepository = new UserRepository()) { }

    async registerUser(username: string, email: string, password: string) {
        const existingUser = await this.userRepo.findOne({ email });
        if (existingUser) throw new Error("Email already exists");

        const password_hashed = await bcrypt.hash(password, 10);
        return this.userRepo.create({ username, email, password: password_hashed });
    }
}