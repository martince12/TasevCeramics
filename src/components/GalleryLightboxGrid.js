"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function GalleryLightboxGrid({ images, title }) {
    const [openIndex, setOpenIndex] = useState(null);

    const isOpen = openIndex !== null;

    const close = () => setOpenIndex(null);
    const prev = () =>
        setOpenIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () =>
        setOpenIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, images.length]);

    return (
        <>
            {/* Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((src, idx) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => setOpenIndex(idx)}
                        className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] transition"
                    >
                        <Image
                            src={src}
                            alt={`${title} ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                    </button>
                ))}
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
                    onMouseDown={close}
                >
                    <div
                        className="relative w-full max-w-none sm:max-w-5xl"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* Image frame */}
                        <div className="relative w-full h-[75dvh] sm:h-auto sm:aspect-[16/10] overflow-hidden rounded-3xl border border-white/15 bg-black">
                            <Image
                                src={images[openIndex]}
                                alt={`${title} ${openIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Controls */}
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={close}
                            className="absolute -top-3 -right-3 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-2 text-white hover:bg-white/20 transition"
                        >
                            ✕
                        </button>

                        <button
                            type="button"
                            aria-label="Previous"
                            onClick={prev}
                            className="absolute top-1/2 -left-2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-2 text-white hover:bg-white/20 transition"
                        >
                            ‹
                        </button>

                        <button
                            type="button"
                            aria-label="Next"
                            onClick={next}
                            className="absolute top-1/2 -right-2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-2 text-white hover:bg-white/20 transition"
                        >
                            ›
                        </button>

                        <div className="mt-3 text-center text-sm text-white/70">
                            {openIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}