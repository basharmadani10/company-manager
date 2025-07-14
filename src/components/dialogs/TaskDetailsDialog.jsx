// TaskDetailDialog.jsx (Updated with 3-Column Layout)

import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Chip, useTheme, Grid, Avatar,
  Divider, Tooltip, IconButton, Menu, MenuItem,
  DialogContentText, CircularProgress, ListItemIcon,
  // --- Imports for a new Checklist feature ---
  List,
  ListItem,
  Checkbox,
  Alert,
  ListItemText,
} from "@mui/material";
import { tokens } from "../../theme";
import EditTaskDialog from './EditTaskDialog';

// --- Icon Imports ---
import EventIcon from '@mui/icons-material/Event';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import CategoryIcon from '@mui/icons-material/Category';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'; // New Icon for Checklist
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'; // New Icon for Description
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// --- API Imports ---
import axios from "axios";
import { baseUrl } from "../../shared/baseUrl"; 
import { getAuthToken } from "../../shared/Permissions";
import { deleteTaskApi, deleteTaskResourceApi } from "../../shared/APIs";
import useTaskResources from "../../hooks/getTaskResourcesDataHook";
import DeleteConfirmationComponent from "../DeleteConfirmation";
import { AddResourceDialog } from "./AddTaskResourceDialog";

// Helper component for metadata items
const MetadataItem = ({ icon, label, children }) => {
  const colors = tokens(useTheme().palette.mode);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary[700], color: colors.greenAccent[400] }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" color={colors.grey[300]}>{label}</Typography>
        <Typography variant="body1" fontWeight="500">{children}</Typography>
      </Box>
    </Box>
  );
};

// Dummy data for the new checklist feature
const dummyChecklist = [
    { id: 1, text: "Initial design mockups", completed: true },
    { id: 2, text: "Develop API endpoints for user auth", completed: true },
    { id: 3, text: "Frontend development for the login page", completed: false },
    { id: 4, text: "Unit testing for components", completed: false },
];


