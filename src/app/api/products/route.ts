import { NextResponse } from "next/server";
import { readProductsFromFile, writeProductsToFile } from "@/lib/productsFile";
import type { Product } from "@/types/product";

// GET: leer todos los productos
export async function GET() {
    try {
        const products = await readProductsFromFile();
        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error leyendo products.txt:", error);
        return NextResponse.json(
            { error: "No se pudieron leer los productos" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, name, price, quantity } = body as {
            code?: string;
            name?: string;
            price?: number;
            quantity?: number;
        };

        if (!code || !name || typeof price !== "number") {
            return NextResponse.json(
                { error: "Datos inválidos para crear producto" },
                { status: 400 }
            );
        }

        const products = await readProductsFromFile();

        const maxId = products.reduce(
            (max, p) => Math.max(max, Number(p.id) || 0),
            0
        );

        const newProduct: Product = {
            id: String(maxId + 1),
            code,
            name,
            price,
            // 👇 si no mandas quantity, se va en 0. Puede ser negativo sin problema.
            quantity: typeof quantity === "number" ? quantity : 0,
        };

        products.push(newProduct);
        await writeProductsToFile(products);

        return NextResponse.json({ product: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Error creando producto:", error);
        return NextResponse.json(
            { error: "No se pudo crear el producto" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, code, name, price, quantity } = body as {
            id?: string;
            code?: string;
            name?: string;
            price?: number;
            quantity?: number;
        };

        if (
            !id ||
            !code ||
            !name ||
            typeof price !== "number" ||
            typeof quantity !== "number"
        ) {
            return NextResponse.json(
                { error: "Datos inválidos para actualizar producto" },
                { status: 400 }
            );
        }

        const products = await readProductsFromFile();
        const idx = products.findIndex((p) => p.id === id);

        if (idx === -1) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        products[idx] = { id, code, name, price, quantity };
        await writeProductsToFile(products);

        return NextResponse.json({ product: products[idx] });
    } catch (error) {
        console.error("Error actualizando producto:", error);
        return NextResponse.json(
            { error: "No se pudo actualizar el producto" },
            { status: 500 }
        );
    }
}

// DELETE: eliminar producto
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = body as { id?: string };

        if (!id) {
            return NextResponse.json(
                { error: "ID requerido para eliminar producto" },
                { status: 400 }
            );
        }

        const products = await readProductsFromFile();
        const newProducts = products.filter((p) => p.id !== id);

        if (newProducts.length === products.length) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        await writeProductsToFile(newProducts);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error eliminando producto:", error);
        return NextResponse.json(
            { error: "No se pudo eliminar el producto" },
            { status: 500 }
        );
    }
}