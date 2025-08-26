// =================================================================
//  Login Component - Self-Contained with Animated Background
// =================================================================

// React & Hooks
import React, { useState, useRef } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

// External Libraries
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

// New! Import for global styles from Emotion
import { Global, css } from "@emotion/react";

// Material-UI (MUI) Components
import {
  Box,
  Button,
  TextField,
  useTheme,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Avatar,
  Link,
} from "@mui/material";

// MUI Icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Custom Project Components & Utils
// (تأكد من أن هذه المسارات صحيحة في مشروعك)
import CustomSnackbar from "../../components/CustomSnackbar";
import { tokens } from "../../theme";
import { baseUrl } from "../../shared/baseUrl";
import { LoginApi, getMyPermissions } from "../../shared/APIs";
import { getAuthToken, setAuthToken, setPermissions, setRole } from "../../shared/Permissions";

// =================================================================

// 1. تعريف الأنيميشن والستايلات العامة كمتغير ثابت
const globalStyles = css`
  @keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Login = () => {
  // --- Setup hooks and state ---
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const snackbarRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Handlers ---
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}${LoginApi}`, {
        email: values.email,
        password: values.password,
      });

      const token = response.data.data.token;
      setAuthToken(token);

      const config = {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      };
      const permissionResponse = await axios.get(`${baseUrl}${getMyPermissions}`, config);

      setRole(permissionResponse.data.data.role);
      setPermissions(permissionResponse.data.data.permissions);

      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(
          "Login successful! Redirecting...",
          "success"
        );
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(errorMessage, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Formik & Yup Setup ---
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  // --- Render ---
  return (
    <>
      {/* 2. حقن الستايلات العامة في الصفحة باستخدام مكون Global */}
      <Global styles={globalStyles} />

      {/* 3. تطبيق الخلفية المتحركة مباشرةً على الحاوية الرئيسية باستخدام sx */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(-50deg, #292929, #080b12, #1e5245, #2a2d64)',
          backgroundSize: '400% 400%',
          animation: 'gradient-animation 15s ease infinite',
        }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* الفورم العائم بتأثير الزجاج */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="25px"
                p="40px"
                sx={{
                  width: { sm: "450px", xs: "90vw" },
                  backgroundColor: 'rgba(100, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(20px)',   
                }}
              >
                <Typography
    variant="h1"
    color={colors.greenAccent[400]}
    fontWeight="bold"
    sx={{ mb: 2 }} 
  >
    BuildPro
  </Typography>
              

                <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
                  Sign In
                </Typography>

                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
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

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    padding: "14px 0",
                    fontSize: "16px",
                    fontWeight: "bold",
                    mt: "10px",
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[900],
                    '&:hover': {
                      backgroundColor: colors.greenAccent[700],
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: colors.grey[900]}} />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
        <CustomSnackbar ref={snackbarRef} />
      </Box>
    </>
  );
};

export default Login;