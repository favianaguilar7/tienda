import type { CartItem } from "./cart";

export interface SaleLogItem {
    code: string;
    name: string;
    price: number;
    quantity: number;
}

export interface SalePayload {
    items: SaleLogItem[];
    total: number;
    createdAt: string;
}