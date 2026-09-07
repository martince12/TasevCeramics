// Run against `npm run start -- --port 3100` after a production build.
// No real email is sent. These checks inspect HTTP responses and rendered HTML.
const assert = require("node:assert/strict");
const { test } = require("node:test");
const origin = process.env.SEO_TEST_ORIGIN || "http://localhost:3100";
const canonicalOrigin = "https://tasev-ceramics.com";
const routes = ["/", "/gallery/bathroom", "/gallery/kitchen", "/gallery/living-room", "/gallery/stairs-and-terrace", "/gallery/pools", "/gallery/stone"];
const counts = [48, 25, 26, 72, 15, 19];

function decode(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
}
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, "g"))].map((match) =>
    Object.fromEntries([...match[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((attribute) => [attribute[1], decode(attribute[2])])));
}
function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

test("every public page: unique metadata, canonical, social cards, language, headings, and image alt", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [index, route] of routes.entries()) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const head = html.split("</head>")[0];
    assert.match(html, /<html[^>]*lang="mk"/);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, route);
    assert.equal([...html.matchAll(/<main\b/g)].length, 1, route);
    const titleTags = [...head.matchAll(/<title>(.*?)<\/title>/g)];
    assert.equal(titleTags.length, 1, route);
    const title = decode(titleTags[0][1]);
    assert.match(title, /Tasev Ceramics/);
    assert.equal(title.match(/Tasev Ceramics/g).length, 1, "do not apply the template twice");
    titles.add(title);
    const meta = tags(head, "meta");
    const value = (name) => meta.find((item) => item.name === name || item.property === name)?.content;
    const description = value("description");
    assert.ok(description?.length > 60, route);
    descriptions.add(description);
    const canonicals = tags(head, "link").filter((item) => item.rel === "canonical");
    assert.equal(canonicals.length, 1, route);
    // Next serializes the root origin without '/', which is URL-equivalent.
    assert.equal(new URL(canonicals[0].href).href, canonicalOrigin + route);
    for (const item of meta.filter((item) => ["robots", "googlebot"].includes(item.name))) assert.doesNotMatch(item.content, /noindex|nofollow/);
    assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /noindex/);
    assert.equal(value("og:title"), title);
    assert.equal(value("og:description"), description);
    assert.equal(new URL(value("og:url")).href, canonicalOrigin + route);
    assert.equal(value("og:locale"), "mk_MK");
    assert.equal(value("og:type"), "website");
    assert.equal(value("og:site_name"), "Tasev Ceramics");
    assert.equal(value("twitter:card"), "summary_large_image");
    assert.equal(value("twitter:title"), title);
    assert.equal(value("twitter:description"), description);
    for (const name of ["og:image", "twitter:image"]) {
      const image = new URL(value(name));
      assert.equal(image.origin, canonicalOrigin);
      assert.equal((await fetch(origin + image.pathname)).status, 200, value(name));
    }
    const images = tags(html, "img");
    assert.equal(images.length, index === 0 ? 7 : counts[index - 1], route);
    for (const image of images) {
      assert.ok(image.alt.length > 15, image.alt);
      assert.ok(image.sizes, route);
    }
    assert.equal(images.filter((item) => item.loading === "lazy").length, images.length - 1, route);
    assert.equal(tags(head, "link").filter((item) => item.rel === "alternate" && item.hreflang).length, 0);
    if (index === 0) {
      const graph = jsonLd(html).flatMap((item) => item["@graph"] || []);
      const business = graph.find((item) => item["@type"] === "HomeAndConstructionBusiness");
      assert.equal(business.telephone, "+38971355519");
      assert.equal(business.email, "miletasev1@gmail.com");
      assert.equal(business.url, canonicalOrigin + "/");
      for (const field of ["address", "geo", "aggregateRating", "review", "priceRange", "openingHours"]) assert.equal(business[field], undefined);
      assert.ok(graph.some((item) => item["@type"] === "WebSite" && item.inLanguage === "mk"));
      assert.doesNotMatch(JSON.stringify(graph), /SearchAction/);
      for (const categoryRoute of routes.slice(1)) assert.ok(tags(html, "a").some((item) => item.href === categoryRoute));
    } else {
      const breadcrumb = jsonLd(html).find((item) => item["@type"] === "BreadcrumbList");
      assert.equal(breadcrumb.itemListElement.length, 3);
      assert.equal(breadcrumb.itemListElement[2].item, canonicalOrigin + route);
      assert.match(html, /aria-label="Патека до страницата"/);
      assert.ok(html.includes(description), "category description is visible, not only metadata");
    }
  }
  assert.equal(titles.size, routes.length);
  assert.equal(descriptions.size, routes.length);
});

test("sitemap contains exactly the seven real canonical pages; robots permits public assets", async () => {
  const response = await fetch(origin + "/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls.sort(), routes.map((route) => canonicalOrigin + route).sort());
  assert.equal(new Set(urls).size, 7);
  assert.doesNotMatch(xml, /<lastmod>/, "do not invent content modification dates");
  for (const url of urls) assert.equal((await fetch(origin + new URL(url).pathname)).status, 200, url);
  const robots = await fetch(origin + "/robots.txt");
  assert.equal(robots.status, 200);
  const text = await robots.text();
  assert.match(text, /Allow: \/(?:\r?\n|$)/);
  assert.match(text, /Disallow: \/api\//);
  assert.match(text, /Sitemap: https:\/\/tasev-ceramics.com\/sitemap.xml/);
  assert.doesNotMatch(text, /Disallow: \/(?:\r?\n|$)|Disallow: \/(?:gallery|_next|.*\.(?:css|js|jpg|webp))/);
});

test("invalid URLs return unindexable 404s and API responses are not indexable", async () => {
  for (const route of ["/missing-page", "/gallery/unknown", "/gallery/__proto__", "/gallery"]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 404, route);
    const html = await response.text();
    assert.ok(tags(html, "meta").some((item) => item.name === "robots" && item.content.includes("noindex")));
    assert.match(html, /Страницата не е пронајдена/);
    assert.equal(tags(html, "link").filter((item) => item.rel === "canonical").length, 0);
  }
  const api = await fetch(origin + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  assert.equal(api.status, 400);
  assert.match(api.headers.get("x-robots-tag"), /noindex/);
  const slash = await fetch(origin + "/gallery/stone/", { redirect: "manual" });
  assert.equal(slash.status, 308);
  assert.equal(new URL(slash.headers.get("location"), origin).pathname, "/gallery/stone");
});

test("icons, local fonts and optimized images are publicly reachable", async () => {
  const html = await (await fetch(origin)).text();
  const resources = tags(html, "link").filter((item) => item.rel?.includes("icon") || item.as === "font");
  assert.ok(resources.some((item) => item.rel === "apple-touch-icon"));
  assert.ok(resources.some((item) => item.href.includes("icon.svg")));
  assert.ok(resources.some((item) => item.as === "font"));
  for (const resource of resources) assert.equal((await fetch(new URL(resource.href, origin))).status, 200, resource.href);
  const optimized = await fetch(origin + "/_next/image?url=%2Fhero-photo2.webp&w=640&q=75", { headers: { Accept: "image/webp" } });
  assert.equal(optimized.status, 200);
  assert.match(optimized.headers.get("content-type"), /image\/webp/);
});
