import Image from "next/image";
import Link from "next/link";
import { imagesByCategory, categories } from "@/data/galleryData";
import { notFound } from "next/navigation";
import GalleryLightboxGrid from "@/components/GalleryLightboxGrid";

export default async function CategoryPage({ params }) {
    const { category } = await params;

    const images = imagesByCategory[category];
    if (!images) notFound();

    const categoryTitle =
        categories.find((c) => c.slug === category)?.title ||
        category.replace("-", " ");

    return (
        <section className="bg-zinc-50 min-h-dvh">
            <div className="mx-auto max-w-[1400px] px-6 py-20">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm text-zinc-500">Галерија</p>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#242323]">
                            {categoryTitle}
                        </h1>
                    </div>

                    <Link
                        href="/#gallery"
                        className="inline-flex items-center gap-2 rounded-full bg-[#705849]/90 px-5 py-2.5 text-sm font-large text-white shadow-md hover:bg-[#705849] transition"
                    >
                        Back
                    </Link>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    <GalleryLightboxGrid images={images} title={categoryTitle} />
                </div>
            </div>
        </section>
    );
}