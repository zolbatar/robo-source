export function search(selectedCategory: string | null, query: string) {
    return (
        <form method="GET" className="mt-2 space-y-3">
            <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Servo motors, lidar, grippers..."
                className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            />

            {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
            )}

            <button
                type="submit"
                className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
            >
                Apply search
            </button>
        </form>
    );
}
