import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FilteredImage } from "../feed/FilteredImage";
import {
    useToggleLikeMutation, useGetCommentsQuery, useAddCommentMutation,
    useUpdatePostMutation, useDeletePostMutation, useToggleFavoriteMutation
} from "./postApiSlice";
import type { Post } from "./postApiSlice";
import { Link } from "react-router-dom";

export function PostCard({ post }: { post: Post }) {
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const isOwner = currentUserId === post.authorId._id;

    const [toggleLike] = useToggleLikeMutation();
    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCaption, setEditCaption] = useState(post.caption);

    const [updatePost] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const { data: comments } = useGetCommentsQuery(post._id, { skip: !showComments });
    const [commentText, setCommentText] = useState("");
    const [addComment] = useAddCommentMutation();
    const [toggleFavorite] = useToggleFavoriteMutation();

    async function handleSaveEdit() {
        await updatePost({ id: post._id, data: { caption: editCaption } });
        setIsEditing(false);
        setShowMenu(false);
    }

    async function handleDelete() {
        if (confirm("Delete this post?")) {
            await deletePost(post._id);
        }
    }

    async function handleAddComment(e: React.FormEvent) {
        e.preventDefault();
        if (!commentText.trim()) return;
        await addComment({ postId: post._id, text: commentText });
        setCommentText("");
    }

    return (
        <div className="post">
            <div className="postHeader">
                <Link to={`/profile/${post.authorId._id}`} className="postAuthorLink">
                    <img src={post.authorId.avatarUrl || "/default-avatar.png"} alt={post.authorId.username} />
                    <span>{post.authorId.username}</span>
                </Link>

                {isOwner && (
                    <div className="postMenu">
                        <button type="button" className="menuBtn" onClick={() => setShowMenu((v) => !v)}>...</button>
                        {showMenu && (
                            <div className="menuDropdown">
                                <button type="button" onClick={() => { setIsEditing(true); setShowMenu(false); }}>Edit</button>
                                <button type="button" onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="editBox">
                    <textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} />
                    <div className="editActions">
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="button" onClick={handleSaveEdit}>Save</button>
                    </div>
                </div>
            ) : (
                <p className="postCaption">{post.caption}</p>
            )}

            {post.type === "photo" && post.media?.length > 0 && (
                <div className="mediaScroll">
                    {post.media.map((item, i) => (
                        <FilteredImage key={i} src={item.url} filter={item.filter} />
                    ))}
                </div>
            )}

            <div className="postActions">
                <button
                    type="button"
                    className={post.likedByMe ? "actionBtn liked" : "actionBtn"}
                    onClick={() => toggleLike(post._id)}
                >
                    {post.likedByMe ? "♥" : "♡"} {post.likeCount}
                </button>
                <button type="button" className="actionBtn" onClick={() => setShowComments((v) => !v)}>
                    💬 {post.commentCount}
                </button>
                <button
                    type="button"
                    className={post.favoritedByMe ? "actionBtn favorited" : "actionBtn"}
                    onClick={() => toggleFavorite(post._id)}
                >
                    {post.favoritedByMe ? "★" : "☆"}
                </button>
            </div>

            {showComments && (
                <div className="commentSection">
                    {comments?.map((c) => (
                        <div key={c._id} className="comment">
                            <span className="commentAuthor">{c.authorId.username}</span> {c.text}
                        </div>
                    ))}
                    <form className="commentForm" onSubmit={handleAddComment}>
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
}