import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useCreatePostMutation } from "./postApiSlice";
import { setType, setCaption, setMediaUrlAt, addMediaField, removeMediaAt, setEditingIndex, resetDraft } from "./postDraftSlice";
import "../../styles/postForm.css";

export function CreatePostForm() {
    const draft = useSelector((state: RootState) => state.postDraft);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createPost, { isLoading, error }] = useCreatePostMutation();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const cleanedMedia = draft.media
                .map((m) => ({ ...m, url: m.url.trim() }))
                .filter((m) => m.url);

            await createPost({
                type: draft.type,
                caption: draft.caption,
                media: draft.type === "photo" ? cleanedMedia : undefined,
            }).unwrap();
            dispatch(resetDraft());
            navigate("/");
        } catch {
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

                <label>Type</label>
                <select value={draft.type} onChange={(e) => dispatch(setType(e.target.value as "text" | "photo"))}>
                    <option value="text">Text</option>
                    <option value="photo">Photo</option>
                </select>

                <label>Caption</label>
                <textarea
                    value={draft.caption}
                    onChange={(e) => dispatch(setCaption(e.target.value))}
                    placeholder="What's on your mind?"
                />

                {draft.type === "photo" && (
                    <>
                        <label>Images</label>
                        {draft.media.map((item, i) => (
                            <div key={i} className="mediaRow">
                                <input
                                    value={item.url}
                                    onChange={(e) => dispatch(setMediaUrlAt({ index: i, value: e.target.value }))}
                                    placeholder={`Image URL ${i + 1}`}
                                />
                                <button type="button" onClick={() => openFilterPage(i)}>
                                    {item.filter === "none" ? "Add filter" : `Filter: ${item.filter}`}
                                </button>
                                {draft.media.length > 1 && (
                                    <button type="button" onClick={() => dispatch(removeMediaAt(i))}>Remove</button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="addBtn" onClick={() => dispatch(addMediaField())}>
                            + Add another image
                        </button>
                    </>
                )}

                <button type="submit" disabled={isLoading}>Post</button>
                {error && <p>Something went wrong creating your post.</p>}
            </form>
        </div>
    );
}