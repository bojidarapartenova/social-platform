import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export interface AuthPayload {
    userId: string;
    role: "user" | "admin";
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
        req.user = payload;
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
        const token = header.split(" ")[1];
        try {
            req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
        } catch {
        }
    }
    next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}