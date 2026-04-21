import { Product } from "@/app/products";
import { formatLeadTime, getLeadTimeRegion } from "@/app/lead-time";
import { LocalisationKey } from "@/app/localisation";

export function getSelectionDetail(
    selectedProduct: Product,
    localisationKey: LocalisationKey,
) {
    return (
        <aside className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold">Selection detail</h2>

            {selectedProduct ? (
                <>
                    <div className="mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            Active part
                        </div>
                        <h3 className="mt-2 text-xl font-semibold">
                            {selectedProduct.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            {selectedProduct.brand} · {selectedProduct.id} ·{" "}
                            {selectedProduct.category}
                        </p>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Lead time:{" "}
                            {formatLeadTime(
                                selectedProduct.leadTime,
                                getLeadTimeRegion(selectedProduct),
                                localisationKey,
                            )}
                        </p>
                    </div>
                </>
            ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    No products match the current filter.
                </div>
            )}
        </aside>
    );
}
