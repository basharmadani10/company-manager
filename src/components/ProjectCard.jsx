import {
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
  Grid,
  Divider,
  Tooltip,
  Stack,
} from "@mui/material";
import { tokens } from "../theme";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import AspectRatioIcon from "@mui/icons-material/AspectRatioOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import StraightenIcon from "@mui/icons-material/Straighten"; // أيقونة للوحدة (Unit)
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"; // أيقونة للكمية
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { green } from "@mui/material/colors";
import { useNavigate  } from "react-router-dom";
import { havePermission } from "../shared/Permissions";
import { useProject } from "../contexts/ProjectContext";

const ProjectCard = ({ project }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); 
  const {selectedProjectId, setSelectedProjectId  } = useProject();

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "ForSale":
        return green[700];
      case "NotForSale":
        return colors.redAccent[500];
      default:
        return colors.grey[500];
    }
  };

  const getProgressChipColor = (progress) => {
    switch (progress) {
      case "Done":
        return green[700];
      case "In Progress":
        return colors.blueAccent[500];
      case "Initial":
        return colors.grey[600]
      default:
        return colors.blueAccent[500];
    }
  };

  const renderDetailItem = (Icon, label, value) => (
    <Grid item xs={12} sm={6}>
      <Box display="flex" alignItems="center">
        <Icon sx={{ mr: 0.5, fontSize: "1rem", color: colors.blueAccent[200] }} />
        <Typography variant="body2" color={colors.grey[300]}>
          <Box component="span" fontWeight="bold">{label}:</Box> {value}
        </Typography>
      </Box>
    </Grid>
  );
const handleCardClick =() =>{
  
  {havePermission("details projects")&&
  setSelectedProjectId(project.id);
  console.log("selected pId:"+selectedProjectId);
  navigate(`/dashboard/projects/${project.id}`);}
}
  return (
    <Paper
    onClick={handleCardClick}

      sx={{
        ml:1,
        // --- التغييرات الجديدة هنا ---
        width: { xs: '100%', sm: '400px', md: '450px' }, // تحديد عرض ثابت للبطاقة
        maxWidth: '100%', // التأكد من أنها لا تتجاوز عرض الشاشة على الأجهزة الصغيرة
        borderRadius: "20px",
        boxShadow: `0px 0px 15px -5px ${colors.greenAccent[600]}`,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-12px)",
          boxShadow: `0px 0px 15px ${colors.greenAccent[600]}`,
        },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      
      {/* Top Section: Title, Project Code, and Sale Status */}
      <Box
        sx={{
          backgroundColor: colors.primary[700],
          borderBottom: `1px solid ${colors.grey[700]}`,
          display: "flex",
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: "space-between",
          alignItems: { xs: 'flex-start', sm: 'center' },
        
        }}
      >
        
        <Box sx={{p:3}}>
          <Typography variant="h3" color={colors.greenAccent[300]} fontWeight="bold" sx={{ mb: 0.5 }}>
            {project.title}
          </Typography>
          <Typography variant="body2" color={colors.grey[400]} display="flex" alignItems="center">
            <CodeIcon sx={{ mr: 0.8, fontSize: "1rem" }} />
            {project.project_code}
          </Typography>

       

        </Box>

      </Box>
      <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Tooltip
                            title={`Finished: ${project.progress_percentage}%`}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                width: { xs: '100%', sm: '400px', md: '450px' },
                                height: "8px",
                                // borderRadius: "4px",
                                overflow: "hidden",
                                backgroundColor: colors.grey[700],
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${project.progress_percentage}%`,
                                  backgroundColor:green[500],
                                }}
                              />

                            </Box>
                          </Tooltip>
                        </Box>
      {/* Main Content Section */}
      <Box sx={{ p: 3, backgroundColor: colors.primary[800] }}>
        {/* Description Section */}
        <Box mb={3}>
          <Typography variant="h6" color={colors.grey[300]} sx={{ mb: 1 }} display="flex" alignItems="center">
            <InfoOutlinedIcon sx={{ mr: 0.8, fontSize: "1.4rem", color: colors.greenAccent[300] }} />
            Description
          </Typography>
          <Typography variant="body2" color={colors.grey[400]} sx={{ pl: 3.5, lineHeight: 1.7 }}>
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />

        {/* Key Details Section */}
        <Typography variant="h6" color={colors.greenAccent[400]} sx={{ mb: 1.5 }} display="flex" alignItems="center">
          Project Details
        </Typography>
        <Grid container spacing={2.5} mb={3}>
          {renderDetailItem(LocationOnIcon, "Location", project.location)}
          {renderDetailItem(CategoryIcon, "Type", project.type)}
          {renderDetailItem(LayersIcon, "Floors", project.number_of_floor)}
          {renderDetailItem(AspectRatioIcon, "Area", `${project.area} sqm`)}
          {renderDetailItem(CalendarTodayIcon, "Completion", formatDate(project.expected_date_of_completed))}
          {renderDetailItem(AccountBalanceWalletOutlinedIcon, "Cost", formatCurrency(project.expected_cost))}
        </Grid>

        <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />

            {/* Owner and Consulting Company */}
            {/* <Stack mb="20px" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 4 }} alignItems="flex-start" flexWrap="wrap"> */}
            {project.owner && (
              <Box mb="10px"display="flex" alignItems="center">
                <PersonIcon sx={{ mr: 1, fontSize: "1.2rem", color: colors.greenAccent[400] }} />
                <Typography variant="subtitle1" color={colors.grey[200]} fontWeight="bold">
                  Owner: <Box component="span" fontWeight="normal" color={colors.grey[300]}>
                    {project.owner.user.first_name} {project.owner.user.last_name}
                  </Box>
                </Typography>
              </Box>
            )}
            {project.consultingCompany && (
              <Box display="flex" alignItems="center">
                <BusinessIcon sx={{ mr: 1, fontSize: "1.2rem", color: colors.greenAccent[400] }} />
                <Typography variant="subtitle1" color={colors.grey[200]} fontWeight="bold">
                  Consulting: <Box component="span" fontWeight="normal" color={colors.grey[300]}>
                    {project.consultingCompany.name}
                  </Box>
                </Typography>
              </Box>
            )}
          {/* </Stack> */}

        {/* Progress and Associated Parties Section */}
        <Stack mt="15px" direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 , }} justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
          {/* Progress Status Chip */}
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon sx={{ fontSize: "1rem", color: colors.greenAccent[800] }} />
            <Chip
              label={`Progress: ${project.progress_status}`}
              size="small"
              sx={{
                backgroundColor: getProgressChipColor(project.progress_status),
                color: colors.grey[100],
                fontWeight: "bold",
                fontSize: "0.75rem",
                py: 1,
                px: 2,
                borderRadius: "10px",
              }}
            />
                    <Chip
          label={project.status_of_sale}
          size="small"
          sx={{
            backgroundColor: getStatusChipColor(project.status_of_sale),
            color: colors.grey[100],
            fontWeight: "bold",
            fontSize: "0.75rem",
            py: 1,
            px: 2,
            borderRadius: "10px",
          }}
        />
          </Box>

      
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProjectCard;