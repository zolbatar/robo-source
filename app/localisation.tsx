export type LocalisationKey = "EU" | "UK" | "US" | "Japan";

export type Localisation = {
    label: string;
    currency: "EUR" | "GBP" | "USD" | "JPY";
    locale: string;
    rateFromUsd: number;
};

export const localisationOptions: Array<{
    key: LocalisationKey;
    value: Localisation;
}> = [
    {
        key: "EU",
        value: {
            label: "EU",
            currency: "EUR",
            locale: "en-IE",
            rateFromUsd: 0.92,
        },
    },
    {
        key: "UK",
        value: {
            label: "UK",
            currency: "GBP",
            locale: "en-GB",
            rateFromUsd: 0.79,
        },
    },
    {
        key: "US",
        value: {
            label: "US",
            currency: "USD",
            locale: "en-US",
            rateFromUsd: 1.0,
        },
    },
    {
        key: "Japan",
        value: {
            label: "Japan",
            currency: "JPY",
            locale: "ja-JP",
            rateFromUsd: 155,
        },
    },
];

export const localisations: Record<LocalisationKey, Localisation> =
    localisationOptions.reduce(
        (acc, option) => {
            acc[option.key] = option.value;
            return acc;
        },
        {} as Record<LocalisationKey, Localisation>,
    );

const warehouseByKey: Record<LocalisationKey, string> = {
    US: "US warehouse",
    UK: "UK warehouse",
    EU: "EU warehouse",
    Japan: "Japan warehouse",
};

export const localeConfig: Record<
    LocalisationKey,
    {
        currency: Localisation["currency"];
        rate: number;
        label: string;
        warehouse: string;
    }
> = (Object.keys(localisations) as LocalisationKey[]).reduce((acc, key) => {
    const loc = localisations[key];

    acc[key] = {
        currency: loc.currency,
        rate: loc.rateFromUsd,
        label: `${loc.label} · ${loc.currency}`,
        warehouse: warehouseByKey[key],
    };

    return acc;
}, {} as Record<LocalisationKey, {
    currency: Localisation["currency"];
    rate: number;
    label: string;
    warehouse: string;
}>);