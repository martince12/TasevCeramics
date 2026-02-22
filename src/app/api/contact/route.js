import { Resend } from "resend";

export async function POST(req) {
    try {
        const { name, phone ,email, message } = await req.json();

        if (!name || !email || !message) {
            return Response.json({ error: "Missing fields" }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        const to = process.env.CONTACT_TO_EMAIL;
        const from = process.env.CONTACT_FROM_EMAIL;

        if (!apiKey || !to || !from) {
            return Response.json({ error: "Server not configured" }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const subject = `New contact request from ${name}`;
        const text = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;

        await resend.emails.send({
            from,
            to,
            subject,
            text,
            replyTo: email,
        });

        return Response.json({ ok: true });
    } catch (err) {
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}