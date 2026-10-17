import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import UiIcon from "@/components/UiIcon";
import { categories } from "@/data/galleryData";
import { localService, serviceContent, workProcess } from "@/data/serviceContent";
import { localServiceSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ ...localService, absoluteTitle: true });

export default function LocalServicePage() {
  return (
    <main id="main-content" className="category-page container local-service-page">
      <JsonLd data={localServiceSchema(localService)} />
      <nav className="breadcrumbs" aria-label="Патека до страницата">
        <ol><li><Link href="/">Почетна</Link></li><li><span aria-hidden="true">/</span><span aria-current="page">Керамичар во Кавадарци</span></li></ol>
      </nav>
      <header className="service-intro">
        <p className="eyebrow">Tasev Ceramics · Керамика и камен</p>
        <h1>{localService.heading}</h1>
        <p>Tasev Ceramics е базиран во Кавадарци и работи на проекти во градот и низ Македонија. Со над 20 години искуство во поставување керамика и камен, вниманието го посветуваме на подлогата, прецизните линии и уредната завршна обработка.</p>
        <p>Ако барате мајстор за плочки за нов простор или реновирање, овде можете да ги разгледате услугите, реални примери од изработката и што е потребно за почетна проценка на вашиот проект.</p>
        <Link href="/#contact" className="text-link">Разговарајте за вашиот проект <UiIcon /></Link>
      </header>

      <section className="service-section" aria-labelledby="services-title">
        <div className="section-heading"><div><p className="eyebrow">Услуги и изработени проекти</p><h2 id="services-title">Лепење плочки и поставување камен</h2></div><p>Избрани фотографии од нашето портфолио. Во секоја категорија можете да ја погледнете целосната галерија.</p></div>
        <div className="project-grid">{categories.map((category, index) => (
          <article key={category.slug} className="service-project">
            <Link href={`/gallery/${category.slug}`} className="project-link">
              <div className="project-image" style={{ "--cover-ratio": category.coverRatio }}>
                <Image src={category.cover} alt={category.imageAlt} fill priority={index === 0} sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 307px" />
                <span className="project-open" aria-hidden="true"><UiIcon /></span>
              </div>
              <div className="project-caption"><h3>{category.seoTitle}</h3></div>
            </Link>
            <p>{serviceContent[category.slug].summary}</p>
          </article>
        ))}</div>
      </section>

      <section className="service-section" aria-labelledby="process-title">
        <p className="eyebrow">Од подготовка до завршна обработка</p>
        <h2 id="process-title">Како се одвива работата</h2>
        <ol className="service-process">{workProcess.map(([title, description]) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>

      <section className="service-section service-copy" aria-labelledby="quote-title">
        <h2 id="quote-title">Што е потребно за понуда?</h2>
        <p>Наведете ја локацијата, видот на просторот, приближната квадратура и димензиите на плочките. Кажете дали се поставува на нова или постојна подлога и дали има скали, агли или други детали што бараат дополнителна обработка. Фотографии од просторот помагаат за почетниот разговор.</p>
        <p>Проценката зависи од материјалот, подготовката и сложеноста на изработката. Калкулаторот дава ориентативна цена, а конкретната понуда се договара по консултација и увид.</p>
        <Link href="/#pricing" className="text-link">Пресметајте ориентативна цена <UiIcon /></Link>
      </section>

      <section className="service-section service-copy" aria-labelledby="contact-title">
        <p className="eyebrow">Кавадарци · Проекти низ Македонија</p>
        <h2 id="contact-title">Да го испланираме вашиот простор</h2>
        <p>За достапност и договор за проект, јавете се или испратете порака преку контакт формата. За работа надвор од Кавадарци, наведете го местото заедно со останатите детали.</p>
        <div className="service-actions"><Link href="/#contact" className="text-link">Побарајте понуда <UiIcon /></Link><a className="text-link" href={`tel:${site.telephone}`}>{site.telephoneDisplay}</a></div>
      </section>
    </main>
  );
}
