"use client";

import { useState } from "react";
import { BarcodeInput } from "./components/BarcodeInput";
import { CartSummary } from "./components/CartSummary";
import { CartTable } from "./components/CartTable";
import { CatalogList } from "./components/CatalogList";
import { useVenta } from "./hooks/useVenta";
import { CheckoutModal } from "./components/CheckoutModal";

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

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                totalAmount={totalAmount}
                amountGiven={amountGiven}
                hasValidAmount={hasValidAmount}
                change={change}
                onAmountChange={setAmountGiven}
                onCancel={handleCancelCheckout}
                onConfirm={handleConfirmCheckout}
                onExactAmount={handleExactAmount}
            />

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