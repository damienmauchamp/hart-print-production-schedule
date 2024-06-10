import { Order, PropsWithReactQuery } from "@/types";
import Section from "../Section";
import Table, {
    TableHead,
    TableHeadCell,
    TableRow,
    TableCell,
    TableDate,
    TableSubRow,
} from "../Table";
import SecondaryButton from "../SecondaryButton";
import { FaAngleDown, FaAngleUp, FaSyncAlt } from "react-icons/fa";
import ButtonFetch from "../ButtonFetch";
import React, { useState } from "react";

function OrdersSection({
    orders,
    refetch,
    isFetching,
    isLoading,
}: PropsWithReactQuery & {
    orders?: Order[];
}) {
    const [openOrders, setOpenOrders] = useState<number[]>([]);

    const toggleOrder = (id: number) => {
        if (openOrders.includes(id)) {
            setOpenOrders(openOrders.filter((o) => o !== id));
        } else {
            setOpenOrders([...openOrders, id]);
        }
    };

    //
    return (
        <>
            {/*  */}
            <Section title="Orders">
                {refetch && (
                    <ButtonFetch
                        refetch={refetch}
                        isFetching={isFetching}
                        isLoading={isLoading}
                    >
                        Update
                    </ButtonFetch>
                )}

                <Table>
                    <TableHead>
                        <tr>
                            <TableHeadCell>Order Number</TableHeadCell>
                            <TableHeadCell>Customer</TableHeadCell>
                            <TableHeadCell center>Status</TableHeadCell>
                            <TableHeadCell>Completed at</TableHeadCell>
                            <TableHeadCell>Need by date</TableHeadCell>
                            <TableHeadCell></TableHeadCell>
                        </tr>
                    </TableHead>
                    <tbody>
                        {orders?.map((o) => (
                            <React.Fragment key={o.id}>
                                <TableRow>
                                    <TableCell bold>{o.order_number}</TableCell>
                                    <TableCell>{o.customer_name}</TableCell>
                                    <TableCell center>
                                        <span
                                            className={`uppercase text-xs p-1 rounded-sm bg-slate-200 dark:bg-slate-900  ${
                                                o.status === "confirmed"
                                                    ? "text-green-600 dark:text-green-700"
                                                    : "text-yellow-600 dark:text-yellow-700"
                                            }`}
                                        >
                                            {o.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <TableDate
                                            date={o.updated_at}
                                            datetime
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TableDate date={o.need_by_date} />
                                    </TableCell>
                                    <TableCell>
                                        <SecondaryButton
                                            onClick={() => toggleOrder(o.id)}
                                        >
                                            {openOrders.includes(o.id) ? (
                                                <FaAngleUp />
                                            ) : (
                                                <FaAngleDown />
                                            )}
                                        </SecondaryButton>
                                    </TableCell>
                                </TableRow>

                                {/* items */}
                                <tr>
                                    <td
                                        colSpan={6}
                                        className={
                                            openOrders.includes(o.id)
                                                ? ""
                                                : "hidden"
                                        }
                                    >
                                        <Table sub>
                                            <TableHead>
                                                <tr>
                                                    <TableHeadCell>
                                                        Product
                                                    </TableHeadCell>
                                                    <TableHeadCell>
                                                        Quantity
                                                    </TableHeadCell>
                                                </tr>
                                            </TableHead>
                                            <tbody>
                                                {o.items.map((item) => (
                                                    <TableSubRow key={item.id}>
                                                        <TableCell bold>
                                                            {item.product.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.quantity}
                                                        </TableCell>
                                                    </TableSubRow>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </Section>
        </>
    );
}

export default OrdersSection;
