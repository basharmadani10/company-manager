// src/scenes/projects/path/to/tabs/MaterialsTab.jsx (Final Version with View Switcher)

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  // --- New Imports for View Switcher and Table ---
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // <-- New Import

// --- Icon Imports ---
import CategoryIcon from "@mui/icons-material/Category";
import StraightenIcon from "@mui/icons-material/Straighten";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // <-- New Icon
import ViewListIcon from '@mui/icons-material/ViewList';   // <-- New Icon

// --- Theme, API, Hooks, and Custom Components ---
import { tokens } from "../../../../theme";
import { Header } from "../../../../components/Header";
import axios from "axios";
import { baseUrl } from "../../../../shared/baseUrl";
import { getAuthToken, havePermission } from "../../../../shared/Permissions";
import { addExistingItemToProjectContainer } from "../../../../shared/APIs";
import { SelectAndAddItemDialog } from "../../../../components/dialogs/SelectItemDialog";
import useProjectItemsData from "../../../../hooks/getAllProjectItemsDataHook";
import { useProject } from '../../../../contexts/ProjectContext';

// ====================================================================
// == Material Card Component (No Changes Needed)
// ====================================================================
const MaterialCard = ({ material, onAddClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: colors.primary[700],
        border: `1px solid ${colors.grey[700]}`,
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0px 8px 15px -5px ${colors.greenAccent[800]}`,
          borderColor: colors.greenAccent[700],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
            {material.name}
          </Typography>
          <Chip
            icon={<CategoryIcon />}
            label={material.category}
            size="small"
            sx={{ backgroundColor: colors.primary[600], color: colors.grey[200] }}
          />
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <StraightenIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>
              Unit: <Typography component="span" fontWeight="bold" color={colors.grey[100]}>{material.unit}</Typography>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Inventory2OutlinedIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>
              Expected quantity: <Typography component="span" fontWeight="bold" color={colors.grey[100]}>{material.expected_quantity}</Typography>
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ====================================================================
// == New Table Component
// ====================================================================
const MaterialsTable = ({ materials, onAddClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Material Name", flex: 1.5, cellClassName: "name-column--cell" },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "unit", headerName: "Unit", flex: 0.5 },
    { field: "expected_quantity", headerName: "Expected Qty", type: 'number', flex: 1, align: 'left', headerAlign: 'left' },
  ];

  return (
    <Box sx={{
      height: '75vh', width: '100%',
      "& .MuiDataGrid-root": { border: "none" },
      "& .MuiDataGrid-cell": { borderBottom: `1px solid ${colors.grey[700]}` },
      "& .name-column--cell": { color: colors.greenAccent[300], fontWeight: 'bold' },
      "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.primary[600], borderBottom: "none" },
      "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[700] },
      "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[600] },
    }}>
      <DataGrid
        rows={materials}
        columns={columns}
        getRowId={(row) => row.id} // Ensure DataGrid knows how to get a unique ID
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
      />
    </Box>
  );
}


// ====================================================================
// == Main Component (MaterialsTab)
// ====================================================================
const MaterialsTab = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedProjectId } = useProject();
  const { materials, loading, error, refetchMaterials } = useProjectItemsData({});

  // --- New state for controlling the view mode ---
  const [viewMode, setViewMode] = useState('card');

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "info" });
  
  // --- New handler for changing the view ---
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const categories = useMemo(() => {
    if (!materials) return [];
    return Array.from(new Set(materials.map((m) => m.category)));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    return materials
      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((m) => selectedCategory ? m.category === selectedCategory : true);
  }, [materials, searchTerm, selectedCategory]);
  
  const handleOpenQuantityDialog = (material) => {
    setSelectedMaterial(material);
    setExpectedQuantity("");
    setSubmitError(null);
    setIsQuantityDialogOpen(true);
  };

  const handleCloseQuantityDialog = () => { setIsQuantityDialogOpen(false); setSelectedMaterial(null); };

  const handleConfirmAndAddItem = async () => {
    if (!expectedQuantity || parseFloat(expectedQuantity) <= 0) {
      setSubmitError("Please enter a valid, positive quantity.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        item_id: selectedMaterial.id, // Assuming selectedMaterial has the item's ID
        expected_quantity: parseFloat(expectedQuantity),
      };
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.post(`${baseUrl}${addExistingItemToProjectContainer}${selectedProjectId}`, payload, config);
      setFeedback({ open: true, message: `Successfully added ${selectedMaterial.name} to the project!`, severity: "success" });
      handleCloseQuantityDialog();
      refetchMaterials(); // Refetch to show updated data
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setSubmitError(errorMessage);
      setFeedback({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaterialAdded = () => { refetchMaterials(); setIsAddDialogOpen(false); };

  return (
    <Box sx={{ backgroundColor: colors.primary[800], borderRadius: "12px", mt: 1, p: 2 }}>
      <Header
        title="Project Expected Materials"
        subtitle="Browse and add materials to your project"
      />
      <Box mt="20px">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 4 }} alignItems="center">
          <TextField
            label="Search by material name..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
            </Select>
          </FormControl>
          
          {/* --- New ToggleButtonGroup to switch views --- */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value="card" aria-label="card view"><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="table" aria-label="table view"><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>

         {havePermission("create new items")&& (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setIsAddDialogOpen(true)}
            sx={{
              flexShrink: 0,
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100],
              "&:hover": { backgroundColor: colors.greenAccent[800] },
            }}
          >
            Add New
          </Button>
         )} 

        </Stack>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <>
            {filteredMaterials.length === 0 ? (
              <Alert severity="info" sx={{ mt: 3 }}>No materials found matching your criteria.</Alert>
            ) : viewMode === 'card' ? (
              // --- Card View ---
              <Grid container spacing={3}>
                {filteredMaterials.map((material) => (
                  <Grid item key={material.id} xs={12} sm={6} md={4}>
                    <MaterialCard material={material} onAddClick={handleOpenQuantityDialog} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              // --- Table View ---
              <MaterialsTable materials={filteredMaterials} onAddClick={handleOpenQuantityDialog} />
            )}
          </>
        )}
      </Box>

      {/* --- Dialogs and Snackbar --- */}
      {selectedMaterial && (
        <Dialog open={isQuantityDialogOpen} onClose={handleCloseQuantityDialog}>
          <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400] }}>
            Enter Quantity for <Typography component="span" color="white" fontWeight="bold">{selectedMaterial.name}</Typography>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}>
            {submitError && (<Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>)}
            <TextField
              autoFocus margin="dense" name="expected_quantity"
              label="Expected Quantity" type="number" fullWidth
              variant="outlined" value={expectedQuantity}
              onChange={(e) => setExpectedQuantity(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
            <Button onClick={handleCloseQuantityDialog} disabled={isSubmitting} sx={{ color: colors.grey[100] }}>Cancel</Button>
            <Button onClick={handleConfirmAndAddItem} variant="contained" disabled={isSubmitting}
              sx={{ backgroundColor: colors.greenAccent[700], "&:hover": { backgroundColor: colors.greenAccent[800] } }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Confirm & Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <SelectAndAddItemDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onConfirm={handleMaterialAdded}
        existingProjectMaterials={materials}
      />
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setFeedback({ ...feedback, open: false })} severity={feedback.severity} sx={{ width: "100%" }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaterialsTab;