import React, { useState, useMemo } from "react";
import {
  Box, Typography, Button, TextField, FormControl, InputLabel, Select, Chip,
  Divider, MenuItem, Grid, Card, CardContent, CircularProgress, Alert, Stack,
  useTheme, Snackbar,
  // --- إضافات جديدة للجدول وأزرار التبديل ---
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  ToggleButton, ToggleButtonGroup
} from "@mui/material";

// --- أيقونات جديدة ---
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // أيقونة عرض البطاقات
import ViewListIcon from '@mui/icons-material/ViewList';   // أيقونة عرض القائمة/الجدول
import StraightenIcon from "@mui/icons-material/Straighten";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";

// ... (باقي الـ imports تبقى كما هي)
import { tokens } from "../../../../theme";
import { Header } from "../../../../components/Header";
import useProjectInventoryData  from "../../../../hooks/getProjectInventoryDataHook";
import { useProject } from '../../../../contexts/ProjectContext';

import { DataGrid } from "@mui/x-data-grid";
import { SelectAndAddItemToInventoryDialog } from "../../../../components/dialogs/SelectItemToInventoryDialog";
import { havePermission } from "../../../../shared/Permissions";


// ====================================================================
// == مكون البطاقة (Card) - يبقى كما هو
// ====================================================================
const MaterialCard = ({ material }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card
      elevation={0}
      sx={{
        p: 2, backgroundColor: colors.primary[700], border: `1px solid ${colors.grey[700]}`,
        borderRadius: "12px", height: "100%", display: "flex", flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0px 8px 15px -5px ${colors.greenAccent[800]}`,
          borderColor: colors.greenAccent[700],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>{material.name}</Typography>
          <Chip icon={<CategoryIcon />} label={material.category} size="small" sx={{ backgroundColor: colors.primary[600], color: colors.grey[200] }} />
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <StraightenIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>Unit: <Typography component="span" fontWeight="bold" color={colors.grey[100]}>{material.unit}</Typography></Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Inventory2OutlinedIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>Available: <Typography component="span" fontWeight="bold" color={colors.grey[100]}>{material.quantity_available}</Typography></Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};


// ====================================================================
// == مكون الجدول الجديد
// ====================================================================
const MaterialsTable = ({ materials }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
      { field: "itemId", headerName: "ID", tokensflex: 0.5 },
      { field: "name", headerName: "Material Name", flex: 1, cellClassName: "name-column--cell" },
      { field: "category", headerName: "Category", flex: 1 },
      { field: "quantity_available", headerName: "Available Quantity", flex: 1 },
      { field: "unit", headerName: "Unit", flex: 0.5 },
    ];
  
console.log(materials);
    return (
      <Box m="20px 0 0 0" height="90vh" sx={{
        /* DataGrid styles remain the same */
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
          rows={materials}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.itemId} 
        />
      </Box>
    );
}


// ====================================================================
// == المكون الرئيسي
// ====================================================================
const ProjectInventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedProjectId } = useProject();
  
  const { materials, loading, error, refetchMaterials } = useProjectInventoryData ({});

  // --- حالات الفلترة ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // --- حالة جديدة للتحكم في وضع العرض ---
  const [viewMode, setViewMode] = useState('card');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // --- دالة لتبديل العرض ---
  const handleViewChange = (event, newView) => {
    if (newView !== null) { // التأكد من أن المستخدم اختار قيمة
      setViewMode(newView);
    }
  };

  // ... (useMemo and other handlers remain the same)
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
  
  const handleMaterialAdded = () => {
    refetchMaterials();
    setIsAddDialogOpen(false);
  };


  return (
    <Box >
      <Header
        title="Project Inventory"
        subtitle="Manage all materials assigned to the current project"
      />

      <Box mt="20px" >
        {/* --- قسم الفلاتر وأزرار التحكم --- */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }} alignItems="center">
          <TextField label="Search..." variant="outlined" fullWidth size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select value={selectedCategory} label="Category" onChange={(e) => setSelectedCategory(e.target.value)}>
              <MenuItem value=""><em>All</em></MenuItem>
              {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
            </Select>
          </FormControl>
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
          {havePermission("add item to inventory") && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setIsAddDialogOpen(true)}
            sx={{ flexShrink: 0, backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] } }}
          >
            Add Material
          </Button>
          )}
        </Stack>

        {/* --- قسم عرض البيانات (إما كروت أو جدول) --- */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <>
            {filteredMaterials.length === 0 ? (
              <Alert severity="info" sx={{ mt: 3 }}>No materials found for this project or matching your filter.</Alert>
            ) : viewMode === 'card' ? (
              // --- عرض البطاقات ---
              <Grid container spacing={1}>
                {filteredMaterials.map((material) => (
                  <Grid item key={material.id} xs={12} sm={6} md={4}>
                    <MaterialCard material={material} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              // --- عرض الجدول ---
              <MaterialsTable materials={filteredMaterials} />
            )}
          </>
        )}
      </Box>

      {/* --- الديالوجات تبقى كما هي --- */}
      <SelectAndAddItemToInventoryDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onConfirm={handleMaterialAdded}
        projectId={selectedProjectId}
        existingProjectMaterials={materials}
      />
    </Box>
  );
};

export default ProjectInventory;  