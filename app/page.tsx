import {allProducts, enrichProduct} from "@/app/products";

// Pagination
const PAGE_SIZE = 24;

const categories = [
  "Motors",
  "Controllers",
  "Sensors",
  "Grippers",
  "Cables",
  "Frames",
  "Cameras",
  "Microcontrollers",
  "Wheels",
];

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(price);
}

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
      <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <main className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 py-6 lg:px-8">
          <header
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div
                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium tracking-wide text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  RoboSource · Global robotics components finder
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Find robotics parts fast, with regional availability and buyer-aware ranking.
                  </h1>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
                    A composable product listing page for engineering and procurement teams. The
                    catalog is stable, while pricing, warehouse availability, and merchandising
                    signals can update independently.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Locale
                  </div>
                  <div className="mt-1 text-sm font-medium">United Kingdom · GBP</div>
                </div>
                <div
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Persona
                  </div>
                  <div className="mt-1 text-sm font-medium">Procurement</div>
                </div>
                <div
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Refresh model
                  </div>
                  <div className="mt-1 text-sm font-medium">Static catalog + live offers</div>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
            <aside
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100">
                  Reset
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium">Search</h3>
                  <div
                      className="mt-2 rounded-2xl border border-zinc-200 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800">
                    Servo motors, lidar, grippers...
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Category</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <span
                            key={category}
                            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                        >
                      {category}
                    </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Commercial filters</h3>
                  <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="rounded-2xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      In stock in UK
                    </div>
                    <div className="rounded-2xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      Lead time under 7 days
                    </div>
                    <div className="rounded-2xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      Substitute available
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Technical filters</h3>
                  <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="rounded-2xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      Voltage
                    </div>
                    <div className="rounded-2xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      Interface
                    </div>
                    <div className="rounded-2xl border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                      Payload / torque
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section
                className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div
                  className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts.toLocaleString()} results
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">Recommended for procurement teams in the UK</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Price mode
                    </div>
                    <div className="mt-1 text-sm font-medium">Localized</div>
                  </div>
                  <div
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Sort
                    </div>
                    <div className="mt-1 text-sm font-medium">Availability first</div>
                  </div>
                  <div
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Refresh
                    </div>
                    <div className="mt-1 text-sm font-medium">Page {safePage} of {totalPages}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {products.map((product) => (
                    <article
                        key={product.id}
                        className="rounded-3xl border border-zinc-200 p-5 transition hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                        <span
                            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {product.category}
                        </span>
                            <span
                                className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          {product.badge}
                        </span>
                          </div>
                          <h3 className="mt-3 text-lg font-semibold tracking-tight">{product.name}</h3>
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {product.brand} · {product.id}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {product.specs.map((spec) => (
                                <span
                                    key={spec}
                                    className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                                >
                            {spec}
                          </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-3 sm:min-w-[260px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Localized price
                            </div>
                            <div className="mt-1 text-sm font-semibold">
                              {formatPrice(product.basePrice, product.currency)}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Availability
                            </div>
                            <div className="mt-1 text-sm font-semibold">{product.regionStock}</div>
                          </div>
                          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Lead time
                            </div>
                            <div className="mt-1 text-sm font-semibold">{product.leadTime}</div>
                          </div>
                          <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                              Global stock
                            </div>
                            <div className="mt-1 text-sm font-semibold">{product.stock} units</div>
                          </div>
                        </div>
                      </div>
                    </article>
                ))}
              </div>

              <div
                  className="mt-6 flex flex-col gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Page {safePage} of {totalPages}
                </div>

                <div className="flex items-center gap-3">
                  {previousPageHref ? (
                      <a
                          href={previousPageHref}
                          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                      >
                        Previous
                      </a>
                  ) : (
                      <span
                          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                    Previous
                  </span>
                  )}

                  {nextPageHref ? (
                      <a
                          href={nextPageHref}
                          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                      >
                        Next
                      </a>
                  ) : (
                      <span
                          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                    Next
                  </span>
                  )}
                </div>
              </div>
            </section>

            <aside
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold">Selection detail</h2>
              <div
                  className="mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Active part
                </div>
                <h3 className="mt-2 text-xl font-semibold">NanoMech Model-541</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  High-torque motor suitable for AMR and warehouse automation builds. The detail
                  panel can become a streamed or client-fetched region-specific view later.
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <div className="text-zinc-500 dark:text-zinc-400">Best warehouse</div>
                  <div className="mt-1 font-medium">Birmingham, UK</div>
                </div>
                <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <div className="text-zinc-500 dark:text-zinc-400">Suggested substitute</div>
                  <div className="mt-1 font-medium">RoboTech Series-703</div>
                </div>
                <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <div className="text-zinc-500 dark:text-zinc-400">Persona insight</div>
                  <div className="mt-1 font-medium">Ranked higher due to UK stock and short lead time</div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
  );
}
