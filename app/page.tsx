import { allProducts, enrichProduct } from "@/app/products";
import ProductBrowser from "@/app/product-browser";

// Pagination
const PAGE_SIZE = 24;

type HomeProps = {
    searchParams?: Promise<{
        page?: string;
        category?: string;
    }>;
};

export default async function Home({ searchParams }: HomeProps) {
    const params = (await searchParams) ?? {};
    const parsedPage = Number(params.page ?? "1");
    const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
    const selectedCategory = params.category?.trim() || null;

    const filteredProducts = selectedCategory
        ? allProducts.filter((product) => product.Category === selectedCategory)
        : allProducts;

    const totalProducts = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const products = filteredProducts.slice(startIndex, endIndex).map(enrichProduct);

    const previousPageHref =
        safePage > 1
            ? `/?page=${safePage - 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`
            : null;

    const nextPageHref =
        safePage < totalPages
            ? `/?page=${safePage + 1}${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`
            : null;

    return (
        <ProductBrowser
            products={products}
            selectedCategory={selectedCategory}
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