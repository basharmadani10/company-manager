import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Stack,
  Avatar,
  useTheme,
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import { tokens } from "../../theme";
import useConsultingCompanyDetailsData from "../../hooks/getConsultingCompanyDetailsDataHook";
import { Header } from "../../components/Header";

// --- Icons ---
import BusinessIcon from "@mui/icons-material/Business";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import ConsultingEngineers from "./consultingEngineers/Index";
import { havePermission } from "../../shared/Permissions";

// Helper component for displaying information rows
const InfoRow = ({ icon, label, value, colors }) => (
  <Box display="flex" alignItems="center" gap={2} mb={2.5}>
    <Avatar
      sx={{
        backgroundColor: colors.greenAccent[800],
        color: colors.greenAccent[200],
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body2" color={colors.grey[300]}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight="bold" color={colors.grey[100]}>
        {value || "N/A"}
      </Typography>
    </Box>
  </Box>
);

const ConsultingCompanyDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();

  const { companyDetails:company, loading, error } = useConsultingCompanyDetailsData({companyId: id});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !company) {
    return (
      <Box m="20px">
        <Alert severity="error">
          Failed to load company details. Please try again or check the company ID.
        </Alert>
      </Box>
    );
  }

  const {
    name, email, focal_point_first_name, focal_point_last_name,
    address, phone_number, land_line, license_number,
  } = company;

  const focalPointName = `${focal_point_first_name || ""} ${focal_point_last_name || ""}`.trim();

  return (
    <Box m="20px">
      <Header title="Company Details" subtitle={`Information for ${name}`} />
      
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          backgroundColor: colors.primary[800],
          borderRadius: "12px",
        }}
      >
        {/* --- HEADER SECTION --- */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          gap={3}
          mb={3}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: colors.greenAccent[700],
            }}
          >
            <BusinessIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h3" color={colors.greenAccent[300]} fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="h6" color={colors.grey[400]}>
              Consulting & Advisory Services
            </Typography>
          </Box>
          <Chip
            icon={<CardMembershipOutlinedIcon />}
            label={`License: ${license_number || 'N/A'}`}
            variant="outlined"
            sx={{
              borderColor: colors.greenAccent[400],
              color: colors.greenAccent[300],
              p: 2,
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Divider sx={{ my: 4, borderColor: colors.grey[700] }} />

        {/* --- DETAILS GRID --- */}
        <Grid container justifyContent="space-between" spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" color={colors.grey[200]} fontWeight={600} mb={3}>
              Contact Information
            </Typography>
            <Stack>
              <InfoRow icon={<EmailOutlinedIcon />} label="Email Address" value={email} colors={colors} />
              <InfoRow icon={<PhoneOutlinedIcon />} label="Phone Number" value={phone_number} colors={colors} />
              <InfoRow icon={<CallOutlinedIcon />} label="Landline" value={land_line} colors={colors} />
              <InfoRow icon={<LocationOnOutlinedIcon />} label="Address" value={address} colors={colors} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: colors.primary[900],
                borderRadius: "12px",
                border: `1px solid ${colors.grey[700]}`,
                textAlign: "center",
                height: "100%",
              }}
            >
              <Typography variant="h5" color={colors.grey[200]} fontWeight={600} mb={2}>
                Company Representative
              </Typography>
              <Avatar
                sx={{
                  width: 60, height: 60,
                  backgroundColor: colors.blueAccent[700],
                  margin: "0 auto 16px auto",
                }}
              >
                <PersonPinOutlinedIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" color={colors.blueAccent[300]}>
                {focalPointName || "Not Specified"}
              </Typography>
              <Typography variant="body1" color={colors.grey[400]}>
                Primary Contact
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: colors.grey[700] }} />
{havePermission("view consulting engineers")&&(
        <Box>
          <Typography variant="h4" color={colors.grey[200]} fontWeight={600} mb={3}>
            Assigned Engineers
          </Typography>
          <ConsultingEngineers consultingCompanyId={id} />
        </Box>
)}
      </Paper>
    </Box>
  );
};

export default ConsultingCompanyDetails;