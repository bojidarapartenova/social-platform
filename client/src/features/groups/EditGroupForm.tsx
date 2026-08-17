import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGroupQuery, useUpdateGroupMutation } from "./groupApiSlice";
import "../../styles/postForm.css";

export function EditGroupForm() {
    const { id } = useParams<{ id: string }>();
    const { data: group, isLoading } = useGetGroupQuery(id!);
    const [updateGroup, { isLoading: isSaving }] = useUpdateGroupMutation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (group) {
            setName(group.name);
            setDescription(group.description);
            setAvatarUrl(group.avatarUrl);
        }
    }, [group]);

    if (isLoading) return <p>Loading...</p>;
    if (!group) return <p>Group not found.</p>;
    if (group.membershipStatus !== "owner") return <p>Only the group owner can edit this group.</p>;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (!name.trim()) {
            setFormError("Give your group a name.");
            return;
        }

        try {
            await updateGroup({
                id: id!,
                data: { name: name.trim(), description: description.trim(), avatarUrl: avatarUrl.trim() },
            }).unwrap();
            navigate(`/groups/${id}`);
        } catch {
            setFormError("Something went wrong updating the group.");
        }
    }

    return (
        <div className="postFormPage">
            <form className="postFormCard" onSubmit={handleSubmit}>
                <h1>Edit group</h1>

                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fashion Lovers" />

                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this group about? Add #tags too." />

                <label>Group picture URL</label>
                <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />

                <div className="postFormActions">
                    <button type="button" className="cancelEditBtn" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit" disabled={isSaving}>Save</button>
                </div>
                {formError && <p>{formError}</p>}
            </form>
        </div>
    );
}