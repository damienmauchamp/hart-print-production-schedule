import React, { ButtonHTMLAttributes } from "react";
import { FaSyncAlt } from "react-icons/fa";
import SecondaryButton from "./SecondaryButton";
import { PropsWithReactQuery } from "@/types";

function ButtonFetch({
    children,
    className,
    refetch,
    isLoading = false,
    isFetching,
}: ButtonHTMLAttributes<HTMLButtonElement> & PropsWithReactQuery) {
    return (
        <SecondaryButton
            onClick={() => refetch()}
            className={`mt-4 ${className}`}
            disabled={isFetching || isLoading}
        >
            <span>{children}</span>
            <FaSyncAlt className={`ml-2 ${isFetching ? "icon-spin" : ""}`} />
        </SecondaryButton>
    );
}

export default ButtonFetch;
