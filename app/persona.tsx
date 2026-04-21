export function selectPersona(selectedPersona: string, query: string, selectedCategory: string | null, selectedLocale: string) {
    return <form method="GET" className="flex items-center gap-2">
        <span>This is a persona selection form for the product browser (passes into via URL):</span>
        <select
            name="persona"
            defaultValue={selectedPersona}
            className="rounded-xl border px-3 py-2 text-sm"
        >
            <option value="procurement">Procurement</option>
            <option value="engineer">Engineer</option>
            <option value="field">Field repair</option>
        </select>

        {/* preserve existing filters */}
        {query && <input type="hidden" name="q" value={query}/>}
        {selectedCategory && <input type="hidden" name="category" value={selectedCategory}/>}
        <input type="hidden" name="locale" value={selectedLocale}/>

        <button type="submit">Apply</button>
    </form>
}