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
    { username: "admin", name: "Admin Account", email: "admin@seed.local", bio: "Platform administrator.", avatarUrl: "https://i.pravatar.cc/300?img=12" },
    { username: "sophia_bloom", name: "Sophia Bloom", email: "sophia@seed.local", bio: "Photographer & coffee addict ☕📸", avatarUrl: "https://i.pravatar.cc/300?img=5" },
    { username: "marcus_lee", name: "Marcus Lee", email: "marcus@seed.local", bio: "Software engineer, gamer, dog dad 🐶", avatarUrl: "https://i.pravatar.cc/300?img=13" },
    { username: "aria_moon", name: "Aria Moon", email: "aria@seed.local", bio: "Fashion & lifestyle blogger", avatarUrl: "https://i.pravatar.cc/300?img=9" },
    { username: "leo_martins", name: "Leo Martins", email: "leo@seed.local", bio: "Travel more, worry less ✈️", avatarUrl: "https://i.pravatar.cc/300?img=14" },
    { username: "nina_park", name: "Nina Park", email: "nina@seed.local", bio: "UI/UX designer | plant mom 🌿", avatarUrl: "https://i.pravatar.cc/300?img=16" },
    { username: "daniel_cruz", name: "Daniel Cruz", email: "daniel@seed.local", bio: "Fitness coach 💪", avatarUrl: "https://i.pravatar.cc/300?img=15" },
    { username: "elena_ross", name: "Elena Ross", email: "elena@seed.local", bio: "Bookworm 📚 | tea over coffee", avatarUrl: "https://i.pravatar.cc/300?img=20" },
    { username: "kevin_shaw", name: "Kevin Shaw", email: "kevin@seed.local", bio: "Street photography enthusiast", avatarUrl: "https://i.pravatar.cc/300?img=17" },
    { username: "maya_singh", name: "Maya Singh", email: "maya@seed.local", bio: "Foodie. Always hungry 🍜", avatarUrl: "https://i.pravatar.cc/300?img=25" },
    { username: "oliver_king", name: "Oliver King", email: "oliver@seed.local", bio: "Musician 🎸 | indie rock", avatarUrl: "https://i.pravatar.cc/300?img=33" },
    { username: "ivy_chen", name: "Ivy Chen", email: "ivy@seed.local", bio: "Digital artist ✨", avatarUrl: "https://i.pravatar.cc/300?img=45" },
    { username: "ryan_cole", name: "Ryan Cole", email: "ryan@seed.local", bio: "Runner. Coffee snob.", avatarUrl: "https://i.pravatar.cc/300?img=52" },
    { username: "zara_ahmed", name: "Zara Ahmed", email: "zara@seed.local", bio: "Med student, cat person 🐱", avatarUrl: "https://i.pravatar.cc/300?img=47" },
    { username: "tom_becker", name: "Tom Becker", email: "tom@seed.local", bio: "Just here for the memes", avatarUrl: "https://i.pravatar.cc/300?img=53" },
];

