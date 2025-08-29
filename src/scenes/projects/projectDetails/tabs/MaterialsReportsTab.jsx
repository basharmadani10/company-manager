import React, { useState, useMemo } from "react";
import {
  Box,
  LinearProgress,
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
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  // --- إضافات جديدة للجدول وأزرار التبديل ---
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

// --- استيراد DataGrid للجدول ---
import { DataGrid } from "@mui/x-data-grid";

// --- أيقونات جديدة ---
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // أيقونة عرض البطاقات
import ViewListIcon from '@mui/icons-material/ViewList';   // أيقونة عرض القائمة/الجدول
import StraightenIcon from "@mui/icons-material/Straighten";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// --- Theme, API, Hooks, and Custom Components ---
import { tokens } from "../../../../theme";
import { Header } from "../../../../components/Header";
import axios from "axios";
import { baseUrl } from "../../../../shared/baseUrl";
import { getAuthToken } from "../../../../shared/Permissions";
import {
  addExistingItemToProjectContainer,
  createNewItemApi,
} from "../../../../shared/APIs";
import { SelectAndAddItemDialog } from "../../../../components/dialogs/SelectItemDialog";
import { useProject } from '../../../../contexts/ProjectContext';
import useProjectContainerReportsData from "../../../../hooks/getAllProjectContainerReportsDataHook";
import { green, red } from "@mui/material/colors";

// ====================================================================
// == مكون البطاقة (Card) - تم استخدام TestCard من الكود الأصلي
// ====================================================================
const TestCard = ({ material }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const consumedPercentage = material.expected_quantity > 0
        ? (material.consumed_quantity / material.expected_quantity) * 100
        : 0;

    const getProgressColor = () => {
        if (consumedPercentage > 90) return colors.redAccent[500];
        if (consumedPercentage > 60) return colors.yellowAccent[600];
        return colors.greenAccent[500];
    };

    return (
        <Card
            elevation={0}
            sx={{
                p: 2,
                backgroundColor: colors.primary[700],
                border: `1px solid ${colors.grey[700]}`,
                borderRadius: "12px",
                transition: "all 0.2s ease-in-out",
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                "&:hover": {
                    cursor: "pointer",
                    borderColor: getProgressColor(),
                    boxShadow: `0px 4px 12px -5px ${getProgressColor()}`,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 0 }}>
                {/* --- HEADER SECTION --- */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="div" fontWeight="bold">
                        {material.name}
                    </Typography>
                    <Chip
                        label={material.category}
                        icon={<CategoryIcon />}
                        size="small"
                        sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
                    />
                </Box>
                 <InfoItem
                    icon={<AttachMoneyIcon fontSize="small" />}
                    text={`Unit: ${material.unit}`}
                />
                {/* --- QUANTITY DETAILS SECTION --- */}
                <Box sx={{ mt: 2, p: 1.5, backgroundColor: colors.primary[800], borderRadius: '8px', border: `1px solid ${colors.grey[800]}` }}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InfoItem icon={<Inventory2OutlinedIcon fontSize="small" />} text={`Available: ${material.quantity_available}`} />
                        </Grid>
                        <Grid item xs={6}>
                            <InfoItem icon={<TrackChangesIcon fontSize="small" />} text={`Expected: ${material.expected_quantity}`} />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>

            {/* --- PROGRESS BAR SECTION --- */}
            <Box sx={{ mt: 'auto', pt: 2 }}>
                <Tooltip title={`Consumed: ${material.consumed_quantity} | Expected: ${material.expected_quantity}`}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Consumption</Typography>
                            <Typography variant="body2" fontWeight="bold" color={getProgressColor()}>
                                {`${Math.round(consumedPercentage)}%`}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={consumedPercentage}
                            sx={{
                                height: 8, borderRadius: 5, mt: 0.5, backgroundColor: colors.primary[900],
                                '& .MuiLinearProgress-bar': { backgroundColor: getProgressColor() },
                            }}
                        />
                    </Box>
                </Tooltip>
            </Box>
        </Card>
    );
};

const InfoItem = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        {icon}
        <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Box>
);


// ====================================================================
// == مكون الجدول الجديد
// ====================================================================
const MaterialsReportTable = ({ materials }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Material Name", flex: 1.5, cellClassName: "name-column--cell" },
        { field: "category", headerName: "Category", flex: 1 },
        { field: "expected_quantity", headerName: "Expected", type: 'number', flex: 1, align: 'left', headerAlign: 'left' },
        { field: "consumed_quantity", headerName: "Consumed", type: 'number', flex: 1, align: 'left', headerAlign: 'left' ,cellClassName: "consumed_quantity-column--cell"},
        { field: "quantity_available", headerName: "Available", type: 'number', flex: 1, align: 'left', headerAlign: 'left',cellClassName: "quantity_available-column--cell"},
        { field: "unit", headerName: "Unit", flex: 0.5 },
    ];

    return (
        <Box sx={{
            height: '75vh', width: '100%',
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: `1px solid ${colors.grey[700]}` },
            "& .name-column--cell": { color: colors.greenAccent[300], fontWeight: 'bold' },
            "& .quantity_available-column--cell": { color: green[500], fontWeight: 'bold' },
            "& .consumed_quantity-column--cell": { color: red[400], fontWeight: 'bold' },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.primary[600], borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[700] },
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[600] },
            "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}>
            <DataGrid
                rows={materials}
                columns={columns}
                getRowId={(row) => row.id}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
            />
        </Box>
    );
}

// ====================================================================
// == المكون الرئيسي
// ====================================================================
const MaterialsReportsTab = ({}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { selectedProjectId } = useProject();
    const { materials, loading, error, refetchMaterials } = useProjectContainerReportsData({});

    // --- حالة جديدة للتحكم في وضع العرض ---
    const [viewMode, setViewMode] = useState('card');

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    
    // --- دالة لتبديل العرض ---
    const handleViewChange = (event, newView) => {
        if (newView !== null) { // التأكد من أن المستخدم اختار قيمة
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
    

    return (
        <Box sx={{ backgroundColor: colors.primary[800], borderRadius: "12px"}}>
            <Header
                title="Project Materials Reports"
                subtitle="Browse the quantities of materials that we used in our project"
            />

            <Box mt="20px">
                {/* --- قسم الفلاتر وأزرار التحكم --- */}
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
                    
                    <ToggleButtonGroup
                     size="small"
                        value={viewMode}
                        exclusive
                        onChange={handleViewChange}
                        aria-label="view mode"
                    >
                        <ToggleButton value="card" aria-label="card view"><ViewModuleIcon /></ToggleButton>
                        <ToggleButton value="table" aria-label="table view"><ViewListIcon /></ToggleButton>
                    </ToggleButtonGroup>


                </Stack>
                
                {/* --- قسم عرض البيانات (إما كروت أو جدول) --- */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        {filteredMaterials.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 3 }}>You didn't add any material to the project yet.</Alert>
                        ) : viewMode === 'card' ? (
                            // --- عرض البطاقات ---
                            <Grid container spacing={3}>
                                {filteredMaterials.map((material) => (
                                    <Grid item key={material.id} xs={12} sm={6} md={4}>
                                        <TestCard material={material} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            // --- عرض الجدول ---
                            <MaterialsReportTable materials={filteredMaterials} />
                        )}
                    </>
                )}
            </Box>  
        </Box>
    );
};

export default MaterialsReportsTab;