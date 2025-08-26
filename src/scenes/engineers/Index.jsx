// src/components/Engineers.jsx (Updated to use the Dialog)

import { useState } from "react";
import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import useEngineersData from "../../hooks/getAllEngineersDataHook";
import { Link } from "react-router-dom";
import {
  Box, Typography, useTheme, Button, CircularProgress, Snackbar, Alert, IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

// Import custom components
import DeleteConfirmationComponent from "../../components/DeleteConfirmation";
import UpdateEngineerDialog from "./UpdateEngineer";

import { baseUrl } from "../../shared/baseUrl";
import { deleteEngineerApi } from "../../shared/APIs";
import { havePermission } from "../../shared/Permissions";


const Engineers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { engineers, loading, error, refetchEngineers } = useEngineersData();

  // State for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // State for the Update Dialog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  
  // Handlers for opening and closing the dialog
  const handleOpenUpdateDialog = (engineer) => {
    setSelectedEngineer(engineer);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setSelectedEngineer(null);
    setIsUpdateDialogOpen(false);
  };
  
  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "first_name", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "last_name", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "specialization_name", headerName: "Specialization", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "is_active",
      headerName: "Status",
      sortable: false,
      filterable: false,
      flex:0.5,
      renderCell: ({ value }) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
          <Button  sx={{
                        backgroundColor: colors.greenAccent[700],
                        color: colors.primary[100],
                        "&:hover": { backgroundColor: colors.greenAccent[800] },
                    }}>
            {value ===1 ? "active" :"unactive" || "Undefined"}
          </Button>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.5,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
          {havePermission("edit engineers") && (
            // This button now opens the dialog
            <IconButton
              aria-label="edit"
              onClick={() => handleOpenUpdateDialog(row)}
              sx={{ color: colors.blueAccent[400], "&:hover": { color: colors.blueAccent[300] } }}
            >
              <EditIcon />
            </IconButton>
          )}

          {havePermission("delete engineers") && (
            <DeleteConfirmationComponent
              itemId={row.id}
              deleteApi={`${baseUrl}${deleteEngineerApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Engineer deleted successfully!", "success");
                refetchEngineers();
              }}
              onDeleteError={(errorMessage) => showSnackbar(`Failed to delete: ${errorMessage}`, "error")}
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
              confirmationText="Are you sure you want to delete this engineer?"
            />
          )}
        </Box>
      ),
    },
  ];

  // Loading and Error screens remain the same...
  
  if (error) {
    // Return error UI
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><Typography color="error">Error: {error.message}</Typography></Box>
  }

  return (
    <Box m="10px">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Header title="Engineers" subtitle="Managing the Engineers in the Company" />
            {havePermission("create engineers") && (
            <Link to="/dashboard/engineers/add" style={{ textDecoration: "none" }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: colors.greenAccent[700],
                        color: colors.primary[100],
                        "&:hover": { backgroundColor: colors.greenAccent[800] },
                    }}
                    startIcon={<AddIcon />}
                >
                Add Engineer
                </Button>
            </Link>
            )}
      </Box>
      <Box m="20px 0 0 0" height="90vh" sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { fontWeight: "bold" },
        "& .MuiDataGrid-columnHeaders": {
            color: colors.greenAccent[400],
            borderBottom: "none",
            fontWeight: "bold",
        },
      }}>
        <DataGrid
          rows={engineers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={loading} // Show loading overlay on the grid
        />
      </Box>

      {/* Render the Update Dialog */}
      {selectedEngineer && (
        <UpdateEngineerDialog
            open={isUpdateDialogOpen}
            onClose={handleCloseUpdateDialog}
            engineerData={selectedEngineer}
            onSuccess={() => {
                handleCloseUpdateDialog(); // Close dialog on success
                refetchEngineers(); // Refetch data to show changes
                showSnackbar("Engineer updated successfully!", "success");
            }}
        />
      )}

      {/* Snackbar for all notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Engineers;