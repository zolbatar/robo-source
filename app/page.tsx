import { allProducts, enrichProduct } from "@/app/products";
import ProductBrowser from "@/app/product-browser";

// Pagination
const PAGE_SIZE = 24;

type HomeProps = {
    searchParams?: Promise<{
        page?: string;
        q?: string;
        category?: string;
    }>;
};

export default async function Home({ searchParams }: HomeProps) {
    const params = (await searchParams) ?? {};
    const query = (params.q ?? "").trim().toLowerCase();
    const parsedPage = Number(params.page ?? "1");
    const currentPage =
        Number.isFinite(parsedPage) && parsedPage > 0
            ? Math.floor(parsedPage)
            : 1;
    const selectedCategory = params.category?.trim() || null;

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

    const totalProducts = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const products = filteredProducts
        .slice(startIndex, endIndex)
        .map(enrichProduct);

    const buildPageHref = (page: number) => {
        const next = new URLSearchParams();

        if (query) next.set("q", query);
        if (selectedCategory) next.set("category", selectedCategory);
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
        />
    );
}
