// src/components/DeleteConfirmationComponent.jsx

import React, { useState,useRef } from 'react';
import
 MuiAlert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Stack,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { tokens } from '../theme';
import CustomSnackbar from './CustomSnackbar';
import { getAuthToken } from '../shared/Permissions';

// Helper Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DeleteConfirmationComponent=({ itemId, deleteApi, onDeleteSuccess, onDeleteError })=> {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const snackbarRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  

  const handleClickOpen = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDelete = async () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog

    try {

      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      console.log(`Attempting to delete item with ID: ${itemId} from API: ${deleteApi}${itemId}`,config);
      const response = await axios.delete(`${deleteApi}${itemId}`,config);
      console.log("Delete successful:", response.data);

      // --- CRITICAL CHANGE HERE ---
      // Ensure snackbar state is set BEFORE calling onDeleteSuccess

      // Now call the parent's success handler
      if (onDeleteSuccess) {
        if (snackbarRef.current) {
          snackbarRef.current.showSnackbar(
            "File deleted successfully!",
            "success"
          );
        }
      }

     

    } catch (error) {
      console.error('Error during deletion:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      if (snackbarRef.current) {
        snackbarRef.current.showSnackbar(errorMessage, "error");
      }

      if (onDeleteError) {
        onDeleteError(itemId, error);
      }
    }finally{
      onDeleteSuccess();
    }
  };



  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <IconButton
        color="error"
        onClick={handleClickOpen}
      >
        <DeleteOutlineIcon />
      </IconButton>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // --- Apply custom styles to the Dialog ---
        PaperProps={{ // Target the Paper component that wraps the dialog content
          sx: {
            backgroundColor: colors.primary[700], // Example: A darker background
            color: colors.grey[100],             // Text color for the entire dialog
            borderRadius: '8px',                 // Rounded corners
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)', // Custom shadow
          }
        }}
        // --- End custom styles for Dialog ---
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: colors.primary[800], // Header background
            color: colors.greenAccent[400],      // Header text color
            fontWeight: 'bold',
            padding: '16px 24px',
          
          }}
        >
          {"Confirm deletion process"}
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '24px',
            color: colors.grey[200],
            backgroundColor:colors.primary[800] // Content text color
          }}
        >
          <DialogContentText id="alert-dialog-description" component="span"> {/* Use component="span" to apply color directly */}
            Are you sure you want to delete this item? Be careful, you cannot undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: colors.primary[800], // Footer background
            padding: '16px 24px',
          }}
        >
          <Button onClick={handleCloseConfirmDialog} sx={{ color: colors.grey[100] }}> {/* Custom color for Cancel */}
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: colors.redAccent[500] }} autoFocus> {/* Custom color for Delete */}
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <CustomSnackbar ref={snackbarRef} />
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Stay open for 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </Stack>
  );
}

export default DeleteConfirmationComponent;