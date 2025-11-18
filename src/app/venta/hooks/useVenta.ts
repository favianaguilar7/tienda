"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";
import type { SalePayload } from "@/types/sale";

export const useVenta = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [codeInput, setCodeInput] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [lastIndex, setLastIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // --- Cargar productos del inventario ---
    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los productos");
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
        loadProducts();
    }, []);

    // --- Agregar al carrito por código ---
    const addByCode = () => {
        const code = codeInput.trim();
        if (!code) return;

        const product = products.find((p) => p.code === code);

        if (!product) {
            setError(`No se encontró el producto con código "${code}"`);
            setCodeInput("");
            inputRef.current?.focus();
            return;
        }

        setError(null);

        setCart((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.product.code === product.code
            );

            let newCart: CartItem[];

            if (existingIndex !== -1) {
                newCart = [...prev];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    quantity: newCart[existingIndex].quantity + 1,
                };
                setLastIndex(existingIndex);
            } else {
                newCart = [...prev, { product, quantity: 1 }];
                setLastIndex(newCart.length - 1);
            }

            return newCart;
        });

        setCodeInput("");
        inputRef.current?.focus();
    };

    // Por si quieres usarlo en el input directamente
    const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addByCode();
        }
    };

    // --- Cambiar cantidad en el carrito ---
    const changeQuantity = (index: number, delta: number) => {
        setCart((prev) => {
            const newCart = [...prev];
            const item = newCart[index];

            if (!item) return prev;

            const newQty = item.quantity + delta;

            if (newQty <= 0) {
                newCart.splice(index, 1);
                return newCart;
            }

            newCart[index] = { ...item, quantity: newQty };
            return newCart;
        });

        setLastIndex(index);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
    );

    // --- Cobrar: log de venta + restar inventario ---
    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError("No hay productos en el carrito.");
            return;
        }

        const sale: SalePayload = {
            items: cart.map((item) => ({
                code: item.product.code,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            })),
            total: totalAmount,
            createdAt: new Date().toISOString(),
        };

        try {
            const res = await fetch("/api/sales/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sale),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Error al registrar la venta");
            }

            // Limpiar carrito y recargar inventario
            setCart([]);
            setLastIndex(null);
            setError(null);
            setCodeInput("");
            inputRef.current?.focus();

            await loadProducts(); // ⬅️ inventario actualizado (con cantidades restadas)
        } catch (err) {
            console.error(err);
            setError("No se pudo registrar la venta. Intenta de nuevo.");
        }
    };

    return {
        // estados
        products,
        codeInput,
        cart,
        lastIndex,
        error,
        loadingProducts,
        totalItems,
        totalAmount,
        inputRef,
        // acciones
        setCodeInput,
        setError,
        addByCode,
        handleCodeKeyDown,
        changeQuantity,
        handleCheckout,
        loadProducts,
    };
};