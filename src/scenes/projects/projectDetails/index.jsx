import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import { tokens } from "../../../theme";

// --- Icons ---
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import PeopleOutlineOutlined from "@mui/icons-material/PeopleOutlineOutlined";
import ArticleIcon from "@mui/icons-material/ArticleOutlined";
import SplitscreenIcon from "@mui/icons-material/SplitscreenOutlined";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnOutlined";


import useOneProjectData from "../../../hooks/getOneProjectDataHook";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import ConsultingCompanyTab from "./tabs/ConsultingCompanyTab";
import TeamTab from "./tabs/TeamTab";
import StudiesTab from "./tabs/StudiesTab";
import ProjectStagesComponent from "./tabs/ProjectTimeLine";
import ProjectGridCalendar from "./tabs/CalendarTab";
import ReportsTab from "./tabs/ReportsTab";
import FinancialTab from "./tabs/FinancialTab";
import { havePermission } from "../../../shared/Permissions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Fade in={true} timeout={500}>
            <div>{children}</div>
          </Fade>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `project-tab-${index}`,
    "aria-controls": `project-tabpanel-${index}`,
  };
}

// --- Main Component ---
const ProjectDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const { project, isLoading, error } = useOneProjectData(id);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const allTabs = useMemo(() => {
    if (!project) return [];

    return [
      {
        label: "General Information",
        icon: <DescriptionIcon />,
        permission: "details projects",
        component: <GeneralInfoTab project={project} />,
      },
      {
        label: "Consulting Company",
        icon: <BusinessIcon />,
        permission: "details projects",
        component: <ConsultingCompanyTab consultingCompany={project?.consultingCompany} />,
      },
      {
        label: "Team",
        icon: <PeopleOutlineOutlined />,
        permission: "details projects",
        component: <TeamTab participants={project?.participants} />,
      },
      {
        label: "Studies",
        icon: <ArticleIcon />,
        permission: "view diagrams",
        component: <StudiesTab />,
      },
      {
        label: "Stages",
        icon: <SplitscreenIcon />,
        permission: "view stages",
        component: <ProjectStagesComponent consultingCompanyId={project?.consultingCompany?.id} participants={project?.participants} />,
      },
      {
        label: "Calendar",
        icon: <CalendarMonthIcon />,
        permission: "view stages",
        component: <ProjectGridCalendar />,
      },
      {
        label: "Resources",
        icon: <Inventory2Icon />,
        permission: "view reports resource management",
        component: <ReportsTab />,
      },
    ];
  }, [project]);

  const visibleTabs = allTabs.filter(tab => havePermission(tab.permission));

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!project) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Alert severity="info">No project data available.</Alert>
      </Box>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box m="10px">
        <Box
          sx={{
            backgroundColor: colors.primary[800],
            borderRadius: "18px",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: colors.grey[700],
              backgroundColor: colors.primary[800],
              borderTopLeftRadius: "18px",
              borderTopRightRadius: "18px",
            }}
          >
            <Tabs
               value={value}
                             onChange={handleChange}
                             aria-label="project details tabs"
                             TabIndicatorProps={{
                               sx: { backgroundColor: colors.greenAccent[500], height: 2 },
                             }}
                             textColor="inherit"
                             variant="fullWidth"
                             sx={{
                               minHeight: "40px",
                               "& .MuiTab-root": {
                                 minHeight: "40px", 
                               },
                             }}
            >
              {visibleTabs.map((tab, index) => (
                <Tab
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                  {...a11yProps(index)}
                  sx={{
                    color: colors.grey[300],
                    "&.Mui-selected": {
                      color: colors.greenAccent[300],
                      fontWeight: "bold",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {visibleTabs.map((tab, index) => (
            <TabPanel key={index} value={value} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectDetails;