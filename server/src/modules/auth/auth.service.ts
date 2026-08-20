import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../users/user.repository";
import { env } from "../../config/env";

export class AuthService {
    constructor(private userRepo: UserRepository = new UserRepository()) { }

    async registerUser(name: string, username: string, email: string, password: string, avatarUrl?: string, bio?: string) {
        const existingUser = await this.userRepo.findOne({ email });
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const password_hashed = await bcrypt.hash(password, 10);
        const user = await this.userRepo.create({
            name,
            username,
            email,
            password: password_hashed,
            ...(avatarUrl ? { avatarUrl } : {}),
            ...(bio ? { bio } : {}),
        });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...safeUser } = user.toObject();
        return { token, user: safeUser };
    }

    async loginUser(email: string, password: string) {
        const user = await this.userRepo.findOne({ email });
        if (!user) {
            throw new Error("Invalid email");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...safeUser } = user.toObject();
        return { token, user: safeUser };
    }
}