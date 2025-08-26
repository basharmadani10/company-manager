// src/scenes/engineers/addEngineer/index.jsx (path based on your initial prompt)

// imports
import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
import { createProjectManagerApi } from "../../../shared/APIs";
import CustomSnackbar from "../../../components/CustomSnackbar";

// react
import { useState, useRef } from "react";

// mui libraries
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  TextField,
  InputLabel,
  FormControl,
  NativeSelect, // Assuming you still want a native select for specialization
  CircularProgress,
  Grid, // <--- Import Grid
  Typography, // <--- Import Typography
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

// Icons
import PersonIcon from "@mui/icons-material/Person"; // For first/last name
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WorkIcon from "@mui/icons-material/Work"; // For specialization/experience
import LockIcon from "@mui/icons-material/Lock"; // For password
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//External libraries
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { getAuthToken } from "../../../shared/Permissions";

const AddProjectManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");


  // password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // handling create engineer Api
  const [isLoading, setIsLoading] = useState(false);
  const snackbarRef = useRef(null);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true); // Set loading state to true
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }}
        
      console.log("Submitting values:", values);
      const response = await axios.post(
        `${baseUrl}${createProjectManagerApi}`,
        values,
        config
      );

      console.log("Manager created successfully:", response.data);
      snackbarRef.current.showSnackbar(
        "Manager created successfully!",
        "success"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      console.error(
        "Error creating Manager:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create Manager. Please try again.";
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    bio:"",
    password: "",
    years_of_experience: "",
  };

  const phoneRegExp =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  //handle validations
  const userSchema = yup.object().shape({
    first_name: yup.string().required("First Name is required"), // Updated messages for clarity
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is invalid")
      .required("Phone Number is required"),
      bio: yup.string(),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"), // Added min length
    years_of_experience: yup
      .number()
      .typeError("Experience must be a number")
      .required("Years of Experience is required")
      .min(0, "Cannot be negative"),
  });

  // the main return
  return (
    <Box m="10px">
      <Header
        title="Create New Project Manager"
        subtitle="Add a new Project Manager to the system"
      ></Header>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // Align content to the top
          mt: "20px",
          mb: "20px", // Add bottom margin for spacing
        }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={userSchema} // Use the updated validation schema
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: isNonMobile ? "75%" : "100%", // Responsive width for form container
                  maxWidth: "900px", // Max width for large screens
                  p: "30px", // Padding around the form sections
                  backgroundColor: colors.primary[800], // Background for the form container
                  borderRadius: "12px", // Slightly more rounded corners
                  boxShadow: `0px 0px 15px -5px ${colors.greenAccent[600]}`, // Subtle shadow
                  gap: "25px", // Gap between main sections
                }}
              >
                {/* --- Personal Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 1, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                >
                  Personal Details
                </Typography>
                <Grid container  spacing={3} sx={{ width: "100%" }}>
                  {/* First Name and Last Name side-by-side on larger screens */}
                  <Grid item xs={12} sm={6} >
                    <TextField
                      fullWidth
                      variant="outlined" // Changed to outlined
                      type="text"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.first_name}
                      name="first_name"
                      error={!!touched.first_name && !!errors.first_name}
                      helperText={touched.first_name && errors.first_name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined" // Changed to outlined
                      type="text"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.last_name}
                      name="last_name"
                      error={!!touched.last_name && !!errors.last_name}
                      helperText={touched.last_name && errors.last_name}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} >
                    <TextField
                    rows={4}
                    multiline
                      fullWidth
                      variant="outlined" // Changed to outlined
                      type="text"
                      label="Bio"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.bio}
                      name="bio"
                      error={!!touched.bio && !!errors.bio}
                      helperText={touched.bio && errors.bio}
                      InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                    </Grid>
                </Grid>

                {/* --- Contact Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                >
                  Contact Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined" // Changed to outlined
                      type="email"
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined" // Changed to outlined
                      type="tel" // Use type="tel" for phone number
                      label="Phone Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone_number}
                      name="phone_number"
                      error={!!touched.phone_number && !!errors.phone_number}
                      helperText={touched.phone_number && errors.phone_number}
                      InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
                    />
                  </Grid>
                </Grid>

                {/* --- Professional Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[600]}` }}
                >
                  Professional Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
    <Grid item xs={12} sm={6}>
        <TextField
            fullWidth
            variant="outlined"
            type="number"
            label="Years of Experience"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.years_of_experience}
            name="years_of_experience"
            error={!!touched.years_of_experience && !!errors.years_of_experience}
            helperText={touched.years_of_experience && errors.years_of_experience}
            InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: colors.grey[500] }} /></InputAdornment> }}
        />
    </Grid>
</Grid>

                {/* --- Account Details Section --- */}
                <Typography
                  variant="h5"
                  color={colors.greenAccent[400]}
                  sx={{ mb: 1, mt: 3, width: "100%", textAlign: "left", pb: "8px", borderBottom: `1px solid ${colors.grey[700]}` }}
                >
                  Account Details
                </Typography>
                <Grid container spacing={3} sx={{ width: "100%" }}>
                  <Grid item xs={12}> {/* Password full width */}
                    <TextField
                      fullWidth
                      variant="outlined" // Changed to outlined
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={!!touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: colors.grey[500] }} /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* --- Submit Button --- */}
                <Box display="flex" justifyContent="end" mt="30px" width="100%">
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: colors.greenAccent[700],
                      color: colors.blueAccent[100],
                      padding: "12px 25px",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
                    }}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      '&:hover': {
                        backgroundColor: colors.greenAccent[800],
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Engineer" // Updated button text
                    )}
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default AddProjectManager;