import OrderForm from "@/Components/Orders/OrderForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getOrders, getProductionSchedule } from "@/Helpers/api";
import { PageProps } from "@/types";
import OrdersSection from "@/Components/Orders/OrdersSection";
import ProductionSchedule from "@/Components/ProductionSchedule/ProductionSchedule";

export default function Home({ auth }: PageProps) {
    const {
        data: orders,
        refetch: refetchOrders,
        isFetching: isFetchingOrders,
        isLoading: isLoadingOrders,
        isFetched: isFetchedOrders,
    } = getOrders();

    const {
        data: schedule,
        refetch: refetchProductionSchedule,
        isFetching: isFetchingProductionSchedule,
        isLoading: isLoadingProductionSchedule,
    } = getProductionSchedule();

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Home"
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Home
                </h2>
            }
        >
            <div className="flex flex-col w-full gap-6 py-6">
                <OrderForm
                    refetchOrders={refetchOrders}
                    refetchProductionSchedule={refetchProductionSchedule}
                />

                <OrdersSection
                    orders={orders}
                    refetch={refetchOrders}
                    isFetching={isFetchingOrders}
                    isLoading={isLoadingOrders}
                />

                <ProductionSchedule
                    startDate={(schedule && schedule[0]?.start_time) || ""}
                    schedule={schedule}
                    refetch={refetchProductionSchedule}
                    isFetching={isFetchingProductionSchedule}
                    isLoading={isLoadingProductionSchedule}
                />
            </div>
        </AuthenticatedLayout>
    );
}
