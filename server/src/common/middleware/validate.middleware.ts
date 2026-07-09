import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";

export function validate(schema: AnySchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
            next();
        } catch (err: any) {
            res.status(400).json({ message: "Validation failed", errors: err.errors });
        }
    };
}