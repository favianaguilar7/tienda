import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";

interface SaleItem {
    code: string;
    name: string;
    price: number;
    quantity: number;
}

interface SaleLogLine {
    items: SaleItem[];
    total: number;
    createdAt: string;
    loggedAt?: string;
}

const SALES_DIR = path.join(process.cwd(), "data", "sales");

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ date: string }> }
) {
    const { date } = await context.params;

    // Validar formato básico YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json(
            { error: "Fecha inválida. Usa formato YYYY-MM-DD." },
            { status: 400 }
        );
    }

    const filePath = path.join(SALES_DIR, `ventas-${date}.txt`);

    try {
        const exists = await fs
            .access(filePath)
            .then(() => true)
            .catch(() => false);

        if (!exists) {
            return NextResponse.json(
                { error: "No hay ventas registradas para esa fecha." },
                { status: 404 }
            );
        }

        const raw = await fs.readFile(filePath, "utf8");
        const lines = raw
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        const sales: SaleLogLine[] = lines.map((line) => JSON.parse(line));

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let { width, height } = page.getSize();
        let y = height - 40;
        const lineHeight = 14;

        const ensureSpace = () => {
            if (y < 40) {
                page = pdfDoc.addPage();
                ({ width, height } = page.getSize());
                y = height - 40;
            }
        };

        // Título
        page.drawText(`Reporte de ventas - ${date}`, {
            x: 50,
            y,
            size: 18,
            font,
        });
        y -= 24;

        page.drawText(`Generado: ${new Date().toLocaleString("es-MX")}`, {
            x: 50,
            y,
            size: 10,
            font,
        });
        y -= 20;

        if (sales.length === 0) {
            page.drawText("No hay ventas registradas para este día.", {
                x: 50,
                y,
                size: 12,
                font,
            });
        } else {
            let totalDelDia = 0;

            sales.forEach((sale, index) => {
                totalDelDia += sale.total;

                ensureSpace();
                page.drawText(`Venta #${index + 1}`, {
                    x: 50,
                    y,
                    size: 12,
                    font,
                });
                y -= lineHeight;

                ensureSpace();
                const timeLine = `Creación: ${sale.createdAt}${sale.loggedAt ? ` | Registrada: ${sale.loggedAt}` : ""
                    }`;
                page.drawText(timeLine, {
                    x: 50,
                    y,
                    size: 10,
                    font,
                });
                y -= lineHeight;

                // Encabezado simple
                ensureSpace();
                page.drawText(
                    "Código | Producto | Cant | Precio | Importe",
                    {
                        x: 50,
                        y,
                        size: 10,
                        font,
                    }
                );
                y -= lineHeight;

                sale.items.forEach((item) => {
                    ensureSpace();
                    const importe = item.price * item.quantity;
                    const line = `${item.code} | ${item.name} | ${item.quantity
                        } | $${item.price.toFixed(2)} | $${importe.toFixed(2)}`;
                    page.drawText(line, {
                        x: 50,
                        y,
                        size: 10,
                        font,
                    });
                    y -= lineHeight;
                });

                ensureSpace();
                page.drawText(
                    `Total venta #${index + 1}: $${sale.total.toFixed(2)}`,
                    {
                        x: 50,
                        y,
                        size: 10,
                        font,
                    }
                );
                y -= lineHeight * 2;
            });

            ensureSpace();
            page.drawText(
                `Total del día: $${sales
                    .reduce((s, v) => s + v.total, 0)
                    .toFixed(2)}`,
                {
                    x: 50,
                    y,
                    size: 12,
                    font,
                }
            );
        }

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="reporte-ventas-${date}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generando PDF de ventas:", error);
        return NextResponse.json(
            { error: "No se pudo generar el PDF de ventas" },
            { status: 500 }
        );
    }
}