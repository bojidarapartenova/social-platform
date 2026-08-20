import { useEffect, useRef, useState } from "react";
import { getFilterStrategy } from "./filters/filterStrategy";

export function FilteredImage({ src, filter }: { src: string; filter: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [useFallbackImg, setUseFallbackImg] = useState(false);

    useEffect(() => {
        setUseFallbackImg(false); // Reset fallback state when source changes
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const strategy = getFilterStrategy(filter);
            strategy.apply(ctx);
        };

        img.onerror = () => {
            // Trigger fallback on CORS or network load failure
            setUseFallbackImg(true);
        };

        img.src = src;
    }, [src, filter]);

    // Fallback: Standard <img> tag ignores CORS restrictions for display
    if (useFallbackImg) {
        return (
            <img
                src={src}
                alt="Post content"
                style={{ maxWidth: "100%", display: "block" }}
                onError={(e) => {
                    // Show text placeholder if the image URL is completely dead
                    e.currentTarget.style.display = "none";
                }}
            />
        );
    }

    return <canvas ref={canvasRef} style={{ maxWidth: "100%", display: "block" }} />;
}