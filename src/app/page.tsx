import Link from "next/link";

export default function HomePage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Tienda</h1>
            <p style={{ color: "#6b7280" }}>Selecciona una opción para comenzar.</p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <Link
                    href="/venta"
                    style={{
                        padding: "0.8rem 1.4rem",
                        borderRadius: "8px",
                        backgroundColor: "#111827",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "1rem",
                    }}
                >
                    Pantalla de venta
                </Link>

                <Link
                    href="/inventario"
                    style={{
                        padding: "0.8rem 1.4rem",
                        borderRadius: "8px",
                        backgroundColor: "#4b5563",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "1rem",
                    }}
                >
                    Inventario
                </Link>
            </div>
        </main>
    );
}