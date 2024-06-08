import { Order, Product } from "@/types";
import axios from "axios";
import { useQuery, UseQueryOptions } from "react-query";

export const axiosClient = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

export const seedQuery = () =>
    useQuery(
        "seed", // route("seed")
        async () => await axiosClient.get(route("seed")).then((res) => res.data)
        // async () => await axiosClient.get("/seed").then((res) => res.data)
    );
export const getProducts = (options?: UseQueryOptions<Product[], Error>) =>
    useQuery<Product[], Error>(
        "products",
        async () =>
            await axiosClient
                .get(route("products"))
                .then((res) => res.data.data),
        // await axiosClient.get("/products").then((res) => res.data.data),
        options
    );
export const getOrder = (
    orderNumber: string,
    options?: UseQueryOptions<Order, Error>
) =>
    useQuery<Order, Error>(
        ["order", orderNumber],
        async () => {
            return (
                orderNumber &&
                (await axiosClient
                    .get(route("order.get", orderNumber))
                    .then((res) => res.data.data))
            );
        },
        options
    );
export const getOrders = (options?: UseQueryOptions<Order[], Error>) =>
    useQuery<Order[], Error>(
        "orders",
        async () => {
            return await axiosClient
                .get(route("orders.list"))
                .then((res) => res.data.data);
        },
        options
    );

//

export interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export const addOrderItemFn = (
    productId: number,
    quantity: number,
    orderNumber: string
) =>
    axiosClient.post(route("order.item.store"), {
        productId: productId,
        quantity: quantity,
        orderNumber: orderNumber,
    });

export const editOrderFn = (
    orderNumber: string,
    customer: string,
    need_by_date: string,
    done: boolean = false
) =>
    axiosClient.put(route("order.put", orderNumber), {
        customer: customer,
        orderNumber: orderNumber,
        need_by_date: need_by_date,
        done: done,
    });

export const editOrderItemFn = (
    orderNumber: string,
    itemId: number,
    quantity: number
) =>
    axiosClient.put(
        route("order.item.put", {
            order: orderNumber,
            orderItem: itemId,
        }),
        {
            quantity: quantity,
        }
    );

export const deleteOrderItemFn = (orderNumber: string, itemId: number) =>
    axiosClient.delete(
        route("order.item.delete", {
            order: orderNumber,
            orderItem: itemId,
        })
    );
