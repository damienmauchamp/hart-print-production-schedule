import { PropsWithChildren } from "react";

const SectionTitle = ({ children }: PropsWithChildren<{}>) => {
    return (
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 leading-tight">
            {children}
        </h3>
    );
};

export default function Section({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) {
    return (
        <section className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    {title && <SectionTitle>{title}</SectionTitle>}

                    {children}
                </div>
            </div>
        </section>
    );
}
