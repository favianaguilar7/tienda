import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const SALES_DIR = path.join(process.cwd(), "data", "sales");

export async function GET() {
    try {
        const exists = await fs
            .access(SALES_DIR)
            .then(() => true)
            .catch(() => false);

        if (!exists) {
            return NextResponse.json({ days: [] }, { status: 200 });
        }

        const files = await fs.readdir(SALES_DIR);

        const days = files
            .filter((f) => f.startsWith("ventas-") && f.endsWith(".txt"))
            .map((f) => f.replace("ventas-", "").replace(".txt", ""))
            .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
            .sort((a, b) => (a < b ? 1 : -1)) // más recientes primero
            .slice(0, 5);

        return NextResponse.json({ days }, { status: 200 });
    } catch (error) {
        console.error("Error listando días de ventas:", error);
        return NextResponse.json({ days: [] }, { status: 500 });
    }
}