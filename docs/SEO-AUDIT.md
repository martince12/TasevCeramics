# Tasev Ceramics — SEO implementation and audit

Audit date: 7 September 2026. Preferred production origin: `https://tasev-ceramics.com`.

## Organic + local service expansion

The site now has eight indexable public pages. The single new service URL is `https://tasev-ceramics.com/keramicar-kavadarci`. It uses the requested title “Керамичар Кавадарци | Лепење и поставување плочки – Tasev Ceramics”, description “Tasev Ceramics нуди професионално лепење и поставување керамички плочки во Кавадарци и низ Македонија. Купатила, кујни, тераси, скали, базени и камен.” and H1 “Керамичар во Кавадарци – професионално поставување плочки”. The title is absolute to avoid adding the brand twice through the existing layout template; Open Graph and Twitter match it.

The server-rendered page provides an introduction, six service/portfolio entries with real existing cover images, four work-process steps, quote preparation guidance, and estimator/contact/telephone links. Photos are not attributed to a particular city without evidence. Category pages retain every gallery image and the same lightbox component, followed by two distinct service paragraphs and contextual links to the new page and estimator. The homepage gallery now ends with a minimal text-and-links service overview; the existing grid, hero, animations, calculator and form remain intact.

The new page emits Service and BreadcrumbList JSON-LD. Its provider references the existing `https://tasev-ceramics.com/#business` entity; it does not declare a competing business. Service area uses the same Kavadarci and North Macedonia facts as the homepage. No reviews, ratings, street addresses, coordinates or other branches were added. Service properties were checked against [Schema.org Service](https://schema.org/Service).

The sitemap contains the homepage, this service page and the six gallery categories. No separate `/lepenje-plocki-kavadarci`, `/postavuvanje-plocki-kavadarci` or `/majstor-za-plocki-kavadarci` routes exist. No transliteration keyword blocks or meta-keyword lists were added.

Files changed for this expansion:
- `src/app/keramicar-kavadarci/page.js` — new server-rendered service page.
- `src/data/serviceContent.js` — focused local metadata, category content and process copy.
- `src/app/gallery/[category]/page.js` — useful category text and contextual links after the unchanged gallery.
- `src/app/page.js` — homepage services overview and internal links.
- `src/app/globals.css` — scoped spacing, text, wrapping links and service layout styles using the existing design tokens and grid breakpoints.
- `src/lib/seo.js` — absolute-title option and Service/BreadcrumbList graph.
- `src/app/sitemap.js` — new canonical URL.
- `tests/seo.http.cjs` — eight-page metadata/canonical/schema/link coverage, visible service content, and excluded duplicate routes.
- `docs/SEO-AUDIT.md` and `README.md` — updated documentation.

Validation: `npm run lint` and `npm run build` passed; all nine component regression tests and all four production HTTP SEO tests passed. HTTP checks cover all eight pages, exact local-page title/description, canonical/social metadata, service provider identity and geography, breadcrumbs, internal links, visible category copy, sitemap membership and 404 responses for the excluded duplicate routes.

Responsive implementation reuses the existing one/two/three-column project grid, fluid headings, bounded content widths and wrapping links. Browser verification is pending: the Browser skill is available, but this session does not expose its required JavaScript execution tool. Source review and automated HTTP/component tests do not replace visual checks at phone, tablet and desktop sizes. No production deployment was performed.

## Local SEO refinement — 17 October 2026

The owner confirmed Kavadarci, North Macedonia as the base and availability for projects across North Macedonia. The current About paragraph says: “Tasev Ceramics е базиран во Кавадарци и нуди професионално поставување керамички плочки, гранитогрес, декоративен и природен камен за проекти во Кавадарци и низ Македонија.” Existing experience, materials and project categories remain in the following sentence.

The shared footer displays “Кавадарци, Северна Македонија” and “Проекти низ Македонија”. Both the About copy and footer are rendered on the server, without needing JavaScript.

Homepage description: “Професионално поставување керамички плочки, гранитогрес и камен од Tasev Ceramics, базиран во Кавадарци. Изведба на проекти во Кавадарци и низ Македонија.” The same title and description feed Open Graph and Twitter metadata.

The business graph now has a partial PostalAddress with addressLocality `Kavadarci` and addressCountry `MK`, and areaServed entries for City `Kavadarci` and Country `North Macedonia`. No street, postcode, coordinates or branches are asserted. Phone, email and social profiles are preserved. Only the bathroom category description adds Kavadarci; all category titles stay service-focused. No keyword lists, transliteration blocks or doorway routes were created.

Changed files in this refinement: `src/lib/site.js`, `src/lib/seo.js`, `src/app/page.js`, `src/app/layout.js`, `src/data/galleryData.js`, `tests/seo.http.cjs`, and this audit. The HTTP suite now checks the confirmed geography and visible server HTML in addition to existing SEO checks.

## Findings before the original implementation

- Next.js 16.1.6 App Router / React 19.2.3, not the originally described Next.js 14 stack.
- Seven public pages: the homepage and six gallery categories. Gallery, pricing and contact on the homepage are sections, not separate routes.
- Only a shared root title and description existed. Category pages inherited them; there were no canonicals, social cards, sitemap, robots route or JSON-LD.
- `lang="mk"`, one H1 per page, semantic main/nav/footer, actual category links, local fonts, keyboard controls, labeled form fields and responsive `next/image` were already in place.
- All 205 gallery assets resolve. Their originals total approximately 128 MiB; they are lazy-loaded through Next's image optimizer, not downloaded together.
- Gallery image alternatives were category names plus numbers, without service context.
- The favicon was the default Vercel triangle. No Apple touch icon or manifest existed.
- There is no verified street address, geographic coordinate, complete business-hours schedule, rating, certification or service area in repository content. Consultation availability after 17:00 is not a complete opening-hours schedule.
- Granite, marble, travertine, tiles and decorative stone are supported by existing content. Porcelain/granite-porcelain claims were not added without confirmation.

## Deployment prerequisite: canonical hostname

Live response headers on the audit date showed:

| Request | Response |
| --- | --- |
| `http://tasev-ceramics.com` | 308 to `https://tasev-ceramics.com/` |
| `https://tasev-ceramics.com` | 308 to `https://www.tasev-ceramics.com/` |
| `https://www.tasev-ceramics.com` | 200 |

The current Vercel domain rule conflicts with the requested non-www canonical. Before deploying this SEO release, configure the apex domain to serve the production deployment and redirect `www` to the apex. Preserve paths and query strings. Then verify both HTTP and HTTPS host variants on the homepage and a category URL.

**No inverse redirect was added in Next configuration:** combined with the existing Vercel rule it would create a redirect loop. Infrastructure was not changed, and this release has not been deployed by the agent. Any public legacy Vercel alias should also redirect to the chosen production host, or receive an appropriate deployment-level indexing policy. Review preview protection separately; public business pages must stay indexable.

## Metadata and canonical strategy

- `metadataBase` uses the fixed production origin rather than request headers or preview URLs.
- Homepage title: `Tasev Ceramics | Поставување керамика и плочки во Кавадарци`.
- Child title template: `%s | Tasev Ceramics`. The homepage uses an absolute title to avoid repeated branding.
- Every category has a distinct service-focused Macedonian title and description, used consistently in the head and sharing metadata.
- Each public page declares its own canonical. Queries and section fragments are excluded. The root canonical may serialize without its final slash in Next; `https://tasev-ceramics.com` and `https://tasev-ceramics.com/` are the same root URL.
- Category paths have no trailing slash. Next's existing permanent trailing-slash normalization is now explicit.
- Public pages use index/follow and large Google image previews. Error responses retain Next's noindex behavior, and `/api/*` responses have an `X-Robots-Tag: noindex, nofollow` header.
- Open Graph includes the page-specific title/description/URL, `mk_MK`, website type, site name and an existing image with accurate dimensions and alt text.
- Twitter uses `summary_large_image` and matching unique metadata. No invented social account handle is declared.
- Homepage sharing uses the existing 1920×1080 hero; category sharing uses its own cover. No generative imagery, unnecessary recropping or new image downloads at page runtime were added.
- `lang="mk"` is preserved. No fake translated URLs, hreflang, meta keyword lists or hidden text were added.

## Sitemap and robots

`src/app/sitemap.js` derives category entries from the same data used by navigation. It includes exactly:

1. https://tasev-ceramics.com/
2. https://tasev-ceramics.com/gallery/bathroom
3. https://tasev-ceramics.com/gallery/kitchen
4. https://tasev-ceramics.com/gallery/living-room
5. https://tasev-ceramics.com/gallery/stairs-and-terrace
6. https://tasev-ceramics.com/gallery/pools
7. https://tasev-ceramics.com/gallery/stone
8. https://tasev-ceramics.com/keramicar-kavadarci

The gallery landing section is covered by the homepage entry; a nonexistent `/gallery` route is not invented. API, error, modal, query and fragment URLs are excluded. Change frequency is monthly; priorities are 1 for home and 0.8 for categories. These are hints, not promises about crawler behavior or ranking.

`lastModified` is deliberately omitted: no trustworthy per-page publication/edit record exists. Build time, checkout mtime and an arbitrary historical date would not be truthful content-modification timestamps. Add the field when an editorial source tracks actual significant content updates.

`src/app/robots.js` allows public paths and assets, disallows `/api/`, and advertises the absolute sitemap URL. A robots block is not a security control; the API also has a noindex response header.

## Structured data

The homepage server-renders a JSON-LD graph with:

- `HomeAndConstructionBusiness`: stable entity ID, business name, URL, description, existing telephone/email, brand icon, hero image and the two existing social profiles.
- `WebSite`: name, URL, Macedonian language and a reference to the business publisher. No nonexistent SearchAction.

Category pages server-render `BreadcrumbList` matching visible links: Home → homepage Gallery section → current category. No duplicate gallery page is implied.

JSON-LD is serialized with HTML delimiters escaped. Only the owner-confirmed locality and country are supplied in the partial address. No street address, postcode, coordinates, review/rating, price range, opening hours or unconfirmed locality is invented. The business subtype is valid Schema.org vocabulary, but **Google's LocalBusiness rich-result eligibility requires an address**. The locality-only address is not a complete street address; this implementation does not fabricate missing details to pass that feature's validation and does not promise a rich result.

## Visible content, images and accessibility

- The existing About paragraph now explicitly connects the business name, supported materials and six service categories. It replaces existing copy instead of adding an SEO section or keyword cards.
- The existing hero H1 and section hierarchy remain. Category H1s retain their visible category labels; short category-specific service descriptions add context.
- Gallery alternatives describe the known service/category and photo number. They do not invent colors, locations, material grades or project-specific details.
- Covers, gallery links, lightbox state, keyboard behavior, calculator formulas, contact payloads and Resend logic are preserved.
- Breadcrumbs add small, accessible navigation links. All original routes and section navigation remain available.
- Public phone/email/social values now come from one factual source for the footer, homepage contact link and structured data.
- The Vercel favicon is replaced with a restrained T initial in the existing palette; SVG, multi-size ICO and 180×180 Apple icon are included. Visible wordmarks are unchanged. An installable-app manifest is unnecessary for this business portfolio and was not added solely for SEO.

## Performance audit

- Homepage and six category pages are server-rendered; category pages now use build-time static generation. Unknown category slugs return genuine 404s.
- Metadata and JSON-LD remain on the server. No SEO package, animation dependency or additional client component was added.
- The existing 107,122-byte WebP hero remains prioritized. The first category photo is prioritized as the likely image LCP candidate; other grid images stay lazy. An opened lightbox image is still prioritized only after interaction.
- Gallery responsive image sizes are capped for large screens. Reserved image frames preserve layout stability.
- A local HTTP check returned the 640px hero as WebP at 13,682 bytes. This is a resource-size observation, not a Core Web Vitals score.
- The 165,420-byte local variable font and its existing `next/font/local` swap/preload behavior are retained.
- Existing IntersectionObserver reveals and reduced-motion behavior are preserved, with content visible in server HTML and without JavaScript.
- No browser was available for Lighthouse, rendered mobile inspection or LCP/CLS/INP measurements. Use PageSpeed Insights/Lighthouse after deployment and Search Console field data when available. No unmeasured performance score is claimed.

## Files changed for this SEO pass

| File | Change |
| --- | --- |
| `src/lib/site.js` | Canonical origin and verified public business facts |
| `src/lib/seo.js` | Page metadata, business/website graph, breadcrumbs |
| `src/components/JsonLd.js` | Safe server-side JSON-LD output |
| `src/app/layout.js` | Metadata base/template, verification hook, shared contact facts |
| `src/app/page.js` | Homepage metadata/schema, concise service copy, descriptive cover alternatives |
| `src/data/galleryData.js` | Category SEO titles/descriptions, safe image alternatives and cover dimensions |
| `src/app/gallery/[category]/page.js` | Unique metadata, static routes, visible breadcrumbs, short description |
| `src/components/GalleryLightboxGrid.js` | Category-aware alternatives and responsive loading hints |
| `src/app/robots.js` | Crawl rules and sitemap pointer |
| `src/app/sitemap.js` | Actual canonical public routes |
| `src/app/not-found.js` | Macedonian 404 with a real gallery return link |
| `src/app/globals.css` | Only compact breadcrumb and category-count styling |
| `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` | Brand-aware metadata icons |
| `scripts/generate-icons.cjs` | Reproducible icon generation using the installed Sharp dependency |
| `next.config.mjs` | Explicit slash strategy and nonindexable API headers |
| `tests/seo.http.cjs` | HTTP/head/schema/crawl/404/image verification |
| `tests/redesign.test.cjs` | JSON-LD serialization regression coverage alongside existing behavior checks |
| `README.md`, `docs/SEO-AUDIT.md` | Verification commands and operational follow-up |

Existing uncommitted redesign changes in the working tree were preserved. No secrets, Resend environment values, calculator formulas or package dependencies were changed.

## Verification and manual follow-up

```sh
npm run lint
node --test tests/redesign.test.cjs
npm run build
npm run start -- --port 3100
# In another terminal:
node --test tests/seo.http.cjs
```

The HTTP suite checks the rendered production head for all eight pages, unique titles/descriptions, self-canonicals, OG/Twitter images, one H1/main, Macedonian language, meaningful alternatives, lazy loading, JSON-LD, breadcrumbs, sitemap contents, robots rules, icons/fonts, image optimization, canonical trailing-slash redirects, real 404/noindex behavior and invalid contact validation. It does not send email. Existing calculator, gallery/lightbox, contact and section-navigation checks remain in the component suite.

Before considering the production rollout complete:

1. Fix the Vercel domain direction described above, then deploy and rerun public HTTP checks. Do not add an inverse application redirect while apex → www still exists.
2. Locality and coverage are now confirmed: based in Kavadarci and available across North Macedonia. Keep this wording consistent with the real Google Business Profile; no branches elsewhere are claimed.
3. Verify Search Console ownership with DNS, or set the real public token as `GOOGLE_SITE_VERIFICATION` in Vercel and rebuild. No token has been invented or installed.
4. Submit the sitemap, inspect the homepage and representative category URLs, and request indexing where appropriate.
5. Validate the deployed JSON-LD with Schema.org Validator and Google's Rich Results Test, observing the address limitation for LocalBusiness.
6. Set up or verify the real Google Business Profile as a service-area business using accurate operational facts. Keep the website phone/name consistent, upload actual work photos and request genuine customer reviews.
7. Check mobile/desktop rendering and PageSpeed Insights; monitor real queries, impressions, clicks and Core Web Vitals over time.

Technical implementation improves crawlability and semantic clarity; it does not guarantee indexing, ranking positions or rich results.

## Primary references

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Schema.org HomeAndConstructionBusiness](https://schema.org/HomeAndConstructionBusiness)
- [Google LocalBusiness requirements](https://developers.google.com/search/docs/appearance/structured-data/local-business)
