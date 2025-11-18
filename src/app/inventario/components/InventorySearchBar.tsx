interface InventorySearchBarProps {
    search: string;
    onChangeSearch: (value: string) => void;
    onRefresh: () => void;
}

export const InventorySearchBar: React.FC<InventorySearchBarProps> = ({
    search,
    onChangeSearch,
    onRefresh,
}) => {
    return (
        <div
            style={{
                marginTop: "0.5rem",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
            }}
        >
            <input
                type="text"
                value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                placeholder="Buscar por código o nombre"
                style={{
                    flex: 1,
                    maxWidth: "400px",
                    padding: "0.5rem 0.7rem",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.95rem",
                }}
            />
            <button
                type="button"
                onClick={onRefresh}
                style={{
                    padding: "0.5rem 0.9rem",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                }}
            >
                Actualizar
            </button>
        </div>
    );
};