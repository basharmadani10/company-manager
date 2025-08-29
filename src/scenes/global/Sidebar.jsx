import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import buildProLogo from '../../assets/logo.png';
import { havePermission } from "../../shared/Permissions";

// --- ORIGINAL ICONS ---
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

// --- NEW, MORE SUITABLE ICONS ---
import EngineeringIcon from '@mui/icons-material/Engineering'; // For Engineers
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // For Project Managers
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // For Sales Managers
import BusinessIcon from '@mui/icons-material/Business'; // For Companies
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // For Projects
import BadgeIcon from '@mui/icons-material/Badge'; // For Owners
import QueryStatsIcon from '@mui/icons-material/QueryStats'; // For Sales Dashboard

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isActive = selected === to;

  return (
    <MenuItem
      active={isActive}
      onClick={() => setSelected(to)}
      icon={icon}
      component={<Link to={to} />}
      style={{ paddingLeft: "20px" }}
    >
      <Typography
        fontWeight={isActive ? 600 : 400}
        color={isActive ? colors.greenAccent[400] : colors.grey[100]}
      >
        {title}
      </Typography>
    </MenuItem>
  );
};

const ProSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  const collapsedSidebarWidth = "80px";
  const expandedSidebarWidth = "270px";

  return (
    <Sidebar
      style={{
        border: "none",
        position: "fixed",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 100,
        width: isCollapsed ? collapsedSidebarWidth : expandedSidebarWidth,
        transition: "width 0.3s ease-in-out",
      }}
      collapsed={isCollapsed}
      backgroundColor={colors.primary[800]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Menu
          iconShape="square"
          menuItemStyles={{
            button: ({ active }) => ({
              backgroundColor: "transparent !important",
              borderLeft: active ? `4px solid ${colors.greenAccent[500]}` : "none",
              "&:hover": {
                backgroundColor: `${colors.primary[700]} !important`,
              },
            }),
            icon: ({ active }) => ({
              color: active ? colors.greenAccent[400] : colors.grey[100],
            }),
          }}
        >
          {/* LOGO AND COLLAPSE ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{ margin: "10px 0 20px 0", color: colors.grey[100] }}
          >
            {!isCollapsed && (

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {havePermission("view statistics")&&(
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <Box
                    component="img"
                    alt="BuildPro Logo"
                    src={buildProLogo}
                    sx={{ height: '25px', cursor: 'pointer', display: 'block' }}
                  />
                </Link>
                )}
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER PROFILE SECTION */}
          {!isCollapsed && (
            <Box mb="20px">
              <Box textAlign="center" mt="10px">
                <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
                  Mohamad Alraie
                </Typography>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  IT Admin
                </Typography>
              </Box>
            </Box>
          )}

          {!isCollapsed && <Divider sx={{ borderColor: colors.grey[700], margin: '0 20px 20px 20px' }} />}

          {/* MENU ITEMS */}
          <Box flexGrow={1}>
          {havePermission("view statistics") && (
            <Item
              title="Dashboard"
              to="/dashboard/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          )}
            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Management
              </Typography>
            )}

            {havePermission("view engineers") && (
              <Item
                title="Engineers"
                to="/dashboard/engineers"
                icon={<EngineeringIcon />} // <-- CHANGED
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {havePermission("view project managers") && (
              <Item
                title="Project Managers"
                to="/dashboard/projectManagers"
                icon={<SupervisorAccountIcon />} // <-- CHANGED
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {havePermission("view real estate managers") && (
              <Item
                title="Sales Managers"
                to="/dashboard/salesManagers"
                icon={<TrendingUpIcon />} // <-- CHANGED
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {havePermission("view consulting company") && (
              <Item
                title="Consulting Companies"
                to="/dashboard/ConsultingCompanies"
                icon={<BusinessIcon />} // <-- CHANGED
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {havePermission("view projects") && (
              <Item
                title="Projects"
                to="/dashboard/projects"
                icon={<AccountTreeIcon />} // <-- CHANGED
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {havePermission("view owners") && (
              <Item
                title="Owners"
                to="/dashboard/owners"
                icon={<BadgeIcon />} // <-- CHANGED
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
          {havePermission("view engineers") && ( // Assuming a permission for this dashboard
            <Item
              title="Sales Dashboard"
              to="/dashboard/sales"
              icon={<QueryStatsIcon />} // <-- CHANGED
              selected={selected}
              setSelected={setSelected}
            />
          )}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default ProSidebar;