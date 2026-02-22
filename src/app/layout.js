import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
    title: "Keramicar",
    description: "Keramicar portfolio website",
};

const navLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
];

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <div className="min-h-dvh flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>

            <footer className="bg-[#473124] text-white border-t border-white/10">
                <div className="mx-auto max-w-[1400px] px-6 py-12">

                    <div className="grid gap-8 md:grid-cols-4">

                        {/* Brand */}
                        <div>
                            <h3 className="text-lg font-semibold">TASEV CERAMICS</h3>
                            <p className="mt-3 text-sm text-white/70">
                                Професионална изработка и поставување керамика.
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                                Контакт
                            </h4>
                            <p className="mt-3 text-sm">+389 71 355 519</p>
                            <p className="text-sm text-white/70">miletasev1@gmail.com</p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                                Социјални мрежи
                            </h4>

                            <div className="mt-4 flex items-center gap-4">

                                {/* Instagram */}
                                <a
                                    href="https://instagram.com/yourusername"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.75-.88a1.13 1.13 0 100 2.25 1.13 1.13 0 000-2.25z"/>
                                    </svg>
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://facebook.com/yourusername"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            d="M22 12a10 10 0 10-11.5 9.9v-7H7.9v-2.9h2.6V9.6c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v1.9h2.9l-.5 2.9h-2.4v7A10 10 0 0022 12z"/>
                                    </svg>
                                </a>

                            </div>
                        </div>

                        {/* Navigation */}
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                                Навигација
                            </h4>
                            <div className="mt-3 flex gap-2 text-sm">
                                <a href="#home" className="hover:text-white/80">Почетна</a>
                                <a href="#about" className="hover:text-white/80">За нас</a>
                                <a href="#gallery" className="hover:text-white/80">Галерија</a>
                                <a href="#pricing" className="hover:text-white/80">Ценовник</a>
                                <a href="#contact" className="hover:text-white/80">Контакт</a>
                            </div>
                        </div>

                    </div>

                    <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
                        © {new Date().getFullYear()} TASEV CERAMICS. Сите права задржани.
                    </div>

                </div>
            </footer>
        </div>
        </body>
        </html>
    );
}