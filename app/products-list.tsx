import { formatLeadTime, getLeadTimeRegion } from "@/app/lead-time";
import { Product } from "@/app/products";
import { Localisation, LocalisationKey } from "@/app/localisation";
import { formatPrice } from "@/app/pricing";

export function getProductsList(
    products: Product[],
    selectedProduct: Product | null,
    setSelectedProductId: (productId: string) => void,
    localisationKey: LocalisationKey,
    localisation: Localisation,
) {
    return (
        <div className="mt-5 grid gap-4">
            {products.map((product) => {
                const isSelected = product.id === selectedProduct?.id;
                const productRegion = getLeadTimeRegion(product);
                const leadTime = formatLeadTime(
                    product.leadTime,
                    productRegion,
                    localisationKey,
                );

                return (
                    <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelectedProductId(product.id)}
                        className={`rounded-3xl border p-5 text-left transition ${
                            isSelected
                                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
                                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                        }`}
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {product.category}
                                    </span>
                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                        {product.badge}
                                    </span>
                                    {isSelected ? (
                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            Selected
                                        </span>
                                    ) : null}
                                </div>

                                <h3 className="mt-3 text-lg font-semibold tracking-tight">
                                    {product.name}
                                </h3>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                                    {product.brand} · {product.id}
                                </p>
                            </div>

                            <div className="grid gap-3 sm:min-w-65 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Localised price
                                    </div>
                                    <div className="mt-1 text-sm font-semibold">
                                        {formatPrice(
                                            product.basePrice,
                                            localisation,
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Availability
                                    </div>
                                    <div className="mt-1 text-sm font-semibold">
                                        {product.regionStock}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Lead time
                                    </div>
                                    <div className="mt-1 text-sm font-semibold">
                                        {leadTime}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                                    <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Global stock
                                    </div>
                                    <div className="mt-1 text-sm font-semibold">
                                        {product.stock} units
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
