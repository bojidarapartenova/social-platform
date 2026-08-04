import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function HashtagText({ text }: { text: string }) {
    if (!text) return null;

    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);

    const nodes: ReactNode[] = parts.map((part, i) => {
        if (part.startsWith("#") && part.length > 1) {
            const tag = part.slice(1);
            return (
                <Link key={i} to={`/tags/${tag}`} className="hashtag">
                    {part}
                </Link>
            );
        }
        return <span key={i}>{part}</span>;
    });

    return <>{nodes}</>;
}