import { useForm } from "@inertiajs/react";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import PrimaryButton from "../PrimaryButton";
import TextInput from "../TextInput";
import Select from "../Select";
import {
    AxiosErrorResponse,
    OrderError,
    addOrderItemFn,
    editOrderFn,
    getOrder,
    getOrders,
    getProducts,
} from "@/Helpers/api";
import { useMutation, useQuery } from "react-query";
import Section from "../Section";
import OrderTable from "./OrderTable";
import Table, {
    TableHead,
    TableHeadCell,
    TableRow,
    TableCell,
    TableDate,
} from "../Table";
import OrdersSection from "./OrdersSection";
import { FaPlus } from "react-icons/fa6";

type Props = {};

// const addOrderItemMutation = addOrderItem();

export default function OrderForm({
    refetchOrders,
    refetchProductionSchedule,
}: {
    refetchOrders: () => void;
    refetchProductionSchedule: () => void;
}) {
    // region form

    const [needByDateMin, setNeedByDateMin] = useState(
        new Date().toISOString().split("T")[0]
    );
    const formRef = React.createRef<HTMLFormElement>();

    const editOrderMutation = useMutation({
        mutationFn: (params: {
            customer: string;
            need_by_date: string;
            done: boolean;
        }) =>
            editOrderFn(
                orderNumber,
                params.customer,
                params.need_by_date,
                params.done
            ),
        onSuccess: (res) => {
            const message = res.data.message || null;
            const orderStatus = res.data.data.status;

            if (message) alert(message);

            if (orderStatus === "confirmed") {
                // Reset forms
                setProductType(null);
                reset();
                productFormReset();
                setOrderNumber("");
            }
        },
        onError: (err: AxiosErrorResponse) => {
            alert(err?.response?.data?.message);
        },
        onSettled: () => {
            refetchOrder();
        },
    });

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setError,
        hasErrors,
        clearErrors,
    } = useForm({
        customer: "",
        need_by_date: "",
    });

    const submit: FormEventHandler = (e: FormEvent) => {
        e.preventDefault();

        //
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // retrieve form data
        const customer = String(formData.get("customer"));
        const need_by_date = String(formData.get("need_by_date"));

        let formHasErrors = false;

        if (!customer) {
            setError("customer", "Please enter a customer name.");
            formHasErrors = true;
        }

        if (!need_by_date) {
            setError("need_by_date", "Please enter a need by date.");
            formHasErrors = true;
        }

        if (!orderNumber) {
            alert("Please add at least one item to the order.");
            formHasErrors = true;
        }

        if (hasErrors || formHasErrors) return;

        // getting the submitter
        const nativeEvent = e.nativeEvent as SubmitEvent;
        const submitterName =
            nativeEvent.submitter && "name" in nativeEvent.submitter
                ? (
                      nativeEvent.submitter as
                          | HTMLButtonElement
                          | HTMLInputElement
                  ).name
                : null;

        // posting the form
        editOrderMutation.mutate({
            customer: customer,
            need_by_date: need_by_date,
            done: submitterName === "place-order",
        });
    };
    // endregion form

    // region product form
    const addOrderItemMutation = useMutation({
        mutationFn: (params: { productId: number; quantity: number }) => {
            return addOrderItemFn(
                params.productId,
                params.quantity,
                orderNumber
            );
        },
        onSuccess: (res) => {
            const message = res.data.message;
            const orderNumber = res.data.order.order_number;
            const productType = res.data.item.product.type_id;

            setProductType(productType);
            setOrderNumber(orderNumber);
        },
        onError: (err: AxiosErrorResponse) => {
            alert(err?.response?.data?.message);
        },
        onSettled: () => {
            refetchOrder();
        },
    });

    const [productType, setProductType] = useState<number | null>(null);
    const [orderNumber, setOrderNumber] = useState<string>("");

    useEffect(() => {
        refetchOrder();
        refetchOrders();
        refetchProductionSchedule();
    }, [orderNumber]);

    const {
        data: productFormData,
        setData: setProductFormData,
        processing: productFormProcessing,
        errors: productFormErrors,
        reset: productFormReset,
        setError: setProductFormError,
        hasErrors: productFormHasErrors,
        clearErrors: clearProductFormErrors,
    } = useForm({
        product: "",
        quantity: 1,
    });

    const submitProductItem: FormEventHandler = (e: FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const quantity = Number(formData.get("quantity"));
        const productId = Number(formData.get("product"));

        let formHasErrors = false;

        if (!quantity || quantity < 1) {
            setProductFormError(
                "quantity",
                "Please enter a quantity for this product."
            );
            formHasErrors = true;
        }

        if (!productId) {
            setProductFormError("product", "Please select a product.");
            formHasErrors = true;
        }

        if (formHasErrors || productFormHasErrors) return;

        // posting the form
        addOrderItemMutation.mutate({
            productId: productId,
            quantity: quantity,
        });
    };

    // endregion product form

    // region products
    const {
        data: products,
        // refetch: refetchProducts,
        // isFetching: isFetchingProducts,
        // isLoading: isLoadingProducts,
        // isFetched: isFetchedProducts,
    } = getProducts();
    // endregion products

    // region order
    const {
        data: order,
        refetch: refetchOrder,
        isFetching: isFetchingOrder,
        isLoading: isLoadingOrder,
        // isFetched: isFetchedOrder,
    } = getOrder(orderNumber, {
        onSuccess: (data) => {
            // Updating the product type
            if (!data.items.length) {
                setProductType(null);
            } else {
                setProductType(Number(data.items[0].product.type_id));
            }
        },
        onError: (err: OrderError) => {
            if (err.response.data.code === "NOT_FOUND") {
                alert(
                    "We could not find this order. It may have been deleted due to inactivity. This page will be reloaded."
                );
                setTimeout(() => window.location.reload(), 1000);
            }
        },
    });
    // endregion order

    return (
        <>
            <Section title="Place your order">
                {/* products */}
                <form key={"addProductForm"} onSubmit={submitProductItem}>
                    <div className="flex gap-4">
                        <div className="grow">
                            <InputLabel value="Product" />

                            <Select
                                id="product"
                                type="text"
                                name="product"
                                required
                                value={productFormData.product}
                                className="mt-1 block w-full"
                                // autoComplete="username"
                                onChange={(e) => {
                                    setProductFormData(
                                        "product",
                                        e.target.value
                                    );
                                    clearProductFormErrors("product");
                                }}
                            >
                                <option></option>
                                {products?.map((product) => (
                                    <option
                                        key={product.id}
                                        value={product.id}
                                        disabled={
                                            productType !== null &&
                                            product.type_id !== productType
                                        }
                                    >
                                        {product.name} ({product.type})
                                    </option>
                                ))}
                            </Select>

                            <InputError
                                message={productFormErrors.product}
                                className="mt-2"
                            />
                        </div>

                        {/* quantity */}
                        <div>
                            <InputLabel value="Quantity" />

                            <TextInput
                                id="quantity"
                                type="number"
                                name="quantity"
                                min={1}
                                value={productFormData.quantity}
                                className="mt-1 block w-full"
                                // autoComplete="username"
                                isFocused={true}
                                onChange={(e) => {
                                    setProductFormData(
                                        "quantity",
                                        Number(e.target.value)
                                    );
                                    clearProductFormErrors("quantity");
                                }}
                            />

                            <InputError
                                message={productFormErrors.quantity}
                                className="mt-2"
                            />
                        </div>

                        {/* add product */}
                        <div className="flex items-end justify-center">
                            <PrimaryButton
                                className="py-3"
                                disabled={productFormProcessing}
                                title="Add product"
                            >
                                <FaPlus />
                            </PrimaryButton>
                        </div>
                    </div>
                </form>

                {/* order info */}
                <form key={"addOrderForm"} onSubmit={submit} ref={formRef}>
                    {/* customer */}
                    <div>
                        <InputLabel value="Customer" />

                        <TextInput
                            id="customer"
                            type="text"
                            name="customer"
                            value={data.customer}
                            className="mt-1 block w-full"
                            // autoComplete="username"
                            isFocused={true}
                            onChange={(e) => {
                                setData("customer", e.target.value);
                                clearErrors("customer");
                            }}
                        />

                        <InputError
                            message={errors.customer}
                            className="mt-2"
                        />
                    </div>

                    {/* need by */}
                    <div>
                        <InputLabel value="Need By" />

                        <TextInput
                            id="need_by_date"
                            type="date"
                            name="need_by_date"
                            value={data.need_by_date}
                            className="mt-1 block w-full"
                            // autoComplete="username"
                            isFocused={true}
                            min={needByDateMin}
                            onChange={(e) => {
                                setData("need_by_date", e.target.value);
                                clearErrors("need_by_date");
                            }}
                        />

                        <InputError
                            message={errors.need_by_date}
                            className="mt-2"
                        />
                    </div>

                    {/* submit */}
                    <div className="flex items-center justify-center mt-4">
                        <PrimaryButton
                            className="ms-4"
                            disabled={processing}
                            name="edit-order"
                            title="Update order info"
                        >
                            Update order info
                        </PrimaryButton>
                        <PrimaryButton
                            className="ms-4 hover:bg-green-500 active:bg-green-700"
                            disabled={processing}
                            name="place-order"
                            title="Place order"
                            onClick={(e) => {
                                e.preventDefault();

                                formRef.current?.requestSubmit(
                                    e.target as HTMLElement
                                );
                            }}
                        >
                            Place order
                        </PrimaryButton>
                    </div>
                </form>
            </Section>

            {order && (
                <Section title="Your order">
                    <OrderTable
                        order={order}
                        refetch={() => refetchOrder()}
                        isFetching={isFetchingOrder}
                        isLoading={isLoadingOrder}
                    />
                </Section>
            )}
        </>
    );
}
