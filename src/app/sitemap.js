import { categories } from "@/data/galleryData";
import { absoluteUrl } from "@/lib/site";

export default function sitemap() {
  // No trustworthy per-page publication timestamps exist in the repository.
  // Omit lastModified rather than misrepresent every build as a content edit.
  return [
    { url: absoluteUrl(), changeFrequency: "monthly", priority: 1 },
    ...categories.map(({ slug }) => ({
      url: absoluteUrl(`/gallery/${slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
