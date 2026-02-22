function rangePaths(folder, prefix, count) {
    return Array.from({ length: count }, (_, i) => {
        const n = i + 1;
        return `/gallery/${folder}/${prefix}${n}.jpg`;
    });
}

export const categories = [
    { slug: "bathroom", title: "Купатило", cover: "/gallery/bathroom/b1.jpg" },
    { slug: "kitchen", title: "Кујна", cover: "/gallery/kitchen/k1.jpg" },
    { slug: "living-room", title: "Дневна соба", cover: "/gallery/living-room/lr1.jpg" },
    { slug: "stairs-and-terrace", title: "Скали и тераси", cover: "/gallery/stairs-and-terrace/st1.jpg" },
    { slug: "pools", title: "Базенти", cover: "/gallery/pools/p1.jpg" },
    { slug: "stone", title: "Украсен камен", cover: "/gallery/stone/s1.jpg" },
];


export const imagesByCategory = {
    bathroom: rangePaths("bathroom", "b", 21),
    kitchen: rangePaths("kitchen", "k", 10),
    "living-room": rangePaths("living-room", "lr", 10),
    "stairs-and-terrace": rangePaths("stairs-and-terrace", "st", 31),
    pools: rangePaths("pools", "p", 22),
    stone: rangePaths("stone", "s", 13),
};