import type { Product } from "@/types/product";

interface InventoryTableProps {
    products: Product[];
    editingId: string | null;
    editForm: {
        code: string;
        name: string;
        price: string;
        quantity: string;
    };
    onStartEdit: (product: Product) => void;
    onChangeEditField: (field: "code" | "name" | "price" | "quantity", value: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (id: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
    products,
    editingId,
    editForm,
    onStartEdit,
    onChangeEditField,
    onSaveEdit,
    onCancelEdit,
    onDelete,
}) => {
    if (products.length === 0) {
        return <p style={{ color: "#6b7280" }}>No hay productos cargados.</p>;
    }

    return (
        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.95rem",
                marginTop: "1rem",
            }}
        >
            <thead>
                <tr
                    style={{
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: "left",
                    }}
                >
                    <th style={{ padding: "0.5rem" }}>ID</th>
                    <th style={{ padding: "0.5rem" }}>Código</th>
                    <th style={{ padding: "0.5rem" }}>Nombre</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Cantidad</th>
                    <th style={{ padding: "0.5rem", textAlign: "right" }}>Precio</th>
                    <th style={{ padding: "0.5rem", textAlign: "center" }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {products.map((p) => {
                    const isEditing = p.id === editingId;

                    return (
                        <tr
                            key={p.id}
                            style={{
                                borderBottom: "1px solid #f3f4f6",
                            }}
                        >
                            <td style={{ padding: "0.5rem" }}>{p.id}</td>

                            {/* Código */}
                            <td style={{ padding: "0.5rem" }}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.code}
                                        onChange={(e) =>
                                            onChangeEditField("code", e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "0.2rem 0.3rem",
                                            fontSize: "0.9rem",
                                        }}
                                    />
                                ) : (
                                    p.code
                                )}
                            </td>

                            {/* Nombre */}
                            <td style={{ padding: "0.5rem" }}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) =>
                                            onChangeEditField("name", e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "0.2rem 0.3rem",
                                            fontSize: "0.9rem",
                                        }}
                                    />
                                ) : (
                                    p.name
                                )}
                            </td>

                            {/* Cantidad */}
                            <td style={{ padding: "0.5rem", textAlign: "right" }}>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="1"
                                        value={editForm.quantity}
                                        onChange={(e) => onChangeEditField("quantity", e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.2rem 0.3rem",
                                            fontSize: "0.9rem",
                                            textAlign: "right",
                                        }}
                                    />
                                ) : (
                                    p.quantity
                                )}
                            </td>

                            {/* Precio */}
                            <td style={{ padding: "0.5rem", textAlign: "right" }}>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.price}
                                        onChange={(e) =>
                                            onChangeEditField("price", e.target.value)
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "0.2rem 0.3rem",
                                            fontSize: "0.9rem",
                                            textAlign: "right",
                                        }}
                                    />
                                ) : (
                                    `$${p.price.toFixed(2)}`
                                )}
                            </td>

                            {/* Acciones */}
                            <td
                                style={{
                                    padding: "0.5rem",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={onSaveEdit}
                                            style={{
                                                padding: "0.2rem 0.5rem",
                                                marginRight: "0.3rem",
                                                borderRadius: "4px",
                                                border: "none",
                                                backgroundColor: "#16a34a",
                                                color: "white",
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onCancelEdit}
                                            style={{
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "4px",
                                                border: "1px solid #d1d5db",
                                                backgroundColor: "white",
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => onStartEdit(p)}
                                            style={{
                                                padding: "0.2rem 0.5rem",
                                                marginRight: "0.3rem",
                                                borderRadius: "4px",
                                                border: "1px solid #d1d5db",
                                                backgroundColor: "white",
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(p.id)}
                                            style={{
                                                padding: "0.2rem 0.5rem",
                                                borderRadius: "4px",
                                                border: "none",
                                                backgroundColor: "#b91c1c",
                                                color: "white",
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};