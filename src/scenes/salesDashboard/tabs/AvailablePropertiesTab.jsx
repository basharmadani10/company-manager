// src/components/tabs/AvailablePropertiesTab.jsx

import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    CircularProgress, 
    Alert, 
    Card, 
    CardMedia, 
    CardContent, 
    Divider, 
    Stack, 
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton, // New Import
    Tooltip,    // New Import
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';

// --- Icons ---
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import DescriptionIcon from '@mui/icons-material/Description'; // New Icon for Contract
import PaymentsIcon from '@mui/icons-material/Payments';     // New Icon for Payments

// ====================================================================
// == Mock Data (remains the same)
// ====================================================================

const mockPropertyBooks = [
    {
        id: 1, model: "Azure Villa",
        diagram_image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
        price: "450000.00", space: 250, number_of_rooms: 4, number_of_bathrooms: 3,
    },
    // ... other properties
];

const mockCustomers = [
    { id: 1, name: "Ahmed Al Futtaim", phone: "+971 50 123 4567", bookingDate: "2025-07-20" },
    { id: 2, name: "Fatima Al Mansouri", phone: "+971 55 987 6543", bookingDate: "2025-08-01" },
    // ... other customers
];

// ====================================================================
// == Components
// ====================================================================

const PropertyBookCard = ({ book, onClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card 
            onClick={onClick}
            sx={{ 
                backgroundColor: colors.primary[800], 
                borderRadius: '12px', 
                height: '100%',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 8px 16px rgba(0,0,0,0.3)`
                }
            }}
        >
           {/* Card content remains the same */}
            <CardMedia component="img" height="160" image={book.diagram_image} alt={book.model} />
            <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{book.model}</Typography>
                <Typography variant="h4" color={colors.greenAccent[400]} sx={{ mb: 2 }}>
                    ${parseFloat(book.price).toLocaleString()}
                </Typography>
                <Divider sx={{ borderColor: colors.grey[700] }} />
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}><Stack direction="row" spacing={1} alignItems="center"><SquareFootIcon fontSize="small" /> <Typography variant="body2">{book.space} m²</Typography></Stack></Grid>
                    <Grid item xs={12} sm={6}><Stack direction="row" spacing={1} alignItems="center"><BedIcon fontSize="small" /> <Typography variant="body2">{book.number_of_rooms} Rooms</Typography></Stack></Grid>
                    <Grid item xs={12} sm={6}><Stack direction="row" spacing={1} alignItems="center"><BathtubIcon fontSize="small" /> <Typography variant="body2">{book.number_of_bathrooms} Baths</Typography></Stack></Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// --- Updated Dialog Component ---
const BookedCustomersDialog = ({ open, onClose, book }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // --- Action Handlers ---
    const handleViewContract = (id) => {
        // Replace with your actual navigation logic
        alert(`Viewing contract for customer ID: ${id}`);
    };

    const handleViewPayments = (id) => {
        // Replace with your actual navigation logic
        alert(`Viewing payments for customer ID: ${id}`);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Customer Name', flex: 1 },
        { field: 'phone', headerName: 'Phone Number', flex: 1 },
        { field: 'bookingDate', headerName: 'Booking Date', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => (
                <Box>
                    <Tooltip title="View Contract">
                        <IconButton onClick={() => handleViewContract(row.id)}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Payments">
                        <IconButton onClick={() => handleViewPayments(row.id)}>
                            <PaymentsIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ backgroundColor: colors.primary[800] }}>
                Booked Customers for: <Typography component="span" variant="h5" color={colors.greenAccent[400]}>{book?.model}</Typography>
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: colors.primary[800], height: '60vh' }}>
                <DataGrid
                    rows={mockCustomers}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.blueAccent[800] },
                        '& .MuiDataGrid-cell': { borderBottom: `1px solid ${colors.primary[700]}` },
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};


const AvailablePropertiesTab = ({ projectId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const propertyBooks = mockPropertyBooks;
    const loading = false;
    const error = null;

    const handleCardClick = (book) => {
        setSelectedBook(book);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedBook(null);
    };

    return (
        <Box p={{ xs: 1, sm: 2, md: 3 }}>
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} gutterBottom>
                Available Units & Models
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : error ? (
                <Alert severity="error">Failed to load properties.</Alert>
            ) : (
                <Grid container spacing={3} mt={1}>
                    {propertyBooks.length > 0 ? (
                        propertyBooks.map((book) => (
                            <Grid item xs={12} sm={6} md={4} key={book.id}>
                                <PropertyBookCard book={book} onClick={() => handleCardClick(book)} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No specific property models have been added for this project yet.
                            </Alert>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Render the Dialog */}
            <BookedCustomersDialog 
                open={isDialogOpen}
                onClose={handleCloseDialog}
                book={selectedBook}
            />
        </Box>
    );
};

export default AvailablePropertiesTab;