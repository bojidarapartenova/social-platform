import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/api/auth",
    authRoutes
);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/users", userRoutes);

export default app;