"use client";
import React from 'react';


interface ProductStatusProps {
    status: any,
    key: any,
    productStatus: any,
    setProductStatus: any

}
function ProductStatus(
    { productStatus,
        status,
        key,
        setProductStatus,
    }: ProductStatusProps

) {

    const handleStatusChange = (status: string) => {
        setProductStatus(status);
    };


    return (
        <div>
            <div className="flex items-center" key={key} >

                <input
                    id={`status-${key}`}
                    type="radio"
                    name="status"
                    value={status}
                    checked={productStatus === status}
                    onChange={(event) => handleStatusChange(event.target.value)}
                    className="h-4 w-4 rounded form-radio border-gray-300 text-beige focus:ring-beige"

                />
                <label htmlFor={`status-${key}`} className="ml-3 min-w-0 flex-1 text-gray-500">{status}</label>

            </div>

        </div>


    )

}

export default ProductStatus;