// src/scenes/projects/dialogs/EditProjectDialog.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField,
  useTheme, CircularProgress, Alert, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../../theme';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { editProjectApi, updateProjectApi } from '../../shared/APIs'; // Add this to your APIs file
import { getAuthToken } from '../../shared/Permissions';

const EditProjectDialog = ({ open, onClose, project, onSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill the form when the dialog opens or the project data changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        location: project.location || '',
        type: project.type || '',
        expected_cost: project.expected_cost || '',
        expected_date_of_completed: project.expected_date_of_completed?.split('T')[0] || '', // Format for date input
        area: project.area || '',
        number_of_floor: project.number_of_floor || '',
      });
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      _method: 'PUT' // Common practice for handling PUT requests via POST
    };

    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      await axios.post(`${baseUrl}${updateProjectApi}${project.id}`, payload, config);
      
      onSuccess(); // This will close the dialog and refetch the data
    } catch (err) {
      console.error("Failed to update project:", err);
      setError(err.response?.data?.message || "An error occurred while saving the project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Edit Project Details
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField name="title" label="Project Title" value={formData.title || ''} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="type" label="Project Type" value={formData.type || ''} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="description" label="Description" value={formData.description || ''} onChange={handleInputChange} fullWidth multiline rows={4} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="location" label="Location" value={formData.location || ''} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="expected_cost" label="Expected Cost ($)" type="number" value={formData.expected_cost || ''} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="expected_date_of_completed" label="Expected Completion Date" type="date" value={formData.expected_date_of_completed || ''} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="area" label="Total Area (sqm)" type="number" value={formData.area || ''} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="number_of_floor" label="Number of Floors" type="number" value={formData.number_of_floor || ''} onChange={handleInputChange} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectDialog;