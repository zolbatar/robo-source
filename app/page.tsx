import { allProducts, enrichProduct } from "@/app/products";
import ProductBrowser from "@/app/product-browser";

// Pagination
const PAGE_SIZE = 24;

type HomeProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {};
  const parsedPage = Number(params.page ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const totalProducts = allProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const products = allProducts.slice(startIndex, endIndex).map(enrichProduct);
  const previousPageHref = safePage > 1 ? `/?page=${safePage - 1}` : null;
  const nextPageHref = safePage < totalPages ? `/?page=${safePage + 1}` : null;

  return (
    <ProductBrowser
      products={products}
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
