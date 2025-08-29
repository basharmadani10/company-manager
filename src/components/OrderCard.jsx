// src/pages/bookDetails/OrderCard.jsx

import React, { useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  useTheme,
  Stack,
  Chip,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { tokens } from "../theme";
import { getAuthToken } from "../shared/Permissions";
import { baseUrl } from "../shared/baseUrl";
import {
  approveOrderApi,
  rejectOrderApi,
  cancelOrderApi,
} from "../shared/APIs";

// --- Icons ---
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AttachmentIcon from "@mui/icons-material/Attachment";
import NotesIcon from "@mui/icons-material/Notes";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

const getStatusChipColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "warning";
    case "approved":
    case "completed":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const OrderCard = ({ order, onActionSuccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState({
    approve: false,
    reject: false,
    cancel: false,
  });
  const [error, setError] = useState(null);

  // --- REFACTORED: Specific handler for each action ---

  const handleApprove = async () => {
    setLoading((prev) => ({ ...prev, approve: true }));
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.put(`${baseUrl}${approveOrderApi({orderId: order.id})}`, {}, config);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Failed to approve order:", err);
      setError("Failed to approve order. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, approve: false }));
    }
  };

  const handleReject = async () => {
    setLoading((prev) => ({ ...prev, reject: true }));
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.put(`${baseUrl}${rejectOrderApi({orderId: order.id})}`, {}, config);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Failed to reject order:", err);
      setError("Failed to reject order. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, reject: false }));
    }
  };

  const handleCancel = async () => {
    setLoading((prev) => ({ ...prev, cancel: true }));
    setError(null);
    try {
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.put(`${baseUrl}${cancelOrderApi({orderId: order.id})}`, {}, config);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      setError("Failed to cancel order. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, cancel: false }));
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        backgroundColor: colors.primary[800],
        borderRadius: "10px",
        borderLeft: `5px solid ${colors.greenAccent[500]}`,
      }}
    >
      {/* --- Header: Priority and Status --- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Priority: #{order.priority_number}
        </Typography>
        <Chip
          label={order.status.toUpperCase()}
          color={getStatusChipColor(order.status)}
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* --- Client Info --- */}
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonIcon fontSize="small"  sx={{color:colors.greenAccent[400]}}/>
          <Typography variant="body1">
            <span style={{ color: colors.grey[300] }}>Client:</span>{" "}
            <strong>{`${order.client.first_name} ${order.client.last_name}`}</strong>
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon fontSize="small"  sx={{color:colors.greenAccent[400]}}/>
          <Typography variant="body1">
            <span style={{ color: colors.grey[300] }}>Email:</span>{" "}
            {order.client.email}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PhoneIcon fontSize="small"  sx={{color:colors.greenAccent[400]}}/>
          <Typography variant="body1">
            <span style={{ color: colors.grey[300] }}>Phone:</span>{" "}
            {order.client.phone_number}
          </Typography>
        </Stack>
        {order.note && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotesIcon fontSize="small" sx={{color:colors.greenAccent[400]}}/>
            <Typography variant="body1">
              <span style={{ color: colors.grey[300] }}>Note:</span>{" "}
              {order.note}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* --- Footer: Date and Identity File --- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color={colors.grey[400]}>
          Created: {new Date(order.created_at).toLocaleString()}
        </Typography>
        <Button
          variant="outlined"
          
          size="small"
          startIcon={<AttachmentIcon />}
          href={order.identity_file}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!order.identity_file}
          sx={{
            color:colors.greenAccent[400],
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          View Identity File
        </Button>
      </Stack>

      {/* --- Action Buttons --- */}
{(order.status === "pending" || order.status === "payment_pending") && (
  <Stack spacing={1} mt={2}>
    {error && (
      <Alert severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    )}
    <Stack direction="row" spacing={1.5} justifyContent="flex-end">

      {/* Show Approve/Reject buttons ONLY when status is 'pending' */}
      {order.status === "pending" && (
        <>
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={
              loading.approve ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckCircleOutlineIcon />
              )
            }
            disabled={Object.values(loading).some(Boolean)}
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={
              loading.reject ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <HighlightOffIcon />
              )
            }
            disabled={Object.values(loading).some(Boolean)}
            onClick={handleReject}
          >
            Reject
          </Button>
        </>
      )}

      {/* Show Cancel button for BOTH 'pending' and 'payment_pending' */}
      <Button
        variant="outlined"
        color="warning"
        size="small"
        startIcon={
          loading.cancel ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <DoDisturbIcon />
          )
        }
        disabled={Object.values(loading).some(Boolean)}
        onClick={handleCancel}
      >
        Cancel
      </Button>
      
    </Stack>
  </Stack>
)}
    </Paper>
  );
};

export default OrderCard;