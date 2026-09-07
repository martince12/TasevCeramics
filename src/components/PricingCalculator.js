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
        <div className="calculator">
            <div className="calculator-grid">
                <div className="field">
                    <label htmlFor="quote-category">Категорија</label>
                    <select id="quote-category" value={category} onChange={(e) => { setCategory(e.target.value); setTileType(""); }} className="form-control">
                        {Object.entries(PRICES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="quote-tile">Вид на плочки</label>
                    <select id="quote-tile" value={tileType} onChange={(e) => setTileType(e.target.value)} disabled={!usesTileType} className="form-control">
                        {!usesTileType ? <option value="">Не е потребно</option> : <>
                            <option value="">Избери димензија…</option>
                            {(TILE_TYPES[category] || []).map((tile) => <option key={tile.id} value={tile.id}>{tile.label}</option>)}
                        </>}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="quote-work">Тип на работа</label>
                    <select id="quote-work" value={workType} onChange={(e) => setWorkType(e.target.value)} className="form-control">
                        <option value="new">Ново</option><option value="old">На старо</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="quote-area">Површина (m²)</label>
                    <input id="quote-area" value={sqm} onChange={(e) => setSqm(e.target.value)} inputMode="decimal" placeholder="Пример: 12.5" className="form-control" aria-describedby={sqm.length > 0 && (!Number.isFinite(sqmNumber) || sqmNumber <= 0) ? "quote-error quote-note" : "quote-note"} aria-invalid={sqm.length > 0 && (!Number.isFinite(sqmNumber) || sqmNumber <= 0)} />
                    <p id="quote-note" className="field-note">* Ова е ориентативна пресметка. Финалната цена се утврдува по увид на лице место.</p>
                </div>
                <div className="estimate" aria-live="polite" aria-atomic="true">
                    <p className="eyebrow">Процена</p>
                    <output className="estimate-total" htmlFor="quote-category quote-tile quote-work quote-area">{formattedTotal}€</output>
                    <div className="estimate-detail">
                        {usesTileType ? (unitPrice == null ? <span>Избери „Вид на плочки“ за да се пресмета цена.</span> : <span>Цена: <b>{unitPrice}€</b>/m²</span>) : <span>{PRICES[category].label}: <b>{PRICES[category].price}€</b>/m²</span>}
                        {workType === "old" && <p>Дополнително на старо: 7€/m²</p>}
                    </div>
                </div>
            </div>
            {sqm.length > 0 && (!Number.isFinite(sqmNumber) || sqmNumber <= 0) && <p id="quote-error" role="alert" className="validation-error">Внеси валиден број на m² (поголем од 0).</p>}
        </div>
    );
}
