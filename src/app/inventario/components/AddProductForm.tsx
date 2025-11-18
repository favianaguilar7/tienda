interface AddProductFormState {
    code: string;
    name: string;
    price: string;
    quantity: string;
}

interface AddProductFormProps {
    form: AddProductFormState;
    saving: boolean;
    onChangeField: (field: "code" | "name" | "price" | "quantity", value: string) => void;
    onSubmit: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
    form,
    saving,
    onChangeField,
    onSubmit,
}) => {
    return (
        <div
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
                Agregar producto
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 2fr 1fr 1fr auto", // 👈 antes eran 3 + botón
                    gap: "0.5rem",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Código"
                    value={form.code}
                    onChange={(e) => onChangeField("code", e.target.value)}
                    style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        fontSize: "0.9rem",
                    }}
                />
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => onChangeField("name", e.target.value)}
                    style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        fontSize: "0.9rem",
                    }}
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={form.price}
                    onChange={(e) => onChangeField("price", e.target.value)}
                    style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        fontSize: "0.9rem",
                    }}
                />
                <input
                    type="number"
                    step="1"
                    placeholder="Cantidad"
                    value={form.quantity}
                    onChange={(e) => onChangeField("quantity", e.target.value)}
                    style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        fontSize: "0.9rem",
                    }}
                />

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={saving}
                    style={{
                        padding: "0.45rem 0.9rem",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: saving ? "#9ca3af" : "#111827",
                        color: "white",
                        fontSize: "0.9rem",
                        cursor: saving ? "default" : "pointer",
                        whiteSpace: "nowrap",
                    }}
                >
                    {saving ? "Guardando..." : "Agregar"}
                </button>
            </div>
        </div>
    );
};