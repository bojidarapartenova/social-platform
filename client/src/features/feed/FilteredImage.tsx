import { useEffect, useRef, useState } from "react";
import { getFilterStrategy } from "./filters/filterStrategy";

export function FilteredImage({ src, filter }: { src: string; filter: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
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
            setFailed(false);
        };
        img.onerror = () => setFailed(true);
        img.src = src;
    }, [src, filter]);

    if (failed) {
        return <div className="imageLoadError">Couldn't load this image</div>;
    }

    return <canvas ref={canvasRef} style={{ maxWidth: "100%", display: "block" }} />;
}