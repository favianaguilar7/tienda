import type { CartItem } from "@/types/cart";

interface CartTableProps {
    cart: CartItem[];
    lastIndex: number | null;
    onChangeQuantity: (index: number, delta: number) => void;
}

export const CartTable: React.FC<CartTableProps> = ({
    cart,
    lastIndex,
    onChangeQuantity,
}) => {
    if (cart.length === 0) {
        return (
            <section>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Carrito</h2>
                <p style={{ color: "#6b7280" }}>
                    Aún no hay productos en el carrito. Escanea o escribe un código.
                </p>
            </section>
        );
    }

    return (
        <section>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Carrito</h2>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.95rem",
                }}
            >
                <thead>
                    <tr
                        style={{
                            borderBottom: "1px solid #e5e7eb",
                            textAlign: "left",
                        }}
                    >
                        <th style={{ padding: "0.5rem" }}>Código</th>
                        <th style={{ padding: "0.5rem" }}>Producto</th>
                        <th style={{ padding: "0.5rem", textAlign: "right" }}>Precio</th>
                        <th style={{ padding: "0.5rem", textAlign: "center" }}>Cantidad</th>
                        <th style={{ padding: "0.5rem", textAlign: "right" }}>Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => {
                        const isLast = index === lastIndex;

                        return (
                            <tr
                                key={item.product.id}
                                style={{
                                    borderBottom: "1px solid #f3f4f6",
                                    backgroundColor: isLast ? "#eef2ff" : "transparent",
                                }}
                            >
                                <td style={{ padding: "0.5rem" }}>{item.product.code}</td>
                                <td style={{ padding: "0.5rem" }}>{item.product.name}</td>
                                <td style={{ padding: "0.5rem", textAlign: "right" }}>
                                    ${item.product.price.toFixed(2)}
                                </td>
                                <td
                                    style={{
                                        padding: "0.5rem",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => onChangeQuantity(index, -1)}
                                        style={{
                                            padding: "0.1rem 0.4rem",
                                            marginRight: "0.3rem",
                                            borderRadius: "4px",
                                            border: "1px solid #d1d5db",
                                            background: "white",
                                            cursor: "pointer",
                                        }}
                                    >
                                        -
                                    </button>
                                    <span
                                        style={{
                                            minWidth: "2rem",
                                            display: "inline-block",
                                        }}
                                    >
                                        {item.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onChangeQuantity(index, 1)}
                                        style={{
                                            padding: "0.1rem 0.4rem",
                                            marginLeft: "0.3rem",
                                            borderRadius: "4px",
                                            border: "1px solid #d1d5db",
                                            background: "white",
                                            cursor: "pointer",
                                        }}
                                    >
                                        +
                                    </button>
                                </td>
                                <td style={{ padding: "0.5rem", textAlign: "right" }}>
                                    {(item.quantity * item.product.price).toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
};