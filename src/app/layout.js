import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import localFont from "next/font/local";
import { site } from "@/lib/site";

const manrope = localFont({
  src: "./fonts/Manrope/Manrope-Variable.ttf",
  weight: "200 800",
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Tasev Ceramics" },
  description: site.description,
  // Set the real public verification value in Vercel when supplied by Google.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }) {
  return (
    <html lang="mk">
      <body className={manrope.variable}>
        <a className="skip-link" href="#main-content">Прескокни до содржината</a>
        <Navbar />
        {children}
        <ScrollReveal />
        <footer className="site-footer">
          <div className="container">
            <div className="footer-top"><div><Link href="/#home" className="wordmark">TASEV<span>CERAMICS</span></Link><p>Професионална изработка<br />и поставување керамика.</p></div>
              <div className="footer-links"><a href={`tel:${site.telephone}`}>{site.telephoneDisplay}</a><a href={`mailto:${site.email}`}>{site.email}</a></div>
              <nav aria-label="Социјални мрежи" className="footer-links"><a href={site.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={site.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a></nav>
            </div>
            <div className="footer-bottom"><p>© {new Date().getFullYear()} TASEV CERAMICS. Сите права задржани.</p><nav aria-label="Навигација во подножје">{[["home", "Почетна"], ["about", "За нас"], ["gallery", "Галерија"], ["pricing", "Ценовник"], ["contact", "Контакт"]].map(([id, label]) => <Link key={id} href={`/#${id}`}>{label}</Link>)}</nav></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
