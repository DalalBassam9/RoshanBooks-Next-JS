"use client";

import Layout from '../components/AdminLayout';
import React from "react";
import CityForm from "../components/Cities/CityForm";
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, Stack, IconButton, Divider, TableRow, Paper, Box, Button, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import moment from 'moment';
import axios from "axios";

interface City {
    cityId: number;
    name: string;
}

type Cities = City[];

export default function Cities() {

    const [loading, setLoading] = React.useState(false);
    const [loadingForDelete, setLoadingForDelete] = React.useState(false);
    const [showCityForm, setShowCityForm] = React.useState(false);
    const [selectedCity, setSelectedCity] = React.useState<any>(null);
    const [cities, setCities] = React.useState<Cities>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


    const handleShowCityForm = (city: any) => {
        setSelectedCity(city);
        setShowCityForm(true);
    };

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const getCities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/api/admin/cities?page=${page + 1}&per_page=${rowsPerPage}`
            );
            setCities(response.data.data);
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

    React.useEffect(() => {
        getCities();
    }, [page, rowsPerPage]);


    const deleteCity = (cityId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#D5A983',
            cancelButtonColor: "#D5A983",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.value) {
                onDelete(cityId);
            }
        });
    };


    const onDelete = async (cityId: string) => {
        try {
            setLoadingForDelete(true);
            await axios.delete(process.env.NEXT_PUBLIC_API_URL + "/api/admin/cities/" + cityId);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'City Deleted successfully',
                confirmButtonColor: '#D5A983',
            })
            setSelectedCity(null);
            getCities();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message || error.message,
                confirmButtonColor: '#D5A983',
            })
        } finally {
            setLoadingForDelete(false);
        }
    };

    return (
        <div>

            <Layout>

                {showCityForm && (
                    <CityForm
                        showCityForm={showCityForm}
                        setShowCityForm={setShowCityForm}
                        selectedCity={selectedCity}
                        reloadData={() => getCities()}
                        setSelectedCity={setSelectedCity}
                    />

                )}
                <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ padding: "20px" }}
                    >
                        Cities List
                    </Typography>
                    <Divider />
                    <Box height={10} />
                    <Stack direction="row" spacing={2} className="my-2 mb-2">
                        <TextField size="small" sx={{
                            '& label.Mui-focused': {
                                color: '#D5A983',
                                fontWeight: 'bold'
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#D5A983', // Change the border color
                            },
                        }} label="Search" />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        ></Typography>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#D5A983', color: '#fff', fontWeight: 'bold' }}

                            endIcon={<AddCircleIcon />}
                            onClick={() => setShowCityForm(true)}

                        >
                            Add City
                        </Button>
                    </Stack>
                    <Box height={10} />

                    {cities.length > 0 && (
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" style={{ minWidth: "100px" }}>
                                            ID
                                        </TableCell>
                                        <TableCell align="left" style={{ minWidth: "100px" }}>
                                            Name
                                        </TableCell>
                                        <TableCell align="left" style={{ minWidth: "100px" }}>
                                            CreateAt
                                        </TableCell>
                                        <TableCell align="left" style={{ minWidth: "100px" }}>
                                            UpdateAt
                                        </TableCell>
                                        <TableCell align="left" style={{ minWidth: "100px" }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cities
                                        .map
                                        ((city: any) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={city.cityId}
                                                >
                                                    <TableCell align="left">{city.cityId}</TableCell>
                                                    <TableCell align="left">{city.name}</TableCell>
                                                    <TableCell align="left">{moment(city.created_at).format("DD MMM YYYY hh:mm A")}</TableCell>
                                                    <TableCell align="left">{moment(city.updated_at).format("DD MMM YYYY hh:mm A")}</TableCell>

                                                    <TableCell align="left">
                                                        <Stack spacing={2} direction="row">
                                                            <EditIcon
                                                                style={{
                                                                    marginTop: "10px",
                                                                    fontSize: "20px",
                                                                    color: "primary",
                                                                    cursor: "pointer",
                                                                }}
                                                                className="cursor-pointer"
                                                                onClick={() => handleShowCityForm(city)
                                                                }
                                                            />
                                                            <IconButton
                                                                disabled={loadingForDelete}
                                                                onClick={() => [
                                                                    setSelectedCity(city),
                                                                    deleteCity(city.cityId),
                                                                ]}
                                                            >
                                                                {loadingForDelete && selectedCity?.cityId === city.cityId
                                                                    ? <CircularProgress size={24} /> :
                                                                    <DeleteIcon
                                                                    />}
                                                            </IconButton>


                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={cities.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />


                        </TableContainer>
                    )
                    }
                </Paper>

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress style={{ color: '#D5A983' }} />
                    </div>
                )}

            </Layout>


        </div>
    );


};