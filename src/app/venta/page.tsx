"use client";

import { useState } from "react";
import { BarcodeInput } from "./components/BarcodeInput";
import { CartSummary } from "./components/CartSummary";
import { CartTable } from "./components/CartTable";
import { CatalogList } from "./components/CatalogList";
import { useVenta } from "./hooks/useVenta";

export default function VentaPage() {
    const {
        products,
        codeInput,
        cart,
        lastIndex,
        error,
        totalItems,
        totalAmount,
        inputRef,
        loadingProducts,
        setCodeInput,
        addByCode,
        handleCodeKeyDown,
        changeQuantity,
        handleCheckout,
    } = useVenta();

    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [amountGiven, setAmountGiven] = useState("");

    const parsedAmount = Number(amountGiven.replace(",", "."));
    const hasValidAmount = !isNaN(parsedAmount) && parsedAmount >= totalAmount;
    const change = hasValidAmount ? parsedAmount - totalAmount : 0;

    const handleOpenCheckoutModal = () => {
        if (totalItems === 0) {
            // opcional: podrías mostrar un mensaje más elaborado
            alert("No hay productos en el carrito.");
            return;
        }
        setAmountGiven("");
        setIsCheckoutModalOpen(true);
    };

    const handleCancelCheckout = () => {
        setIsCheckoutModalOpen(false);
        setAmountGiven("");
    };

    const handleExactAmount = () => {
        setAmountGiven(totalAmount.toFixed(2));
    };

    const handleConfirmCheckout = async () => {
        if (!hasValidAmount) {
            alert("La cantidad pagada debe ser mayor o igual al total.");
            return;
        }
        await handleCheckout();
        setIsCheckoutModalOpen(false);
        setAmountGiven("");
    };

    return (
        <div
            style={{
                padding: "1.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
            }}
        >
            <h1
                style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                }}
            >
                Punto de venta
            </h1>

            <BarcodeInput
                codeInput={codeInput}
                error={error}
                inputRef={inputRef}
                onChangeCode={setCodeInput}
                onSubmitCode={addByCode}
                onKeyDown={handleCodeKeyDown}
            />

            <CartSummary totalItems={totalItems} totalAmount={totalAmount} />

            <div>
                <button
                    type="button"
                    onClick={handleOpenCheckoutModal}
                    style={{
                        marginTop: "0.5rem",
                        padding: "0.7rem 1.4rem",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#16a34a",
                        color: "white",
                        fontSize: "0.95rem",
                        cursor: "pointer",
                    }}
                >
                    Cobrar / Registrar venta
                </button>
            </div>

            {isCheckoutModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 50,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                            padding: "1.5rem",
                            maxWidth: "400px",
                            width: "100%",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,0.15)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "1.2rem",
                                marginBottom: "0.75rem",
                                fontWeight: 600,
                            }}
                        >
                            Confirmar venta
                        </h2>

                        <p
                            style={{
                                marginBottom: "0.75rem",
                                fontSize: "0.95rem",
                            }}
                        >
                            Total a pagar:{" "}
                            <strong>${totalAmount.toFixed(2)} MXN</strong>
                        </p>

                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.25rem",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                            }}
                        >
                            ¿Con cuánto paga el cliente?
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={amountGiven}
                            onChange={(e) => setAmountGiven(e.target.value)}
                            placeholder="Ej. 100"
                            style={{
                                width: "100%",
                                padding: "0.5rem 0.7rem",
                                borderRadius: "6px",
                                border: "1px solid #d1d5db",
                                fontSize: "0.95rem",
                                marginBottom: "0.5rem",
                            }}
                        />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.75rem",
                                gap: "0.5rem",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleExactAmount}
                                style={{
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    backgroundColor: "white",
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                }}
                            >
                                Cantidad exacta
                            </button>

                            {hasValidAmount && (
                                <span
                                    style={{
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    Cambio:{" "}
                                    <strong>
                                        ${change.toFixed(2)} MXN
                                    </strong>
                                </span>
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "0.5rem",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleCancelCheckout}
                                style={{
                                    padding: "0.45rem 0.9rem",
                                    borderRadius: "6px",
                                    border: "1px solid #d1d5db",
                                    backgroundColor: "white",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmCheckout}
                                style={{
                                    padding: "0.45rem 0.9rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#16a34a",
                                    color: "white",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                }}
                            >
                                Cobrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CartTable
                cart={cart}
                lastIndex={lastIndex}
                onChangeQuantity={changeQuantity}
            />

            <section style={{ marginTop: "2rem" }}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    Catálogo disponible
                </h2>

                {loadingProducts ? (
                    <p>Cargando productos...</p>
                ) : (
                    <CatalogList products={products} />
                )}
            </section>
        </div>
    );
}