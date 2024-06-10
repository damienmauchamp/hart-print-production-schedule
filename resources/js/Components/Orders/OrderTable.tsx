import {
    AxiosErrorResponse,
    deleteOrderItemFn,
    editOrderItemFn,
} from "@/Helpers/api";
import { Order, OrderItem } from "@/types";
import {
    HTMLAttributes,
    PropsWithChildren,
    TdHTMLAttributes,
    ThHTMLAttributes,
    useEffect,
    useState,
} from "react";
import { FaSyncAlt } from "react-icons/fa";
import SecondaryButton from "../SecondaryButton";
import { useMutation } from "react-query";
import styles from "./OrderTable.module.css";
import Table, { TableRow, TableCell, TableHead, TableHeadCell } from "../Table";
import ButtonFetch from "../ButtonFetch";

type Props = {
    order?: Order;
    isFetching?: boolean;
    isLoading?: boolean;
    refetch?: () => void;
};

const QuantityButton = ({
    itemId,
    orderNumber,
    productId,
    quantity,
    //
    quantityValue,
    setQuantityValue,
}: {
    itemId: number;
    orderNumber: string;
    productId: number;
    quantity: number;
    quantityValue: number;
    setQuantityValue: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const increment = () => {
        setQuantityValue(quantityValue + 1);
    };
    const decrement = () => {
        setQuantityValue(quantityValue <= 0 ? 0 : quantityValue - 1);
    };

    return (
        <div className="flex items-center">
            <button
                className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    decrement();
                }}
            >
                <span className="sr-only">Quantity button</span>
                <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                    />
                </svg>
            </button>
            <div>
                <input
                    type="number"
                    id="first_product"
                    className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    min={1}
                    placeholder="1"
                    required
                    value={quantityValue}
                    onChange={(e) => {
                        setQuantityValue(e.target.valueAsNumber);
                    }}
                />
            </div>
            <button
                className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    increment();
                }}
            >
                <span className="sr-only">Quantity button</span>
                <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        // -linecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                    />
                </svg>
            </button>
        </div>
    );
};

export function OrderItemLine({
    item,
    orderNumber,
    refetchOrder = () => {},
}: {
    item: OrderItem;
    orderNumber: string;
    refetchOrder?: () => void;
}) {
    const [itemQuantityValue, setItemQuantityValue] = useState<number>(
        item.quantity
    );
    const [quantityValue, setQuantityValue] = useState<number>(item.quantity);
    const [deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        setItemQuantityValue(item.quantity);
        setQuantityValue(item.quantity);
    }, [item.quantity]);

    const editOrderItemMutation = useMutation({
        mutationFn: (params: {
            orderNumber: string;
            itemId: number;
            quantity: number;
        }) =>
            editOrderItemFn(params.orderNumber, params.itemId, params.quantity),
        onSuccess: (res) => {
            const message = res.data.message;
            setItemQuantityValue(quantityValue);
            console.log("OK message:", message);
        },
        onError: (err: AxiosErrorResponse) => {
            alert(err?.response?.data?.message);
        },
    });

    const confirmChanges = () =>
        editOrderItemMutation.mutate({
            orderNumber: orderNumber,
            itemId: item.id,
            quantity: quantityValue,
        });

    const deleteOrderItemMutation = useMutation({
        mutationFn: (params: { orderNumber: string; itemId: number }) =>
            deleteOrderItemFn(params.orderNumber, params.itemId),
        onSuccess: (res) => {
            // const message = res.data.message;
            setDeleted(true);
            refetchOrder();
        },
        onError: (err: AxiosErrorResponse) => {
            alert(err?.response?.data?.message);
        },
    });

    const deleteItem = () =>
        confirm("Are you sure you want to remove this item?") &&
        deleteOrderItemMutation.mutate({
            orderNumber: orderNumber,
            itemId: item.id,
        });

    if (deleted) return null;

    return (
        <TableRow key={item.id}>
            <TableCell bold>{item.product.name}</TableCell>
            <TableCell>{item.product.type}</TableCell>
            <TableCell>
                <QuantityButton
                    itemId={item.id}
                    orderNumber={orderNumber}
                    productId={item.product.id}
                    quantity={item.quantity}
                    quantityValue={quantityValue}
                    setQuantityValue={setQuantityValue}
                />
            </TableCell>
            <TableCell>
                <a
                    href="#"
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    onClick={deleteItem}
                >
                    Remove
                </a>
            </TableCell>
            <TableCell>
                {itemQuantityValue !== quantityValue && (
                    <a
                        href="#"
                        className="font-medium text-green-600 dark:text-green-500 hover:underline"
                        onClick={confirmChanges}
                    >
                        Confirm
                    </a>
                )}
            </TableCell>
        </TableRow>
    );
}

export default function OrderTable({
    order,
    isLoading = true,
    isFetching = false,
    refetch = () => {},
}: Props) {
    if (!order) return null;

    if (isLoading) return "Loading...";

    return (
        <div>
            <div className="flex items-start justify-between">
                <div>
                    <div>Order Number : {order.order_number}</div>
                    <div>Customer : {order.customer_name}</div>
                    <div>Need by : {order.need_by_date}</div>
                    <div>Status : {order.status}</div>
                    <div>Updated : {order.updated_at}</div>
                </div>

                <ButtonFetch
                    refetch={refetch}
                    isFetching={isFetching}
                    isLoading={isLoading}
                >
                    Update
                </ButtonFetch>
            </div>
            <Table>
                <TableHead>
                    <tr>
                        <TableHeadCell>Product Name</TableHeadCell>
                        <TableHeadCell>Type</TableHeadCell>
                        <TableHeadCell>Quantity</TableHeadCell>
                        <TableHeadCell></TableHeadCell>
                        <TableHeadCell></TableHeadCell>
                    </tr>
                </TableHead>
                <tbody>
                    {order.items.map((item) => (
                        <OrderItemLine
                            key={item.id}
                            item={item}
                            orderNumber={order.order_number}
                            refetchOrder={refetch}
                        />
                    ))}

                    <TableRow key={"empty"} className={styles.emptyLine}>
                        <TableCell
                            colSpan={6}
                            className="text-center font-normal italic"
                        >
                            No items yet.
                        </TableCell>
                    </TableRow>
                </tbody>
            </Table>
        </div>
    );
}
