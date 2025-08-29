// src/pages/bookDetails/OrdersTab.jsx

import React from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Link,
  IconButton,
  Tooltip,
Divider
} from "@mui/material";
import { tokens } from "../../../theme";
import useBookOrdersData from "../../../hooks/getBookOrdersDataHook"; // 1. استيراد الـ hook الجديد

// --- Icons ---
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AttachmentIcon from "@mui/icons-material/Attachment";
import NotesIcon from "@mui/icons-material/Notes";
import OrderCard from "../../../components/OrderCard";


// ====================================================================
// == المكون الرئيسي للتبويب (OrdersTab)
// ====================================================================
const OrdersTab = ({ bookId }) => {
  // 2. استدعاء الـ hook لجلب البيانات
  const { orders, loading, error ,refetch} = useBookOrdersData({ bookId });
  
  const handleActionSuccess = () => {
    console.log("Action successful, refetching orders...");
    refetch();
  };
  
  // 3. التعامل مع حالات التحميل والخطأ
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {orders && orders.length > 0 ? (
        <Stack spacing={3}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order}   onActionSuccess={handleActionSuccess}/>
          ))}
        </Stack>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No orders found for this property model.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default OrdersTab;