import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  useTheme,
  Stack,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { havePermission } from "../../../shared/Permissions";
import { baseUrl } from "../../../shared/baseUrl";
import { deleteProjectBookBillsApi } from "../../../shared/APIs";

// Icons
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import PaymentsIcon from "@mui/icons-material/Payments";
import CompassCalibrationIcon from "@mui/icons-material/CompassCalibration";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Components
import AddBillDialog from "../../../components/dialogs/AddBillDialog";
import DeleteConfirmationComponent from "../../../components/DeleteConfirmation";

// ====================================================================
// == COMPONENT DEFINITIONS ADDED HERE
// ====================================================================

const DetailItem = ({ icon, label, value }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  if (!value && value !== 0) return null;
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      {icon}
      <Box>
        <Typography variant="h6" color={colors.grey[300]}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

const BillsTable = ({ bills, loading, error, refetchBills }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'left' }}>
        <Typography color={colors.greenAccent[400]}>
          ${parseFloat(params.value).toLocaleString()}
        </Typography>
</Box>
      ),
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 0.3,
      renderCell: ({ row }) => (
        <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'center' }}>

          {havePermission("delete engineers") && (
            <DeleteConfirmationComponent
              itemId={row.id}
              deleteApi={`${baseUrl}${deleteProjectBookBillsApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Bill deleted successfully!", "success");
                if (refetchBills) refetchBills();
              }}
              onDeleteError={(errorMessage) =>
                showSnackbar(`Failed to delete: ${errorMessage}`, "error")
              }
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
              confirmationText="Are you sure you want to delete this bill?"
            />
          )}
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error?.message || "Failed to load bills."}</Alert>;
  }
  if (!bills || bills.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2, backgroundColor: colors.primary[900] }}>
        No bills found for this record.
      </Alert>
    );
  }
  return (
    <Box
      m="20px 0 0 0"
      height="70vh"
      sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { fontWeight: "bold" },
        "& .MuiDataGrid-columnHeaders": {
          color: colors.greenAccent[400],
          borderBottom: "none",
          fontWeight: "bold",
        },
      }}
    >
      <DataGrid
        rows={bills}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};


// ====================================================================
// == MAIN TAB COMPONENT
// ====================================================================

const BookInfoTab = ({ bookDetails, bills, billsLoading, billsError, refetchBills, bookId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isAddBillDialogOpen, setIsAddBillDialogOpen] = useState(false);

  const handleBillAdded = () => {
    setIsAddBillDialogOpen(false);
    if (refetchBills) {
      refetchBills();
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: colors.primary[800],
        borderRadius: "12px",
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12}>
          <Grid container spacing={{ xs: 2, md: 5 }}>
            <Grid item xs={12} md={7}>
              <Box display="flex">
                <Box
                  component="img"
                  src={bookDetails.diagram_image}
                  alt={bookDetails.model}
                  sx={{
                    width: "50%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                    border: `2px solid ${colors.primary[700]}`,
                  }}
                />
                <Box display="flex" flexDirection="column" height="100%" pl={3}>
                  <Typography variant="h2" fontWeight="bold">
                    {bookDetails.model}
                  </Typography>
                  <Typography
                    variant="h3"
                    color={colors.greenAccent[400]}
                    sx={{ mb: 2, mt: 1 }}
                  >
                    Book Price: ${parseFloat(bookDetails.price).toLocaleString()}
                  </Typography>
                  <Divider sx={{ mb: 3, borderColor: colors.grey[700] }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<SquareFootIcon color="primary" />}
                        label="Space"
                        value={`${bookDetails.space} m²`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<BedIcon color="primary" />}
                        label="Rooms"
                        value={bookDetails.number_of_rooms}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<BathtubIcon color="primary" />}
                        label="Bathrooms"
                        value={bookDetails.number_of_bathrooms}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<CompassCalibrationIcon color="primary" />}
                        label="Direction"
                        value={bookDetails.direction}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<PaymentsIcon color="primary" />}
                        label="First Payment"
                        value={
                          bookDetails.first_payment_amount
                            ? `$${parseFloat(
                                bookDetails.first_payment_amount
                              ).toLocaleString()}`
                            : "N/A"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<EventAvailableIcon color="primary" />}
                        label="Available Units"
                        value={bookDetails.available_units ?? "N/A"}
                      />
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3, borderColor: colors.grey[700] }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" color={colors.grey[300]}>
                    {bookDetails.description || "No description available."}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />

      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Financial Bills
          </Typography>
          <Button
            onClick={() => setIsAddBillDialogOpen(true)}
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100],
              "&:hover": { backgroundColor: colors.greenAccent[800] },
            }}
            startIcon={<AddIcon />}
          >
            Add Bill
          </Button>
        </Box>
        <BillsTable
          bills={bills}
          loading={billsLoading}
          error={billsError}
          refetchBills={refetchBills}
        />
      </Box>

      <AddBillDialog
        open={isAddBillDialogOpen}
        onClose={() => setIsAddBillDialogOpen(false)}
        bookId={bookId}
        onBillAdded={handleBillAdded}
      />
    </Paper>
  );
};

export default BookInfoTab;