const TaskDetailDialog = ({ open, onClose, task: initialTask, onTaskDeleted, onTaskUpdated, consultingCompanyId, participants, stageId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [task, setTask] = useState(initialTask);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [checklist, setChecklist] = useState(dummyChecklist);
  const { resources, loading: resourcesLoading, error: resourcesError, refetchResources } = useTaskResources({ taskId: task?.id });
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);

  useEffect(() => { setTask(initialTask); }, [initialTask]);

  if (!task) return null;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEdit = () => { setIsEditDialogOpen(true); handleMenuClose(); };
  const handleDeleteClick = () => { setIsDeleteDialogOpen(true); handleMenuClose(); };
  const handleDeleteDialogClose = () => { if (!isDeleting) setIsDeleteDialogOpen(false); };
  const handleTaskUpdateSuccess = (updatedTaskData) => {
    const newTaskState = { ...task, ...updatedTaskData.data };
    setTask(newTaskState);
    if (onTaskUpdated) onTaskUpdated(newTaskState);
    setIsEditDialogOpen(false);

    const handleAddResourceSuccess = () => {
      refetchResources();
      setIsAddResourceDialogOpen(false);
    };
    
    const handleDeleteResourceSuccess = () => {
      refetchResources();
    };
  };
  
  
  const handleConfirmDelete = async () => { /* ... (delete logic is the same) ... */ };

  const handleAddResourceSuccess = () => {
    refetchResources();
    setIsAddResourceDialogOpen(false);
  };
  
  const handleDeleteResourceSuccess = () => {
    refetchResources();
  };
  

  const statusConfig = {
    ToDo: { label: "To Do", color: "default", variant: "outlined" },
    Doing: { label: "In Progress", color: "warning", variant: "filled" },
    penApproval: { label: "Waiting", color: "info", variant: "filled" },
    Done: { label: "Done", color: "success", variant: "filled" },
  };
  const currentStatus = statusConfig[task.status] || statusConfig.ToDo;


  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" PaperProps={{ sx: { backgroundColor: colors.primary[800], borderRadius: '12px', height: '90vh' } }}>
        <DialogTitle sx={{ p: 2, borderBottom: `1px solid ${colors.grey[700]}`,backgroundColor: colors.primary[800], }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" color={colors.grey[300]}>Task Details</Typography>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Chip label={currentStatus.label} color={currentStatus.color} variant={currentStatus.variant} size="medium" />
              <IconButton onClick={handleMenuOpen}><MoreVertIcon /></IconButton>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{backgroundColor: colors.primary[800],}}>
          <Grid container spacing={3} sx={{ height: '100%', pt: 2 }}>

            {/* --- العمود الأول: العنوان، الوصف، الملاحظات --- */}
            <Grid item xs={12} md={4} flex="1" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} gutterBottom>{task.title}</Typography>
                <Typography variant="subtitle1" color={colors.greenAccent[400]}>Stage ID: {stageId || 'N/A'}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" color={colors.grey[200]} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><DescriptionOutlinedIcon/> Description</Typography>
                <Typography variant="body1" sx={{ color: colors.grey[300], lineHeight: 1.7 }}>{task.description}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h6" color={colors.grey[200]} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}><SpeakerNotesIcon/> Notes</Typography>
                <Typography variant="body1" sx={{ color: colors.grey[300] }}>{task.note || "No additional notes."}</Typography>
              </Box>
            </Grid>

            {/* --- العمود الثاني: التفاصيل --- */}
            <Grid item xs={12} md={4} flex="1" sx={{ borderLeft: { md: `1px solid ${colors.grey[700]}` }, borderRight: { md: `1px solid ${colors.grey[700]}` }, px: { md: 3 } }}>
              <Typography variant="h6" color={colors.grey[200]} sx={{ mb: 2 }}>Details</Typography>
                <MetadataItem icon={<PersonPinIcon />} label="Assigned To">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: "0.8rem", bgcolor: colors.greenAccent[700] }}>{task.employeeAssigned?.name?.charAt(0) || '?'}</Avatar>
                        {task.employeeAssigned?.name}
                    </Box>
                </MetadataItem>
                <MetadataItem icon={<SupervisorAccountIcon />} label="Supervisor">{task.supervisor_id || "N/A"}</MetadataItem>
                <MetadataItem icon={<CategoryIcon />} label="Task Type">{task.type_of_task || "N/A"}</MetadataItem>
                <Divider sx={{ my: 2.5 }} />
                <MetadataItem icon={<EventIcon />} label="Start Date">{new Date(task.start_date).toLocaleDateString("en-GB")}</MetadataItem>
                <MetadataItem icon={<EventIcon />} label="Deadline">{new Date(task.dead_line).toLocaleDateString("en-GB")}</MetadataItem>
                <MetadataItem icon={<LowPriorityIcon />} label="Priority">{task.priority || "Not Set"}</MetadataItem>
            </Grid>

            {/* --- العمود الثالث: قائمة التحقق (Checklist) --- */}
            <Grid item xs={12} md={4} flex="1">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="h6" color={colors.grey[200]} sx={{ display: 'flex', alignItems: 'center', gap: 1 ,mr:"20px"}}>
                  <InventoryIcon/> Used Resources
                </Typography>
                <Button 
                  startIcon={<AddCircleOutlineIcon/>} 
                  onClick={() => setIsAddResourceDialogOpen(true)} 
                  size="small"
                >
                  Add Resource
                </Button>
              </Box>
              <Box sx={{ p: 1, border:`1px solid ${colors.grey[700]}` , borderRadius: '8px'}}>
                {resourcesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress size={30} /></Box>
                ) : resourcesError ? (
                  <Alert severity="error">Failed to load resources.</Alert>
                ) : resources.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography color="text.secondary">No resources assigned.</Typography></Box>
                ) : (
                  <List dense>
                  {resources.map(resource => (
                    <ListItem
                      key={resource.id}
                      secondaryAction={
                        <DeleteConfirmationComponent
                          itemId={resource.id}
                          deleteApi={`${baseUrl}${deleteTaskResourceApi}${resource.id}`}
                          onDeleteSuccess={handleDeleteResourceSuccess}
                          icon={<DeleteIcon fontSize="small" sx={{ color: colors.redAccent[500] }} />}
                          confirmationText={`Are you sure you want to remove "${resource.item.name}"?`}
                        />
                      }
                      sx={{
                        // Styling improvements for better separation and readability
                        py: 1,
                        '&:not(:last-child)': {
                          borderBottom: `1px solid ${colors.grey[700]}`,
                        },
                        '&:hover': {
                          backgroundColor: colors.primary[700], 
                          borderRadius: '4px'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          // Primary Text (Item Name)
                          <Typography variant="body1" fontWeight="600" color={colors.grey[100]}>
                            {resource.item.name}
                          </Typography>
                        }
                        secondary={
                          // Secondary Text (Details: Category, Quantity, Unit)
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" display="block" color={colors.grey[400]}>
                              Category: {resource.item.category}
                            </Typography>
                            
                            {/* Display Quantity and Unit together */}
                            <Typography variant="body2" color={colors.greenAccent[400]} fontWeight="bold">
                              Quantity: {resource.quantity} ({resource.item.unit})
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                )}
              </Box>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.grey[700]}`,backgroundColor: colors.primary[800], }}>
          <Button onClick={onClose} variant="contained" sx={{ color: colors.grey[100], backgroundColor: colors.greenAccent[700], '&:hover': { backgroundColor: colors.greenAccent[800] } }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* --- Menus and other dialogs remain the same --- */}
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} PaperProps={{ sx: { backgroundColor: colors.primary[700] } }}>
        <MenuItem onClick={handleEdit}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: colors.redAccent[400] }}><ListItemIcon><DeleteIcon fontSize="small" sx={{ color: colors.redAccent[400] }} /></ListItemIcon>Delete</MenuItem>
      </Menu>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose} PaperProps={{ sx: { backgroundColor: colors.primary[800] } }}>
        <DialogTitle sx={{color: colors.grey[100]}}>Confirm Task Deletion</DialogTitle>
        <DialogContent><DialogContentText sx={{color: colors.grey[300]}}>Are you sure you want to delete this task? This action cannot be undone.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeleting} sx={{ color: colors.grey[300] }}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting} startIcon={isDeleting ? <CircularProgress size={20} color="inherit"/> : null} variant="contained">{isDeleting ? "Deleting..." : "Delete"}</Button>
        </DialogActions>
      </Dialog>
      {isAddResourceDialogOpen && (
          <AddResourceDialog
            open={isAddResourceDialogOpen}
            onClose={() => setIsAddResourceDialogOpen(false)}
            onResourceAdded={handleAddResourceSuccess}
            taskId={task.id}
          />
      )}
      
      {task && (<EditTaskDialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} task={task} onTaskUpdated={handleTaskUpdateSuccess} consultingCompanyId={consultingCompanyId} participants={participants} stageId={stageId} />)}
    </>
  );
};

export default TaskDetailDialog;