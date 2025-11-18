"use client";

import type React from "react";
import { RefObject } from "react";

interface BarcodeInputProps {
    codeInput: string;
    error: string | null;
    inputRef: RefObject<HTMLInputElement | null>;
    onChangeCode: (value: string) => void;
    onSubmitCode: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const BarcodeInput: React.FC<BarcodeInputProps> = ({
    codeInput,
    error,
    inputRef,
    onChangeCode,
    onSubmitCode,
    onKeyDown,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (onKeyDown) {
            onKeyDown(e);
            return;
        }
        if (e.key === "Enter") {
            onSubmitCode();
        }
    };

    return (
        <section
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxWidth: "500px",
            }}
        >
            <label style={{ fontWeight: 500 }}>
                Código de producto (lector / manual):
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={codeInput}
                    onChange={(e) => onChangeCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escanea o escribe el código y presiona Enter"
                    style={{
                        flex: 1,
                        padding: "0.6rem 0.8rem",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        outline: "none",
                    }}
                />
                <button
                    type="button"
                    onClick={onSubmitCode}
                    style={{
                        padding: "0.6rem 1rem",
                        fontSize: "0.9rem",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#111827",
                        color: "white",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                    }}
                >
                    Agregar
                </button>
            </div>
            {error && (
                <span style={{ color: "#b91c1c", fontSize: "0.9rem" }}>{error}</span>
            )}
        </section>
    );
};