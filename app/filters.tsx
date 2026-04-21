import { categories } from "@/app/categories";
import Link from "next/link";

export function getFilters(selectedCategory: string | null) {
    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Link
                    href="/"
                    className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    Reset
                </Link>
            </div>

            <div className="mt-6 space-y-6">
                <div>
                    <h3 className="text-sm font-medium">Category</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            const href = isActive
                                ? "/"
                                : `/?category=${encodeURIComponent(category)}`;

                            return (
                                <a
                                    key={category}
                                    href={href}
                                    className={`rounded-full border px-3 py-1 text-xs transition ${
                                        isActive
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                            : "border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
                                    }`}
                                >
                                    {category}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
