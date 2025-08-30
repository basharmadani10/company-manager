// src/components/dialogs/UploadVersionDialog.jsx

import React, { useState } from "react";
import {
  Box, Typography, Button, TextField, CircularProgress, Snackbar, Alert,
  useTheme, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme";
import axios from "axios";
import { baseUrl } from "../../shared/baseUrl";
import { uploadNewerVersionApi } from "../../shared/APIs"; // You'll need to add this to your APIs file
import { getAuthToken } from "../../shared/Permissions";

const UploadVersionDialog = ({ open, onClose, onUploadSuccess, originalFileId, originalFileName }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedFile, setSelectedFile] = useState(null);
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleClose = () => {
    // Reset state on close
    setSelectedFile(null);
    setVersion("");
    setErrors({});
    onClose();
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    const newErrors = {};
    if (!selectedFile) newErrors.file = "Please select a file.";
    if (!version.trim()) newErrors.version = "Version is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("version", version);
    formData.append("parent_file_id", originalFileId); // Link to the original file

    try {
      const config = { headers: { "Authorization": `Bearer ${getAuthToken()}`, "Content-Type": "multipart/form-data" }};
      await axios.post(`${baseUrl}${uploadNewerVersionApi}${originalFileId}`, formData, config);

      setSnackbar({ open: true, message: "New version uploaded successfully!", severity: "success" });
      onUploadSuccess(); // Notify parent to refetch files
      handleClose();

    } catch (error) {
      console.error("Error uploading new version:", error);
      const errorMessage = error.response?.data?.message || "Failed to upload file. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: colors.primary[700], display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Upload New Version for "{originalFileName}"
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[800], pt: '20px !important' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              fullWidth
              error={!!errors.file}
            >
              {selectedFile ? selectedFile.name : "Select File"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {errors.file && <Alert severity="error" sx={{ mt: -2 }}>{errors.file}</Alert>}

            <TextField
              label="Version"
              variant="outlined"
              fullWidth
              value={version}
              onChange={(e) => {
                setVersion(e.target.value);
                setErrors(prev => ({ ...prev, version: "" }));
              }}
              error={!!errors.version}
              helperText={errors.version}
              placeholder="e.g., v1.1, 2.0"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[700], p: 2 }}>
          <Button onClick={handleClose} >Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: colors.greenAccent[600], "&:hover": { backgroundColor: colors.greenAccent[700] } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({...prev, open: false}))}>
        <Alert onClose={() => setSnackbar(prev => ({...prev, open: false}))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadVersionDialog;