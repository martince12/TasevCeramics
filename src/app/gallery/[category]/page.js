import UiIcon from "@/components/UiIcon";
﻿import Link from "next/link";
import { imagesByCategory, categories } from "@/data/galleryData";
import { notFound } from "next/navigation";
import GalleryLightboxGrid from "@/components/GalleryLightboxGrid";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const selected = categories.find((item) => item.slug === category);
  if (!selected) notFound();
  return pageMetadata({
    title: selected.seoTitle,
    description: selected.description,
    path: `/gallery/${selected.slug}`,
    image: { url: selected.cover, width: selected.coverWidth, height: selected.coverHeight, alt: selected.imageAlt },
  });
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const selected = categories.find((item) => item.slug === category);
  if (!selected) notFound();
  const images = imagesByCategory[category];
  return (
    <main id="main-content" className="category-page container">
      <JsonLd data={breadcrumbSchema(selected)} />
      <nav className="breadcrumbs" aria-label="Патека до страницата">
        <ol>
          <li><Link href="/">Почетна</Link></li>
          <li><span aria-hidden="true">/</span><Link href="/#gallery">Галерија</Link></li>
          <li><span aria-hidden="true">/</span><span aria-current="page">{selected.title}</span></li>
        </ol>
      </nav>
      <div className="section-heading" data-reveal="up"><div><p className="eyebrow">Изработени проекти / Галерија</p><h1>{selected.title}</h1></div><p>{selected.description}<span className="category-count">{images.length} фотографии · Погледнете ја изработката одблиску.</span></p></div>
      <nav className="category-nav" aria-label="Категории на проекти">{categories.map((item) => <Link key={item.slug} href={`/gallery/${item.slug}`} aria-current={item.slug === category ? "page" : undefined}>{item.title}</Link>)}</nav>
      <GalleryLightboxGrid images={images} title={selected.title} imageAlt={selected.imageAlt} />
      <div className="gallery-end"><p>Имате проект на ум?</p><Link href="/#contact" className="text-link">Разговарајте со нас <UiIcon /></Link></div>
    </main>
  );
}
