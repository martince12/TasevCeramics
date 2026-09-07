"use client";

import UiIcon from "@/components/UiIcon";


import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function GalleryLightboxGrid({ images, title, imageAlt = `Изработен проект: ${title}` }) {
  const [openIndex, setOpenIndex] = useState(null);
  const panel = useRef(null);
  const closeButton = useRef(null);
  const isOpen = openIndex !== null;
  const close = () => setOpenIndex(null);
  const prev = () => setOpenIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setOpenIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowLeft") { event.preventDefault(); setOpenIndex((i) => (i === 0 ? images.length - 1 : i - 1)); }
      if (event.key === "ArrowRight") { event.preventDefault(); setOpenIndex((i) => (i === images.length - 1 ? 0 : i + 1)); }
      if (event.key === "Tab") {
        const controls = panel.current.querySelectorAll("button");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; trigger?.focus(); };
  }, [isOpen, images.length]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((src, idx) => <button key={src} type="button" onClick={() => setOpenIndex(idx)} aria-label={`Отвори фотографија ${idx + 1}: ${title}`} className="gallery-image" data-reveal="up" data-reveal-order={idx % 3}>
          <Image src={src} alt={`${imageAlt} — фотографија ${idx + 1}`} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 50vw, (max-width: 1536px) 33vw, 451px" priority={idx === 0} />
          <span className="project-open" aria-hidden="true"><UiIcon /></span>
        </button>)}
      </div>
      {isOpen && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} — преглед на фотографии`} onMouseDown={close}>
        <div ref={panel} className="lightbox-panel" onMouseDown={(event) => event.stopPropagation()}>
          <div className="lightbox-toolbar"><span>{title}</span><button ref={closeButton} type="button" aria-label="Затвори" onClick={close} className="lightbox-control"><UiIcon name="close" /></button></div>
          <div className="lightbox-frame"><Image src={images[openIndex]} alt={`${imageAlt} — фотографија ${openIndex + 1}`} fill sizes="(max-width: 1200px) 100vw, 1200px" className="object-contain" priority />
            <button type="button" aria-label="Претходна" onClick={prev} className="lightbox-control lightbox-prev"><UiIcon name="chevron-left" /></button>
            <button type="button" aria-label="Следна" onClick={next} className="lightbox-control lightbox-next"><UiIcon name="chevron-right" /></button>
          </div>
          <div className="lightbox-counter" aria-live="polite">{openIndex + 1} / {images.length}</div>
        </div>
      </div>}
    </>
  );
}
