// src/scenes/projects/path/to/tabs/ReportsTab.jsx

import React, { useState, useMemo } from "react";
import { Box, Tab, Typography, useTheme } from "@mui/material"; // <-- Added Typography
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { tokens } from "../../../../theme";
import { havePermission } from "../../../../shared/Permissions"; // <-- 1. Import the permission checker

// --- Import the tab components ---
import ProjectInventory from "./InventoryTab";
import MaterialsReportsTab from "./MaterialsReportsTab";
import FinancialTab from "./FinancialTab";

const ReportsTab = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- 2. Define all possible tabs in a configuration array ---
  const reportsTabsConfig = useMemo(() => [
    {
      label: "Inventory",
      value: "1",
      // IMPORTANT: Replace with your actual permission string
      permission: "view project inventory", 
      component: <ProjectInventory />,
    },
    {
      label: "Materials Reports",
      value: "2",
      // IMPORTANT: Replace with your actual permission string
      permission: "view reports resource management",
      component: <MaterialsReportsTab />,
    },
    {
      label: "Financials Reports",
      value: "3",
      // IMPORTANT: Replace with your actual permission string
      permission: "view financial payments",
      component: <FinancialTab />,
    },
  ], []);

  // --- 3. Filter the tabs based on user permissions ---
  const visibleTabs = reportsTabsConfig.filter(tab => havePermission(tab.permission));

  // --- 4. Set the initial active tab to the first VISIBLE tab ---
  const [activeTab, setActiveTab] = useState(visibleTabs.length > 0 ? visibleTabs[0].value : '');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // If no tabs are visible for the user, show a message
  if (visibleTabs.length === 0) {
    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>You do not have permission to view any reports.</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList 
            onChange={handleTabChange} 
            aria-label="Project Reports Tabs"
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

export default ReportsTab;