import bcrypt from "bcryptjs";
import { User } from "../users/user.model";

export async function registerUser(
    username: string,
    email: string,
    password: string
) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        passwordHash
    });

    return user;
}