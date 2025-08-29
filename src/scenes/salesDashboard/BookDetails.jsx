// src/pages/bookDetails/BookDetailsPage.jsx

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import useBookDetailsData from "../../hooks/getBookDetailsDataHook";
import useBookBillsData from "../../hooks/getBookBillsDataHook";
import { Header } from "../../components/Header";

// استيراد مكونات التبويبات الجديدة
import BookInfoTab from "./bookDetailsTabs/BookInfoTab";
import OrdersTab from "./bookDetailsTabs/OrdersTab";

// مكون مساعد لعرض لوحة التبويب
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const BookDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { bookId } = useParams();

  // --- State لإدارة التبويب النشط ---
  const [activeTab, setActiveTab] = useState(0);

  // --- جلب البيانات يبقى في المكون الرئيسي ---
  const {
    bookDetails,
    loading: detailsLoading,
    error: detailsError,
  } = useBookDetailsData({ bookId });
  const {
    bills,
    loading: billsLoading,
    error: billsError,
    refetch: refetchBills,
  } = useBookBillsData({ bookId });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // عرض التحميل أو الخطأ قبل عرض أي شيء آخر
  if (detailsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (detailsError || !bookDetails) {
    return (
      <Box m="20px">
        <Alert severity="error">
          {detailsError?.message || "Book details not found."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="Property Book Details"
        subtitle={`Details for model: ${bookDetails.model}`}
      />

      <Box sx={{ width: "100%", mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="book details tabs"
          >
            <Tab label="Book Info" id="tab-0" />
            <Tab label="Orders" id="tab-1" />
          </Tabs>
        </Box>

        {/* --- عرض محتوى التبويب الأول --- */}
        <TabPanel value={activeTab} index={0}>
          <BookInfoTab
            bookDetails={bookDetails}
            bills={bills}
            billsLoading={billsLoading}
            billsError={billsError}
            refetchBills={refetchBills}
            bookId={bookId}
          />
        </TabPanel>

        {/* --- عرض محتوى التبويب الثاني --- */}
        <TabPanel value={activeTab} index={1}>
          <OrdersTab bookId={bookId} />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default BookDetails;