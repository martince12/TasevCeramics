"use client";

import { useMemo, useState } from "react";

const PRICES = {
    bathroom: { label: "Купатило", price: 17 },
    kitchen: { label: "Кујна", price: 15 },
    "living-room": { label: "Дневна соба", price: 15 },
    pools: { label: "Базен", price: 25 },
    "stairs-terrace": { label: "Скали и тераса", price: 17 },
    stone: { label: "Украсен камен", price: 25 },
};

const CATEGORIES_WITH_TILE_TYPE = new Set([
    "bathroom",
    "kitchen",
    "living-room",
    "stairs-terrace",
]);

const TILE_TYPES_COMMON = [
    { id: "30-60", label: "30×30 – 60×60", price: 17 },
    { id: "60x120", label: "60×120", price: 19 },
    { id: "120x120", label: "120×120", price: 22 },
];

const TILE_TYPES = {
    bathroom: TILE_TYPES_COMMON,
    kitchen: TILE_TYPES_COMMON,
    "living-room": TILE_TYPES_COMMON,
    "stairs-terrace": TILE_TYPES_COMMON,
};


export default function PricingCalculator() {
    const [category, setCategory] = useState("bathroom");
    const [tileType, setTileType] = useState("");
    const [workType, setWorkType] = useState("new"); // "new" | "old"
    const [sqm, setSqm] = useState("");

    const usesTileType = CATEGORIES_WITH_TILE_TYPE.has(category);

    const sqmNumber = useMemo(() => {
        const normalized = String(sqm).replace(",", ".").trim();
        const n = Number(normalized);
        return Number.isFinite(n) ? n : NaN;
    }, [sqm]);
    const extraPerSqm = 7;

    const extraCost = useMemo(() => {
        if (workType !== "old") return 0;
        if (!Number.isFinite(sqmNumber) || sqmNumber <= 0) return 0;
        return sqmNumber * extraPerSqm;
    }, [workType, sqmNumber]);

    const unitPrice = useMemo(() => {
        if (!usesTileType) return PRICES[category].price;

        const list = TILE_TYPES[category] || [];
        const picked = list.find((t) => t.id === tileType);
        return picked ? picked.price : null;
    }, [category, tileType, usesTileType]);

    const total = useMemo(() => {
        if (!Number.isFinite(sqmNumber) || sqmNumber <= 0) return null;
        if (unitPrice == null) return null;

        const base = sqmNumber * unitPrice;
        return base + extraCost;
    }, [sqmNumber, unitPrice, extraCost]);
    const formattedTotal =
        total === null
            ? "—"
            : new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(total);

    return (
        <div className="rounded-3xl border border-[#705849] bg-white p-6 md:p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-3 md:items-start">
                {/* Категорија */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-zinc-700">
                        Категорија
                    </label>
                    <select
                        value={category}
                        onChange={(e) => {
                            const nextCat = e.target.value;
                            setCategory(nextCat);
                            setTileType("");
                        }}
                        className="mt-2 block w-full h-12 rounded-2xl border px-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    >
                        {Object.entries(PRICES).map(([key, v]) => (
                            <option key={key} value={key}>
                                {v.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Вид на плочки */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-zinc-700">
                        Вид на плочки
                    </label>
                    <select
                        value={tileType}
                        onChange={(e) => setTileType(e.target.value)}
                        disabled={!usesTileType}
                        className="mt-2 block w-full h-12 rounded-2xl border px-4 text-sm outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-60"
                    >
                        {!usesTileType ? (
                            <option value="">Не е потребно</option>
                        ) : (
                            <>
                                <option value="">Избери димензија…</option>
                                {(TILE_TYPES[category] || []).map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.label}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </div>
                {/* Тип на работа */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-zinc-700">
                        Тип на работа
                    </label>

                    <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="mt-2 block w-full h-12 rounded-2xl border px-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    >
                        <option value="new">Ново</option>
                        <option value="old">На старо</option>
                    </select>

                </div>
                {/* Површина */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-zinc-700">
                        Површина (m²)
                    </label>
                    <input
                        value={sqm}
                        onChange={(e) => setSqm(e.target.value)}
                        inputMode="decimal"
                        placeholder="Пример: 12.5"
                        className="mt-2 block w-full h-12 rounded-2xl border px-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
                    />
                    <p className="mt-2 text-xs text-zinc-500">
                        * Ова е ориентативна пресметка. Финалната цена се утврдува по увид на
                        лице место.
                    </p>
                </div>

                {/* Процена */}
                <div className="md:col-span-3">
                    <div className="rounded-2xl border bg-zinc-50 p-5">
                        <div className="text-xs uppercase tracking-widest text-zinc-500">
                            Процена
                        </div>

                        <div className="mt-2 text-3xl font-bold tracking-tight">
                            {formattedTotal}€
                        </div>

                        <div className="mt-2 text-sm text-zinc-600">
                            {usesTileType ? (
                                unitPrice == null ? (
                                    <span>Избери „Вид на плочки“ за да се пресмета цена.</span>
                                ) : (
                                    <span>
                    Цена: <b>{unitPrice}€</b>/m²
                  </span>
                                )
                            ) : (
                                <span>
                  {PRICES[category].label}: <b>{PRICES[category].price}€</b>/m²
                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Валидација */}
            {sqm.length > 0 && (!Number.isFinite(sqmNumber) || sqmNumber <= 0) && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Внеси валиден број на m² (поголем од 0).
                </div>
            )}
        </div>
    );
}