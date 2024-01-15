"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { getCartItems, CartState, clearCart } from '../../redux/cartSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import AddressForm from "../../components/Profile/AddressForm";
import DeliveryAddressCard from "../../components/Checkout/DeliveryAddressCard";
import CartItemSummary from "../../components/Checkout/CartItemSummary";

import Swal from "sweetalert2";
export default function Checkout() {
    const router = useRouter();
    const [addresses, setِِAddresses] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();

    const state = useSelector((state: { cart: CartState }) => state);
    const items = useSelector((state: { cart: CartState }) => state.cart.items);
    const subTotal = items.reduce(
        (acc: any, item: any) => acc + item.price * item.quantity,
        0
    );
    const total = subTotal + 3;
    const [showAddressForm, setShowAddressForm] = React.useState(false);
    const [selectedAddress, setSelectedAddress] = React.useState<any>(null);


    const handleShowAddressForm = (address: any) => {
        setSelectedAddress(address);
        setShowAddressForm(true);
    };

    useEffect(() => {
        dispatch(getCartItems());
    }, [dispatch]);



    const getAddresses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/api/addresses`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setِِAddresses(response.data.data);
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        getAddresses();
    },[]);

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            const defaultAddressId = addresses.find((address: any) => address.default === 1) as any;
            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_URL + '/api/checkout',
                {
                    items: items, 
                    subTotal: subTotal,
                    totalPrice: total,
                    addressId: defaultAddressId.addressId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            router.push('/checkout/thankyou');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message || error.message,
            })
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="mt-4 grid grid-cols-2 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
            <div className="lg:col-span-2 col-span-3 bg-indigo-50 space-y-8 px-12">
                <div className="mt-8 p-4 relative flex flex-col  bg-white shadow rounded-md">
                    <div className="py-5  rounded-md bg-white">
                        <div>
                            {showAddressForm && (
                                <AddressForm
                                    showAddressForm={showAddressForm}
                                    setShowAddressForm={setShowAddressForm}
                                    selectedAddress={selectedAddress}
                                    reloadData={() => getAddresses()}
                                    setSelectedAddress={setSelectedAddress}
                                />

                            )}

                            <div className="bg-white shadow sm:rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex justify-between">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900">Addressess</h3>

                                        <button
                                            onClick={() => { setShowAddressForm(true) }}
                                            className="rounded-md  px-3 py-2 bg-beige px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Add new address
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul role="list" className="divide-y divide-gray-100">
                            {addresses.map((address: any) => (
                                <DeliveryAddressCard
                                    address={address}
                                    setShowAddressForm={setShowAddressForm}
                                    reloadData={() => getAddresses()}
                                    setSelectedAddress={setSelectedAddress}
                                    handleShowAddressForm={handleShowAddressForm} />
                            ))}
                        </ul>
                    </div>
                </div>



            </div>
            <div className="md:col-span-1 col-span-3  bg-indigo-50 space-y-8 px-12">
                <div className="mt-8 p-4 relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md">
                    <div className="">
                        <div className="px-3">
                            {items.map((item: any) => (
                                <CartItemSummary
                                    cartItem={item}
                                />
                            ))}
                            <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                                <div className="w-full flex mb-3 items-center">
                                    <div className="flex-grow">
                                        <span className="text-gray-600">Subtotal</span>
                                    </div>
                                    <div className="pl-3">
                                        <span className="font-semibold">{subTotal}</span>
                                    </div>
                                </div>

                            </div>
                            <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                                <div className="w-full flex items-center">
                                    <div className="flex-grow">
                                        <span className="text-gray-600">Total</span>
                                    </div>
                                    <div className="pl-3">
                                        <span className="font-semibold text-gray-400 text-sm">AUD</span> <span className="font-semibold">{total}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex-none rounded-full bg-beige px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beige" onClick={handlePlaceOrder}>Complete Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
