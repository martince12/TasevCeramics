"use client";

import { useState } from "react";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle");
    const [phone, setPhone] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus("sending");

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone,email, message }),
        });

        if (res.ok) {
            setStatus("sent");
            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
        } else {
            setStatus("error");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8"
        >
            <div>
                <label className="block text-sm font-medium">Име</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none"
                    placeholder="Ваше име"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Мобилен телефон</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    className="mt-2 w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none"
                    placeholder="+389 7X XXX XXX"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">E-mail</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="mt-2 w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none"
                    placeholder="example@email.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Порака</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    className="mt-2 w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50 outline-none"
                    placeholder="Опишете што ви е потребно..."
                />
            </div>

            <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-white text-[#0b2a1f] font-semibold py-3 hover:bg-white/90 transition disabled:opacity-60"
            >
                {status === "sending" ? "Се праќа..." : "Испрати порака"}
            </button>

            {status === "sent" && (
                <p className="text-sm text-white/80">Фала! Пораката е испратена.</p>
            )}
            {status === "error" && (
                <p className="text-sm text-red-200">Нешто се случи. Обиди се повторно.</p>
            )}
        </form>
    );
}