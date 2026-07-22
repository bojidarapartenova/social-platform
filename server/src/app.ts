import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import followRoutes from "./modules/follows/follow.routes"
import postRoutes from "./modules/posts/post.routes";
import commentRoutes from "./modules/posts/comment.routes";
import chatRoutes from "./modules/chats/chat.routes"

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
app.use("/api/follows", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/chats", chatRoutes);

export default app;