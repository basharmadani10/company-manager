import React from "react";
import { Box, Typography, useTheme, Button, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import useProjectSalesData from "../../hooks/getAllProjectsToSaleDataHook";
import { havePermission } from "../../shared/Permissions";
import DeleteConfirmationComponent from "../../components/DeleteConfirmation";
import { deleteProjectSaleApi } from "../../shared/APIs";
import { baseUrl } from "../../shared/baseUrl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ListedSalesProjects = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { sales, loading, error, refetchSales } = useProjectSalesData();

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "main_title", headerName: "Marketing Title", flex: 1, cellClassName: "name-column--cell" },
    { field: "title", headerName: "Project Name", flex: 1, valueGetter: (params) => params.row.project?.title || '' },
    { field: "status_of_sale", headerName: "Status", flex: 1, valueGetter: (params) => params.row.project?.status_of_sale || '' },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="Edit Sale Details">
            <IconButton onClick={() => navigate(`/dashboard/sales/${row.id}/edit`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          {havePermission("delete sales listing") && (
            <DeleteConfirmationComponent
              itemId={row.id}
              deleteApi={`${baseUrl}${deleteProjectSaleApi}`}
              onDeleteSuccess={refetchSales}
              confirmationText={`Are you sure to delete listing for "${row.main_title}"?`}
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
            />
          )}
        </Box>
      ),
    },
  ];

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="Projects for Sale" subtitle="Manage all projects currently listed for sale" />
        {havePermission("create sales listing") && (
          <Link to="/dashboard/sales/add">
            <Button variant="contained" sx={{ backgroundColor: colors.greenAccent[700] }} startIcon={<AddCircleOutlineIcon />}>
              List New Project
            </Button>
          </Link>
        )}
      </Box>
      <Box m="20px 0 0 0" height="75vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300], fontWeight: "bold" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
      }}>
        <DataGrid
          rows={sales}
          columns={columns}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default ListedSalesProjects;