async function seedUsers(): Promise<Record<string, string>> {
    const userIds: Record<string, string> = {};

    for (const u of USERS) {
        let userId: string;
        try {
            const created = await authService.registerUser(u.name, u.username, u.email, PASSWORD);
            userId = created._id.toString();
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
        { owner: "sophia_bloom", name: "Photography Lovers", description: "A place to share your best shots. #photography #travel", avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2j_mJTEYa_4B1t4E3npUn3DbUIGc8uwyzqIurv_cXCHQZIIOHZMtMVZw&s=10" },
        { owner: "daniel_cruz", name: "Fitness & Wellness", description: "Workouts, recipes, and motivation. #fitness #health", avatarUrl: "https://i.pinimg.com/236x/68/e8/1f/68e81f991759486c11948fe6e6ab28f8.jpg" },
        { owner: "aria_moon", name: "Fashion Forward", description: "Outfits, trends, and style inspo. #fashion #ootd", avatarUrl: "https://luxiders.com/content/uploads/hannah-morgan-ycVFts5Ma4s-unsplash.jpeg" },
        { owner: "oliver_king", name: "Indie Music Club", description: "Discover new artists and share your favorites. #music", avatarUrl: "https://i.pinimg.com/736x/22/3a/78/223a787008c70db79baa786483aee9f1.jpg" },
    ];

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
                { url: "https://paintbynumbers.uk/wp-content/uploads/2020/08/Aesthetic-road-paint-by-numbers.jpg", filter: "none" },
                { url: "https://wallpapersok.com/images/hd/new-york-aesthetic-street-9efn806yao7b7tpa.jpg", filter: "sobel" },
                { url: "https://i.pinimg.com/736x/60/46/02/604602bb238e235d984369d5a4edd472.jpg", filter: "negative" },
            ]
        },
        { author: "marcus_lee", caption: "Finally beat this boss after 20 tries lol #gaming" },
        { author: "marcus_lee", caption: "New desk setup, feeling productive #tech", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfCEe416mQ4gWt3hf_dSxCkmNP9EaF8hX4lG0gp7aP1po6wuXibrb6xzef&s=10", filter: "none" }] },
        { author: "aria_moon", caption: "Today's fit 🧥 #fashion #ootd", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRva_4RWiLdUkRLyKxPix5bkqpfYuyrOaC7aO5PjyP5Ag&s=10", filter: "none" }] },
        { author: "leo_martins", caption: "Somewhere in the Alps ⛰️ #travel", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRstdjca4wVuCTouzkFmI-Hzu6UdRPq1LVA8rzN8cNV-w&s=10", filter: "blur" }] },
        { author: "nina_park", caption: "New plant baby 🌿 #plants", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnGwMmK8NiDjEjLBntyrEOyUDg9SmltKK_nLUxkt2IoQ&s=10", filter: "none" }] },
        { author: "daniel_cruz", caption: "Leg day complete 🔥 #fitness" },
        { author: "elena_ross", caption: "Currently reading this masterpiece 📖 #books", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMY9Ed0PyhYn_XT8d478TGsGLVlddI4fY0snzYuKT_WA&s=10", filter: "none" }] },
        { author: "kevin_shaw", caption: "Rainy city nights #streetphoto #photography", media: [{ url: "https://plus.unsplash.com/premium_photo-1669927131902-a64115445f0f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2l0eSUyMG5pZ2h0fGVufDB8fDB8fHww", filter: "negative" }] },
        { author: "maya_singh", caption: "Homemade ramen night 🍜 #food", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5bdaajsNdjEQpLc6edirUnl1agS1I1jiLBjDs31Yz4g&s=10", filter: "none" }] },
        { author: "oliver_king", caption: "New track dropping this Friday 🎸 #music" },
        { author: "ivy_chen", caption: "Latest digital piece #art", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05RkPuukvEOgC7sbQG4ccVsafzk4UDCNJRsRAH9ZbAQ&s=10", filter: "none" }] },
        { author: "ryan_cole", caption: "10k done ✅ #running #fitness" },
        { author: "zara_ahmed", caption: "Studying with my study buddy 🐱 #catsofinstagram", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmt63QG25Xgzd8ALX4Rd0IdReKf6nzQrv8gi2E23r00A&s=10", filter: "none" }] },
        { author: "tom_becker", caption: "no caption needed #memes", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStOzDoS14WEsBqF7faLGhxE4voqyorhwKuwQN-Ab1Fsg&s=10", filter: "none" }] },
        { author: "marcus_lee", caption: "My entry for this week #photography", group: "Photography Lovers", media: [{ url: "https://picsum.photos/seed/gpost1/800/600", filter: "none" }] },
        { author: "kevin_shaw", caption: "Feedback welcome! #photography", group: "Photography Lovers", media: [{ url: "https://picsum.photos/seed/gpost2/800/600", filter: "sobel" }] },
        { author: "nina_park", caption: "Morning routine that changed my life #fitness", group: "Fitness & Wellness" },
        { author: "ryan_cole", caption: "Meal prep Sunday #fitness #food", group: "Fitness & Wellness", media: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNtx3GcjY3VRYD2jI0Sy-ipwS7n5Wr0iAu_2A-qKCRrQ&s=10", filter: "none" }] },
        { author: "elena_ross", caption: "Thrifted this gem today #fashion", group: "Fashion Forward", media: [{ url: "https://i.pinimg.com/736x/c2/19/22/c2192268511d3296fca8e9182a656d04.jpg", filter: "none" }] },
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