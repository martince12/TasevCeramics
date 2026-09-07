"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Content is visible in SSR and without JavaScript. Only offscreen elements
// become animation candidates; fixed navigation and dialogs are never animated.
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;

    let observer;
    const elements = [...document.querySelectorAll("[data-reveal]")];
    const show = (element) => element.classList.remove("reveal-pending", "reveal-entered");

    const setup = () => {
      observer?.disconnect();
      elements.forEach(show);
      if (preference.matches) return;

      observer = new window.IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.remove("reveal-pending");
          target.classList.add("reveal-entered");
          observer.unobserve(target);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        observer.observe(element);
        element.classList.add("reveal-pending");
      });
    };

    // Keyboard users should never focus an invisible link or form field.
    const onFocus = (event) => {
      elements.forEach((element) => {
        if (!element.contains(event.target)) return;
        show(element);
        observer?.unobserve(element);
      });
    };

    setup();
    preference.addEventListener("change", setup);
    document.addEventListener("focusin", onFocus);
    return () => {
      observer?.disconnect();
      elements.forEach(show);
      preference.removeEventListener("change", setup);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return null;
}
