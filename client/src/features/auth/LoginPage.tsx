import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import "../../styles/logInForm.css"

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            const safeResult = {
                token: result.token,
                user: {
                    ...result.user,
                    name: result.user.name ?? "",
                },
            };
            dispatch(setCredentials(safeResult));
            navigate("/");
        } catch {

        }
    }

    return (
        <div className="form" >
            <div className="opt">
                <div className="regLink">
                    <Link to="/register">Sign Up</Link>
                </div>

                <div className="logLink active">
                    <Link to="/login">Log In</Link>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <h1>Welcome Back!</h1>

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />

                <button type="submit" disabled={isLoading}>
                    LOG IN
                </button>

                {error && <p>Invalid email or password</p>}
            </form>
        </div>
    );
}