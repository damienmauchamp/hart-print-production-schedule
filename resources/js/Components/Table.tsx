import {
    HTMLAttributes,
    TdHTMLAttributes,
    ThHTMLAttributes,
    PropsWithChildren,
} from "react";

export const TableDate = ({
    date: dateStr,
    datetime = false,
}: {
    date: string;
    datetime?: boolean;
}) => {
    const date = new Date(dateStr);

    return (
        <time
            dateTime={dateStr}
            className="text-sm text-gray-500 dark:text-gray-400"
        >
            {date.toLocaleDateString() +
                (datetime ? ` ${date.toLocaleTimeString()}` : "")}
        </time>
    );
};

// const TableRow = ({ children }: PropsWithChildren) => (
export const TableRow = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
        className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${className}`}
        {...props}
    >
        {children}
    </tr>
);
export const TableSubRow = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
        className={`odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 ${className}`}
        {...props}
    >
        {children}
    </tr>
);

export const TableCell = (
    {
        children,
        className = "",
        bold = false,
        center = false,
        right = false,
        ...props
    }: TdHTMLAttributes<HTMLTableCellElement> & {
        bold?: boolean;
        center?: boolean;
        right?: boolean;
    } // px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white
) => (
    <td
        className={`px-6 py-4 ${
            bold ? "font-semibold text-gray-900 dark:text-white" : ""
        } ${className}${(center && " text-center") || ""}${
            (right && " text-right") || ""
        }`}
        {...props}
    >
        {children}
    </td>
);
// export const TableHeadRow = ({ children }: PropsWithChildren) => (
export const TableHeadCell = ({
    className = "",
    center = false,
    right = false,
    children,
}: ThHTMLAttributes<HTMLTableCellElement> & {
    center?: boolean;
    right?: boolean;
}) => (
    <th
        scope="col"
        className={`px-6 py-3 ${className}${(center && " text-center") || ""}${
            (right && " text-right") || ""
        }`}
    >
        {children}
    </th>
);

export const TableHead = ({ children }: PropsWithChildren) => (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        {children}
    </thead>
);
const Table = ({
    children,
    sub = false,
}: PropsWithChildren & { sub?: boolean }) => {
    const table = () => (
        <table
            className={`${
                (sub && "sub mb-4") || ""
            } w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400`}
        >
            {children}
        </table>
    );

    if (sub) return table();

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {table()}
        </div>
    );
};

export default Table;
