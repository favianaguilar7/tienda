"use client";

import { useEffect, useState } from "react";
import { InventorySearchBar } from "./components/InventorySearchBar";
import { AddProductForm } from "./components/AddProductForm";
import { InventoryTable } from "./components/InventoryTable";
import { useInventario } from "./hooks/useInventario";
import { InventoryReportsSection } from "./components/InventoryReportsSection";

export default function InventarioPage() {
    const {
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
        loadProducts,
        handleChangeAddField,
        handleAddProduct,
        handleStartEdit,
        handleChangeEditField,
        handleCancelEdit,
        handleSaveEdit,
        handleDelete,
    } = useInventario();

    return (
        <div
            style={{
                padding: "1.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <h1
                style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                }}
            >
                Inventario
            </h1>

            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                Listado de productos cargados desde Aquí
                puedes agregar, editar y eliminar productos.
            </p>

            <InventorySearchBar
                search={search}
                onChangeSearch={setSearch}
                onRefresh={loadProducts}
            />

            <AddProductForm
                form={addForm}
                saving={savingAdd}
                onChangeField={handleChangeAddField}
                onSubmit={handleAddProduct}
            />

            <InventoryReportsSection />

            {loading && <p>Cargando productos...</p>}

            {error && (
                <p style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{error}</p>
            )}

            {!loading && !error && (
                <>
                    <div style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
                        Total productos: <strong>{products.length}</strong> | Coincidencias:{" "}
                        <strong>{filtered.length}</strong>
                    </div>

                    <InventoryTable
                        products={filtered}
                        editingId={editingId}
                        editForm={editForm}
                        onStartEdit={handleStartEdit}
                        onChangeEditField={handleChangeEditField}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onDelete={handleDelete}
                    />

                    {(savingEdit || savingAdd) && (
                        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                            Guardando cambios...
                        </p>
                    )}
                </>
            )}
        </div>
    );
}