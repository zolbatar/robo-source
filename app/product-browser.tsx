"use client";

import {useEffect, useMemo, useState} from "react";
import type {Product} from "@/app/products";
import {
    localeConfig,
    LocalisationKey,
    localisationOptions,
    localisations,
} from "@/app/localisation";
import {getFilters} from "@/app/filters";
import {getSelectionDetail} from "@/app/selection";
import {paginationControl} from "@/app/pagination";
import {getProductsList} from "@/app/products-list";
import {search} from "@/app/search";
import {selectPersona} from "@/app/persona";

type ProductBrowserProps = {
    products: Product[];
    selectedCategory: string | null;
    query: string;
    safePage: number;
    totalPages: number;
    totalProducts: number;
    startIndex: number;
    endIndex: number;
    previousPageHref: string | null;
    nextPageHref: string | null;
    selectedLocale: LocalisationKey;
    selectedPersona: "engineer" | "procurement" | "field";
    selectedPersonaLabel: string;
};

function stringSeed(input: string): number {
    return input.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function getWarehouseForLocale(locale: LocalisationKey) {
    switch (locale) {
        case "US":
            return "US warehouse";
        case "EU":
            return "EU warehouse";
        case "Japan":
            return "Japan warehouse";
        case "UK":
        default:
            return "UK warehouse";
    }
}

function isLocalisationKey(value: string): value is LocalisationKey {
    return value in localisations;
}

function buildLiveOffer(
    product: Product,
    locale: LocalisationKey,
    timeBucket: number,
): Pick<Product, "regionStock" | "leadTime" | "badge"> {
    const seed = stringSeed(product.id);
    const preferredWarehouse = getWarehouseForLocale(locale);
    const warehouseOptions = [preferredWarehouse, "UK warehouse", "EU warehouse", "US warehouse"];
    const regionStockBase = Math.max(4, Math.floor(product.stock * (((seed % 18) + 8) / 100)));
    const stockDrift = ((seed + timeBucket) % 9) - 4;
    const liveUnits = Math.max(0, regionStockBase + stockDrift);
    const chosenWarehouse = warehouseOptions[(seed + timeBucket) % warehouseOptions.length];

    const leadTimeDays = Math.max(2, 2 + ((seed + timeBucket) % 7));

    const liveBadge =
        liveUnits <= 8
            ? "Low stock"
            : leadTimeDays <= 3
                ? "Short lead time"
                : chosenWarehouse === preferredWarehouse
                    ? `Popular in ${locale}`
                    : product.badge;

    return {
        regionStock: `${chosenWarehouse}: ${liveUnits} units`,
        leadTime: `${leadTimeDays} days`,
        badge: liveBadge,
    };
}

export default function ProductBrowser({
                                           products,
                                           selectedCategory,
                                           query,
                                           safePage,
                                           totalPages,
                                           totalProducts,
                                           startIndex,
                                           endIndex,
                                           previousPageHref,
                                           nextPageHref,
                                           selectedLocale,
                                           selectedPersona,
                                           selectedPersonaLabel,
                                       }: ProductBrowserProps) {
    const [selectedProductId, setSelectedProductId] = useState(
        products[0]?.id ?? null,
    );
    const [liveProducts, setLiveProducts] = useState<Product[]>(products);
    const [localisationKey, setLocalisationKey] = useState<LocalisationKey>(selectedLocale);

    useEffect(() => {
        const applyLiveOffers = () => {
            const timeBucket = Math.floor(Date.now() / 30000);

            setLiveProducts(
                products.map((product) => ({
                    ...product,
                    ...buildLiveOffer(product, localisationKey, timeBucket),
                })),
            );
        };

        applyLiveOffers();
        const intervalId = window.setInterval(applyLiveOffers, 30000);

        return () => window.clearInterval(intervalId);
    }, [products, localisationKey]);

    const selectedProduct = useMemo(
        () =>
            liveProducts.find((product) => product.id === selectedProductId) ??
            liveProducts[0] ??
            null,
        [liveProducts, selectedProductId],
    );

    const localisation = localisations[localisationKey];

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
            {false && <div className="flex justify-center">
                {selectPersona(selectedPersona, query, selectedCategory, localisationKey)}
            </div>}

            <main className="mx-auto flex min-h-screen w-full max-w-400 flex-col px-6 py-6 lg:px-8">
                <section className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
                    <aside
                        className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

                        {search(selectedCategory, query)}

                        <div className="mt-6 flex flex-col gap-2"></div>

                        {getFilters(selectedCategory, query)}
                    </aside>

                    <section
                        className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div
                            className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {totalProducts === 0
                                        ? "No results found"
                                        : `Showing ${startIndex + 1}-${Math.min(endIndex, totalProducts)} of ${totalProducts.toLocaleString()} results`}
                                </div>
                                <h2 className="mt-1 text-xl font-semibold">
                                    {selectedCategory
                                        ? `${selectedCategory} recommended for ${selectedPersonaLabel.toLowerCase()} teams in ${localisationKey}`
                                        : `Recommended for ${selectedPersonaLabel.toLowerCase()} teams in ${localisationKey}`}
                                </h2>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div
                                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Price mode
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        Localised + live offers
                                    </div>
                                </div>
                                <div
                                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Sort
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        Persona + availability
                                    </div>
                                </div>
                                <div
                                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Locale / persona
                                    </div>
                                    <div className="mt-1 text-sm font-medium">
                                        {localisationKey} · {selectedPersonaLabel}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                            <div className="text-zinc-500 dark:text-zinc-400">
                                {selectedCategory
                                    ? `Filtered by ${selectedCategory}`
                                    : "Showing all categories"}
                            </div>

                            <label className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                <span className="whitespace-nowrap">
                                    {localeConfig[localisationKey].currency}
                                </span>
                                <select
                                    value={localisationKey}
                                    onChange={(event) => {
                                        const nextLocale = event.currentTarget.value;

                                        if (isLocalisationKey(nextLocale)) {
                                            setLocalisationKey(nextLocale);
                                        }
                                    }}
                                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                                >
                                    {localisationOptions.map(
                                        ({key, value}) => (
                                            <option key={key} value={key}>
                                                {value.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </label>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                Persona: {selectedPersonaLabel}
                            </div>
                        </div>

                        {paginationControl(
                            previousPageHref,
                            nextPageHref,
                            safePage,
                            totalPages,
                        )}

                        <div
                            className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300">
                            Live commercial offers refresh every few seconds.
                        </div>

                        {getProductsList(
                            liveProducts,
                            selectedProduct,
                            setSelectedProductId,
                            localisationKey,
                            localisation,
                        )}
                    </section>

                    {getSelectionDetail(selectedProduct, localisationKey)}
                </section>
            </main>
        </div>
    );
}
