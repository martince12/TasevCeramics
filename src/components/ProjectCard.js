import Image from "next/image";
import Link from "next/link";
import UiIcon from "@/components/UiIcon";

export default function ProjectCard({ category, index, photoCount }) {
  return (
    <Link href={`/gallery/${category.slug}`} className="project-link" data-reveal="image" data-reveal-order={index % 2}>
      <div className="project-image" style={{ "--cover-ratio": category.coverRatio }}>
        <Image src={category.cover} alt={category.imageAlt} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 307px" />
        <span className="project-open" aria-hidden="true"><UiIcon /></span>
      </div>
      <div className="project-caption">
        <div><span className="index">0{index + 1}</span><h3>{category.title}</h3></div>
        {photoCount !== undefined && <span>{photoCount} фотографии</span>}
      </div>
    </Link>
  );
}
