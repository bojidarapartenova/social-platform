import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { AuthService } from "./modules/auth/auth.service";
import { UserRepository } from "./modules/users/user.repository";
import { User } from "./modules/users/user.model";
import { followUser } from "./modules/follows/follow.service";
import { GroupService } from "./modules/groups/group.service";
import { PostService } from "./modules/posts/post.service";
import { LikeService } from "./modules/posts/like.service";
import { CommentService } from "./modules/posts/comment.service";
import { BookmarkService } from "./modules/posts/bookmark.service";

const authService = new AuthService();
const userRepo = new UserRepository();
const groupService = new GroupService();
const postService = new PostService();
const likeService = new LikeService();
const commentService = new CommentService();
const bookmarkService = new BookmarkService();

const PASSWORD = "Seed12345!";

interface SeedUser {
    username: string;
    name: string;
    email: string;
    bio: string;
    avatarUrl: string;
}

const USERS: SeedUser[] = [
    { username: "admin", name: "Admin Account", email: "admin@seed.local", bio: "Platform administrator.", avatarUrl: "/images/admin.jpg" },
    { username: "sophia_bloom", name: "Sophia Bloom", email: "sophia@seed.local", bio: "Photographer & coffee addict ☕📸", avatarUrl: "/images/female1.jpg" },
    { username: "marcus_lee", name: "Marcus Lee", email: "marcus@seed.local", bio: "Software engineer, gamer, dog dad 🐶", avatarUrl: "/images/male1.jpg" },
    { username: "aria_moon", name: "Aria Moon", email: "aria@seed.local", bio: "Fashion & lifestyle blogger", avatarUrl: "/images/female2.jpg" },
    { username: "leo_martins", name: "Leo Martins", email: "leo@seed.local", bio: "Travel more, worry less ✈️", avatarUrl: "/images/male2.jpg" },
    { username: "nina_park", name: "Nina Park", email: "nina@seed.local", bio: "UI/UX designer | plant mom 🌿", avatarUrl: "/images/female3.jpg" },
    { username: "daniel_cruz", name: "Daniel Cruz", email: "daniel@seed.local", bio: "Fitness coach 💪", avatarUrl: "/images/male3.jpg" },
    { username: "elena_ross", name: "Elena Ross", email: "elena@seed.local", bio: "Bookworm 📚 | tea over coffee", avatarUrl: "/images/female4.jpg" },
    { username: "kevin_shaw", name: "Kevin Shaw", email: "kevin@seed.local", bio: "Street photography enthusiast", avatarUrl: "/images/male4.jpg" },
    { username: "maya_singh", name: "Maya Singh", email: "maya@seed.local", bio: "Foodie. Always hungry 🍜", avatarUrl: "/images/female5.jpg" },
    { username: "oliver_king", name: "Oliver King", email: "oliver@seed.local", bio: "Musician 🎸 | indie rock", avatarUrl: "/images/male5.jpg" },
    { username: "ivy_chen", name: "Ivy Chen", email: "ivy@seed.local", bio: "Digital artist ✨", avatarUrl: "/images/female6.jpg" },
    { username: "ryan_cole", name: "Ryan Cole", email: "ryan@seed.local", bio: "Runner. Coffee snob.", avatarUrl: "/images/male6.jpg" },
    { username: "zara_ahmed", name: "Zara Ahmed", email: "zara@seed.local", bio: "Med student, cat person 🐱", avatarUrl: "/images/female7.jpg" },
    { username: "tom_becker", name: "Tom Becker", email: "tom@seed.local", bio: "Just here for the memes", avatarUrl: "/images/male7.jpg" },
];

async function seedUsers(): Promise<Record<string, string>> {
    const userIds: Record<string, string> = {};

    for (const u of USERS) {
        let userId: string;
        try {
            const created = await authService.registerUser(u.name, u.username, u.email, PASSWORD);
            userId = created.user._id.toString();
            await userRepo.updateById(userId, { bio: u.bio, avatarUrl: u.avatarUrl });
            console.log(`Created user: ${u.username}`);
        } catch {
            const existing = await User.findOne({ username: u.username });
            if (!existing) throw new Error(`Could not create or find user ${u.username}`);
            userId = existing._id.toString();
            console.log(`User already exists, reusing: ${u.username}`);
        }
        userIds[u.username] = userId;
    }

    await User.findByIdAndUpdate(userIds["admin"], { role: "admin" });
    console.log("Promoted 'admin' to role=admin\n");

    return userIds;
}

