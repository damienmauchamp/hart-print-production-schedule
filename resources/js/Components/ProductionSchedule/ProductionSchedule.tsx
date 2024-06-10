import Section from "../Section";
import ButtonFetch from "../ButtonFetch";
import { PropsWithReactQuery, Schedule } from "@/types";
import Table, {
    TableHead,
    TableHeadCell,
    TableRow,
    TableCell,
    TableDate,
} from "../Table";
import { isScheduleProductItem } from "@/Helpers/api";

function ProductionSchedule({
    startDate,
    schedule,
    refetch,
    isFetching,
    isLoading,
}: PropsWithReactQuery & { startDate?: string; schedule?: Schedule }) {
    return (
        <Section title="Production Schedule">
            {/* <p>Start date : {startDate}</p> */}
            <p>
                Start date :{" "}
                {(startDate && <TableDate date={startDate} datetime />) || "-"}
            </p>

            <ButtonFetch
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isLoading}
            >
                Refresh
            </ButtonFetch>

            <Table>
                <TableHead>
                    <tr>
                        <TableHeadCell>Order Number</TableHeadCell>
                        <TableHeadCell>Product</TableHeadCell>
                        <TableHeadCell>Product Type</TableHeadCell>
                        <TableHeadCell>Qty</TableHeadCell>
                        <TableHeadCell>Ordered at</TableHeadCell>
                        <TableHeadCell>Need by</TableHeadCell>
                        <TableHeadCell>Production start</TableHeadCell>
                        <TableHeadCell>Production end</TableHeadCell>
                    </tr>
                </TableHead>
                <tbody>
                    {schedule?.map((item) =>
                        isScheduleProductItem(item) ? (
                            <TableRow key={`${item.order_id}-${item.product}`}>
                                <TableCell>{item.order_number}</TableCell>
                                <TableCell>{item.product_type}</TableCell>
                                <TableCell>{item.product}</TableCell>
                                <TableCell right>{item.quantity}</TableCell>
                                <TableCell center>
                                    <TableDate
                                        date={item.completed_at}
                                        datetime
                                    />
                                </TableCell>
                                <TableCell>
                                    <TableDate date={item.order_need_by} />
                                </TableCell>
                                <TableCell center>
                                    <TableDate
                                        date={item.start_time}
                                        datetime
                                    />
                                </TableCell>
                                <TableCell center>
                                    <TableDate date={item.end_time} datetime />
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow
                                key={`${item.timestamp}`}
                                className="bg-red-200 dark:bg-red-950"
                            >
                                <TableCell colSpan={6} center>
                                    CHANGEOVER
                                </TableCell>
                                {/* <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell> */}
                                <TableCell center>
                                    <TableDate
                                        date={item.start_time}
                                        datetime
                                    />
                                </TableCell>
                                <TableCell center>
                                    <TableDate date={item.end_time} datetime />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </tbody>
            </Table>
        </Section>
    );
}

export default ProductionSchedule;
