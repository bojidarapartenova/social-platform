import { User } from "../users/user.model";
import { Group } from "../groups/group.model";
import { Post } from "../posts/post.model";

function escapeRegex(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class SearchService {
    async search(query: string) {
        const cleanedQuery = query.replace(/^#+/, "");
        const safe = escapeRegex(cleanedQuery);
        const regex = new RegExp(safe, "i");

        const [users, groups, posts] = await Promise.all([
            User.find({ $or: [{ username: regex }, { name: regex }] })
                .select("username name avatarUrl")
                .limit(10),
            Group.find({ $or: [{ name: regex }, { description: regex }] })
                .select("name avatarUrl description")
                .limit(10),
            Post.find({ caption: regex })
                .sort({ createdAt: -1 })
                .limit(40)
                .populate("authorId", "username avatarUrl name")
                .populate("groupId", "name avatarUrl"),
        ]);

        return { users, groups, posts };
    }
}