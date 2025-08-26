// src/components/PdfViewerDialog.jsx

import React, { useState ,useEffect} from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import {
  Dialog, DialogContent, DialogTitle, DialogActions, IconButton,
  Box, Typography, Button, CircularProgress, Alert
} from "@mui/material";


pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";


export const PdfViewerDialog = ({ open, onClose, pdfFile, fileName }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1); // ابدأ دائمًا من الصفحة الأولى
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Failed to load PDF document:", error);
    setError("Failed to load the PDF file. It might be corrupted or in an unsupported format.");
    setLoading(false);
  }

  const goToPrevPage = () => setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  const goToNextPage = () => setPageNumber(prevPage => Math.min(prevPage + 1, numPages));

  // إعادة تعيين الحالة عند فتح ديالوج جديد
  useEffect(() => {
    if (open) {
        setLoading(true);
        setError(null);
        setNumPages(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { height: '95vh' } }}>
    <DialogTitle>
      {/* ... */}
    </DialogTitle>
    <DialogContent sx={{ p: 0, overflow: 'auto', display: 'flex', justifyContent: 'center', bgcolor: 'grey.900' }}>
      <Document
        // 👇 --- التغيير الرئيسي هنا ---
        // استخدم الـ prop الجديد مباشرة
        file={pdfFile} 
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<CircularProgress />}
        error="Failed to load PDF file."
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false} // تحسين الأداء
            renderAnnotationLayer={false} // تحسين الأداء
          />
        ))}
      </Document>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
      <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>Previous</Button>
      <Typography>Page {pageNumber} of {numPages || '--'}</Typography>
      <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</Button>
    </DialogActions>
  </Dialog>
  );
};