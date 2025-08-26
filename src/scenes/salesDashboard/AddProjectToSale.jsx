import React, { useState, useRef } from "react";
import {
    Box, Typography, Button, TextField, FormControl, InputLabel, Select,
    MenuItem, Grid, CircularProgress, useTheme, InputAdornment, Chip, Paper, Divider, Stack
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

// --- المكونات والأدوات المساعدة ---
import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import useProjectsData from "../../hooks/getAllProjectsDataHook";
import { createProjectSalingDetailsApi } from "../../shared/APIs";
import CustomSnackbar from "../../components/CustomSnackbar";

// --- الأيقونات ---
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ClassIcon from '@mui/icons-material/Class';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SaveIcon from '@mui/icons-material/Save';


const AddProjectToSale = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const snackbarRef = useRef(null);

    const { projects, loading: projectsLoading } = useProjectsData();
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        const formData = new FormData();
        
        Object.keys(values).forEach(key => {
            if (key === 'main_image' || key === 'diagram_image' || key === 'video_url') {
                if (values[key]) {
                    formData.append(key, values[key]);
                }
            } else {
                formData.append(key, values[key]);
            }
        });

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'multipart/form-data',
                }
            };
            await axios.post(`${baseUrl}${createProjectSalingDetailsApi}`, formData, config);
            snackbarRef.current.showSnackbar("Project sale details added successfully!", "success");
            resetForm();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add project sale details.";
            snackbarRef.current.showSnackbar(errorMessage, "error");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const initialValues = {
        project_id: "",
        main_title: "",
        marketing_description: "",
        location_link: "",
        address: "",
        video_url: null,
        main_image: null,
        diagram_image: null,
    };

    const validationSchema = yup.object().shape({
        project_id: yup.string().required("Project selection is required"),
        main_title: yup.string().required("Main title is required"),
        marketing_description: yup.string().required("Marketing description is required"),
        address: yup.string().required("Address is required"),
        location_link: yup.string().url("Please enter a valid URL").required("Location link is required"),
        main_image: yup.mixed().required("A main image is required."),
        diagram_image: yup.mixed().required("A diagram image is required."),
        video_url: yup.mixed().nullable(),
    });

    return (
        <Box m="20px">
            <Header title="Add Project to Sales" subtitle="Provide marketing details to list a project for sale" />
            
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                backgroundColor: colors.primary[800],
                                borderRadius: '12px',
                                mt: 3
                            }}
                        >
                            {/* ================= القسم الأول: اختيار المشروع ================= */}
                            <Box>
                                <Typography variant="h5" sx={{ color: colors.greenAccent[400] }}>
                                    1. Select Project
                                </Typography>
                                <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />
                                <FormControl fullWidth variant="outlined" error={!!touched.project_id && !!errors.project_id}>
                                    <InputLabel>Select Project*</InputLabel>
                                    <Select
                                        name="project_id"
                                        value={values.project_id}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Select Project*"
                                        startAdornment={<InputAdornment position="start"><ClassIcon /></InputAdornment>}
                                    >
                                        {projectsLoading ? (
                                            <MenuItem disabled><em>Loading projects...</em></MenuItem>
                                        ) : (
                                            projects.map(project => (
                                                <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {touched.project_id && errors.project_id && <Typography color="error" variant="caption" sx={{ ml: 1.5, mt: 0.5 }}>{errors.project_id}</Typography>}
                                </FormControl>
                            </Box>
                            
                            {/* ================= القسم الثاني: التفاصيل التسويقية ================= */}
                            <Box mt={5}>
                                <Typography variant="h5" sx={{ color: colors.greenAccent[400] }}>
                                    2. Marketing Details
                                </Typography>
                                <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12}><TextField fullWidth variant="outlined" label="Main Title*" name="main_title" value={values.main_title} onChange={handleChange} onBlur={handleBlur} error={!!touched.main_title && !!errors.main_title} helperText={touched.main_title && errors.main_title} InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon /></InputAdornment> }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" label="Address*" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} error={!!touched.address && !!errors.address} helperText={touched.address && errors.address} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment> }} /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" label="Location Link (URL)*" name="location_link" value={values.location_link} onChange={handleChange} onBlur={handleBlur} error={!!touched.location_link && !!errors.location_link} helperText={touched.location_link && errors.location_link} InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon /></InputAdornment> }} /></Grid>
                                    <Grid item xs={12}><TextField fullWidth multiline rows={4} variant="outlined" label="Marketing Description*" name="marketing_description" value={values.marketing_description} onChange={handleChange} onBlur={handleBlur} error={!!touched.marketing_description && !!errors.marketing_description} helperText={touched.marketing_description && errors.marketing_description} InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon /></InputAdornment> }} /></Grid>
                                </Grid>
                            </Box>

                            {/* ================= القسم الثالث: رفع الوسائط ================= */}
                            <Box mt={5}>
                                <Typography variant="h5" sx={{ color: colors.greenAccent[400] }}>
                                    3. Media Uploads
                                </Typography>
                                <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle1" fontWeight="600">Main Image*</Typography>
                                            <Button variant="outlined" component="label" fullWidth startIcon={<ImageIcon />}>
                                                Choose File
                                                <input type="file" hidden name="main_image" onChange={(e) => setFieldValue("main_image", e.currentTarget.files[0])} />
                                            </Button>
                                            {touched.main_image && errors.main_image && <Typography color="error" variant="caption">{errors.main_image}</Typography>}
                                            {values.main_image && <Chip icon={<CheckCircleOutlineIcon />} label={values.main_image.name} onDelete={() => setFieldValue("main_image", null)} color="success" variant="outlined" />}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle1" fontWeight="600">Diagram Image*</Typography>
                                            <Button variant="outlined" component="label" fullWidth startIcon={<ImageIcon />}>
                                                Choose File
                                                <input type="file" hidden name="diagram_image" onChange={(e) => setFieldValue("diagram_image", e.currentTarget.files[0])} />
                                            </Button>
                                            {touched.diagram_image && errors.diagram_image && <Typography color="error" variant="caption">{errors.diagram_image}</Typography>}
                                            {values.diagram_image && <Chip icon={<CheckCircleOutlineIcon />} label={values.diagram_image.name} onDelete={() => setFieldValue("diagram_image", null)} color="success" variant="outlined" />}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle1" fontWeight="600">Video (Optional)</Typography>
                                            <Button variant="outlined" component="label" fullWidth startIcon={<VideocamIcon />}>
                                                Choose File
                                                <input type="file" hidden name="video_url" onChange={(e) => setFieldValue("video_url", e.currentTarget.files[0])} />
                                            </Button>
                                            {values.video_url && <Chip icon={<CheckCircleOutlineIcon />} label={values.video_url.name} onDelete={() => setFieldValue("video_url", null)} color="success" variant="outlined" />}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* ================= زر الإرسال ================= */}
                            <Box sx={{ display: 'flex', justifyContent: 'end', mt: 5 }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    disabled={isLoading}
                                    size="medium"
                                    startIcon={<SaveIcon />}
                                    sx={{ 
                                        backgroundColor: colors.greenAccent[600], 
                                        color: colors.grey[900],
                                        fontWeight: 'bold',
                                        px: 5, 
                                        py: 1.25,
                                        '&:hover': { backgroundColor: colors.greenAccent[700] } 
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} sx={{ color: colors.grey[900]}} /> : "Save Details"}
                                </Button>
                            </Box>

                        </Paper>
                    </form>
                )}
            </Formik>
            <CustomSnackbar ref={snackbarRef} />
        </Box>
    );
};

export default AddProjectToSale;