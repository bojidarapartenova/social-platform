import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateGroupMutation } from "./groupApiSlice";
import "../../styles/postForm.css";

export function CreateGroupForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [formError, setFormError] = useState("");
    const [createGroup, { isLoading }] = useCreateGroupMutation();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (!name.trim()) {
            setFormError("Give your group a name.");
            return;
        }

        try {
            const group = await createGroup({
                name: name.trim(),
                description: description.trim(),
                avatarUrl: avatarUrl.trim(),
            }).unwrap();
            navigate(`/groups/${group._id}`);
        } catch {
            setFormError("Something went wrong creating the group.");
        }
    }

    return (
        <div className="postFormPage">
            <form className="postFormCard" onSubmit={handleSubmit}>
                <h1>New group</h1>

                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fashion Lovers" />

                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this group about? Add #tags too." />

                <label>Group picture URL</label>
                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />

                <button type="submit" disabled={isLoading}>Create group</button>
                {formError && <p>{formError}</p>}
            </form>
        </div>
    );
}