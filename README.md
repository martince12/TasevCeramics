# Ceramic Installer Portfolio Website

A modern, fully responsive business website developed for a professional ceramic installation specialist with over 20 years of experience.

The platform presents company information, categorized project gallery, a dynamic pricing calculator, and an integrated contact form with real email delivery.

---

## Live Demo

https://tasev-ceramics.com/

---

## Overview

This project was built as a business portfolio website for a ceramic installation contractor.  
It focuses on clean design, strong visual presentation, and functional user interaction.

Key features:
- Responsive layout (mobile-first approach)
- Categorized project gallery with modal view (lightbox)
- Dynamic pricing calculator based on:
  - Project category
  - Tile dimensions
  - Surface area (m²)
- Contact form with email delivery (Resend API)
- Modern navigation and section-based layout

---

## Technology Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- Resend API (Email service)
- Vercel (Deployment)

---

## Pricing Logic

The calculator determines cost based on:
- Selected project category
- Selected tile dimension:
  - 30x30 – 60x60 → 17€/m²
  - 60x120 → 19€/m²
  - 120x120 → 22€/m²
- Entered surface area (m²)

Certain categories (Pools and Decorative Stone) use fixed pricing.

Work over an existing surface adds 7€/m² to the estimate. Both decimal points and decimal commas are accepted.

All calculations are indicative and serve as an initial estimate.

## SEO

See [the full SEO audit and rollout checklist](docs/SEO-AUDIT.md) for canonical URLs, sitemap/robots, page metadata, structured data, verified business facts and manual Search Console steps.

**Before deploying the SEO changes:** Vercel currently redirects the apex domain to `www`. Reverse that domain configuration so `https://tasev-ceramics.com` serves production and `www` redirects to it. Do not add a reverse application redirect until that existing rule is removed.

Search Console verification can be enabled with the real `GOOGLE_SITE_VERIFICATION` value in Vercel; no verification token or business location has been invented. Run `node --test tests/seo.http.cjs` against a production build served on port 3100 (`npm run start -- --port 3100`). The suite sends no real email.

## Design and regression checks

The visual system uses cool neutral gray surfaces, charcoal text, and a muted slate accent (`#586C80`). Manrope is served through `next/font/local`; the variable font and its SIL Open Font License are in `src/app/fonts/Manrope`. Shared styles live in `src/app/globals.css`, with mobile-first layouts using the standard 640/768/1024/1280px Tailwind breakpoints. Existing gallery routes, calculator rates, contact payloads, and Resend configuration are preserved.

Homepage gallery covers fill an aligned three-column, two-row desktop grid using centered cropping. Category grids and the lightbox retain full-photo views. The 1.02× hover zoom runs only on devices with a fine pointer. `ScrollReveal` progressively enhances offscreen content using IntersectionObserver: headings rise slightly, images fade and scale gently, feature/gallery items stagger, and the desktop contact columns enter from opposite sides. Content stays visible without JavaScript or IntersectionObserver, and reduced-motion preferences and keyboard focus bypass reveals. No animation dependencies are installed.

Run locally with `npm run dev`. Production checks:

```sh
npm run lint
node --test tests/redesign.test.cjs
npm run build
```

The regression checks exercise component event handlers with a lightweight hook harness and the installed Next compiler; no additional dependencies are required. They cover calculator combinations, contact submission states, gallery assets, lightbox navigation, mobile menu behavior, scroll-reveal accessibility/cleanup, and the Resend contract using a mocked provider. They do not send email or replace visual browser testing.

For browser review, check the homepage and all six gallery categories at 320, 375, 390, 430, 768, 1024, 1440, and 1920px. Verify menu focus and Escape handling, lightbox keyboard navigation and focus return, form validation and status messages, image framing, and horizontal overflow. Also check reduced motion and short landscape viewports. The current environment has no available browser, so rendered viewport checks remain pending; component tests and HTTP checks are not substitutes for them.

---

