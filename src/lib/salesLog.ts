import { promises as fs } from "fs";
import path from "path";
import type { SalePayload } from "@/types/sale";
import { readProductsFromFile, writeProductsToFile } from "@/lib/productsFile";

const SALES_DIR = path.join(process.cwd(), "data", "sales");

export async function logSaleToFile(sale: SalePayload) {
    // 1) Aseguramos carpeta de ventas
    await fs.mkdir(SALES_DIR, { recursive: true });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const filePath = path.join(SALES_DIR, `ventas-${dateStr}.txt`);

    const logEntry = {
        ...sale,
        loggedAt: now.toISOString(),
    };

    const line = JSON.stringify(logEntry) + "\n";

    // 2) Actualizar inventario (restar cantidades)
    await applySaleToInventory(sale);

    // 3) Guardar log (append)
    await fs.appendFile(filePath, line, "utf8");
}

// 👇 Helper que aplica la venta al inventario
async function applySaleToInventory(sale: SalePayload) {
    const products = await readProductsFromFile();

    const updated = products.map((p) => {
        const item = sale.items.find((i) => i.code === p.code);
        if (!item) return p;

        // Restamos la cantidad vendida
        // Puede quedar en negativo sin problema (como tú dijiste)
        return {
            ...p,
            quantity: (p.quantity ?? 0) - item.quantity,
        };
    });

    await writeProductsToFile(updated);
}