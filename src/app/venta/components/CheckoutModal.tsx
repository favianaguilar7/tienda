"use client";

import type React from "react";

interface CheckoutModalProps {
    isOpen: boolean;
    totalAmount: number;
    amountGiven: string;
    hasValidAmount: boolean;
    change: number;
    onAmountChange: (value: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
    onExactAmount: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    totalAmount,
    amountGiven,
    hasValidAmount,
    change,
    onAmountChange,
    onCancel,
    onConfirm,
    onExactAmount,
}) => {
    if (!isOpen) return null;

    return (
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
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
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
                    onChange={(e) => onAmountChange(e.target.value)}
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
                        onClick={onExactAmount}
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
                            <strong>${change.toFixed(2)} MXN</strong>
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
                        onClick={onCancel}
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
                        onClick={onConfirm}
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
    );
};