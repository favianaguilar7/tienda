interface CartSummaryProps {
    totalItems: number;
    totalAmount: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    totalItems,
    totalAmount,
}) => {
    return (
        <section
            style={{
                display: "flex",
                gap: "2rem",
                fontSize: "0.95rem",
            }}
        >
            <div>
                <strong>Artículos:</strong> {totalItems}
            </div>
            <div>
                <strong>Total:</strong> ${totalAmount.toFixed(2)} MXN
            </div>
        </section>
    );
};