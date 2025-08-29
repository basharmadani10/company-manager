import React from 'react';

import {
 Typography, Grid, CircularProgress, Alert, useTheme, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, InputAdornment
} from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

// --- استيراد الملفات الخاصة بمشروعك ---
import { tokens } from '../../theme';

import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import { createProjectBookApi } from "../../shared/APIs";

// --- الأيقونات ---
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentsIcon from '@mui/icons-material/Payments';

import TitleIcon from '@mui/icons-material/Title';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import ImageIcon from '@mui/icons-material/Image';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const CreatePropertyBookDialog = ({ open, onClose, projectId, onSuccess }) => {
    // ... الكود الخاص بهذا المكون يبقى كما هو تماماً
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formError, setFormError] = React.useState(null);

    const handleFormSubmit = async (values, { setSubmitting }) => {
        setFormError(null);
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (values[key] !== null && values[key] !== '') {
                formData.append(key, values[key]);
            }
        });
        formData.append('project_id', projectId);

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'multipart/form-data' }
            };
            await axios.post(`${baseUrl}${createProjectBookApi}`, formData, config);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error creating property book:", err);
            setFormError(err.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = yup.object().shape({
        model: yup.string().required("Required"),
        space: yup.number().positive("Must be positive").required("Required"),
        price: yup.number().positive("Must be positive").required("Required"),
        number_of_rooms: yup.number().integer().min(0).required("Required"),
        number_of_bathrooms: yup.number().integer().min(0).required("Required"),
        diagram_image: yup.mixed().required("An image is required"),
        first_payment_amount: yup.number().min(0).nullable(),
        available_units: yup.number().integer().min(0).nullable(),
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ backgroundColor: colors.primary[800] }}>Create New Property Model</DialogTitle>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{ model: "", space: "", price: "", description: "", number_of_rooms: "", number_of_bathrooms: "", direction: "", diagram_image: null, first_payment_amount: "", available_units: "" }}
                validationSchema={validationSchema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
                            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="model" label="Model Name*" error={!!touched.model && !!errors.model} helperText={touched.model && errors.model} onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="space" label="Space (m²)*" type="number" error={!!touched.space && !!errors.space} helperText={touched.space && errors.space} onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><SquareFootIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="price" label="Price*" type="number" error={!!touched.price && !!errors.price} helperText={touched.price && errors.price} onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="first_payment_amount" label="First Payment Amount" type="number" onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><PaymentsIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="number_of_rooms" label="Number of Rooms*" type="number" error={!!touched.number_of_rooms && !!errors.number_of_rooms} helperText={touched.number_of_rooms && errors.number_of_rooms} onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><BedIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="number_of_bathrooms" label="Number of Bathrooms*" type="number" error={!!touched.number_of_bathrooms && !!errors.number_of_bathrooms} helperText={touched.number_of_bathrooms && errors.number_of_bathrooms} onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><BathtubIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="available_units" label="Available Units" type="number" onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><EventAvailableIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth name="direction" label="Direction" onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><CompassCalibrationIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12}><TextField fullWidth multiline rows={3} name="description" label="Description" onChange={handleChange} onBlur={handleBlur} InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon /></InputAdornment> }} /></Grid>
                                <Grid item xs={12}>
                                    <Button variant="outlined" component="label" startIcon={<ImageIcon />}>Upload Diagram Image*<input type="file" hidden accept="image/*" onChange={(event) => setFieldValue("diagram_image", event.currentTarget.files[0])} /></Button>
                                    {touched.diagram_image && errors.diagram_image && <Typography color="error" variant="caption" sx={{ ml: 2 }}>{errors.diagram_image}</Typography>}
                                    {values.diagram_image && <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>{values.diagram_image.name}</Typography>}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: colors.primary[800], p: '20px' }}>
                            <Button onClick={onClose} color="inherit">Cancel</Button>
                            <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : "Create Book"}</Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};
export default CreatePropertyBookDialog;