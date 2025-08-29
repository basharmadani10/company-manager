// src/scenes/projects/ProjectsList.jsx (Enhanced Version)

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // To navigate to the add project page

// MUI Libraries
import {
  Box,
  Button,
  useTheme,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack, // For flexible arrangement of filter controls
} from "@mui/material";

// Components & Hooks
import { Header } from "../../components/Header";
import { tokens } from "../../theme";
import CustomSnackbar from "../../components/CustomSnackbar";
import ProjectCard from "../../components/ProjectCard";
import useProjectsData from "../../hooks/getAllProjectsDataHook"; // Your custom data fetching hook
import { projectTypeOptions,progressStatusOptions,statusOfSaleOptions } from "../../shared/projectStatics";

// Icons
import InfoIcon from '@mui/icons-material/Info';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For add button
import SearchIcon from '@mui/icons-material/Search'; // For search input
import FilterListIcon from '@mui/icons-material/FilterList'; // Generic filter icon for select fields
import { havePermission } from "../../shared/Permissions";

const ProjectsList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const snackbarRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  // Fetch projects data using your custom hook
  const { projects, isLoading, error } = useProjectsData();

  // State for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProgress, setFilterProgress] = useState('');




  // Effect to show snackbar if an error occurs (uses the error from the hook)
  if (error && snackbarRef.current) {
    // Only show snackbar once per error, maybe with a small timeout or a check
    // to prevent continuous re-triggering if the component re-renders quickly.
    // For simplicity, we'll let it re-trigger here.
    snackbarRef.current.showSnackbar(error, "error");
  }

  // Filter projects based on search term and selected filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.project_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()); // Added location to search

    const matchesType = filterType ? project.type === filterType : true;
    const matchesStatus = filterStatus ? project.status_of_sale === filterStatus : true;
    const matchesProgress = filterProgress ? project.progress_status === filterProgress : true;

    return matchesSearch && matchesType && matchesStatus && matchesProgress;
  });

  const handleAddProjectClick = () => {
    navigate("/dashboard/projects/add"); // Assuming you have a route for adding projects
  };

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Projects" subtitle="View and manage all registered projects" />
        {havePermission("create projects") &&
        <Button
          variant="contained"
          onClick={handleAddProjectClick}
          sx={{
            backgroundColor: colors.greenAccent[700],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          startIcon={<AddCircleOutlineIcon />}
        >
          Add New Project
        </Button>
        }
      </Box>

      {/* --- Filter and Search Section --- */}
      <Box
        sx={{
          backgroundColor: colors.primary[700],
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="h6" color={colors.greenAccent[400]} sx={{ mb: 2 }}>
          <FilterListIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Filters & Search
        </Typography>
        <Grid container spacing={3}>
          {/* Search Input */}
          <Grid item xs={12} md={6} lg={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Projects"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: colors.grey[500], mr: 1 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Grid>
          {/* Type Filter */}
          <Grid item xs={12} md={6} lg={3}>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } ,    minWidth: '180px',}}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Type"
                startAdornment={<FilterListIcon sx={{ color: colors.grey[500], mr: 1 }} />}
         
              >
                <MenuItem value=""><em>All Types</em></MenuItem>
                {projectTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Status of Sale Filter */}
          <Grid item xs={12} md={6} lg={3}>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } ,    minWidth: '180px',}}>
              <InputLabel>Filter by Sale Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter by Sale Status"
                startAdornment={<FilterListIcon sx={{ color: colors.grey[500], mr: 1 }} />}
              >
                <MenuItem value=""><em>All Statuses</em></MenuItem>
                {statusOfSaleOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Progress Status Filter */}
          <Grid item xs={12} md={6} lg={3}>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } ,    minWidth: '180px',}}>
              <InputLabel>Filter by Progress</InputLabel>
              <Select
                value={filterProgress}
                onChange={(e) => setFilterProgress(e.target.value)}
                label="Filter by Progress"
                startAdornment={<FilterListIcon sx={{ color: colors.grey[500], mr: 1 }} />}
              >
                <MenuItem value=""><em>All Progress</em></MenuItem>
                {progressStatusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* --- Projects Display Area --- */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: "10px",
        }}
      >
        {isLoading ? (
         <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          // minHeight="calc(100vh - 150px)" // Adjust height to fit header
        >
          <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
          <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
            Loading Projects...
          </Typography>
        </Box>
        ) : error ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px" p={3} sx={{ backgroundColor: colors.primary[800], borderRadius: "8px", width: '100%', maxWidth: '600px' }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: colors.redAccent[500], mb: 2 }} />
            <Typography variant="h5" color={colors.redAccent[400]} textAlign="center">
              {error}
            </Typography>
            <Typography variant="body2" color={colors.grey[500]} textAlign="center" mt={1}>
              Please check your network connection or try again later.
            </Typography>
          </Box>
        ) : filteredProjects.length === 0 ? (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px" p={3} sx={{ backgroundColor: colors.primary[800], borderRadius: "8px", width: '100%', maxWidth: '600px' }}>
            <InfoIcon sx={{ fontSize: 60, color: colors.blueAccent[500], mb: 2 }} />
            <Typography variant="h5" color={colors.grey[300]} textAlign="center" sx={{ mb: 1 }}>
              No projects match your criteria.
            </Typography>
            <Typography variant="body2" color={colors.grey[400]} textAlign="center">
              Try adjusting your search or filters. If you're looking to add a new project, use the "Add New Project" button above!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ width: "100%", maxWidth: "1200px" }}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default ProjectsList;