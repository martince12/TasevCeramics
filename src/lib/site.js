// Public business facts only. Keep these consistent with the visible website.
export const site = {
  name: "Tasev Ceramics",
  url: "https://tasev-ceramics.com",
  title: "Tasev Ceramics | Поставување керамика, плочки и камен",
  description: "Професионално поставување керамички плочки, гранит, мермер, травертин и украсен камен. Проекти за купатила, кујни, тераси, скали и базени.",
  telephone: "+38971355519",
  telephoneDisplay: "+389 71 355 519",
  email: "miletasev1@gmail.com",
  socials: {
    instagram: "https://instagram.com/keramikaplocki",
    facebook: "https://facebook.com/mile.tasev.9",
  },
  image: { url: "/hero-photo2.webp", width: 1920, height: 1080, alt: "Прецизно поставување керамички плочки — Tasev Ceramics" },
};

export const absoluteUrl = (path = "/") => new URL(path, site.url).href;