async function seedFollows(userIds: Record<string, string>) {
    const mutualPairs: [string, string][] = [
        ["sophia_bloom", "marcus_lee"],
        ["sophia_bloom", "aria_moon"],
        ["marcus_lee", "leo_martins"],
        ["nina_park", "daniel_cruz"],
        ["elena_ross", "kevin_shaw"],
        ["maya_singh", "oliver_king"],
        ["ivy_chen", "ryan_cole"],
        ["zara_ahmed", "tom_becker"],
        ["sophia_bloom", "nina_park"],
        ["marcus_lee", "kevin_shaw"],
    ];

    const oneWay: [string, string][] = [
        ["aria_moon", "sophia_bloom"],
        ["leo_martins", "sophia_bloom"],
        ["daniel_cruz", "sophia_bloom"],
        ["elena_ross", "sophia_bloom"],
        ["kevin_shaw", "marcus_lee"],
        ["maya_singh", "marcus_lee"],
        ["oliver_king", "nina_park"],
        ["ivy_chen", "nina_park"],
        ["ryan_cole", "elena_ross"],
        ["zara_ahmed", "maya_singh"],
        ["tom_becker", "ivy_chen"],
        ["nina_park", "sophia_bloom"],
    ];

    for (const [a, b] of mutualPairs) {
        try { await followUser(userIds[a], userIds[b]); } catch { }
        try { await followUser(userIds[b], userIds[a]); } catch { }
    }
    for (const [follower, target] of oneWay) {
        try { await followUser(userIds[follower], userIds[target]); } catch { }
    }

    console.log("Seeded follow relationships (mutual + one-way)\n");
}

async function seedGroups(userIds: Record<string, string>): Promise<Record<string, string>> {
    const groupsData = [
        { owner: "sophia_bloom", name: "Photography Lovers", description: "A place to share your best shots. #photography #travel", avatarUrl: "/images/group1.jpg" },
        { owner: "daniel_cruz", name: "Fitness & Wellness", description: "Workouts, recipes, and motivation. #fitness #health", avatarUrl: "/images/group2.jpg" },
        { owner: "aria_moon", name: "Fashion Forward", description: "Outfits, trends, and style inspo. #fashion #ootd", avatarUrl: "/images/group3.jpg" },
        { owner: "oliver_king", name: "Indie Music Club", description: "Discover new artists and share your favorites. #music", avatarUrl: "/images/group4.jpg" }
    ]

    const groupIds: Record<string, string> = {};

    for (const g of groupsData) {
        try {
            const group = await groupService.createGroup(userIds[g.owner], {
                name: g.name, description: g.description, avatarUrl: g.avatarUrl,
            });
            groupIds[g.name] = group._id.toString();
            console.log(`Created group: ${g.name}`);
        } catch (err: any) {
            console.log(`Skipping group "${g.name}" (already exists?): ${err.message}`);
        }
    }

    const membershipPlan: { user: string; group: string; approve: boolean }[] = [
        { user: "marcus_lee", group: "Photography Lovers", approve: true },
        { user: "kevin_shaw", group: "Photography Lovers", approve: true },
        { user: "leo_martins", group: "Photography Lovers", approve: false },
        { user: "nina_park", group: "Fitness & Wellness", approve: true },
        { user: "ryan_cole", group: "Fitness & Wellness", approve: true },
        { user: "zara_ahmed", group: "Fitness & Wellness", approve: false },
        { user: "elena_ross", group: "Fashion Forward", approve: true },
        { user: "maya_singh", group: "Fashion Forward", approve: false },
        { user: "ivy_chen", group: "Indie Music Club", approve: true },
        { user: "tom_becker", group: "Indie Music Club", approve: true },
    ];

    for (const m of membershipPlan) {
        const groupId = groupIds[m.group];
        if (!groupId) continue;
        const ownerUsername = groupsData.find((g) => g.name === m.group)!.owner;
        try {
            await groupService.requestToJoin(groupId, userIds[m.user]);
            if (m.approve) {
                await groupService.approveRequest(groupId, userIds[m.user], userIds[ownerUsername]);
            }
        } catch (err: any) {
            console.log(`Skipping membership for ${m.user} in ${m.group}: ${err.message}`);
        }
    }

    console.log("Seeded group memberships (approved + pending)\n");
    return groupIds;
}

