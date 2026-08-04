import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="chatEmpty">
            <h3>Page not found</h3>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/" className="profileBtn primary" style={{ marginTop: "1rem", display: "inline-block" }}>
                Go home
            </Link>
        </div>
    );
}