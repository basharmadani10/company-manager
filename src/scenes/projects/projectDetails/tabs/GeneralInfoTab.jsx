// src/scenes/projects/GeneralInfoTab.jsx

import React, { useState } from "react";
import {
  Grid,
  Stack,
  Paper,
  Typography,
  Divider,
  Box,
  Chip,
  useTheme,
  Avatar,
  Icon,
  Button
} from "@mui/material";
import { tokens } from "../../../../theme";
import EditIcon from '@mui/icons-material/EditOutlined';

// --- Icons ---
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AspectRatioIcon from "@mui/icons-material/AspectRatioOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";

import UserCard from "../../../../components/UserCard";
import EditProjectDialog from "../../../../components/dialogs/EditProjectDialog";
import { havePermission } from "../../../../shared/Permissions";


// A minimalist component for displaying key statistics
const StatCard = ({ icon, label, value, valueColor }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                backgroundColor: 'transparent',
                borderColor: colors.grey[700],
                borderRadius: '10px',
                height: '100%'
            }}
        >
            <Stack spacing={1}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Icon sx={{ color: colors.greenAccent[400] }}>{icon}</Icon>
                    <Typography variant="body1" fontWeight="600" color={colors.grey[300]}>{label}</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" color={valueColor || colors.grey[100]} pl={{xs: 0, sm: 4.5}}>
                    {value}
                </Typography>
            </Stack>
        </Paper>
    );
};

// A component for displaying a row of info with an icon
const InfoRow = ({ icon, label, value }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ backgroundColor: colors.primary[600], color: colors.greenAccent[400] }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="body2" color={colors.grey[400]}>
            {label}
          </Typography>
          <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
            {value || "N/A"}
          </Typography>
        </Box>
      </Stack>
    );
  };


const GeneralInfoTab = ({ project, refetchProject }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Helper Functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };
   const getStatusChipStyle = (status) => {
    const styles = { fontWeight: "bold", py: 0.5, px: 1.5, fontSize: '0.8rem', borderRadius: '20px' };
    switch (status) {
      case "ForSale": return { ...styles, backgroundColor: colors.greenAccent[700], color: "#fff" };
      case "NotForSale": return { ...styles, backgroundColor: colors.redAccent[600], color: "#fff" };
      default: return { ...styles, backgroundColor: colors.grey[700], color: colors.grey[100] };
    }
  };
  const getProgressChipStyle = (progress) => {
    const baseStyle = { fontWeight: "bold", py: 0.5, px: 1.5, fontSize: '0.8rem', borderRadius: '20px', color: colors.grey[100] };
    switch (progress) {
      case "Done": return { ...baseStyle, backgroundColor: colors.greenAccent[600] };
      case "In Progress": return { ...baseStyle, backgroundColor: colors.blueAccent[500] };
      case "Initial": return { ...baseStyle, backgroundColor: colors.grey[600] };
      default: return { ...baseStyle, backgroundColor: colors.grey[700] };
    }
  };

  const handleSuccess = () => {
    setIsEditDialogOpen(false);
    if (refetchProject) {
      refetchProject();
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ backgroundColor: colors.primary[800], borderRadius: '12px' }}>
        <Stack spacing={5}>
          
          {/* --- SECTION 1: HEADER --- */}
          <Box>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
                  {project.title}
                </Typography>
                <Chip
                  icon={<CodeIcon />}
                  label={project.project_code}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1, borderColor: colors.grey[700], color: colors.grey[300] }}
                />
              </Box>
              <Stack direction="row" spacing={1.5} alignItems="center" pt={{ xs: 2, md: 0 }}>
                {havePermission("edit projects")&&(
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Edit
                </Button>
  )}
                <Chip label={project.progress_status} sx={getProgressChipStyle(project.progress_status)} />
                <Chip label={project.status_of_sale} sx={getStatusChipStyle(project.status_of_sale)} />
              </Stack>
            </Stack>
            <Divider sx={{ mt: 3, borderColor: colors.grey[700] }} />
          </Box>

          {/* --- SECTION 2: KEY METRICS --- */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<AccountBalanceWalletOutlinedIcon />} label="EXPECTED COST" value={formatCurrency(project.expected_cost)} valueColor={colors.greenAccent[400]} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<CalendarTodayIcon />} label="COMPLETION DATE" value={formatDate(project.expected_date_of_completed)} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<AspectRatioIcon />} label="TOTAL AREA" value={`${project.area || 'N/A'} sqm`} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard icon={<LayersIcon />} label="FLOORS" value={project.number_of_floor} />
            </Grid>
          </Grid>

          {/* --- SECTION 3: DESCRIPTION & STAKEHOLDERS --- */}
          <Grid container spacing={5}>
              {/* Description and other details */}
              <Grid item xs={12} md={7}>
                  <Stack spacing={3.5}>
                      <Typography variant="h4" fontWeight="600" color={colors.grey[200]}>About this Project</Typography>
                      <Typography variant="body1" color={colors.grey[400]} sx={{ lineHeight: 1.8, fontSize: '1rem' }}>
                          {project.description}
                      </Typography>
                      <Divider sx={{borderColor: colors.grey[800]}}/>
                      <InfoRow icon={<LocationOnIcon/>} label="Location" value={project.location} />
                      <InfoRow icon={<CategoryIcon/>} label="Project Type" value={project.type} />
                  </Stack>
              </Grid>
              
              {/* Stakeholders */}
              <Grid item xs={12} md={5}>
                  <Stack spacing={3}>
                      <Typography variant="h4" fontWeight="600" color={colors.grey[200]}>Stakeholders</Typography>
                      <InfoRow
                          icon={<BusinessIcon />}
                          label="Consulting Company"
                          value={project.consultingCompany.name}
                      />
                      {project.owner && (
                          <>
                              <Divider sx={{borderColor: colors.grey[800]}}/>
                              <UserCard
                                  label="Project Owner"
                                  firstName={project.owner.user.first_name}
                                  lastName={project.owner.user.last_name}
                                  email={project.owner.user.email}
                                  phoneNumber={project.owner.user.phone_number}
                                  address={project.owner.address}
                              />
                          </>
                      )}
                  </Stack>
              </Grid>
          </Grid>
        </Stack>
      </Paper>

      <EditProjectDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        project={project}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default GeneralInfoTab;