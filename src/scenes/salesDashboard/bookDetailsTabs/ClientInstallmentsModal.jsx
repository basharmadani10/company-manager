// src/pages/bookDetails/bookDetailsTabs/ClientInstallmentsModal.jsx

import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box,
  useTheme, CircularProgress, Alert, Typography, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import useClientInstallmentsData from '../../../hooks/useClientInstallmentsData';

const ClientInstallmentsModal = ({ open, onClose, unitId, clientId }) => { // <-- CHANGED: from bookId to unitId
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // <-- CHANGED: Pass unitId to the hook
  const { installments, loading, error, fetchInstallments } = useClientInstallmentsData({ unitId, clientId });

  useEffect(() => {
    if (open && clientId && unitId) { // <-- CHANGED: Also check for unitId
      fetchInstallments();
    }
  }, [open, clientId, unitId, fetchInstallments]); // <-- CHANGED: Added unitId dependency

  const columns = [
    // ... columns definition remains the same
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: colors.primary[700] }}>
        Client Installments
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800], minHeight: '400px' }}>
        {/* ... The rest of the component's JSX remains the same */}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[700] }}>
        <Button onClick={onClose} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientInstallmentsModal;