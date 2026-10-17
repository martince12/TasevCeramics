import { absoluteUrl, site } from "@/lib/site";

export function pageMetadata({ title, description, path, image = site.image, absoluteTitle = false }) {
  const useAbsoluteTitle = path === "/" || absoluteTitle;
  const socialTitle = useAbsoluteTitle ? title : `${title} | ${site.name}`;
  const socialImage = { ...image, url: absoluteUrl(image.url) };
  return {
    title: useAbsoluteTitle ? { absolute: title } : title,
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

export function localServiceSchema(service) {
  const business = businessSchema()["@graph"][0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": absoluteUrl(`${service.path}#service`),
        name: service.heading,
        description: service.description,
        url: absoluteUrl(service.path),
        serviceType: "Поставување керамички плочки и камен",
        provider: { "@id": business["@id"] },
        areaServed: business.areaServed,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Почетна", item: absoluteUrl() },
          { "@type": "ListItem", position: 2, name: "Керамичар во Кавадарци", item: absoluteUrl(service.path) },
        ],
      },
    ],
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
        alternateName: ["Majstor Mile", "Мајстор Миле", "majstor mile", "мајстор миле"],
        url: absoluteUrl(),
        description: site.description,
        telephone: site.telephone,
        email: site.email,
        image: absoluteUrl(site.image.url),
        logo: absoluteUrl("/icon.svg"),
        sameAs: Object.values(site.socials),
        address: {
          "@type": "PostalAddress",
          addressLocality: site.location.locality,
          addressCountry: site.location.countryCode,
        },
        areaServed: [
          { "@type": "City", name: site.location.locality },
          { "@type": "Country", name: site.location.country },
        ],
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
