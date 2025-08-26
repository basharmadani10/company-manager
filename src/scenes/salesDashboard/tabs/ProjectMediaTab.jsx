import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    useTheme,
    IconButton,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { tokens } from "../../../theme";
import { Header } from '../../../components/Header';
import axios from 'axios';

// --- أيقونات ---
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ClearIcon from '@mui/icons-material/Clear';

// --- استيراد الـ Hook والـ APIs ---
import useProjectMediaData from '../../../hooks/getProjectMediaDataHook'; // تأكد من صحة المسار
import { baseUrl } from '../../../shared/baseUrl'; // تأكد من صحة المسار
import { addProjectMediaApi, deleteProjectMediaApi } from '../../../shared/APIs'; // تأكد من صحة المسار
import { getAuthToken } from '../../../shared/Permissions'; // تأكد من صحة المسار


// ====================================================================
// == المكون الرئيسي: ProjectMediaTab
// ====================================================================
const ProjectMediaTab = ({ projectId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { media, loading, error, refetchMedia } = useProjectMediaData({ projectId });

    // --- حالة لتتبع الوسيط النشط ---
    const [activeIndex, setActiveIndex] = useState(0);

    // إعادة تعيين المؤشر عند تغير البيانات
    useEffect(() => {
        if (media && media.length > 0) {
            setActiveIndex(0);
        }
    }, [media]);

    // --- بقية الحالات (للإضافة والحذف) ---
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newMediaFile, setNewMediaFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [mediaIdToDelete, setMediaIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- دوال التعامل مع الوسائط ---
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setNewMediaFile(file);
    };
    
    const handleSaveMedia = async () => {
        if (!newMediaFile) return;
        setIsSaving(true);
        const formData = new FormData();
        formData.append('project_id', projectId);
        formData.append('path_file', newMediaFile);
        try {
            await axios.post(`${baseUrl}${addProjectMediaApi}`, formData, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
            refetchMedia();
        } catch (err) {
            console.error("Failed to save media:", err);
        } finally {
            setIsSaving(false);
            setNewMediaFile(null);
            setIsAddDialogOpen(false);
        }
    };

    const handleOpenConfirmDelete = (id) => {
        setMediaIdToDelete(id);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${baseUrl}${deleteProjectMediaApi}${mediaIdToDelete}`, { headers: { Authorization: `Bearer ${getAuthToken()}` } });
            // بعد الحذف، أعد تحميل البيانات (الـ hook سيعيد المؤشر للصفر)
            refetchMedia();
        } catch (err) {
            console.error("Failed to delete media:", err);
        } finally {
            setIsDeleting(false);
            setOpenConfirm(false);
        }
    };
    
    // تحديد الوسيط النشط للعرض
    const activeMedia = media && media.length > 0 ? media[activeIndex] : null;

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>an error happend</Alert>;

    return (
        <Box sx={{ width: '100%', mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Header title="Project Media" subtitle="Browse all images and videos related to the project" />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)} sx={{ backgroundColor: colors.greenAccent[600], height: '45px', px: 3 }}>
                    Add Media
                </Button>
            </Box>
            
            {!activeMedia ? (
                <Box sx={{ mt: 4, p: 4, textAlign: 'center', backgroundColor: colors.primary[700], borderRadius: '12px' }}>
                    <Typography variant="h6">there is no media to view.</Typography>
                </Box>
            ) : (
                <Box>
                    {/* العارض الرئيسي للوسائط */}
                    <Box sx={{
                        height:"75vh",
                        width: '100%',
                        backgroundColor: colors.primary[700],
                        borderRadius: '12px',
                        overflow: 'hidden',
                        aspectRatio: '16 / 9'
                    }}>
                        {activeMedia.type === 'image' ? (
                            <img src={activeMedia.url} alt="Active Media" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            <video src={activeMedia.url} controls autoPlay muted style={{ width: '100%', height: '100%' }} />
                        )}
                        <IconButton
                            onClick={() => handleOpenConfirmDelete(activeMedia.id)}
                            sx={{ position: 'absolute', top: 16, right: 16, color: 'white', backgroundColor: 'rgba(0,0,0,0.4)', '&:hover': { backgroundColor: 'rgba(255,0,0,0.7)' } }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                    {/* شريط الوسائط المصغرة */}
                    <Box sx={{
                        width: '100%',
                        overflowX: 'auto',
                        mt: 2,
                        p: 1,
                        '&::-webkit-scrollbar': { height: 8 },
                        '&::-webkit-scrollbar-track': { background: colors.primary[700] },
                        '&::-webkit-scrollbar-thumb': { background: colors.grey[600], borderRadius: '4px' }
                    }}>
                        <Stack direction="row" spacing={2}>
                            {media.map((item, index) => (
                                <Box
                                    key={item.id}
                                    onClick={() => setActiveIndex(index)}
                                    sx={{
                                        width: 150,
                                        height: 84,
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: activeIndex === index ? `3px solid ${colors.greenAccent[500]}` : `3px solid transparent`,
                                        transition: 'border-color 0.2s ease'
                                    }}
                                >
                                    {item.type === 'image' ? (
                                        <img src={item.url} alt={`thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            )}

            {/* --- نافذة إضافة وسائط جديدة --- */}
            <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Upload New Media</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, mt:1, border: `2px dashed ${colors.grey[700]}`, borderRadius: '12px' }}>
                        <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                        <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current.click()}>
                            Choose File
                        </Button>
                        {newMediaFile && (
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                <Typography variant="body2">{newMediaFile.name}</Typography>
                                <IconButton size="small" onClick={() => setNewMediaFile(null)}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveMedia} variant="contained" color="secondary" disabled={isSaving || !newMediaFile}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- نافذة تأكيد الحذف --- */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                 <DialogTitle>Confirm Deletion</DialogTitle>
                 <DialogContent>
                     <Typography>Are you sure you want to delete this media? This action is permanent.</Typography>
                 </DialogContent>
                 <DialogActions>
                     <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                     <Button onClick={handleConfirmDelete} variant="contained" color="error" disabled={isDeleting}>
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                    </Button>
                 </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProjectMediaTab;