"use client";
import React from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, Box, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import Swal from "sweetalert2";
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';

interface CityFormProps {
    showCityForm: boolean;
    setShowCityForm: (show: boolean) => void;
    reloadData: () => void;
    selectedCity: any;
    setSelectedCity: (city: any) => void;
}
interface FormData {
    name: any;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
});


function CityForm({
    showCityForm,
    setShowCityForm,
    reloadData,
    selectedCity,
    setSelectedCity,
}: CityFormProps) {
    const [loading = false, setLoading] = React.useState<boolean>(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [formData, setFormData] = React.useState<FormData>({
        name: '',
    });


    React.useEffect(() => {
        if (selectedCity) {
            setFormData({ name: selectedCity.name });
        } else {
            setFormData({ name: '' });
        }
    }, [selectedCity]);


    const handleClose = () => {
        setShowCityForm(false);
        setSelectedCity(null);

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



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await schema.validate(formData, { abortEarly: false });
            if (selectedCity) {
                await axios.put(process.env.NEXT_PUBLIC_API_URL + `/api/admin/cities/` + selectedCity.cityId, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'City updated successfully',
                })
            } else {
                await axios.post(process.env.NEXT_PUBLIC_API_URL + `/api/admin/cities`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'City Created successfully',
                })
            }
            setShowCityForm(false);
            setSelectedCity(null);
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
                setShowCityForm(false);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={showCityForm}
            sx={{
                '& .MuiDialog-paper': {
                    width: '80%',
                    maxHeight: 435,

                },
            }}   >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">

                    {selectedCity ? 'Update City' : 'Add City'}
                    <IconButton sx={{
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.light',

                        },
                    }}
                        edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined" onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {selectedCity ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>


    );


}

export default CityForm;

