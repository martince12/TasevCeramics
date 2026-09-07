"use client";

import UiIcon from "@/components/UiIcon";


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
        <form onSubmit={handleSubmit} className="contact-form" data-reveal="right" aria-label="Контакт форма" aria-busy={status === "sending"}>
            <div className="field"><label htmlFor="contact-name">Име</label><input id="contact-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Ваше име" /></div>
            <div className="field"><label htmlFor="contact-phone">Мобилен телефон</label><input id="contact-phone" name="phone" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" className="form-control" placeholder="+389 7X XXX XXX" /></div>
            <div className="field"><label htmlFor="contact-email">E-mail</label><input id="contact-email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="example@email.com" /></div>
            <div className="field"><label htmlFor="contact-message">Порака</label><textarea id="contact-message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} rows="4" className="form-control" placeholder="Опишете што ви е потребно..." /></div>
            <button type="submit" disabled={status === "sending"} className="button button-light">{status === "sending" ? "Се праќа..." : "Испрати порака"}<span aria-hidden="true"><UiIcon /></span></button>
            <div className={status === "error" ? "contact-status error" : "contact-status"} role="status" aria-live="polite">
                {status === "sent" && <p>Фала! Пораката е испратена.</p>}
                {status === "error" && <p>Нешто се случи. Обиди се повторно.</p>}
            </div>
        </form>
    );
}
