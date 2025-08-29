import React from 'react';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- MUI Icons ---
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { getAuthToken, getPermissions } from '../../shared/Permissions';

// --- Placeholder for your theme ---
// In your project, you can remove this and use your actual theme imports
const tokens = (mode) => ({
  grey: {
    100: '#e0e0e0',
    200: '#c2c2c2',
    300: '#a3a3a3',
    400: '#858585',
    700: '#3e4144',
    800: '#2e3032',
  },
  primary: {
    700: '#1F2A40', // A dark background similar to many templates
    900: '#141b2d',
  },
  greenAccent: {
    300: '#4cceac',
    500: '#4cceac',
    800: 'rgba(76, 206, 172, 0.1)',
  },
  redAccent: {
      500: '#f44336',
  }
});
// --- End of Placeholder ---


// --- Dummy Data (in English) ---

// 1. Overview Stats
const kpiData = {
  totalProjects: 25,
  ongoing: 15,
  completed: 8,
  daysWithoutAccidents: 124,
};

// 2. Financial Data (in Millions)
const financialData = [
  { name: 'Project A', budget: 1.2, actual: 1.1 },
  { name: 'Project B', budget: 2.5, actual: 2.8 },
  { name: 'Project C', budget: 0.8, actual: 0.7 },
  { name: 'Project D', budget: 3.1, actual: 2.9 },
  { name: 'Project E', budget: 1.5, actual: 1.5 },
];

// 3. Project Status Data for Pie Chart
const projectStatusData = [
  { name: 'Ongoing', value: 15 },
  { name: 'Completed', value: 8 },
  { name: 'Delayed', value: 2 },
];
const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FF8042'];


// --- Reusable KPI Card Component ---
const KpiCard = ({ title, value, icon, colors }) => (
  <Paper
    sx={{
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary[700],
      border: `1px solid ${colors.grey[700]}`,
      borderRadius: '12px',
    }}
  >
    <Box>
      <Typography variant="h6" fontWeight="600" color={colors.grey[100]}>
        {title}
      </Typography>
      <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]} sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        backgroundColor: colors.greenAccent[800],
        borderRadius: '50%',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
  </Paper>
);


// --- Main Dashboard Component ---
const Dashboard = () => {
  const theme = useTheme(); // Make sure your component is wrapped in a ThemeProvider
  const colors = tokens(theme.palette.mode); // Uses the placeholder tokens

  return (
    <Box m="20px">
      {/* --- HEADER --- */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
          {getAuthToken()}
        </Typography>
        <Typography variant="body2" color={colors.grey[100]} fontWeight="bold">
        "view statistics",
            "activate user",
            "view project managers",
            "create project managers",
            "edit project managers",
            "delete project managers",
            "view engineers",
            "create engineers",
            "edit engineers",
            "delete engineers",
            "view consulting company",
            "create consulting company",
            "edit consulting company",
            "delete consulting company",
            "profile consulting company",
            "view consulting engineers",
            "create consulting engineers",
            "edit consulting engineers",
            "delete consulting engineers",
            "view owners",
            "create owners",
            "edit owners",
            "delete owners",
            "view real estate managers",
            "create real estate managers",
            "edit real estate managers",
            "delete real estate managers",
            "view projects",
            "create projects",
            "edit projects",
            "details projects",
            "assign project participant",
            "delete project participant",
            "view stages",
            "create stages",
            "edit stages",
            "delete stages",
            "create tasks",
            "edit tasks",
            "delete tasks",
            "details tasks",
            "add item to task container",
            "delete item to task container",
            "change tasks status",
            "view reports resource management",
            "view project inventory",
            "add item to inventory",
            "view financial payments",
            "view details payments",
            "add financial payments",
            "view diagrams",
            "download diagrams",
            "upload diagrams",
            "update diagrams",
            "delete diagrams",
            "view archive diagrams",
            "view expected items",
            "select expected items",
            "create new items",
            "delete expected items",
            "view sales project"
        </Typography>
      </Box>

      {/* --- KPI CARDS GRID --- */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Total Projects"
            value={kpiData.totalProjects}
            icon={<BusinessCenterIcon sx={{ color: colors.greenAccent[300], fontSize: 30 }} />}
            colors={colors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="In Progress Projects"
            value={kpiData.ongoing}
            icon={<DonutSmallIcon sx={{ color: colors.greenAccent[300], fontSize: 30 }} />}
            colors={colors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Completed This Year"
            value={kpiData.completed}
            icon={<CheckCircleOutlineIcon sx={{ color: colors.greenAccent[300], fontSize: 30 }} />}
            colors={colors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Today Finished Tasks"
            value={kpiData.daysWithoutAccidents}
            icon={<HealthAndSafetyIcon sx={{ color: colors.greenAccent[300], fontSize: 30 }} />}
            colors={colors}
          />
        </Grid>
      </Grid>

      {/* --- CHARTS GRID --- */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: colors.primary[700],
              border: `1px solid ${colors.grey[700]}`,
              borderRadius: '12px',
              height: '400px', // Set a fixed height for the container
            }}
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
              Budget vs. Actual Cost (in Millions)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={financialData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid stroke={colors.grey[700]} strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: colors.grey[200] }} />
                <YAxis tick={{ fill: colors.grey[200] }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.primary[900],
                    borderColor: colors.grey[700],
                  }}
                  itemStyle={{ color: colors.grey[100] }}
                />
                <Legend wrapperStyle={{ color: colors.grey[200] }}/>
                <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual Cost" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8}>
           <Paper
            sx={{
              p: 3,
              backgroundColor: colors.primary[700],
              border: `1px solid ${colors.grey[700]}`,
              borderRadius: '12px',
              height: '400px',
            }}
          >
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
              Company Projects Status
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
               <PieChart>
                 <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                 >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                 </Pie>
                 <Tooltip
                    contentStyle={{
                      backgroundColor: colors.primary[900],
                      borderColor: colors.grey[700],
                    }}
                 />
                 <Legend wrapperStyle={{ color: colors.grey[200] }}/>
               </PieChart>
            </ResponsiveContainer>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;