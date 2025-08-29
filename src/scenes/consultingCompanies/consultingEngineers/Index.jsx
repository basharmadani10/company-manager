// src/scenes/consultingCompanies/consultingEngineers/index.jsx (Updated file)

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Typography, useTheme, Button, IconButton, CircularProgress, Snackbar, Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import useConsultingEngineersData from "../../../hooks/getAllConsultingEngineersDataHook";
import DeleteConfirmationComponent from "../../../components/DeleteConfirmation";
import UpdateConsultingEngineerDialog from "./UpdateConsultingEngineerDialog"; // <-- استيراد المكون الجديد

import { baseUrl } from "../../../shared/baseUrl";
import { deleteConsultingEngineerApi } from "../../../shared/APIs";
import { havePermission } from "../../../shared/Permissions";

// Icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const ConsultingEngineers = ({ consultingCompanyId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { engineers, loading, error, refetchEngineers } = useConsultingEngineersData({ consultingCompanyId });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Dialog state
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

  const handleOpenUpdateDialog = (engineer) => {
    setSelectedEngineer(engineer);
    setIsUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setSelectedEngineer(null);
    setIsUpdateDialogOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "first_name", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "last_name", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "specialization_name", headerName: "Specialization", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
        field: "status",
        headerName: "Status",
        flex: 0.5,
        renderCell: ({ row }) => (
          <Box width="100%" display="flex" justifyContent="center" alignItems="center" height="100%">
            {havePermission("activate user") &&(
            <Button sx={{
              backgroundColor: row.status == 1 ? colors.greenAccent[600] : colors.redAccent[600],
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: row.status == 1 ? colors.greenAccent[700] : colors.redAccent[700],
              }
            }}>
              { row.status == 1 ?"active":"unactive"}
            </Button>
            )}
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
          {havePermission("edit consulting engineers") && ( // Assuming same permission, adjust if needed
            <IconButton onClick={() => handleOpenUpdateDialog(row)}  sx={{ fontSize:"small",color: colors.blueAccent[400], "&:hover": { color: colors.blueAccent[300] } }}>
              <EditIcon />
            </IconButton>
          )}
          {havePermission("delete consulting engineers") && ( // Assuming same permission, adjust if needed
            <DeleteConfirmationComponent
              itemId={row.id}
              deleteApi={`${baseUrl}${deleteConsultingEngineerApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Engineer deleted successfully!", "success");
                refetchEngineers();
              }}
              onDeleteError={(msg) => showSnackbar(`Deletion failed: ${msg}`, "error")}
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
            />
          )}
        </Box>
      ),
    },
  ];

   if (error) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh"><Typography color="error">Error: {error.message}</Typography></Box>;

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="Consulting Engineers" subtitle="Managing the engineers for this company" />
        {havePermission("create consulting engineers") && (
          <Link to={`/dashboard/ConsultingCompanies/${consultingCompanyId}/ConsultingEngineers/add`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] }}} startIcon={<AddIcon />}>
              Add Engineer
            </Button>
          </Link>
        )}
      </Box>

      <Box m="20px 0 0 0" height="75vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { fontWeight: "bold" },
          "& .MuiDataGrid-columnHeaders": { color: colors.greenAccent[400], borderBottom: "none", fontWeight: "bold" },
      }}>
        <DataGrid
          rows={engineers}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>

      {selectedEngineer && (
        <UpdateConsultingEngineerDialog
          open={isUpdateDialogOpen}
          onClose={handleCloseUpdateDialog}
          engineerData={selectedEngineer}
          consultingCompanyId={consultingCompanyId}
          onSuccess={() => {
            handleCloseUpdateDialog();
            refetchEngineers();
            showSnackbar("Engineer updated successfully!", "success");
          }}
        />
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsultingEngineers;