import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, TextField, Grid, CircularProgress,
  useTheme, InputAdornment, Chip, Paper, Divider, IconButton, Alert,Stack
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import useSingleProjectSaleData from "../../hooks/getSingleProjectToSaleDataHook";
import { updateProjectSaleApi } from "../../shared/APIs";
import CustomSnackbar from "../../components/CustomSnackbar";

// --- الأيقونات ---
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import ImageIcon from "@mui/icons-material/Image";
import ClassIcon from '@mui/icons-material/Class';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';


// ====================================================================
// == مكون فرعي لعرض وتعديل الوسائط
// ====================================================================
const MediaEditCard = ({ label, currentFileUrl, fileType, onFileSelect, formikProps }) => {
    const colors = tokens(useTheme().palette.mode);
    const [fileName, setFileName] = useState("");

    const isImage = fileType === 'image';
    const Icon = isImage ? ImageIcon : VideocamIcon;

    return (
        <Paper elevation={0} sx={{ p: 2, backgroundColor: colors.primary[700], borderRadius: '8px', textAlign: 'center' }}>
            <Icon sx={{ fontSize: 40, color: colors.greenAccent[400] }} />
            <Typography gutterBottom>{label}</Typography>
            
            {/* عرض الوسائط الحالية */}
            {isImage ? (
                <img src={currentFileUrl} alt={label} width="100%" height="150" style={{ objectFit: 'cover', borderRadius: '4px' }}/>
            ) : (
                <video src={currentFileUrl} width="100%" height="150" controls />
            )}
            
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                <ChangeCircleIcon sx={{ mr: 1 }} />
                Change File
                <input 
                    type="file" 
                    hidden 
                    accept={isImage ? "image/*" : "video/*"}
                    onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (file) {
                            formikProps.setFieldValue(label.toLowerCase().replace(' ', '_'), file);
                            setFileName(file.name);
                        }
                    }} 
                />
            </Button>
            {fileName && <Chip label={fileName} sx={{ mt: 1 }} onDelete={() => {
                formikProps.setFieldValue(label.toLowerCase().replace(' ', '_'), null);
                setFileName("");
            }}/>}
        </Paper>
    );
}


// ====================================================================
// == المكون الرئيسي لصفحة التعديل
// ====================================================================
const EditProjectSale = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);
  const { saleId } = useParams();
  const navigate = useNavigate();

  const { saleData, loading: dataLoading, error } = useSingleProjectSaleData({ saleId });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.keys(values).forEach(key => {
      if (['main_image', 'diagram_image', 'video_url'].includes(key)) {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        }
      } else {
        formData.append(key, values[key]);
      }
    });
    

    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'multipart/form-data' } };
      const response =await axios.post(`${baseUrl}${updateProjectSaleApi(saleId)}`, formData, config);
      console.log(response.data)
      snackbarRef.current.showSnackbar("Details updated successfully!", "success");
      navigate("/dashboard/sales");
    } catch (err) {
      snackbarRef.current.showSnackbar(err.response?.data?.message || "Update failed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationSchema = yup.object().shape({
    main_title: yup.string().required("Required"),
    marketing_description: yup.string().required("Required"),
    address: yup.string().required("Required"),
    location_link: yup.string().url("Must be a valid URL").required("Required"),
    main_image: yup.mixed().nullable(),
    diagram_image: yup.mixed().nullable(),
    video_url: yup.mixed().nullable(),
  });

  if (dataLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><CircularProgress /></Box>;
  }
  if (error || !saleData) {
    return (
        <Box m="20px">
            <Alert severity="error">
                Error: Could not load data for this sale listing. Please check the ID and try again.
            </Alert>
        </Box>
    );
  }



  return (
    <Box m="20px">
      <Header title="Edit Project Sale Details" subtitle={`Editing listing for: ${saleData?.main_title || ''}`} />
      
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          project_id:saleData.project_id,
            main_title: saleData?.main_title || "",
            marketing_description: saleData?.marketing_description || "",
            location_link: saleData?.location_link || "",
            address: saleData?.address || "",
            video_url: null, // تبدأ فارغة، المستخدم يرفع ملف جديد فقط عند الحاجة
            main_image: null,
            diagram_image: null,
        }}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <Box mt="20px" p="30px" backgroundColor={colors.primary[800]} borderRadius="12px">
              <Grid container spacing={4}>
                {/* --- قسم تفاصيل التسويق --- */}
                <Grid item xs={12} md={7}>
                  <Stack spacing={3}>
                    <TextField fullWidth disabled label="Project" value={saleData?.project?.title || ''} InputProps={{ startAdornment: <InputAdornment position="start"><ClassIcon/></InputAdornment> }} />
                    <TextField fullWidth variant="outlined" label="Main Title*" name="main_title" value={formikProps.values.main_title} onChange={formikProps.handleChange} onBlur={formikProps.handleBlur} error={!!formikProps.touched.main_title && !!formikProps.errors.main_title} helperText={formikProps.touched.main_title && formikProps.errors.main_title} InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon/></InputAdornment> }} />
                    <TextField fullWidth multiline rows={6} variant="outlined" label="Marketing Description*" name="marketing_description" value={formikProps.values.marketing_description} onChange={formikProps.handleChange} onBlur={formikProps.handleBlur} error={!!formikProps.touched.marketing_description && !!formikProps.errors.marketing_description} helperText={formikProps.touched.marketing_description && formikProps.errors.marketing_description} InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon/></InputAdornment> }} />
                    <TextField fullWidth variant="outlined" label="Address*" name="address" value={formikProps.values.address} onChange={formikProps.handleChange} onBlur={formikProps.handleBlur} error={!!formikProps.touched.address && !!formikProps.errors.address} helperText={formikProps.touched.address && formikProps.errors.address} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon/></InputAdornment> }} />
                    <TextField fullWidth variant="outlined" label="Location Link (URL)*" name="location_link" value={formikProps.values.location_link} onChange={formikProps.handleChange} onBlur={formikProps.handleBlur} error={!!formikProps.touched.location_link && !!formikProps.errors.location_link} helperText={formikProps.touched.location_link && formikProps.errors.location_link} InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon/></InputAdornment> }} />
                  </Stack>
                </Grid>
                
                {/* --- قسم إدارة الوسائط --- */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" color={colors.greenAccent[400]} gutterBottom>Media Management</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><MediaEditCard label="Main Image" currentFileUrl={saleData.main_image} fileType="image" formikProps={formikProps} /></Grid>
                        <Grid item xs={12}><MediaEditCard label="Diagram Image" currentFileUrl={saleData.diagram_image} fileType="image" formikProps={formikProps} /></Grid>
                        <Grid item xs={12}><MediaEditCard label="Video URL" currentFileUrl={saleData.video_url} fileType="video" formikProps={formikProps} /></Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ backgroundColor: colors.greenAccent[600], color: 'white', px: 4, py: 1.5 }}>
                    {isSubmitting ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Formik>
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default EditProjectSale;