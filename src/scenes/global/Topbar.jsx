import { Box, IconButton, useTheme, Menu, MenuItem, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useContext, useState } from "react"; // NEW: Import useState
import { useNavigate } from "react-router-dom"; // NEW: Import useNavigate for redirection
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Logout from "@mui/icons-material/Logout"; // NEW: Import Logout Icon

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate(); // NEW: Hook for navigation

  // --- NEW: State for Settings Menu ---
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // --- NEW: State for Logout Confirmation Dialog ---
  const [openDialog, setOpenDialog] = useState(false);

  // --- NEW: Handlers for Settings Menu ---
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --- NEW: Handlers for Dialog ---
  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleMenuClose(); // Close the menu after clicking logout
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // --- NEW: Handler for Confirming Logout ---
  const handleConfirmLogout = () => {
    // IMPORTANT: Make sure 'authToken' is the same key you use to store the token
    localStorage.removeItem("authToken");
    
    // Redirect to the login page
    navigate("/dashboard/login");

    handleCloseDialog();
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search Bar */}
      <Box
        display="flex"
        backgroundColor={colors.primary[800]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Icons */}
      <Box display="flex">
        {/* MODIFIED: IconButton for Settings now opens the menu */}
        <IconButton onClick={handleMenuOpen}>
          <SettingsOutlinedIcon />
        </IconButton>
        
        {/* NEW: Settings Menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleOpenDialog}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
          {/* You can add more MenuItems here later, e.g., Profile, Settings */}
        </Menu>

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
      </Box>

      {/* NEW: Logout Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{backgroundColor: colors.primary[700]}}
      >
        <DialogTitle>{"Logout Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure that you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>cancel</Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Topbar;