async function seedPosts(userIds: Record<string, string>, groupIds: Record<string, string>): Promise<string[]> {
    type MediaFilter = "none" | "negative" | "blur" | "sobel";
    type SeedPost = {
        author: string;
        caption: string;
        media?: { url: string; filter: MediaFilter }[];
        group?: string;
    };

    const posts: SeedPost[] = [
        { author: "sophia_bloom", caption: "Golden hour never disappoints 🌅 #photography #sunset", media: [{ url: "https://picsum.photos/seed/sunset1/800/600", filter: "none" }] },
        {
            author: "sophia_bloom", caption: "Street shots from today's walk #photography #streetphoto", media: [
                { url: "/images/post1.jpg", filter: "none" },
                { url: "/images/post1.jpg", filter: "sobel" },
            ]
        },
        { author: "marcus_lee", caption: "Finally beat this boss after 20 tries lol #gaming" },
        { author: "marcus_lee", caption: "New desk setup, feeling productive #tech", media: [{ url: "/images/post2.jpg", filter: "none" }] },
        { author: "aria_moon", caption: "Today's fit 🧥 #fashion #ootd", media: [{ url: "/images/post3.jpg", filter: "none" }] },
        { author: "leo_martins", caption: "Somewhere in the Alps ⛰️ #travel", media: [{ url: "/images/post4.jpg", filter: "blur" }] },
        { author: "nina_park", caption: "New plant baby 🌿 #plants", media: [{ url: "/images/post5.jpg", filter: "none" }] },
        { author: "daniel_cruz", caption: "Leg day complete 🔥 #fitness" },
        { author: "elena_ross", caption: "Currently reading this masterpiece 📖 #books", media: [{ url: "/images/post6.jpg", filter: "none" }] },
        { author: "kevin_shaw", caption: "Rainy city nights #streetphoto #photography", media: [{ url: "/images/post7.jpg", filter: "negative" }] },
        { author: "maya_singh", caption: "Homemade ramen night 🍜 #food", media: [{ url: "/images/post8.jpg", filter: "none" }] },
        { author: "oliver_king", caption: "New track dropping this Friday 🎸 #music" },
        { author: "ivy_chen", caption: "Latest digital piece #art", media: [{ url: "/images/post9.jpg", filter: "none" }] },
        { author: "ryan_cole", caption: "10k done ✅ #running #fitness" },
        { author: "zara_ahmed", caption: "Studying with my study buddy 🐱 #catsofinstagram", media: [{ url: "/images/post10.jpg", filter: "none" }] },
        { author: "tom_becker", caption: "no caption needed #memes", media: [{ url: "/images/post1.jpg", filter: "none" }] },
        { author: "marcus_lee", caption: "My entry for this week #photography", group: "Photography Lovers", media: [{ url: "/images/post11.jpg", filter: "none" }] },
        { author: "kevin_shaw", caption: "Feedback welcome! #photography", group: "Photography Lovers", media: [{ url: "/images/post12.jpg", filter: "sobel" }] },
        { author: "nina_park", caption: "What's the morning routine that changed your life? #fitness", group: "Fitness & Wellness" },
        { author: "ryan_cole", caption: "Meal prep Sunday #fitness #food", group: "Fitness & Wellness", media: [{ url: "/images/post13.jpg", filter: "none" }] },
        { author: "elena_ross", caption: "Thrifted this gem today #fashion", group: "Fashion Forward", media: [{ url: "/images/post14.jpg", filter: "none" }] },
        { author: "ivy_chen", caption: "Been on repeat all week #music", group: "Indie Music Club" },
    ];

    const postIds: string[] = [];

    for (const p of posts) {
        try {
            const created = await postService.createPost(userIds[p.author], {
                type: p.media && p.media.length > 0 ? "photo" : "text",
                caption: p.caption,
                media: p.media,
                groupId: p.group ? groupIds[p.group] : undefined,
            });
            postIds.push(created._id.toString());
        } catch (err: any) {
            console.log(`Skipping post by ${p.author}: ${err.message}`);
        }
    }

    console.log(`Seeded ${postIds.length} posts\n`);
    return postIds;
}

async function seedEngagement(userIds: Record<string, string>, postIds: string[]) {
    const allUserIds = Object.values(userIds).filter((id) => id !== userIds["admin"]);
    const commentTexts = [
        "Love this! 😍", "So good!", "This is amazing", "🔥🔥🔥", "Where was this taken?",
        "Great shot!", "Obsessed with this", "Need this in my life", "So relatable 😂", "Beautiful!",
    ];

    for (const postId of postIds) {
        const shuffled = [...allUserIds].sort(() => Math.random() - 0.5);
        const likeCount = 3 + Math.floor(Math.random() * 8);

        for (const userId of shuffled.slice(0, likeCount)) {
            try { await likeService.toggleLike(postId, userId); } catch { }
        }

        const commentCount = Math.floor(Math.random() * 4);
        for (let i = 0; i < commentCount; i++) {
            const userId = shuffled[i % shuffled.length];
            const text = commentTexts[Math.floor(Math.random() * commentTexts.length)];
            try { await commentService.addComment(postId, userId, text); } catch { }
        }

        if (Math.random() > 0.6) {
            try { await bookmarkService.toggleFavorite(postId, shuffled[0]); } catch { }
        }
    }

    console.log("Seeded likes, comments, and bookmarks\n");
}

async function seed() {
    await connectDB();
    console.log("Seeding started...\n");

    const userIds = await seedUsers();
    await seedFollows(userIds);
    const groupIds = await seedGroups(userIds);
    const postIds = await seedPosts(userIds, groupIds);
    await seedEngagement(userIds, postIds);

    console.log("Seeding complete!");
    console.log(`All seeded accounts share the password: ${PASSWORD}`);
    console.log("Admin login -> username: admin / email: admin@seed.local");
    console.log("Example user login -> username: sophia_bloom / email: sophia@seed.local");

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});