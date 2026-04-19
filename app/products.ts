import rawProducts from "@/data/products.json";

type RawProduct = {
    ProductID: string;
    ProductName: string;
    Category: string;
    Brand: string;
    Price: number;
    InStock: number;
    Currency: string;
};

export type Product = {
    id: string;
    name: string;
    category: string;
    brand: string;
    basePrice: number;
    currency: string;
    stock: number;
    regionStock: string;
    leadTime: string;
    badge: string;
    specs: string[];
};

export const allProducts = rawProducts as RawProduct[];

/*
 * The following code randomly enriches the core data to make it more interesting.
 * This just compensates for the lack of real-world data, in reality rich data
 * would already be available.
 */
function stringSeed(input: string): number {
    return input.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function pickFrom<T>(items: T[], seed: number): T {
    return items[seed % items.length];
}

function generateSpecs(raw: RawProduct): string[] {
    const seed = stringSeed(raw.ProductID);

    switch (raw.Category) {
        case "Motors": {
            const voltages = ["24V", "48V", "72V"];
            const torque = ["1.8 Nm", "2.1 Nm", "3.5 Nm"];
            const interfaceTypes = ["CANopen", "EtherCAT", "Modbus"];
            return [
                pickFrom(voltages, seed),
                pickFrom(torque, seed + 1),
                pickFrom(interfaceTypes, seed + 2),
            ];
        }
        case "Controllers": {
            const mountTypes = ["DIN mount", "Panel mount", "Compact"];
            const buses = ["EtherCAT", "PROFINET", "CAN bus"];
            const cpuClasses = ["ARM A53", "Quad-core", "Edge-ready"];
            return [
                pickFrom(mountTypes, seed),
                pickFrom(buses, seed + 1),
                pickFrom(cpuClasses, seed + 2),
            ];
        }
        case "Sensors": {
            const protection = ["IP65", "IP67", "Factory-rated"];
            const voltages = ["12V", "24V", "PoE"];
            const latency = ["Low latency", "Industrial", "High precision"];
            return [
                pickFrom(protection, seed),
                pickFrom(voltages, seed + 1),
                pickFrom(latency, seed + 2),
            ];
        }
        case "Grippers": {
            const payloads = ["3 kg payload", "6 kg payload", "12 kg payload"];
            const voltages = ["24V", "48V", "Pneumatic-ready"];
            const compat = ["ROS 2", "Cobot-ready", "AMR-ready"];
            return [
                pickFrom(payloads, seed),
                pickFrom(voltages, seed + 1),
                pickFrom(compat, seed + 2),
            ];
        }
        case "Cables": {
            const connectors = ["M8", "M12", "RJ45 industrial"];
            const shielding = ["Shielded", "Drag-chain rated", "EMI protected"];
            const lengths = ["1m", "2m", "5m"];
            return [
                pickFrom(connectors, seed),
                pickFrom(shielding, seed + 1),
                pickFrom(lengths, seed + 2),
            ];
        }
        case "Frames": {
            const materials = ["Aluminium", "Steel", "Lightweight alloy"];
            const sizes = ["400 mm", "600 mm", "900 mm"];
            const ratings = ["Modular", "High rigidity", "Machine-cell ready"];
            return [
                pickFrom(materials, seed),
                pickFrom(sizes, seed + 1),
                pickFrom(ratings, seed + 2),
            ];
        }
        case "Cameras": {
            const resolutions = ["1080p", "4MP", "8MP"];
            const interfaces = ["GigE", "USB 3", "MIPI"];
            const features = ["Global shutter", "Low light", "Vision-ready"];
            return [
                pickFrom(resolutions, seed),
                pickFrom(interfaces, seed + 1),
                pickFrom(features, seed + 2),
            ];
        }
        case "Microcontrollers": {
            const cores = ["ARM Cortex-M4", "ARM Cortex-M7", "Dual-core MCU"];
            const memory = ["512 KB Flash", "1 MB Flash", "2 MB Flash"];
            const io = ["SPI / I2C", "CAN bus", "Low-power I/O"];
            return [
                pickFrom(cores, seed),
                pickFrom(memory, seed + 1),
                pickFrom(io, seed + 2),
            ];
        }
        case "Wheels": {
            const sizes = ["4 in", "6 in", "8 in"];
            const materials = ["Polyurethane", "Rubber", "Anti-static"];
            const uses = ["AMR-ready", "Indoor use", "Heavy-duty"];
            return [
                pickFrom(sizes, seed),
                pickFrom(materials, seed + 1),
                pickFrom(uses, seed + 2),
            ];
        }
        default:
            return ["Industrial", "Robotics", "Component"];
    }
}

function generateLeadTime(raw: RawProduct): string {
    const seed = stringSeed(raw.ProductID);
    const days = [2, 3, 5, 7, 10][seed % 5];
    return `${days} days`;
}

function generateBadge(raw: RawProduct): string {
    const seed = stringSeed(raw.ProductID);

    const badgesByCategory: Record<string, string[]> = {
        Motors: ["Trending for AMR", "High torque", "Warehouse automation"],
        Controllers: ["Integrator pick", "Fast-moving", "Low stock"],
        Sensors: ["Low latency I/O", "Factory-ready", "Popular in UK"],
        Grippers: ["Short lead time", "Popular in UK", "Top seller"],
        Cables: ["Ships from UK", "High demand", "Field-service ready"],
        Frames: ["Machine-cell ready", "Modular build", "Popular in EU"],
        Cameras: ["Vision pipeline", "Low-light capable", "Inspection-ready"],
        Microcontrollers: ["Embedded control", "Compact compute", "Edge-ready"],
        Wheels: ["AMR platform", "Warehouse-ready", "Heavy-duty"],
    };

    const options = badgesByCategory[raw.Category] ?? ["Industrial"];
    return pickFrom(options, seed);
}

function generateRegionStock(raw: RawProduct): string {
    const seed = stringSeed(raw.ProductID);
    const regions = ["UK warehouse", "EU warehouse", "US warehouse"];
    const region = regions[seed % regions.length];
    const localStock = Math.max(5, Math.floor(raw.InStock * (((seed % 20) + 5) / 100)));
    return `${region}: ${localStock} units`;
}

export function enrichProduct(raw: RawProduct): Product {
    return {
        id: raw.ProductID,
        name: raw.ProductName,
        category: raw.Category,
        brand: raw.Brand,
        basePrice: raw.Price,
        currency: raw.Currency,
        stock: raw.InStock,
        regionStock: generateRegionStock(raw),
        leadTime: generateLeadTime(raw),
        badge: generateBadge(raw),
        specs: generateSpecs(raw),
    };
}
