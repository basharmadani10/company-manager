import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Typography, useTheme, Button, CircularProgress, Snackbar, Alert, IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import useSalesManagersData from "../../hooks/getAllSalesManagersDataHook"; // <-- استخدام الـ hook الجديد
import DeleteConfirmationComponent from "../../components/DeleteConfirmation";
import UpdateSalesManagerDialog from "./UpdateSalesManagerDialog"; // <-- ديالوج تعديل جديد

import { baseUrl } from "../../shared/baseUrl";
import { deleteSalesManagerApi } from "../../shared/APIs"; // <-- API حذف جديد
import { havePermission } from "../../shared/Permissions";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const SalesManagers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // --- استخدام الـ Hook والبيانات الجديدة ---
  const { salesManagers, loading, error, refetchSalesManagers } = useSalesManagersData();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Dialog state
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleOpenUpdateDialog = (manager) => {
    setSelectedManager(manager);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setSelectedManager(null);
    setIsUpdateDialogOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "first_name", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "last_name", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0.5,
    //   renderCell: ({ value }) => (
    //     <Box width="100%" display="flex" justifyContent="center" alignItems="center" height="100%">
    //       <Button sx={{
    //         fontSize: "10px",
    //         color: colors.primary[100],
    //         backgroundColor: value ? colors.greenAccent[600] : colors.redAccent[600],
    //         "&:hover": { backgroundColor: value ? colors.greenAccent[700] : colors.redAccent[700] },
    //       }}>
    //         {value ? "Active" : "Inactive"}
    //       </Button>
    //     </Box>
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.5,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          {havePermission("edit real estate managers") && (
            <IconButton
              aria-label="edit"
              onClick={() => handleOpenUpdateDialog(row)}
              sx={{ color: colors.blueAccent[400], "&:hover": { color: colors.blueAccent[300] } }}
            >
              <EditIcon />
            </IconButton>
          )}
          {havePermission("delete real estate managers") && (
            <DeleteConfirmationComponent
              itemId={row.id}
              deleteApi={`${baseUrl}${deleteSalesManagerApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Manager deleted successfully!", "success");
                refetchSalesManagers();
              }}
              onDeleteError={(msg) => showSnackbar(`Deletion failed: ${msg}`, "error")}
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
              confirmationText="Are you sure you want to delete this sales manager?"
            />
          )}
        </Box>
      ),
    },
  ];
  
  if (error) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><Typography color="error">Error: {error.message}</Typography></Box>
  }

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="Sales Managers" subtitle="Managing the Sales Managers in the Company" />
        {havePermission("create real estate managers") && (
          <Link to="/dashboard/salesManagers/add" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": { backgroundColor: colors.greenAccent[800] },
              }}
              startIcon={<AddIcon />}
            >
              Add Sales Manager
            </Button>
          </Link>
        )}
      </Box>

      <Box m="20px 0 0 0" height="90vh" sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { fontWeight: "bold", color: colors.greenAccent[300] },
        "& .MuiDataGrid-columnHeaders": { color: colors.greenAccent[400], borderBottom: "none", fontWeight: "bold" },
      }}>
        <DataGrid
          rows={salesManagers}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </Box>

      {selectedManager && (
        <UpdateSalesManagerDialog
          open={isUpdateDialogOpen}
          onClose={handleCloseUpdateDialog}
          managerData={selectedManager}
          onSuccess={() => {
            handleCloseUpdateDialog();
            refetchSalesManagers();
            showSnackbar("Manager updated successfully!", "success");
          }}
        />
      )}

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

export default SalesManagers;