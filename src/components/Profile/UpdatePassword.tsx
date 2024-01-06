"use client";
import React from 'react';
import {  useState} from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from 'yup';


interface PasswordUserData {
    password: string;
    passwordConfirmation: string;

}


const passwordSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required'),
    passwordConfirmation: Yup.string()
        .required('Password confirmation is required'),

});

const UpdatePassword: React.FC = () => {
    const [passwordData, setPasswordData] = useState<PasswordUserData>({
        password: "",
        passwordConfirmation: "",

    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading = false, setLoading] = React.useState<boolean>(false);
    const [loadingPassword = false, setLoadingPassword] = React.useState<boolean>(false);

    const validatePasswordField = async (field: string, value: string) => {
        try {
            await passwordSchema.validateAt(field, { [field]: value });
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


    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        validatePasswordField(field, value);
    };


    const handlePasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            setLoadingPassword(true);
            await passwordSchema.validate(passwordData, { abortEarly: false });

            const response = await axios.put(process.env.NEXT_PUBLIC_API_URL + "/api/my/update-password", passwordData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password Updated successfully',
            })
        }
        catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                const errors: { [key: string]: string } = {}; // Specify the type of 'errors' as an object with string keys and string values
                error.inner.forEach((error: any) => {
                    errors[error.path] = error.message;
                });
                setErrors(errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response?.data?.message || error.message, // Use optional chaining to access the 'message' property
                });
            }
        } finally {
            setLoadingPassword(false);
        }
    };
    const handlePasswordCancel = () => {
        setPasswordData({
            password: "",
            passwordConfirmation: "",
        });

    };

    return (
        <div>
            <form noValidate autoComplete="off" onSubmit={handlePasswordSubmit} >
                <div className="mt-8  border-t border-gray-900/10">

                    <h2 className="text-base my-4  font-semibold leading-7 text-gray-900"> Change Password</h2>


                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">


                        <div className="sm:col-span-3">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={(e) => handlePasswordChange('password', e.target.value)}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-beige  sm:text-sm ${errors.password ? 'border-red-500' : ''}`}


                                />

                                <div className="text-red-500 text-sm mt-2">{errors.password}</div>

                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="passwordConfirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="passwordConfirmation"
                                    id="password"
                                    onChange={(e) => handlePasswordChange('passwordConfirmation', e.target.value)}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-beige  sm:text-sm ${errors.password ? 'border-red-500' : ''}`}

                                />

                                <div className="text-red-500 text-sm mt-2">{errors.passwordConfirmation}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button"
                        onClick={handlePasswordCancel} className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-beige px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-beige"
                    >
                        change password
                    </button>
                </div>
            </form>

        </div>
    );
}

export default UpdatePassword;