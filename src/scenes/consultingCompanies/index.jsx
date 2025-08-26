// src/scenes/consultingCompanies/index.jsx (Final and Complete Code)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box, Typography, useTheme, Button, IconButton, Snackbar, Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import useConsultingCompaniesData from "../../hooks/getAllConsultingCompaniesDataHook";
import DeleteConfirmationComponent from "../../components/DeleteConfirmation";
import UpdateConsultingCompanyDialog from "./UpdateConsultingCompanyDialog";

import { baseUrl } from "../../shared/baseUrl";
import { deleteConsultingCompanyApi } from "../../shared/APIs";
import { havePermission } from "../../shared/Permissions";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from '@mui/icons-material/Visibility';


const ConsultingCompanies = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { companies, loading, error, refetchCompanies } = useConsultingCompaniesData();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Dialog state
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleOpenUpdateDialog = (company) => {
    setSelectedCompany(company);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setSelectedCompany(null);
    setIsUpdateDialogOpen(false);
  };

  // Function to handle cell clicks for navigation
  const handleCellClick = (params) => {
    // Ignore clicks on the 'actions' column to allow buttons to work
    if (params.field === 'actions') {
      return;
    }
    // Navigate to the details page with the company's ID
    navigate(`/dashboard/ConsultingCompanies/${params.row.id}/details`);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "email", headerName: "Email", flex: 1.2 },
    { field: "manager_name", headerName: "Manager Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1.2 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.8,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
            <Link to={`/dashboard/ConsultingCompanies/${row.id}/details`}>
            <IconButton aria-label="view">
              <VisibilityIcon sx={{ color: colors.grey[300], "&:hover": { color: colors.grey[100] } }} />
            </IconButton>
          </Link>
          
          {havePermission("edit consulting company") && (
            <IconButton
              aria-label="edit"
              onClick={() => handleOpenUpdateDialog(row)}
              sx={{ color: colors.blueAccent[400], "&:hover": { color: colors.blueAccent[300] } }}
            >
              <EditIcon />
            </IconButton>
          )}
          {havePermission("delete consulting company") && (
            <DeleteConfirmationComponent
              itemId={row.id}
              deleteApi={`${baseUrl}${deleteConsultingCompanyApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Company deleted successfully!", "success");
                refetchCompanies();
              }}
              onDeleteError={(msg) => showSnackbar(`Deletion failed: ${msg}`, "error")}
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
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
        <Header title="Consulting Companies" subtitle="Managing The Consulting Companies that work with us" />
        {havePermission("create consulting company") && (
          <Link to="/dashboard/ConsultingCompanies/add" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": { backgroundColor: colors.greenAccent[800] },
              }}
              startIcon={<AddIcon />}
            >
              Add Company
            </Button>
          </Link>
        )}
      </Box>

      <Box m="20px 0 0 0" height="90vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { fontWeight: "bold" },
          "& .MuiDataGrid-columnHeaders": { color: colors.greenAccent[400], borderBottom: "none", fontWeight: "bold" },
          // Style to make rows look clickable
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
      }}>
        <DataGrid
          rows={companies}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          onCellClick={handleCellClick} // Add the click handler to the grid
        />
      </Box>

      {/* Render the Update Dialog */}
      {selectedCompany && (
        <UpdateConsultingCompanyDialog
          open={isUpdateDialogOpen}
          onClose={handleCloseUpdateDialog}
          companyData={selectedCompany}
          onSuccess={() => {
            handleCloseUpdateDialog();
            refetchCompanies();
            showSnackbar("Company updated successfully!", "success");
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

export default ConsultingCompanies;