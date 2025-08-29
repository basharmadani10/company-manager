// src/components/AddFileDialog.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../../theme";
import axios from "axios";
import { baseUrl } from "../../../shared/baseUrl";
import { addProjectFileApi } from "../../../shared/APIs";
import { getAuthToken } from "../../../shared/Permissions";
import { useProject } from '../../../contexts/ProjectContext';


const AddProjectFile = ({ open, onClose,  onUploadSuccess }) => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [fileError, setFileError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const { selectedProjectId } = useProject();



  const config = {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }}

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileError("");
    } else {
      setSelectedFile(null);
    }
  };

  const handleDescriptionChange = (event) => {
    setFileDescription(event.target.value);
    setDescriptionError("");
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("file-upload-button");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let valid = true;
    if (!selectedFile) {
      setFileError("Please select a file to upload.");
      valid = false;
    }
    if (!fileDescription.trim()) {
      setDescriptionError("Description cannot be empty.");
      valid = false;
    }

    if (!valid) {
      showSnackbar("Please correct the errors in the form.", "warning");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", fileDescription);
    formData.append("project_id", selectedProjectId);

    try {
      const response = await axios.post(
        `${baseUrl}${addProjectFileApi(selectedProjectId)}`,
        formData,
config
      );

      if (response.status === 201 || response.status === 200) {
        showSnackbar("File uploaded successfully!", "success");
        onUploadSuccess(); // Notify parent to refetch files
        onClose();
      } else {
        showSnackbar(
          `Failed to upload file: ${response.data.message || "Unknown error"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      let errorMessage = "Failed to upload file. Please try again.";
      if (error.response) {
        if (error.response.status === 422 && error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          if (validationErrors.file) {
            setFileError(validationErrors.file[0]);
          }
          if (validationErrors.description) {
            setDescriptionError(validationErrors.description[0]);
          }
          if (validationErrors.project_id) {
            showSnackbar(
              `Project ID Error: ${validationErrors.project_id[0]}`,
              "error"
            );
          }
          errorMessage = "Validation failed. Please check your inputs.";
        } else {
          errorMessage =
            error.response.data.message || error.response.statusText;
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your network connection.";
      } else {
        errorMessage = error.message;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ backgroundColor: colors.primary[700] }}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Upload New File
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
          >
            <FormControl fullWidth error={!!fileError}>
              <InputLabel
                htmlFor="file-upload-button"
                sx={{ color: colors.greenAccent[300] }}
              >
                {selectedFile ? selectedFile.name : "Select File"}
              </InputLabel>
              <OutlinedInput
                id="file-display-input" // Give this a new ID for clarity, as it's not the actual file input
                readOnly // Make it read-only since it's just displaying
                value={selectedFile ? selectedFile.name : ""} // Display the file name
                label="Select File"
                startAdornment={
                  <InputAdornment position="start">
                    {/* This IconButton will now trigger the hidden input */}
                    <IconButton
                      component="label"
                      htmlFor="hidden-file-upload-button"
                      sx={{ color: colors.blueAccent[300] }}
                    >
                      <UploadFileIcon />
                    </IconButton>
                  </InputAdornment>
                }
                endAdornment={
                  selectedFile && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClearFile}
                        edge="end"
                        sx={{ color: colors.grey[400] }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.grey[500],
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.greenAccent[500],
                  },
                  ".MuiInputBase-input": { color: colors.grey[100] },
                }}
              />
              {fileError && (
                <FormHelperText sx={{ color: colors.redAccent[500] }}>
                  {fileError}
                </FormHelperText>
              )}

              {/* The actual file input, visually hidden */}
              <input
                type="file"
                id="hidden-file-upload-button"
                onChange={handleFileChange}
                style={{ display: "none" }} // This hides the native input
              />
              {fileError && (
                <FormHelperText sx={{ color: colors.redAccent[500] }}>
                  {fileError}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              label="File Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={fileDescription}
              onChange={handleDescriptionChange}
              error={!!descriptionError}
              helperText={descriptionError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colors.grey[500] },
                  "&:hover fieldset": { borderColor: colors.greenAccent[500] },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.greenAccent[500],
                  },
                },
                "& .MuiInputLabel-root": { color: colors.grey[100] },
                "& .MuiInputBase-input": { color: colors.grey[100] },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              disabled={loading}
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: colors.primary[100],
                padding: "10px 20px",
                fontSize: "1rem",
                "&:hover": { backgroundColor: colors.greenAccent[700] },
                "&.Mui-disabled": {
                  backgroundColor: colors.grey[600],
                  color: colors.grey[400],
                },
              }}
            >
              {loading ? "Uploading..." : "Upload File"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Dialog>
  );
};

export default AddProjectFile;

