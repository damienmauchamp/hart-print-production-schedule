import OrderForm from "@/Components/Orders/OrderForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { seedQuery } from "@/Helpers/api";
import { PageProps } from "@/types";

export default function Home({ auth }: PageProps) {
    const {} = seedQuery();

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
                <OrderForm />
            </div>
        </AuthenticatedLayout>
    );
}
