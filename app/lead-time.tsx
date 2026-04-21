import type { Product } from "@/app/products";
import { LocalisationKey } from "@/app/localisation";

export function getLeadTimeRegion(product: Product): string | null {
    const match = product.regionStock.match(/^(UK|EU|US) warehouse:/);
    return match?.[1] ?? null;
}

export function formatLeadTime(
    baseLeadTime: string,
    productRegion: string | null,
    selectedRegion: LocalisationKey,
) {
    const baseDays = Number.parseInt(baseLeadTime, 10);
    if (Number.isNaN(baseDays)) {
        return baseLeadTime;
    }

    if (!productRegion || productRegion !== selectedRegion) {
        const extraDays = 3;
        return `${baseDays + extraDays} days`;
    }

    return baseLeadTime;
}
