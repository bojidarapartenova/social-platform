import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export async function register(req: Request, res: Response) {
    try {
        const { name, username, email, password } = req.body;
        const user = await authService.registerUser(name, username, email, password);
        res.status(201).json({ message: "User created", user });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser(email, password);
        res.status(200).json({ message: "Login successful", token, user });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

