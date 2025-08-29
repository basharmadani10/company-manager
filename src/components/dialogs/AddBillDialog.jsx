import React ,{useState} from 'react';

import {
 Typography, Grid, CircularProgress, Alert, useTheme,Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, InputAdornment
} from '@mui/material';
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

// --- استيراد الملفات الخاصة بمشروعك ---
import { tokens } from '../../theme';

import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import { createProjectBookBillApi } from "../../shared/APIs";

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


const AddBillDialog = ({ open, onClose, bookId, onBillAdded }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState({ amount: "", description: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleCloseAndReset = () => {
      onClose();
      setTimeout(() => {
        setFormData({ amount: "", description: "" });
        setSubmitError(null);
      }, 300);
    };
  
    const handleSubmit = async () => {
      if (!formData.amount || !formData.description) {
        setSubmitError("Please fill in all fields.");
        return;
      }
  
      setIsSubmitting(true);
      setSubmitError(null);
  
      try {
        const finalData = {
          property_book_id: bookId,
          amount: parseFloat(formData.amount),
          description: formData.description,
        };
  
        console.log("Submitting Bill:", finalData);
  
        const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
        await axios.post(
          `${baseUrl}${createProjectBookBillApi}`,
          finalData,
          config
        );
  
        onBillAdded(); // <-- استدعاء دالة تحديث البيانات
        handleCloseAndReset();
      } catch (err) {
        console.error("Failed to create new bill:", err);
        setSubmitError(
          err.response?.data?.message || "Failed to add bill. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <Dialog
        open={open}
        onClose={handleCloseAndReset}
        PaperProps={{ sx: { minWidth: { sm: 450 } } }}
      >
        <DialogTitle
          sx={{
            backgroundColor: colors.primary[800],
            color: colors.greenAccent[400],
            fontWeight: "bold",
          }}
        >
          Add New Financial Bill
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}
        >
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              name="amount"
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: colors.primary[800], p: "16px 24px" }}
        >
          <Button onClick={handleCloseAndReset} sx={{ color: colors.grey[100] }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              backgroundColor: colors.greenAccent[700],
              "&:hover": { backgroundColor: colors.greenAccent[800] },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Bill"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default AddBillDialog;