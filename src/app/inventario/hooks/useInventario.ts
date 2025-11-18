"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

interface AddFormState {
    code: string;
    name: string;
    price: string;
    quantity: string;
}

interface EditFormState {
    code: string;
    name: string;
    price: string;
    quantity: string;
}

export const useInventario = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // agregar
    const [addForm, setAddForm] = useState<AddFormState>({
        code: "",
        name: "",
        price: "",
        quantity: "",
    });
    const [savingAdd, setSavingAdd] = useState(false);

    // editar
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EditFormState>({
        code: "",
        name: "",
        price: "",
        quantity: "",
    });
    const [savingEdit, setSavingEdit] = useState(false);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/products");
            const data = await res.json();
            const list: Product[] = data.products || [];

            setProducts(list);
            setFiltered(list);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // filtro
    useEffect(() => {
        const term = search.toLowerCase();
        const f = products.filter(
            (p) =>
                p.code.toLowerCase().includes(term) ||
                p.name.toLowerCase().includes(term)
        );
        setFiltered(f);
    }, [search, products]);

    // ---- Agregar ----
    const handleChangeAddField = (
        field: "code" | "name" | "price" | "quantity",
        value: string
    ) => {
        setAddForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddProduct = async () => {
        const code = addForm.code.trim();
        const name = addForm.name.trim();
        const priceNum = Number(addForm.price);
        const quantityNum = Number(addForm.quantity);

        if (!code || !name || isNaN(priceNum) || isNaN(quantityNum)) {
            setError(
                "Completa código, nombre, precio y cantidad válidos para agregar."
            );
            return;
        }

        try {
            setSavingAdd(true);
            setError(null);

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    name,
                    price: priceNum,
                    quantity: quantityNum,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al agregar producto");
            }

            setAddForm({ code: "", name: "", price: "", quantity: "" });
            await loadProducts();
        } catch (err) {
            console.error(err);
            setError("No se pudo agregar el producto.");
        } finally {
            setSavingAdd(false);
        }
    };

    // ---- Editar ----
    const handleStartEdit = (product: Product) => {
        setEditingId(product.id);
        setEditForm({
            code: product.code,
            name: product.name,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
        });
        setError(null);
    };

    const handleChangeEditField = (
        field: "code" | "name" | "price" | "quantity",
        value: string
    ) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ code: "", name: "", price: "", quantity: "" });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        const code = editForm.code.trim();
        const name = editForm.name.trim();
        const priceNum = Number(editForm.price);
        const quantityNum = Number(editForm.quantity);

        if (!code || !name || isNaN(priceNum) || isNaN(quantityNum)) {
            setError(
                "Completa código, nombre, precio y cantidad válidos para editar."
            );
            return;
        }

        try {
            setSavingEdit(true);
            setError(null);

            const res = await fetch("/api/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingId,
                    code,
                    name,
                    price: priceNum,
                    quantity: quantityNum,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al actualizar producto");
            }

            setEditingId(null);
            setEditForm({ code: "", name: "", price: "", quantity: "" });
            await loadProducts();
        } catch (err) {
            console.error(err);
            setError("No se pudo actualizar el producto.");
        } finally {
            setSavingEdit(false);
        }
    };

    // ---- Eliminar ----
    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este producto?")) return;

        try {
            setError(null);

            const res = await fetch("/api/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al eliminar producto");
            }

            await loadProducts();
        } catch (err) {
            console.error(err);
            setError("No se pudo eliminar el producto.");
        }
    };

    return {
        products,
        filtered,
        search,
        setSearch,
        error,
        loading,
        addForm,
        savingAdd,
        editingId,
        editForm,
        savingEdit,
        // handlers
        loadProducts,
        handleChangeAddField,
        handleAddProduct,
        handleStartEdit,
        handleChangeEditField,
        handleCancelEdit,
        handleSaveEdit,
        handleDelete,
    };
};