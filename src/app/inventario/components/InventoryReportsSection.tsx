"use client";

import { useEffect, useState } from "react";

export const InventoryReportsSection: React.FC = () => {
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [loadingDays, setLoadingDays] = useState<boolean>(false);

    useEffect(() => {
        const loadAvailableDays = async () => {
            try {
                setLoadingDays(true);
                const res = await fetch("/api/reports/sales/available-days");
                if (!res.ok) {
                    throw new Error("Error al cargar días de ventas");
                }
                const data = await res.json();
                setAvailableDays(Array.isArray(data.days) ? data.days : []);
            } catch (err) {
                console.error(err);
                setAvailableDays([]);
            } finally {
                setLoadingDays(false);
            }
        };

        loadAvailableDays();
    }, []);

    return (
        <section
            style={{
                marginTop: "1rem",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                maxWidth: "600px",
            }}
        >
            <h2
                style={{
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                }}
            >
                Reportes en PDF
            </h2>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                }}
            >
                <div>
                    <button
                        type="button"
                        onClick={() => window.open("/api/reports/inventory", "_blank")}
                        style={{
                            padding: "0.5rem 0.9rem",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#111827",
                            color: "white",
                            fontSize: "0.9rem",
                            cursor: "pointer",
                        }}
                    >
                        Imprimir inventario completo
                    </button>
                </div>

                <div>
                    <div
                        style={{
                            fontSize: "0.9rem",
                            marginBottom: "0.3rem",
                        }}
                    >
                        Ventas por día (últimos 5 días disponibles)
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                        }}
                    >
                        {loadingDays ? (
                            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                                Cargando días disponibles...
                            </span>
                        ) : availableDays.length === 0 ? (
                            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                                No hay ventas registradas en los últimos días.
                            </span>
                        ) : (
                            availableDays.map((date) => (
                                <button
                                    key={date}
                                    type="button"
                                    onClick={() =>
                                        window.open(`/api/reports/sales/${date}`, "_blank")
                                    }
                                    style={{
                                        padding: "0.4rem 0.8rem",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        backgroundColor: "white",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    {date}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};