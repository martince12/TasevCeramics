import { absoluteUrl, site } from "@/lib/site";

export function pageMetadata({ title, description, path, image = site.image }) {
  const socialTitle = path === "/" ? title : `${title} | ${site.name}`;
  const socialImage = { ...image, url: absoluteUrl(image.url) };
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      title: socialTitle,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      locale: "mk_MK",
      type: "website",
      images: [socialImage],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [socialImage] },
  };
}

export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": absoluteUrl("/#business"),
        name: site.name,
        url: absoluteUrl(),
        description: site.description,
        telephone: site.telephone,
        email: site.email,
        image: absoluteUrl(site.image.url),
        logo: absoluteUrl("/icon.svg"),
        sameAs: Object.values(site.socials),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: site.name,
        url: absoluteUrl(),
        inLanguage: "mk",
        publisher: { "@id": absoluteUrl("/#business") },
      },
    ],
  };
}

export function breadcrumbSchema(category) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Почетна", item: absoluteUrl() },
      // Gallery is a real homepage section, not a separate /gallery page.
      { "@type": "ListItem", position: 2, name: "Галерија", item: absoluteUrl("/#gallery") },
      { "@type": "ListItem", position: 3, name: category.title, item: absoluteUrl(`/gallery/${category.slug}`) },
    ],
  };
}
