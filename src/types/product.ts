// src/types/product.ts
export interface Product {
    id: string;
    code: string;      // código de barras / código manual
    name: string;
    price: number;
    quantity: number;
}