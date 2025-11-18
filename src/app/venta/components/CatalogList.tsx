import type { Product } from "@/types/product";

interface CatalogListProps {
    products: Product[];
}

export const CatalogList: React.FC<CatalogListProps> = ({ products }) => {
    return (
        <section style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {products.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            padding: "0.6rem 0.8rem",
                            minWidth: "220px",
                        }}
                    >
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                            Código: {p.code}
                        </div>
                        <div style={{ fontSize: "0.9rem", marginTop: "0.3rem" }}>
                            ${p.price.toFixed(2)} MXN
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};