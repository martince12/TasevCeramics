# Ceramic Installer Portfolio Website

A modern, fully responsive business website developed for a professional ceramic installation specialist with over 20 years of experience.

The platform presents company information, categorized project gallery, a dynamic pricing calculator, and an integrated contact form with real email delivery.

---

## Live Demo

https://tasev-ceramics-site.vercel.app/

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

- Next.js 14 (App Router)
- React
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

All calculations are indicative and serve as an initial estimate.

---

