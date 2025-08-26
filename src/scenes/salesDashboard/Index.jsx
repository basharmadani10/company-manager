import React, { useState, useMemo, useRef } from "react";
import { Box, CircularProgress, Alert, IconButton, Button, useTheme, TextField, InputAdornment, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation

// --- Icons ---
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';

// --- Components & Hooks ---
import { Header } from "../../components/Header";
import useProjectSalesData from "../../hooks/getAllProjectsToSaleDataHook";
import { havePermission } from "../../shared/Permissions";
import SaleCard from "../../components/SaleCard";
import { tokens } from "../../theme";

const SalesDashboardPage = () => {
  const { sales, loading, error } = useProjectSalesData();
  const scrollContainerRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // --- This function now navigates to a new page ---
  const handleCardClick = (saleId) => {
    // Navigate to the detail page, passing the sale ID in the URL
    console.log(saleId);
    navigate(`/dashboard/sales/saleDetails/${saleId}`);
  };

  const handleAddProjectClick = () => {
    navigate("/dashboard/sales/add");
  };
  
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
        const scrollAmount = direction === 'left' ? -600 : 600;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredSales = useMemo(() => {
    if (!sales) return [];
    if (!searchTerm) return sales;
    return sales.filter(sale =>
      sale.main_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.project?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sales, searchTerm]);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="Projects Showcase" subtitle="Browse all projects currently available for sale" />
        {havePermission("view statistics") && (
          <Button
          sx={{
            backgroundColor: colors.greenAccent[700],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={handleAddProjectClick}>
            Sale New Project
          </Button>
        )}
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="filled"
          label="Search by Project Name or Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
        />
      </Box>
      
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => scroll('left')} sx={{ backgroundColor: colors.primary[700], '&:hover': { backgroundColor: colors.primary[600] } }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        
        <Box
          ref={scrollContainerRef}
          sx={{
              display: 'flex', overflowX: 'auto', flexGrow: 1, py: 2, gap: 3, mx: 1,
              '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none',
          }}
        >
          {filteredSales.length > 0 ? (
            filteredSales.map(sale => (
              <SaleCard key={sale.id} sale={sale} onClick={() => handleCardClick(sale.id)} />
            ))
          ) : (
            !loading && <Typography sx={{ width: '100%', textAlign: 'center' }}>No projects found matching your search.</Typography>
          )}
        </Box>
        
        <IconButton onClick={() => scroll('right')} sx={{ backgroundColor: colors.primary[700], '&:hover': { backgroundColor: colors.primary[600] } }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      
      {/* --- The Dialog is no longer needed here --- */}
    </Box>
  );
};

export default SalesDashboardPage;