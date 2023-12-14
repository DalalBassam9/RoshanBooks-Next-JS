"use client"
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from "axios";
import Swal from "sweetalert2";
import Modal from 'react-modal';

interface AddressFormProps {
    showAddressForm: boolean;
    setShowAddressForm: (show: boolean) => void;
    reloadData: () => void;
    selectedAddress: any;
    setSelectedAddress: (category: any) => void;
}
interface FormData {
    phone: string;
    cityId: number | string;
    address: string;
    firstName: any;
    lastName: string;
    district: string;

}

const schema = Yup.object({
    phone: Yup.string()
        .required('Phone is required'),
    cityId: Yup.string()
        .required('City ID is required'),
    address: Yup.string()
        .required('Address is required'),
    firstName: Yup.string()
        .required('First name is required'),
    lastName: Yup.string()
        .required('Last name is required'),
    district: Yup.string()
        .required('District is required'),
});

function AddressForm({
    showAddressForm,
    setShowAddressForm,
    reloadData,
    selectedAddress,
    setSelectedAddress,
}: AddressFormProps) {
    const [loading = false, setLoading] = React.useState<boolean>(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const [cities, setCities] = React.useState([]);
    const [formData, setFormData] = React.useState<FormData>({
        phone: "",
        cityId: "",
        address: "",
        firstName: "",
        lastName: "",
        district: "",
    });

    const handleClose = () => {
        setShowAddressForm(false);
        setSelectedAddress(null);

    };
    const validateField = async (field: string, value: string) => {
        try {
            await schema.validateAt(field, { [field]: value });
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: '',
            }));
        } catch (error: any) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: error.message,
            }));
        }
    };
    const handleChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        // Validate the field using Yup
        validateField(field, value);
    };

    const getCities = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/api/admin/cities-lookups");
            setCities(response.data.cities);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message || error.message,
            })
        }
    };



    React.useEffect(() => {
        getCities();

        if (selectedAddress) {
            setFormData({
                firstName: selectedAddress.firstName,
                lastName: selectedAddress.lastName,
                phone: selectedAddress.phone,
                cityId: selectedAddress.cityId,
                address: selectedAddress.address,
                district: selectedAddress.district
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                cityId: '',
                address: '',
                district: '',
            });
        }
    }, [selectedAddress]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await schema.validate(formData, { abortEarly: false });
            if (selectedAddress) {
                await axios.put(process.env.NEXT_PUBLIC_API_URL + `/api/my/addresses/` + selectedAddress.addressId, formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }

                );
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Address updated successfully',
                })
            } else {
                await axios.post(process.env.NEXT_PUBLIC_API_URL + `/api/my/addresses`, formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }

                );
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Address Created successfully',
                })
            }
            setShowAddressForm(false);
            setSelectedAddress(null);
            reloadData();
        } catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {}; // Specify the type of 'errors' object
                error.inner.forEach((error: any) => {
                    errors[error.path] = error.message;
                });
                setErrors(errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response?.data?.message || error.message, // Use optional chaining to access nested properties
                });

                setShowAddressForm(false);
            }
        } finally {
            setLoading(false);
        }
    };





    return (


        <div className="bg-white ">
            <Modal
                isOpen={showAddressForm}
                onRequestClose={handleClose}

                className="m-auto p-4 bg-white rounded shadow-lg w-1/3"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex"
            >

                <form noValidate autoComplete="off" onSubmit={handleSubmit} >
                    <div className="p-6 border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="first-name"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        autoComplete="given-name"
                                        className={`block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : 'border-gray-400 hover:border-gray-500'}`}

                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="last-name"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        autoComplete="family-name"
                                        className={`block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : 'border-gray-400 hover:border-gray-500'}`}


                                    />
                                    <div className="text-red-500 text-sm mt-2">{errors.lastName}</div>

                                </div>
                            </div>



                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    City
                                </label>
                                <div className="mt-2">
                                    <select
                                        className={`block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline ${errors.cityId ? 'border-red-500' : 'border-gray-400 hover:border-gray-500'}`}
                                        value={formData.cityId}
                                        onChange={(e) => handleChange('cityId', e.target.value)}
                                    >
                                        {cities.map((city: any) => (
                                            <option key={city.cityId} value={city.cityId}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="text-red-500 text-sm mt-2">{errors.cityId}</div>

                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    phone
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}

                                        autoComplete="phone"

                                        className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.phone ? 'border-red-500' : ''}`}
                                    />
                                    <div className="text-red-500 text-sm mt-2">{errors.phone}</div>

                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">
                                    district
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="district"
                                        id="district"
                                        value={formData.district}
                                        onChange={(e) => handleChange('district', e.target.value)}
                                        autoComplete="district"
                                        className={`block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.district ? 'border-red-500' : ''}`}
                                    />
                                    <div className="text-red-500 text-sm mt-2">{errors.district}</div>


                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="address" className="block text-sm font-semibold leading-6 text-gray-900">
                                    Address
                                </label>
                                <div className="mt-2.5">
                                    <textarea
                                        name="address"
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        rows={4}
                                        className={`block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : 'border-gray-400 hover:border-gray-500'}`}
                                        defaultValue={''}
                                    />

                                    <div className="text-red-500 text-sm mt-2">{errors.address}</div>
                                </div>
                            </div>



                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button type="button"
                                className="text-sm font-semibold leading-6 text-gray-900">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-beige px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </form>
            </Modal>
        </div>


    )
}


export default AddressForm;