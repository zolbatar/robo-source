import {categories} from "@/app/categories";
import Link from "next/link";

export function getFilters(selectedCategory: string | null, query: string) {
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
                        <a
                            href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
                            className={`rounded-full border px-3 py-1 text-xs ${
                                !selectedCategory
                                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                    : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                            }`}
                        >
                            All
                        </a>

                        {categories.map((category) => {
                            const params = new URLSearchParams();
                            if (query) params.set("q", query);
                            params.set("category", category);

                            const href = `/?${params.toString()}`;
                            const isActive = selectedCategory === category;

                            return (
                                <a
                                    key={category}
                                    href={href}
                                    className={`rounded-full border px-3 py-1 text-xs ${
                                        isActive
                                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                            : "border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
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
