import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import useBookUnitsData from "../../../hooks/getBookUnitsDataHook";
import ClientInstallmentsModal from "./ClientInstallmentsModal";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const UnitsTab = ({ bookId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { units, loading, error } = useBookUnitsData({ bookId });

  // State to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Function to open the modal with the correct IDs
  const handleViewInstallments = (unitId, clientId) => {
    setSelectedUnitId(unitId);
    setSelectedClientId(clientId);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
    setSelectedUnitId(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "Unit ID",
      width: 90,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.client.first_name} ${params.row.client.last_name}`,
    },
    {
      field: "clientEmail",
      headerName: "Client Email",
      flex: 1,
      valueGetter: (params) => params.row.client.email,
    },
    {
      field: "clientPhone",
      headerName: "Phone Number",
      flex: 1,
      valueGetter: (params) => params.row.client.phone_number,
    },
    {
      field: "first_payment_date",
      headerName: "First Payment",
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<ReceiptLongIcon />}
          onClick={() =>
            handleViewInstallments(params.row.id, params.row.client.id)
          }
        >
          Bills
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Box
        sx={{
          height: "75vh",
          width: "100%",
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={units || []}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>

      <ClientInstallmentsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        unitId={selectedUnitId}
        clientId={selectedClientId}
      />
    </>
  );
};

export default UnitsTab;