import {allProducts, enrichProduct} from "@/app/products";
import ProductBrowser from "@/app/product-browser";
import {localeConfig, LocalisationKey} from "@/app/localisation";

// Pagination
const PAGE_SIZE = 24;


type HomeProps = {
    searchParams?: Promise<{
        page?: string | string[];
        q?: string | string[];
        category?: string | string[];
        locale?: string | string[];
        persona?: string | string[];
    }>;
};

function getSingleParam(
    value: string | string[] | undefined,
): string | undefined {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export default async function Home({searchParams}: HomeProps) {

    // Get parameters passed in with the URL
    const params = (await searchParams) ?? {};
    const query = (getSingleParam(params.q) ?? "").trim().toLowerCase();
    const parsedPage = Number(getSingleParam(params.page) ?? "1");
    const currentPage =
        Number.isFinite(parsedPage) && parsedPage > 0
            ? Math.floor(parsedPage)
            : 1;
    const selectedCategory = (getSingleParam(params.category) ?? "").trim() || null;

    const supportedLocales = Object.keys(localeConfig) as LocalisationKey[];
    const supportedPersonas = ["engineer", "procurement", "field"] as const;

    const localeParam = (getSingleParam(params.locale) ?? "UK").trim().toUpperCase();
    console.log(params)
    const personaParam = (getSingleParam(params.persona) ?? "procurement").trim().toLowerCase();

    console.log(localeParam)
    const selectedLocale =
        supportedLocales.includes(
        localeParam as (typeof supportedLocales)[number],
    )
        ? (localeParam as (typeof supportedLocales)[number])
        : "UK";
    console.log(selectedLocale)

    const selectedPersona = supportedPersonas.includes(
        personaParam as (typeof supportedPersonas)[number],
    )
        ? (personaParam as (typeof supportedPersonas)[number])
        : "procurement";


    const personaLabels = {
        engineer: "Engineer",
        procurement: "Procurement",
        field: "Field repair",
    } as const;

    const filteredProducts = allProducts.filter((product) => {
        const matchesCategory =
            !selectedCategory || product.Category === selectedCategory;

        const matchesQuery =
            !query ||
            product.ProductID.toLowerCase().includes(query) ||
            product.ProductName.toLowerCase().includes(query) ||
            product.Brand.toLowerCase().includes(query) ||
            product.Category.toLowerCase().includes(query);

        return matchesCategory && matchesQuery;
    });

    const enrichedProducts = filteredProducts.map((product) => ({
        raw: product,
        enriched: enrichProduct(product),
    }));

    const stockScore = (regionStock: string) => {
        const matchesPreferredWarehouse = regionStock.startsWith(
            localeConfig[selectedLocale].warehouse,
        )
            ? 10
            : 0;
        const unitsMatch = regionStock.match(/(\d+) units/);
        const units = unitsMatch ? Number(unitsMatch[1]) : 0;
        return matchesPreferredWarehouse + units;
    };

    const leadTimeScore = (leadTime: string) => {
        const days = Number.parseInt(leadTime, 10);
        return Number.isFinite(days) ? Math.max(0, 14 - days) : 0;
    };

    const specScore = (specs: string[]) => {
        switch (selectedPersona) {
            case "engineer":
                return specs.some((spec) =>
                    [
                        "CANopen",
                        "EtherCAT",
                        "Modbus",
                        "ROS 2",
                        "GigE",
                        "Global shutter",
                    ].includes(spec),
                )
                    ? 25
                    : 0;
            case "field":
                return specs.some((spec) =>
                    [
                        "Shielded",
                        "Drag-chain rated",
                        "IP67",
                        "Factory-rated",
                        "Heavy-duty",
                    ].includes(spec),
                )
                    ? 20
                    : 0;
            case "procurement":
            default:
                return 0;
        }
    };

    const priceScore = (price: number) => {
        if (selectedPersona === "procurement") {
            return Math.max(0, 600 - price);
        }
        return 0;
    };

    const badgeScore = (badge: string) => {
        if (
            selectedPersona === "procurement" &&
            ["Low stock", "Short lead time", "Popular in UK", "Popular in EU"].includes(
                badge,
            )
        ) {
            return 20;
        }
        if (
            selectedPersona === "engineer" &&
            ["High torque", "Vision pipeline", "Embedded control"].includes(badge)
        ) {
            return 20;
        }
        if (
            selectedPersona === "field" &&
            ["Field-service ready", "Factory-ready", "Heavy-duty"].includes(badge)
        ) {
            return 20;
        }
        return 0;
    };

    const scoredProducts = enrichedProducts.map(({raw, enriched}) => ({
        raw,
        enriched,
        score:
            stockScore(enriched.regionStock) +
            leadTimeScore(enriched.leadTime) +
            specScore(enriched.specs) +
            priceScore(raw.Price) +
            badgeScore(enriched.badge),
    }));

    const rankedProducts = scoredProducts.sort((a, b) => b.score - a.score);

    const totalProducts = rankedProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const products = rankedProducts.slice(startIndex, endIndex).map(({raw, enriched}) => {
        const localizedPrice =
            Math.round(raw.Price * localeConfig[selectedLocale].rate * 100) / 100;

        return {
            ...enriched,
            basePrice: localizedPrice,
            currency: localeConfig[selectedLocale].currency,
        };
    });

    const buildPageHref = (page: number) => {
        const next = new URLSearchParams();

        if (query) next.set("q", query);
        if (selectedCategory) next.set("category", selectedCategory);
        next.set("locale", selectedLocale);
        next.set("persona", selectedPersona);
        next.set("page", String(page));

        return `/?${next.toString()}`;
    };

    const previousPageHref = safePage > 1 ? buildPageHref(safePage - 1) : null;
    const nextPageHref =
        safePage < totalPages ? buildPageHref(safePage + 1) : null;

    return (
        <ProductBrowser
            products={products}
            selectedCategory={selectedCategory}
            query={query}
            safePage={safePage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            startIndex={startIndex}
            endIndex={endIndex}
            previousPageHref={previousPageHref}
            nextPageHref={nextPageHref}
            selectedLocale={selectedLocale}
            selectedPersona={selectedPersona}
            selectedPersonaLabel={personaLabels[selectedPersona]}
        />
    );
}
