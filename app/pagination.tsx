export function paginationControl(
    previousPageHref: string | null,
    nextPageHref: string | null,
    safePage: number,
    totalPages: number,
) {
    return (
        <div className="mt-5 flex items-center justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
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
                ) : null}

                {nextPageHref ? (
                    <a
                        href={nextPageHref}
                        className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
                    >
                        Next
                    </a>
                ) : null}
            </div>
        </div>
    );
}
