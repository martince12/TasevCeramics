"use client";

import UiIcon from "@/components/UiIcon";


import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#home", label: "Почетна" },
  { href: "/#about", label: "За нас" },
  { href: "/#gallery", label: "Галерија" },
  { href: "/#pricing", label: "Ценовник" },
  { href: "/#contact", label: "Контакт" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const toggle = useRef(null);
  const header = useRef(null);

  useEffect(() => {
    let frame;
    const update = (syncHash) => {
      setScrolled(window.scrollY > 32);
      if (pathname !== "/") return;

      const sections = navLinks
        .map((link) => document.getElementById(link.href.slice(2)))
        .filter(Boolean);
      const headerHeight = header.current?.firstElementChild?.getBoundingClientRect().height || 80;
      const readingLine = headerHeight + window.innerHeight * 0.2;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section;
      }
      if (!current) return;
      setActiveSection(current.id);

      // Keep Next's history state and query parameters; scrolling must not
      // create a new browser-history entry for every section.
      const hash = `#${current.id}`;
      if (syncHash && window.location.hash !== hash) {
        window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
      }
    };
    const onScroll = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(() => { frame = undefined; update(true); });
    };
    // Do not overwrite a direct hash link before Next restores its position.
    update(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    let frame;
    const onAnchorClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/" || !navLinks.some((link) => link.href === `/${url.hash}`)) return;
      const section = document.getElementById(url.hash.slice(1));
      if (!section) return;

      // Explicit scrolling also works when the requested hash is already in
      // the URL. Capture covers the logo, menus, footer and homepage CTAs.
      event.preventDefault();
      setOpen(false);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${url.hash}`);
        section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        setActiveSection(section.id);
      });
    };
    document.addEventListener("click", onAnchorClick, true);
    return () => {
      document.removeEventListener("click", onAnchorClick, true);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const items = [...header.current.querySelectorAll('a, button')].filter((item) => item.getClientRects().length);
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return (
    <header ref={header} className={`site-header ${scrolled || pathname !== "/" || open ? "is-solid" : ""}`}>
      <div className="container nav-inner">
        <Link href="/#home" className="wordmark" aria-label="Tasev Ceramics — Почетна" onClick={() => setOpen(false)}>TASEV<span>CERAMICS</span></Link>
        <nav className="desktop-nav" aria-label="Главна навигација">{navLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === "/" && link.href === `/#${activeSection}` ? "location" : undefined} className={link.href === "/#contact" ? "nav-contact" : "nav-link"}>{link.label}{link.href === "/#contact" && <span aria-hidden="true"><UiIcon /></span>}</Link>)}</nav>
        <button ref={toggle} type="button" aria-label={open ? "Затвори мени" : "Отвори мени"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="menu-toggle"><span aria-hidden="true"><UiIcon name={open ? "close" : "menu"} /></span></button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav container" aria-label="Мобилна навигација">{navLinks.map((link, index) => <Link key={link.href} href={link.href} aria-current={pathname === "/" && link.href === `/#${activeSection}` ? "location" : undefined} onClick={() => setOpen(false)}><span className="index">0{index + 1}</span>{link.label}<span aria-hidden="true"><UiIcon /></span></Link>)}</nav>}
    </header>
  );
}
