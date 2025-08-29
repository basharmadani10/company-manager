import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, CircularProgress, Alert, Card, CardMedia, CardContent,
    Divider, Stack, useTheme, 
    Button
} from '@mui/material';

// --- استيراد الملفات الخاصة بمشروعك ---
import { tokens } from '../../../theme';
import useProjectPropertyBooksData  from '../../../hooks/getProjectPropertyBooksDataHook';


// --- الأيقونات ---
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreatePropertyBookDialog from '../../../components/dialogs/CreateBookDialog';



// ====================================================================
// == 2. مكون بطاقة العرض (Property Card)
// ====================================================================
const PropertyBookCard = ({ book, onClick }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Card onClick={onClick} sx={{ backgroundColor: colors.primary[800], borderRadius: '12px', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 8px 16px rgba(0,0,0,0.3)` } }}>
            <CardMedia component="img" height="160" image={book.diagram_image} alt={book.model} />
            <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{book.model}</Typography>
                <Typography variant="h4" color={colors.greenAccent[400]} sx={{ mb: 2 }}>${parseFloat(book.price).toLocaleString()}</Typography>
                <Divider sx={{ borderColor: colors.grey[700] }} />
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><SquareFootIcon fontSize="small" /> <Typography variant="body2">{book.space} m²</Typography></Stack></Grid>
                    <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><BedIcon fontSize="small" /> <Typography variant="body2">{book.number_of_rooms} Rooms</Typography></Stack></Grid>
                    <Grid item xs={12} sm={6}><Stack direction="row" spacing={1}><BathtubIcon fontSize="small" /> <Typography variant="body2">{book.number_of_bathrooms} Baths</Typography></Stack></Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// ====================================================================
// == 3. المكون الرئيسي (Main Tab Component)
// ====================================================================
const AvailablePropertiesTab = ({ projectId }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { propertyBooks, loading, error, refetchPropertyBooks } = useProjectPropertyBooksData({ projectId });
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = (book) => {
        // --- UPDATED --- : The navigation path now includes projectId (as saleId) and book.id
        navigate(`/dashboard/sales/saleDetails/${projectId}/${book.id}/details`);
    };

    const handleCreateSuccess = () => {
        refetchPropertyBooks();
    };

    return (
        <Box p={{ xs: 1, sm: 2, md: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>Available Units & Models</Typography>
                <Button variant="contained" color="secondary" startIcon={<AddCircleOutlineIcon />} onClick={() => setCreateDialogOpen(true)}>
                    Create New Model
                </Button>
            </Stack>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : error ? (
                <Alert severity="error">Failed to load properties. Please try again.</Alert>
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
                            <Alert severity="info">No specific property models have been added for this project yet.</Alert>
                        </Grid>
                    )}
                </Grid>
            )}

            <CreatePropertyBookDialog
                open={isCreateDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                projectId={projectId}
                onSuccess={handleCreateSuccess}
            />
        </Box>
    );
};

export default AvailablePropertiesTab;