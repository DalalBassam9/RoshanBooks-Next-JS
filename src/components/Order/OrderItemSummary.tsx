"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import axios from "axios";

interface OrderItemSummaryProps {
    orderItem: any,

}
function OrderItemSummary(
    {
        orderItem
    }: OrderItemSummaryProps

) {

    return (
        <div>
            <div className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6">
                <div className="w-full flex items-center">
                    <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
                        <img src={orderItem.product.image} alt="" />
                    </div>
                    <div className="flex-grow pl-3">
                        <h6 className="font-semibold uppercase text-gray-600">{orderItem.product.name}</h6>
                        <p className="text-gray-400">x {orderItem.quantity}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600 text-xl">{orderItem.price}</span><span className="font-semibold text-gray-600 text-sm">.00</span>
                    </div>
                </div>
            </div>

        </div>


    )

}

export default OrderItemSummary;