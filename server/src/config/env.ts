import "dotenv/config";

export const env = {
    PORT: process.env.PORT || 5050,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!
};