// src/pages/sales/SaleDetailPage.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Chip,
  Tab,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

// --- الأيقونات ---
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

import { tokens } from "../../theme";
import { Header } from "../../components/Header";
import useSingleProjectSaleData from "../../hooks/getSingleProjectToSaleDataHook";
import useProjectMediaData from "../../hooks/getProjectMediaDataHook";

import ProjectOverviewTab from "./tabs/ProjectOverviewTab";
import AvailablePropertiesTab from "./tabs/AvailablePropertiesTab";
import ProjectMediaTab from "./tabs/ProjectMediaTab"; 
import axios from "axios";
import { baseUrl } from "../../shared/baseUrl";
import { deleteProjectSaleApi } from "../../shared/APIs";
import { getAuthToken } from "../../shared/Permissions";
import ProjectNewsTab from "./tabs/ProjectNewsTab";






const SaleDetailPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("1");

  // --- جلب البيانات الرئيسية في المكون الأب ---
  const { saleData: sale, loading, error } = useSingleProjectSaleData({ saleId });

  const [openConfirm, setOpenConfirm] = useState(false);
const [saleIdToDelete, setSaleIdToDelete] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenConfirm = (id) => {
    setSaleIdToDelete(id); // تخزين الـ ID
    setOpenConfirm(true);    // فتح النافذة
};

const handleCloseConfirm = () => {
  setOpenConfirm(false);
  setSaleIdToDelete(null);
};

const handleConfirmDelete = async () => {
  setIsDeleting(true); // بدء التحميل
  try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      await axios.delete(`${baseUrl}${deleteProjectSaleApi}${saleIdToDelete}`, config);
      navigate(-1);

  } catch (error) {
      console.error("Failed to delete the sale:", error);
      // يمكنك إظهار رسالة خطأ هنا
  } finally {
      setIsDeleting(false); // إيقاف التحميل
      handleCloseConfirm(); // إغلاق النافذة
  }
};


  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error || !sale) return <Alert severity="error">Could not load project details.</Alert>;

  return (
    <Box m="20px">
      {/* --- الهيدر الرئيسي للصفحة --- */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={sale.project.title} subtitle={`The sales details of ${sale.project.title} project.`} />
        <Stack direction="row" spacing={2}>
          <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIcon />}>Back</Button>
          <Button onClick={() => navigate(`/dashboard/sales/saleDetails/${sale.id}/edit`)} variant="contained" startIcon={<EditIcon />}>Edit</Button>
          
          <Button 
    onClick={() => handleOpenConfirm(sale.id)} 
    variant="contained" 
    color="error" // استخدام لون مناسب للحذف
    startIcon={<DeleteIcon />}
>
    Delete
</Button>
        </Stack>
      </Box>

      {/* --- Hero Section --- */}
      <Box sx={{ height: "400px", position: "relative", backgroundImage: `url(${sale.main_image})`, backgroundSize: "cover", backgroundPosition: "center", p: 4, borderRadius: "15px", mt: 3, color: "white", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 80%)", borderRadius: "15px" }} />
        <Box sx={{ zIndex: 1 }}>
          <Chip label={sale.project.type} size="small" sx={{ mb: 1, backgroundColor: colors.greenAccent[600], color: "white" }} />
          <Typography variant="h2" fontWeight="bold">{sale.main_title}</Typography>
          <Typography variant="h6" color={colors.grey[300]}>{sale.address}</Typography>
        </Box>
      </Box>

      {/* --- قسم التبويبات --- */}
      <Box mt={2}>
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: colors.primary[800], borderRadius: "12px 12px 0 0" }}>
            <TabList onChange={handleTabChange} aria-label="project details tabs">
              <Tab label="Project Overview" value="1" />
              <Tab label="Available books" value="2" />
              <Tab label="Project Media" value="3" />
              <Tab label="Project News" value="4" />
            </TabList>
          </Box>
          <Box sx={{ backgroundColor: colors.primary[800], borderRadius: "0 0 12px 12px" }}>
            <TabPanel value="1" sx={{ p: 0 }}>
                <ProjectOverviewTab sale={sale} />
            </TabPanel>
            <TabPanel value="2" sx={{ p: 0 }}>
                <AvailablePropertiesTab projectId={sale.project_id} />
            </TabPanel>
            <TabPanel value="3" sx={{ p: 0 }}>
                <ProjectMediaTab projectId={sale.project_id}  />
            </TabPanel>
            <TabPanel value="4" sx={{ p: 0 }}>
                <ProjectNewsTab projectId={sale.project_id}/>
            </TabPanel>


          </Box>
        </TabContext>
      </Box>

      <Dialog
    open={openConfirm}
    onClose={handleCloseConfirm}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
>
    <DialogTitle id="alert-dialog-title">
        {"Confirm Deletion"}
    </DialogTitle>
    <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseConfirm} color="primary">
            Cancel
        </Button>
        <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
        >
            {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
        </Button>
    </DialogActions>
</Dialog>
    </Box>
    
  );
};

export default SaleDetailPage;