import { Localisation } from "@/app/localisation";

export function formatPrice(priceUsd: number, target: Localisation) {
    const converted = priceUsd * target.rateFromUsd;

    return new Intl.NumberFormat(target.locale, {
        style: "currency",
        currency: target.currency,
    }).format(converted);
}
