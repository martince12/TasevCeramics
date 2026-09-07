function rangePaths(folder, prefix, count) {
    return Array.from({ length: count }, (_, i) => {
        const n = i + 1;
        return `/gallery/${folder}/${prefix}${n}.jpg`;
    });
}

export const categories = [
    { slug: "bathroom", coverRatio: 0.75, title: "Купатило", cover: "/gallery/bathroom/b1.jpg",
      seoTitle: "Поставување плочки во купатило",
      description: "Погледнете изведени проекти со професионално поставување керамички плочки во купатила. Прецизна изработка со внимание кон деталите од Tasev Ceramics.",
      imageAlt: "Поставување керамички плочки во купатило",
      coverWidth: 1200,
      coverHeight: 1600,
    },
    { slug: "kitchen", coverRatio: 1.3333333333333333, title: "Кујна", cover: "/gallery/kitchen/k1.jpg",
      seoTitle: "Поставување плочки во кујна",
      description: "Изработени кујни со керамички плочки од Tasev Ceramics. Погледнете проекти со прецизно поставување плочки и внимателна завршна обработка.",
      imageAlt: "Изведен проект со керамички плочки во кујна",
      coverWidth: 1600,
      coverHeight: 1200,
    },
    { slug: "living-room", coverRatio: 1.7765625, title: "Дневна соба", cover: "/gallery/living-room/lr1.jpg",
      seoTitle: "Поставување плочки во дневна соба",
      description: "Проекти со поставување плочки во дневни соби од Tasev Ceramics. Погледнете ја изработката на керамички површини во домашниот ентериер.",
      imageAlt: "Поставени плочки во дневна соба",
      coverWidth: 1137,
      coverHeight: 640,
    },
    { slug: "stairs-and-terrace", coverRatio: 0.75, title: "Скали и тераси", cover: "/gallery/stairs-and-terrace/st1.jpg",
      seoTitle: "Поставување плочки на тераси и скали",
      description: "Галерија на изработени скали и тераси со плочки од Tasev Ceramics. Погледнете примери на прецизно поставување и завршна обработка.",
      imageAlt: "Изведба со плочки од категоријата скали и тераси",
      coverWidth: 1200,
      coverHeight: 1600,
    },
    { slug: "pools", coverRatio: 0.75, title: "Базени", cover: "/gallery/pools/p1.jpg",
      seoTitle: "Поставување плочки за базени",
      description: "Изведени проекти со поставување плочки за базени од Tasev Ceramics. Погледнете ја керамичката изработка и деталите во галеријата.",
      imageAlt: "Поставување плочки во базен",
      coverWidth: 1200,
      coverHeight: 1600,
    },
    { slug: "stone", coverRatio: 0.5625, title: "Украсен камен", cover: "/gallery/stone/s1.jpg",
      seoTitle: "Поставување декоративен и природен камен",
      description: "Проекти со поставување украсен и природен камен од Tasev Ceramics. Погледнете изработени камени облоги и детали од завршените проекти.",
      imageAlt: "Изработена облога со украсен камен",
      coverWidth: 900,
      coverHeight: 1600,
    },
];


export const imagesByCategory = {
    bathroom: rangePaths("bathroom", "b", 48),
    kitchen: rangePaths("kitchen", "k", 25),
    // lr17.jpg is not present in the original project assets.
    "living-room": rangePaths("living-room", "lr", 27).filter((src) => !src.endsWith("/lr17.jpg")),
    "stairs-and-terrace": rangePaths("stairs-and-terrace", "st", 72),
    pools: rangePaths("pools", "p", 15),
    stone: rangePaths("stone", "s", 19),
};
