import { Request, Response } from "express";
import { registerUser } from "./auth.service";

export async function register(
    req: Request,
    res: Response
) {
    try {
        const { username, email, password } = req.body;

        const user = await registerUser(
            username,
            email,
            password
        );

        res.status(201).json({
            message: "User created",
            user
        });

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
}