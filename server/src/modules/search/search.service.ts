import { User } from "../users/user.model";
import { Group } from "../groups/group.model";
import { Post } from "../posts/post.model";

function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class SearchService {
    async search(query: string) {
        const safe = escapeRegex(query);
        const regex = new RegExp(safe, "i");
        const tagRegex = new RegExp(`#[a-zA-Z0-9_]*${safe}[a-zA-Z0-9_]*`, "i");

        const [users, groups, posts] = await Promise.all([
            User.find({ $or: [{ username: regex }, { name: regex }] })
                .select("username name avatarUrl")
                .limit(10),
            Group.find({ $or: [{ name: regex }, { description: regex }] })
                .select("name avatarUrl description")
                .limit(10),
            Post.find({ caption: tagRegex })
                .sort({ createdAt: -1 })
                .limit(40)
                .populate("authorId", "username avatarUrl name")
                .populate("groupId", "name avatarUrl"),
        ]);

        return { users, groups, posts };
    }
}