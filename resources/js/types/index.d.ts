export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export type ProductType = {
    id: number;
    name: string;
    units_per_hour: number;
};

export type Product = {
    id: number;
    name: string;
    type_id: number;
    type: string;
    units_per_hour: number;
};

export type OrderItem = {
    id: number;
    product: Product;
    quantity: number;
};

export type Order = {
    id: number;
    order_number: string;
    items: OrderItem[];
    customer_name: string;
    // need_by_date: Date;
    need_by_date: string;
    status: string;
    created_at: string;
    updated_at: string;
};
