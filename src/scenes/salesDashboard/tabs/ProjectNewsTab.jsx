import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    useTheme,
    IconButton,
    Stack, // تم استخدام Stack لعرض الأخبار بشكل عمودي
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Divider,
    CardActions,
    CardMedia
} from '@mui/material';
import { tokens } from "../../../theme";
import { Header } from '../../../components/Header';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ClearIcon from '@mui/icons-material/Clear';
import useProjectNewsData from '../../../hooks/getProjectNewsDataHook';
import { baseUrl } from '../../../shared/baseUrl';
import { createProjectNewsApi, deleteProjectNewsApi } from '../../../shared/APIs';
import axios from 'axios';
import { getAuthToken } from '../../../shared/Permissions';

const NewsCard = ({ item, onDelete }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const formattedDate = item.created_at ? item.created_at.split('T')[0] : 'No Date';

    return (
        <Card
            elevation={0}
            sx={{
                width: '100%',
                height: 200,
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: colors.primary[600],
                border: `1px solid ${colors.grey[700]}`,
                borderRadius: "12px",
                overflow: 'hidden',
                transition: "border-color 0.2s ease-in-out",
                "&:hover": {
                    borderColor: colors.greenAccent[400],
                },
            }}
        >
            <CardMedia
                component="img"
                image={item.path_file}
                alt="Project News Image"
                sx={{
                    width: 380,
                    flexShrink: 0,
                    objectFit: 'contain'
                }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1 }}>
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            height: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: '5',
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {item.description}
                    </Typography>
                </CardContent>
                <Divider sx={{ mx: 2, borderColor: colors.grey[700] }} />
                <CardActions sx={{ justifyContent: 'space-between', pt: 1 }}>
                     <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarTodayIcon fontSize="small"  />
                        <Typography variant="body2" color="text.secondary">{formattedDate}</Typography>
                    </Stack>
                    <IconButton onClick={() => onDelete(item.id)} color="error" size="small">
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Box>
        </Card>
    );
};

const ProjectNewsTab = ({ projectId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { news, loading, error, refetchNews } = useProjectNewsData({ projectId });

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newNewsItem, setNewNewsItem] = useState({ description: '', path_file: null });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [newsIdToDelete, setNewsIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleOpenAddDialog = () => {
        setNewNewsItem({ description: '', path_file: null });
        setIsAddDialogOpen(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewNewsItem(prev => ({ ...prev, path_file: file }));
        }
    };

    const handleCloseAddDialog = () => setIsAddDialogOpen(false);

    const handleSaveNews = async () => {
        if (!newNewsItem.description || !newNewsItem.path_file) {
            alert("يرجى إدخال الوصف ورفع صورة.");
            return;
        }
        setIsSaving(true);
        const formData = new FormData();
        formData.append('project_id', projectId);
        formData.append('description', newNewsItem.description);
        formData.append('path_file', newNewsItem.path_file);
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            };
            await axios.post(`${baseUrl}${createProjectNewsApi}`, formData, config);
            refetchNews();
        } catch (err) {
            console.error("Failed to save news:", err);
        } finally {
            setIsSaving(false);
            handleCloseAddDialog();
        }
    };

    const handleOpenConfirmDelete = (id) => {
        setNewsIdToDelete(id);
        setOpenConfirm(true);
    };
    const handleCloseConfirmDelete = () => {
        setOpenConfirm(false);
        setNewsIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            };
            await axios.delete(`${baseUrl}${deleteProjectNewsApi}${newsIdToDelete}`, config);
            refetchNews();
        } catch (err) {
            console.error("Failed to delete news:", err);
        } finally {
            setIsDeleting(false);
            handleCloseConfirmDelete();
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>Error, Please try again.</Alert>;

    return (
        <Box sx={{ width: '100%', mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Header title="Project News" subtitle="Latest updates and announcements about the project" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ backgroundColor: colors.greenAccent[600], height: '45px', px: 3 }}>
                    Add News
                </Button>
            </Box>
            
            {!news || news.length === 0 ? (
                <Box sx={{ mt: 4, p: 4, textAlign: 'center', backgroundColor: colors.primary[700], borderRadius: '12px' }}>
                    <Typography variant="h6">There is no news to display.</Typography>
                </Box>
            ) : (
                // ==========================================================
                // ==== التعديل الرئيسي هنا: استخدام Stack بدلاً من Grid ====
                // ==========================================================
                <Stack spacing={3}>
                    {news.map((item) => (
                        <NewsCard 
                            key={item.id} 
                            item={item} 
                            onDelete={handleOpenConfirmDelete} 
                        />
                    ))}
                </Stack>
            )}

            {/* --- Dialogs (Add and Confirm Delete) --- */}
            <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Announcement</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <TextField autoFocus required label="Description" multiline rows={5} value={newNewsItem.description} onChange={(e) => setNewNewsItem(prev => ({ ...prev, description: e.target.value }))} />
                        <Box>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current.click()}>
                                Upload Image
                            </Button>
                            {newNewsItem.path_file && (
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                    <Typography variant="body2">{newNewsItem.path_file.name}</Typography>
                                    <IconButton size="small" onClick={() => setNewNewsItem(prev => ({...prev, path_file: null}))}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            )}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseAddDialog}>Cancel</Button>
                    <Button onClick={handleSaveNews} variant="contained" disabled={isSaving} sx={{backgroundColor:colors.greenAccent[600],     "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                },}}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Publish'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirm} onClose={handleCloseConfirmDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this news item? This action is permanent.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" disabled={isDeleting}>
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectNewsTab;