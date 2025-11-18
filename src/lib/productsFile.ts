import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/types/product";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "products.txt");

export async function readProductsFromFile(): Promise<Product[]> {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf8");

    const products: Product[] = raw
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
        .map((line) => {
            const parts = line.split("|");
            const [id, code, name, priceStr, quantityStr] = parts;

            const price = Number(priceStr);
            const quantity =
                quantityStr !== undefined && quantityStr.trim() !== ""
                    ? Number(quantityStr)
                    : 0;

            return {
                id: id.trim(),
                code: code.trim(),
                name: name.trim(),
                price,
                quantity,
            };
        });

    return products;
}

export async function writeProductsToFile(products: Product[]): Promise<void> {
    const lines = products.map((p) =>
        [p.id, p.code, p.name, p.price.toString(), p.quantity.toString()].join("|")
    );

    await fs.writeFile(DATA_FILE_PATH, lines.join("\n") + "\n", "utf8");
}