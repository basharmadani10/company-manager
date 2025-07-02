// src/components/Engineers.jsx (Ensure correct path)

import { useState } from "react"; // For Snackbar state management

import { Header } from "../../components/Header";
import { tokens } from "../../theme";
// Ensure this is the correct path for your hook
// useEngineersData should also return a refetchEngineers function
import useEngineersData from "../../hooks/getAllEngineersDataHook";

import { Link } from "react-router-dom"; // For navigation links

import {
  Box,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton, // For button icons
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Import action icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Icon for the Add button

// Import the new Delete Confirmation component
import DeleteConfirmationComponent from "../../components/DeleteConfirmation"; // Ensure correct path

import { baseUrl } from "../../shared/baseUrl";
import { deleteEngineerApi, deleteProjectManagerApi } from "../../shared/APIs";
import useProjectManagersData from "../../hooks/getAllProjectManagersDataHook";
import { havePermission } from "../../shared/Permissions";


const ProjectManagers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Update your hook to return engineers, loading, error, AND refetchEngineers
  const {  managers, loading, error,refetchManagers} =useProjectManagersData();

  // State for Snackbar messages (notifications)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be: 'success' | 'error' | 'warning' | 'info'

  // Function to open the Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Function to close the Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Define DataGrid columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell", // Custom class for name styling
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell", // Custom class for name styling
    },
    {
      field: "specialization_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // Determine button color based on engineer's status
        const statusColor =
          params.value === "active" ? colors.greenAccent[600] : colors.redAccent[600];

        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Button
              sx={{
                fontSize: "10px",
                color: colors.primary[100], // Text color inside the button
                backgroundColor: statusColor, // Button background color based on status
                "&:hover": {
                  backgroundColor:
                    params.value === "active" ? colors.greenAccent[700] : colors.redAccent[700],
                },
              }}
              onClick={() => showSnackbar(`Engineer Status: ${params.value}`, "info")}
            >
              {params.value ? params.value : "Undefined"}
            </Button>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1, // Give more space for icons
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            {havePermission("edit project managers")&&
            <Link to={`/engineers/edit/${params.row.id}`} style={{ textDecoration: "none" }}>
              <IconButton
                aria-label="edit"
                sx={{ color: colors.blueAccent[400], "&:hover": { color: colors.blueAccent[300] } }}
              >
                <EditIcon />
              </IconButton>
            </Link>}

            {havePermission("delete project managers")&&
            <DeleteConfirmationComponent
              itemId={params.row.id}
              deleteApi={`${baseUrl}${deleteProjectManagerApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Manager deleted successfully!", "success");
                // refetchEngineers(); // 🚨 Refetch data to update the table
              }}
              onDeleteError={(errorMessage) => {
                showSnackbar(`Failed to delete Manager: ${errorMessage}`, "error");
              }}
              // Pass the delete icon to be rendered inside the component's button
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
              // You can also pass custom confirmation text if needed
              confirmationText="Are you sure you want to delete this Manager?"
            />}
          </Box>
        );
      },
    },
  ];

  // Loading Screen
  if (loading) {
    return (
      <Box m="10px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header
            title={"Project Managers"}
            subtitle={"Managing the Managers in the Company."}
          />
          {havePermission("create project managers")&&
          <Link to="/projectManagers/add" style={{ textDecoration: "none" }}>
            <Button
              variant="contained" // Use contained for a more prominent button
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.greenAccent[800],
                },
              }}
              startIcon={<AddIcon />} // Icon for the Add button
            >
              Add Engineer
            </Button>
          </Link>}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 150px)" // Adjust height to fit header
        >
          <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
          <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
            Loading Project Managers...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error Screen
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 150px)" // Adjust height to fit header
      >
        <Typography variant="h5" color="error" sx={{ textAlign: "center" }}>
          Error loading data: {error.message}
        </Typography>
        <Button
          onClick={refetchManagers} // Button to retry fetching data
          variant="outlined"
          sx={{ mt: 2, color: colors.blueAccent[500], borderColor: colors.blueAccent[500] }}
        >
          Retry
        </Button>
        {/* Add Snackbar to display error message gracefully */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Snackbar position
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Main Interface (when loading is successful)
  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header
          title={"Project Managers"}
          subtitle={"Managing the Managers in the Company."}
        />
        <Link to="/projectManagers/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[800],
              },
            }}
            startIcon={<AddIcon />} // Icon for the Add button
          >
            Add Manager
          </Button>
        </Link>
      </Box>
      <Box
        m="20px 0 0 0"
        height="90vh" // Fixed height for DataGrid
        sx={{
          // Custom styles for DataGrid
          "& .MuiDataGrid-root": {
            border: "none", // Remove outer border of the table
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none", // Remove bottom borders between cells
          },
          "& .name-column--cell": {
            // color: colors.greenAccent[300], // Distinct color for engineer names
            fontWeight: "bold", // Bold font for names
          },
          "& .MuiDataGrid-columnHeaders": {
            
            color: colors.greenAccent[400],
            // backgroundColor: colors.primary[800], // Background color for column headers
            borderBottom: "none",
            // fontSize: "1rem", // Larger font size for column headers
            fontWeight: "bold",
          },

        }}
      >
        <DataGrid
          rows={managers}
          columns={columns}
          pageSize={10} // Default number of rows per page
          rowsPerPageOptions={[5, 10, 20]} // Options for rows per page
          disableSelectionOnClick // Prevent row selection on click
        />
      </Box>

      {/* Snackbar for notifications at the bottom right */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Snackbar disappears after 6 seconds
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

export default ProjectManagers;