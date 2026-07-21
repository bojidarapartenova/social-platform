import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useCreatePostMutation } from "./postApiSlice";
import { setCaption, setMediaUrlAt, addMediaField, removeMediaAt, setEditingIndex, resetDraft } from "./postDraftSlice";
import "../../styles/postForm.css";

export function CreatePostForm() {
    const draft = useSelector((state: RootState) => state.postDraft);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createPost, { isLoading }] = useCreatePostMutation();
    const [formError, setFormError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        const cleanedMedia = draft.media.map((m) => ({ ...m, url: m.url.trim() })).filter((m) => m.url);
        const trimmedCaption = draft.caption.trim();

        if (!trimmedCaption && cleanedMedia.length === 0) {
            setFormError("Write something or add a photo.");
            return;
        }

        try {
            await createPost({
                type: cleanedMedia.length > 0 ? "photo" : "text",
                caption: trimmedCaption,
                media: cleanedMedia.length > 0 ? cleanedMedia : undefined,
            }).unwrap();
            dispatch(resetDraft());
            navigate("/");
        } catch {
            setFormError("Something went wrong creating your post.");
        }
    }

    function openFilterPage(index: number) {
        dispatch(setEditingIndex(index));
        navigate("/create/filters");
    }

    return (
        <div className="postFormPage">
            <form className="postFormCard" onSubmit={handleSubmit}>
                <h1>New post</h1>

                <textarea
                    value={draft.caption}
                    onChange={(e) => dispatch(setCaption(e.target.value))}
                    placeholder="What's on your mind?"
                />

                {draft.media.map((item, i) => (
                    <div key={i} className="mediaRow">
                        <input
                            value={item.url}
                            onChange={(e) => dispatch(setMediaUrlAt({ index: i, value: e.target.value }))}
                            placeholder={`Image URL ${i + 1}`}
                        />
                        <button type="button" className="filterBtnSmall" onClick={() => openFilterPage(i)}>
                            {item.filter === "none" ? "Choose filter" : `Filter: ${item.filter}`}
                        </button>
                        <button type="button" onClick={() => dispatch(removeMediaAt(i))}>Remove</button>
                    </div>
                ))}

                <button type="button" className="addBtn" onClick={() => dispatch(addMediaField())}>
                    + Add a photo
                </button>

                <button type="submit" disabled={isLoading}>Post</button>
                {formError && <p>{formError}</p>}
            </form>
        </div>
    );
}