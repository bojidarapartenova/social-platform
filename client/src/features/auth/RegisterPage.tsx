import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "./authApiSlice";
import "../../styles/logInForm.css";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [bio, setBio] = useState("");

    const [register, { isLoading, error }] = useRegisterMutation();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await register({
                name,
                username,
                email,
                password,
                avatarUrl: avatarUrl.trim() || undefined,
                bio,
            }).unwrap();

            navigate("/login");
        } catch (err: any) {
            console.error("Register error:", err);
        }
    }

    return (
        <div className="authPage">
            <div className="form">
                <div className="opt">
                    <div className="regLink active">
                        <Link to="/register">Sign Up</Link>
                    </div>
                    <div className="logLink">
                        <Link to="/login">Log In</Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>

                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />

                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" />

                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />

                    <label htmlFor="avatarUrl">Profile Picture URL</label>
                    <input
                        id="avatarUrl"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/pfp.png (optional)"
                    />

                    <label htmlFor="bio">Bio</label>
                    <input id="bio" type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Add bio" />

                    <button type="submit" disabled={isLoading}>GET STARTED</button>

                    {error && (
                        <div>
                            <p>{(error as any)?.data?.message ?? "Registration failed"}</p>
                            {(error as any)?.data?.errors && (
                                <ul>
                                    {(error as any).data.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                                </ul>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}