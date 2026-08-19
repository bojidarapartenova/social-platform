import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useGetUserQuery, useUpdateProfileMutation } from "./userApiSlice";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../auth/authSlice";

export function EditProfilePage() {
    const navigate = useNavigate();
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

    const { data: user, isLoading: userLoading } = useGetUserQuery(currentUserId!, {
        skip: !currentUserId,
    });
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [formError, setFormError] = useState("");
    const [isCancelHovered, setIsCancelHovered] = useState(false);

    const dispatch = useDispatch();

    const hasHydrated = useRef(false);

    useEffect(() => {
        if (user && !hasHydrated.current) {
            setName(user.name || "");
            setBio(user.bio || "");
            setAvatarUrl(user.avatarUrl || "");
            hasHydrated.current = true;
        }
    }, [user]);

    if (userLoading) return <p>Loading profile...</p>;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        try {
            const updated = await updateProfile({
                id: currentUserId!,
                name: name.trim(),
                bio: bio.trim(),
                avatarUrl: avatarUrl.trim(),
            }).unwrap();

            dispatch(updateUserInfo({
                name: updated.name,
                bio: updated.bio,
                avatarUrl: updated.avatarUrl,
            }));

            navigate(`/profile/${currentUserId}`);
        } catch {
            setFormError("Failed to update profile. Please try again.");
        }
    }

    function handleCancel() {
        navigate(`/profile/${currentUserId}`);
    }

    return (
        <div className="postFormPage">
            <form className="postFormCard" onSubmit={handleSubmit}>
                <h1>Edit Profile</h1>

                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />

                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", marginTop: "12px" }}>Profile Picture URL</label>
                <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                />

                <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", marginTop: "12px" }}>Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                    <button type="submit" disabled={isUpdating} style={{ flex: 1 }}>
                        {isUpdating ? "Saving..." : "Save changes"}
                    </button>

                    <button
                        type="button"
                        className="addBtn"
                        onClick={handleCancel}
                        onMouseEnter={() => setIsCancelHovered(true)}
                        onMouseLeave={() => setIsCancelHovered(false)}
                        style={{
                            flex: 1,
                            marginTop: 0,
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            backgroundColor: isCancelHovered ? "#e0e0e0" : "#f0f0f0",
                        }}
                    >
                        Cancel
                    </button>
                </div>

                {formError && <p style={{ color: "red", marginTop: "10px" }}>{formError}</p>}
            </form>
        </div>
    );
}