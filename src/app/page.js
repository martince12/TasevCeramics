import UiIcon from "@/components/UiIcon";
import Link from "next/link";
import Image from "next/image";
import { categories, imagesByCategory } from "@/data/galleryData";
import PricingCalculator from "@/components/PricingCalculator";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { businessSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: site.title, description: site.description, path: "/" });

const principles = [
  ["Прецизна изработка", "Рамно поставување, чисти фуги и прецизно сечење."],
  ["Секогаш на време", "Работата е завршена во договорениот рок."],
  ["Стручна консултација", "Помош при избор на плочки и материјали."],
  ["Чиста работна средина", "Работам уредно и ја оставам просторијата чиста."],
];

export default function HomePage() {
  return (
    <main id="main-content">
      <JsonLd data={businessSchema()} />
      <section id="home" className="hero">
        <Image src="/hero-photo2.webp" alt="Прецизно поставување на керамички плочки" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow">Tasev Ceramics · Керамика и камен</p>
          <h1>Поставување на керамика со <em>врвен квалитет.</em></h1>
          <p className="hero-description">Со прецизност, искуство и внимание кон деталите, создаваме простори што траат со години.</p>
          <div className="hero-actions">
            <Link href="/#gallery" className="button button-light">Погледни проекти <span aria-hidden="true"><UiIcon /></span></Link>
            <Link href="/#contact" className="text-link">Контакт <span aria-hidden="true"><UiIcon /></span></Link>
          </div>
        </div>
        <div className="container hero-bottom"><span>Прецизност во секој детал.</span><a href="#about">Запознајте нè <span aria-hidden="true"><UiIcon name="arrow-down" /></span></a></div>
      </section>
      <section id="about" className="section-pad">
        <div className="container">
          <div className="about-grid">
            <div data-reveal="up"><p className="eyebrow">За нас</p><h2>Искуство, прецизност и квалитет во секој проект.</h2></div>
            <div className="about-copy" data-reveal="stat"><div className="experience"><span>20<span className="plus">+</span></span><p>години искуство.<br />Работа што трае.</p></div>
              <p>Со над 20 години искуство, Tasev Ceramics нуди професионално поставување керамички плочки, гранит, мермер, травертин и украсен камен за купатила, кујни, дневни соби, тераси, скали и базени.</p>
              <p>Работиме со современи алати, внимаваме на секој детал и гарантираме навремена и професионална реализација.</p>
            </div>
          </div>
          <div className="principles">{principles.map(([title, desc], index) => <div key={title} data-reveal="up" data-reveal-order={index % 3}><span className="index">0{index + 1}</span><h3>{title}</h3><p>{desc}</p></div>)}</div>
        </div>
      </section>
      <section id="gallery" className="gallery-section section-pad">
        <div className="container">
          <div className="section-heading" data-reveal="up"><div><p className="eyebrow">Нашата работа</p><h2>Галерија</h2></div><p>Изработени проекти.<br />Квалитетот се гледа во деталите.</p></div>
          <div className="project-grid">{categories.map((cat, index) => <Link key={cat.slug} href={`/gallery/${cat.slug}`} className="project-link" data-reveal="image" data-reveal-order={index % 2}>
            <div className="project-image" style={{ "--cover-ratio": cat.coverRatio }}><Image src={cat.cover} alt={cat.imageAlt} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 307px" /><span className="project-open" aria-hidden="true"><UiIcon /></span></div>
            <div className="project-caption"><div><span className="index">0{index + 1}</span><h3>{cat.title}</h3></div><span>{imagesByCategory[cat.slug].length} фотографии</span></div>
          </Link>)}</div>
        </div>
      </section>
      <section id="pricing" className="section-pad pricing-section">
        <div className="container"><div className="section-heading" data-reveal="up"><div><p className="eyebrow">Планирајте го проектот</p><h2>Ценовник</h2></div><p>Цената е ориентативна и може да варира во зависност од условите и сложеноста на проектот.</p></div><PricingCalculator /></div>
      </section>
      <section id="contact" className="contact-section section-pad">
        <div className="container contact-grid"><div className="contact-copy" data-reveal="left"><p className="eyebrow">Контакт</p><h2>Ако сакате професионална изработка на вашиот проект, контактирајте не.</h2><p>Секој проект започнува со консултација и увид на лице место, со цел да добиете точна и транспарентна понуда.</p><div className="contact-direct"><p className="eyebrow">Директно јави се</p><a className="phone-link" href={`tel:${site.telephone}`}>{site.telephoneDisplay}</a><p>Достапен сум за консултации, договор и преглед на простор од Понеделник до Петок после 17 часот.</p></div></div><ContactForm /></div>
      </section>
    </main>
  );
}
