"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
    { href: "/#home", label: "Почетна" },
    { href: "/#about", label: "За нас" },
    { href: "/#gallery", label: "Галерија" },
    { href: "/#pricing", label: "Ценовник" },
    { href: "/#contact", label: "Контакт" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-[#705849]/50 backdrop-blur-md border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between ">
                <Link
                    href="/#home"
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                >
                    <Image
                        src="/1.svg"
                        alt="Keramicar logo"
                        width={200}
                        height={60}
                        className="h-15 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-base font-medium tracking-wide text-white">
                    {navLinks.map((l) => (
                        <Link key={l.href} href={l.href} className="hover:opacity-80">
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile button */}
                <button
                    type="button"
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => setOpen((v) => !v)}
                    className="md:hidden p-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                    {open ? (
                        // X icon
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    ) : (
                        // Hamburger icon
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-white/10 bg-[#705849]/55 backdrop-blur">
                    <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1 text-lg">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}