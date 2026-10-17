import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ProjectCard from "@/components/ProjectCard";
import UiIcon from "@/components/UiIcon";
import { categories } from "@/data/galleryData";
import { localService, serviceOverview, workProcess } from "@/data/serviceContent";
import { localServiceSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = pageMetadata({ ...localService, absoluteTitle: true });

export default function LocalServicePage() {
  return (
    <main id="main-content">
      <JsonLd data={localServiceSchema(localService)} />
      <section className="hero" aria-labelledby="local-title">
        <Image src="/hero-photo2.webp" alt="Прецизно поставување на керамички плочки" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow">Tasev Ceramics · Керамика и камен</p>
          <h1 id="local-title">{localService.heading}</h1>
          <p className="hero-description">Професионално лепење и поставување керамички плочки, гранитогрес, декоративен и природен камен во Кавадарци и низ Македонија.</p>
          <div className="hero-actions">
            <Link href="/#contact" className="button button-light">Побарај понуда <span aria-hidden="true"><UiIcon /></span></Link>
            <a href="#selected-projects" className="text-link">Погледни проекти <span aria-hidden="true"><UiIcon /></span></a>
          </div>
        </div>
        <div className="container hero-bottom"><span>Прецизност во секој детал.</span><a href="#local-intro">За нашата работа <span aria-hidden="true"><UiIcon name="arrow-down" /></span></a></div>
      </section>

      <section id="local-intro" className="section-pad" aria-labelledby="services-title">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Патека до страницата">
            <ol><li><Link href="/">Почетна</Link></li><li><span aria-hidden="true">/</span><span aria-current="page">Керамичар во Кавадарци</span></li></ol>
          </nav>
          <div className="section-heading" data-reveal="up"><div><p className="eyebrow">Услуги</p><h2 id="services-title">Лепење и поставување плочки во Кавадарци</h2>
          <div className="service-copy" data-reveal="up"><p>Tasev Ceramics е базиран во Кавадарци и нуди лепење и поставување плочки за купатила, кујни, тераси, скали, базени и други внатрешни и надворешни површини.</p></div>
          <div className={styles.services}>{serviceOverview.map(({ title, description, category }, index) => (
            <article key={category} className={styles.service} data-reveal="up" data-reveal-order={index % 3}>
              <h3><Link href={`/gallery/${category}`}>{title}</Link></h3><p>{description}</p>
            </article>
          ))}</div>
        </div>
      </section>

      <section id="selected-projects" className="gallery-section section-pad" aria-labelledby="projects-title">
        <div className="container">
          <div className="section-heading" data-reveal="up"><div><p className="eyebrow">Нашата работа</p><h2 id="projects-title">Избрани изработки</h2></div><p>Погледнете дел од нашите реализирани проекти во керамика, гранитогрес и камен.</p></div>
          <div className="project-grid">{categories.map((category, index) => <ProjectCard key={category.slug} category={category} index={index} />)}</div>
        </div>
      </section>

      <section className="section-pad" aria-labelledby="process-title">
        <div className="container">
          <p className="eyebrow" data-reveal="up">Од подлога до завршница</p><h2 id="process-title" data-reveal="up">Како работиме</h2>
          <div className="service-copy" data-reveal="up"><p>Работиме со керамички плочки, гранитогрес, мермер, травертин, декоративен и природен камен, со внимание на подготовката, деталите и чистата завршница.</p></div>
          <ol className={styles.process}>{workProcess.map(([title, description], index) => <li key={title} data-reveal="up" data-reveal-order={index % 3}><span className="index" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
          <div className={styles.trust} data-reveal="stat">
            <div className="experience"><span>20<span className="plus">+</span></span><p>години искуство</p></div>
            <p className={styles.trustStatement}>Прецизна изработка.<br />Чисти детали.<br />Професионален пристап.</p>
          </div>
        </div>
      </section>

      <section className="contact-section section-pad" aria-labelledby="contact-title">
        <div className={`container ${styles.cta}`}>
          <div className="contact-copy" data-reveal="left">
            <p className="eyebrow">Кавадарци · Проекти низ Македонија</p><h2 id="contact-title">Имате проект?</h2>
            <p>Контактирајте нè за поставување керамика, плочки или камен во Кавадарци и низ Македонија.</p>
            <p>Барате мајстор за плочки во Кавадарци? Испратете локација, приближна квадратура и фотографија од просторот. Цената во калкулаторот е ориентативна; понудата ја договараме по увид.</p>
          </div>
          <div className={styles.ctaActions} data-reveal="up">
            <Link href="/#pricing" className="button button-light">Пресметај цена <span aria-hidden="true"><UiIcon /></span></Link>
            <Link href="/#contact" className="text-link">Контакт <UiIcon /></Link>
            <a className={`text-link ${styles.phone}`} href={`tel:${site.telephone}`}>{site.telephoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
