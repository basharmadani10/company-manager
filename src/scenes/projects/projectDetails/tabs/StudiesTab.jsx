// src/scenes/projects/path/to/tabs/ResourcesTab.jsx

import React, { useState, useMemo } from "react";
import { Box, Tab, useTheme,Typography} from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { tokens } from "../../../../theme";
import { havePermission } from "../../../../shared/Permissions"; // <-- 1. Import the permission checker

// --- Import the tab components ---
import DocumentsTab from "./DocumentsTab";
import MaterialsTab from "./MaterialsTab";

const ResourcesTab = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- 2. Define all possible tabs in a configuration array ---
  const resourceTabsConfig = useMemo(() => [
    {
      label: "Project Files",
      value: "1",
      // IMPORTANT: Replace with your actual permission string
      permission: "view diagrams", 
      component: <DocumentsTab />,
    },
    {
      label: "Project Materials",
      value: "2",
      // IMPORTANT: Replace with your actual permission string
      permission: "view expected items",
      component: <MaterialsTab />,
    },
  ], []); // Empty dependency array means this config is created only once

  // --- 3. Filter the tabs based on user permissions ---
  const visibleTabs = resourceTabsConfig.filter(tab => havePermission(tab.permission));

  // --- 4. Set the initial active tab to the first VISIBLE tab ---
  const [activeTab, setActiveTab] = useState(visibleTabs.length > 0 ? visibleTabs[0].value : '');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // If no tabs are visible for the user, you can show a message
  if (visibleTabs.length === 0) {
    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>You do not have permission to view any resources.</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList 
            onChange={handleTabChange} 
            aria-label="Project Resources Tabs"
            sx={{
              "& .MuiTab-root": { fontSize: '1rem', fontWeight: '600' },
              "& .Mui-selected": { color: colors.greenAccent[400] },
              "& .MuiTabs-indicator": { backgroundColor: colors.greenAccent[400] }
            }}
          >
            {/* --- 5. Dynamically render the visible tabs --- */}
            {visibleTabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </TabList>
        </Box>

        {/* --- 6. Dynamically render the corresponding tab panels --- */}
        {visibleTabs.map(tab => (
          <TabPanel key={tab.value} value={tab.value} sx={{ p: 0, pt: 2 }}>
            {tab.component}
          </TabPanel>
        ))}
        
      </TabContext>
    </Box>
  );
};

export default ResourcesTab;