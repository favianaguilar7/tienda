import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { readProductsFromFile } from "@/lib/productsFile";

export const runtime = "nodejs";

export async function GET() {
    try {
        const products = await readProductsFromFile();

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
        page.drawText("Reporte de Inventario", {
            x: 50,
            y,
            size: 18,
            font,
        });
        y -= 24;

        // Fecha
        page.drawText(`Generado: ${new Date().toLocaleString("es-MX")}`, {
            x: 50,
            y,
            size: 10,
            font,
        });
        y -= 20;

        // Encabezado "tabla"
        page.drawText("ID | Código | Nombre | Cantidad | Precio", {
            x: 50,
            y,
            size: 11,
            font,
        });
        y -= 16;

        const totalProductos = products.length;
        const totalPiezas = products.reduce(
            (sum, p) => sum + (p.quantity ?? 0),
            0
        );

        for (const p of products) {
            ensureSpace();
            const line = `${p.id} | ${p.code} | ${p.name} | ${p.quantity ?? 0
                } | $${p.price.toFixed(2)}`;
            page.drawText(line, {
                x: 50,
                y,
                size: 10,
                font,
            });
            y -= lineHeight;
        }

        y -= 20;
        ensureSpace();
        page.drawText(
            `Total productos: ${totalProductos} | Total piezas: ${totalPiezas}`,
            {
                x: 50,
                y,
                size: 11,
                font,
            }
        );

        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = pdfBytes.buffer as ArrayBuffer;
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition":
                    'inline; filename="reporte-inventario.pdf"',
            },
        });
    } catch (error) {
        console.error("Error generando PDF de inventario:", error);
        return NextResponse.json(
            { error: "No se pudo generar el PDF de inventario" },
            { status: 500 }
        );
    }
}