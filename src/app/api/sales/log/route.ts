import { NextResponse } from "next/server";
import { logSaleToFile } from "@/lib/salesLog";
import type { SalePayload } from "@/types/sale";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SalePayload;

        // Validación básica
        if (!body || !Array.isArray(body.items) || typeof body.total !== "number") {
            return NextResponse.json(
                { error: "Datos de venta inválidos" },
                { status: 400 }
            );
        }

        await logSaleToFile(body);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error registrando venta:", error);
        return NextResponse.json(
            { error: "No se pudo registrar la venta" },
            { status: 500 }
        );
    }
}