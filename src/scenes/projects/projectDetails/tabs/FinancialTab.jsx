import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    IconButton,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../../../theme";
import useProjectBills from '../../../../hooks/getProjectBillsDataHook';

// --- أيقونات جديدة ---
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Header } from '../../../../components/Header';
import { baseUrl } from '../../../../shared/baseUrl';
import { createProjectBillApi } from '../../../../shared/APIs';
import axios from 'axios';
import { getAuthToken } from '../../../../shared/Permissions';
import { useProject } from '../../../../contexts/ProjectContext';

// ====================================================================
// ==  مكون تفاصيل الفاتورة (للاستخدام في البطاقة والنافذة المنبثقة)
// ====================================================================
const BillDetails = ({ bill, colors }) => (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: `1px solid ${colors.grey[600]}` }}>
            <Box>
                <Typography variant="h4" component="div" fontWeight="600">
                    {bill.description}
                </Typography>
                <Typography sx={{ mt: 1 }} >
                    Date of Payment: {bill.date}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" color="text.secondary">
                   Total Value
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                    ${bill.totalCost.toFixed(2)}
                </Typography>
            </Box>
        </Box>


        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ backgroundColor: 'transparent' }}>
            <Table aria-label="bill details">
                <TableHead sx={{ backgroundColor: colors.primary[800] }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: '600' }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '600' }}>Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody  sx={{ backgroundColor: colors.primary[600] }}>
                    {bill.details.map((detail) => (
                        <TableRow key={detail.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {detail.item}
                            </TableCell>
                            <TableCell>{detail.note}</TableCell>
                            <TableCell align="right">${detail.cost.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
);


// ====================================================================
// ==  مكون بطاقة الفاتورة (بتصميم محسن)
// ====================================================================
const BillCard = ({ bill, onOpenDetails }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Card
            elevation={0}
            sx={{
                p: 2,
                backgroundColor: colors.primary[600],
                border: `1px solid ${colors.grey[700]}`,
                borderRadius: "12px",
                transition: "all 0.2s ease-in-out",
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                "&:hover": {
                    borderColor: colors.greenAccent[400],
                    boxShadow: `0px 4px 15px -5px ${colors.greenAccent[400]}`,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 1 }}>
                {/* --- HEADER --- */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <ReceiptLongIcon sx={{ color: colors.greenAccent[400] }} />
                        <Typography variant="h5" component="div" fontWeight="bold">
                            {bill.description}
                        </Typography>
                    </Stack>
                </Box>

                <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />

                {/* --- DETAILS --- */}
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small"  />
                        <Typography variant="body2" color="text.secondary">Date: {bill.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon fontSize="small"  />
                        <Typography variant="body2" color="text.secondary">
                            Total cost: <b style={{ color: colors.greenAccent[400] }}>${bill.totalCost.toFixed(2)}</b>
                        </Typography>
                    </Box>
                </Stack>

            </CardContent>

            {/* --- ACTION BUTTON --- */}
            <Box sx={{ mt: 'auto', pt: 2, px: 1 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => onOpenDetails(bill)}
                    sx={{ flexShrink: 0, backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] } }}
                >
                    Details
                </Button>
            </Box>
        </Card>
    );
};

// ====================================================================
// ==  مكون فورم إضافة فاتورة جديدة (ديناميكي)
// ====================================================================
const AddBillForm = ({ invoice, setInvoice, colors }) => {

    // دالة لتحديث الحقول الأساسية للفاتورة
    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setInvoice(prev => ({ ...prev, [name]: value }));
    };

    // دالة لتحديث حقول تفاصيل الفاتورة (البنود)
    const handleDetailChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDetails = [...invoice.details];
        updatedDetails[index][name] = value;
        setInvoice(prev => ({ ...prev, details: updatedDetails }));
    };

    // دالة لإضافة بند جديد
    const addDetailRow = () => {
        setInvoice(prev => ({
            ...prev,
            details: [...prev.details, { item: '', note: '', cost: '' }]
        }));
    };

    // دالة لحذف بند
    const removeDetailRow = (index) => {
        const updatedDetails = invoice.details.filter((_, i) => i !== index);
        setInvoice(prev => ({ ...prev, details: updatedDetails }));
    };

    // حساب المجموع الكلي تلقائياً
    const totalCost = useMemo(() =>
        invoice.details.reduce((sum, detail) => sum + (parseFloat(detail.cost) || 0), 0)
    , [invoice.details]);

    return (
        <Box component="form" noValidate autoComplete="off">
            {/* --- معلومات الفاتورة الأساسية --- */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <TextField
                        fullWidth
                        required
                        label="Invoice Description"
                        name="description"
                        value={invoice.description}
                        onChange={handleHeaderChange}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        required
                        type="date"
                        label="Date of Payment"
                        name="date_of_payment"
                        value={invoice.date_of_payment}
                        onChange={handleHeaderChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }}>Invoice Items</Divider>

            {/* --- تفاصيل الفاتورة (البنود الديناميكية) --- */}
            <Stack spacing={2}>
                {invoice.details.map((detail, index) => (
                    <Grid container spacing={1} key={index} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Item" name="item" value={detail.item} onChange={(e) => handleDetailChange(index, e)} variant="outlined" size="small"/>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Note" name="note" value={detail.note} onChange={(e) => handleDetailChange(index, e)} variant="outlined" size="small"/>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField fullWidth type="number" label="Cost" name="cost" value={detail.cost} onChange={(e) => handleDetailChange(index, e)} variant="outlined" size="small"/>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            <IconButton
                                onClick={() => removeDetailRow(index)}
                                color="error"
                                disabled={invoice.details.length <= 1} // تعطيل الحذف إذا كان هناك بند واحد فقط
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
            </Stack>

            {/* --- زر إضافة بند جديد والمجموع --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Button startIcon={<AddIcon />} onClick={addDetailRow} variant="text">
                    Add Item
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    Total: <span style={{ color: colors.greenAccent[400] }}>${totalCost.toFixed(2)}</span>
                </Typography>
            </Box>
        </Box>
    );
};

// ====================================================================
// == المكون الرئيسي
// ====================================================================
const FinancialTab = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { bills, loading, error, refetchBills } = useProjectBills();

    const [viewMode, setViewMode] = useState('card');
    const [selectedBill, setSelectedBill] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { selectedProjectId } = useProject();

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);




    const filteredBills = useMemo(() => {
        if (!bills) return [];

        return bills.filter(bill => {

            const billDate = new Date(bill.date);
            billDate.setHours(0, 0, 0, 0); // تجاهل الوقت

            // فلترة بالوصف
            const descriptionMatch = bill.description.toLowerCase().includes(searchTerm.toLowerCase());

            // فلترة بتاريخ البدء
            const startDateMatch = !startDate || billDate >= new Date(startDate);

            // فلترة بتاريخ الانتهاء
            const endDateMatch = !endDate || billDate <= new Date(endDate);

            return descriptionMatch && startDateMatch && endDateMatch;
        });
    }, [bills, searchTerm, startDate, endDate]);


    const totalOfAllBills = useMemo(() => {
        if (!filteredBills) return 0;
        return filteredBills.reduce((total, bill) => total + bill.totalCost, 0);
    }, [filteredBills]);

    // --- دالة لإعادة تعيين كل الفلاتر ---
    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    const handleOpenDetails = (bill) => {
        setSelectedBill(bill);
        setIsDetailDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailDialogOpen(false);
        setSelectedBill(null);
    };


    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const initialInvoiceState = {
        description: '',
        date_of_payment: new Date().toISOString().split('T')[0],
        project_id: selectedProjectId,
        details: [{ item: '', note: '', cost: '' }]
    };
    const [newInvoice, setNewInvoice] = useState(initialInvoiceState);

    const handleOpenAddDialog = () => {
        setNewInvoice(initialInvoiceState); // إعادة تعيين الفورم عند فتحه
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
    };

    const handleSaveInvoice = async () => {
        setIsSaving(true);
        try {
            console.log("Saving Invoice:", newInvoice);
            const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
            await axios.post(`${baseUrl}${createProjectBillApi}`, newInvoice, config);

            handleCloseAddDialog();
            refetchBills();
        } catch (err) {
            console.error("Failed to save invoice:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteInvoice = async (billId) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) {
            return;
        }
        setIsDeleting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
            await axios.delete(`${baseUrl}/api/bills/${billId}`, config);

            handleCloseDetails();
            refetchBills();
        } catch (err) {
            console.error("Failed to delete invoice:", err);
        } finally {
            setIsDeleting(false);
        }
    };


    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "description", headerName: "Description", flex: 2, cellClassName: "name-column--cell" },
        { field: "date", headerName: "Invoice Date", flex: 1 },
        {
            field: "totalCost", headerName: "Total value", type: 'number', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params) => (
                <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'left' }}>
                    <Typography color={colors.greenAccent[500]} fontWeight="bold">${params.value.toFixed(2)}</Typography>
                </Box>
            )
        },
        {
            field: 'actions', headerName: 'Actions', flex: 1, align: 'center', headerAlign: 'center', sortable: false,
            renderCell: ({ row }) => (
                <Button variant="outlined" size="small" onClick={() => handleOpenDetails(row)}>
                    Details
                </Button>
            )
        }
    ];

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>Error, Please try again.</Alert>;

    return (
        <Box sx={{ width: '100%', p: 2, backgroundColor: colors.primary[700], borderRadius: "12px" }}>

<Header 
    title="Project Invoices" 
    subtitle={`Total value of Invoices: $${totalOfAllBills.toFixed(2)}`} 
/>

            <Stack spacing={2} sx={{ mt: 3, mb: 4, p: 2, backgroundColor: colors.primary[800], borderRadius: '8px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            label="Search by Invoice DESCRIPTION"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            label="Search from"
                            type="date"
                            variant="outlined"
                            size="small"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="to"
                            type="date"
                            variant="outlined"
                            size="small"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton onClick={clearFilters} title="إلغاء الفلاتر">
                            <FilterAltOffIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} md={1} justifyContent='flex-end'>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                            <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange}>
                                <ToggleButton value="table" aria-label="Table view"><ViewListIcon /></ToggleButton>
                                <ToggleButton value="card" aria-label="Card view"><ViewModuleIcon /></ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{ flexShrink: 0, backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] } }}
                        >
                            Add New Invoice
                        </Button>
                    </Grid>
                </Grid>
            </Stack>


            {/* --- عرض البيانات --- */}
            {!bills || bills.length === 0 ? (
                <Box sx={{ mt: 2, p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">There is no Invoices to view</Typography>
                </Box>
            ) : filteredBills.length === 0 ? (
                <Box sx={{ mt: 2, p: 3, textAlign: 'center' }}>
                     <Typography variant="h6">There is no matching Invoices</Typography>
                </Box>
            ) : (
                <>
                    {viewMode === 'table' ? (

                        <Box m="20px 0 0 0" height="75vh" sx={{ /* ... styles */ }}>
                        <DataGrid
                            rows={filteredBills}
                            columns={columns}
                            getRowId={(row) => row.id}
                        />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredBills.map((bill) => (
                                <Grid item xs={12} sm={6} md={4} key={bill.id}>
                                    <BillCard bill={bill} onOpenDetails={handleOpenDetails} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {/* --- نافذة عرض التفاصيل الكاملة --- */}
            {selectedBill && (
                <Dialog open={isDetailDialogOpen} onClose={handleCloseDetails} fullWidth maxWidth="md" >
                   <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold',backgroundColor:colors.primary[500] }}>
                        Invoice Details
                        <IconButton onClick={handleCloseDetails} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{backgroundColor:colors.primary[500]}}>
                        <BillDetails bill={selectedBill} colors={colors} />
                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: colors.primary[500], p: 2, justifyContent: 'space-between' }}>
                        <Button
                            onClick={() => handleDeleteInvoice(selectedBill.id)}
                            variant="contained"
                            color="error"
                            disabled={isDeleting}
                            sx={{ minWidth: '100px' }}
                        >
                            {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                        </Button>
                        <Button onClick={handleCloseDetails} variant="contained" >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

             {/* --- نافذة إضافة فاتورة جديدة --- */}
             <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth="md">
                <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold', backgroundColor: colors.primary[500] }}>
                    Create New Invoice
                    <IconButton onClick={handleCloseAddDialog} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ backgroundColor: colors.primary[500] }}>
                    <AddBillForm
                        invoice={newInvoice}
                        setInvoice={setNewInvoice}
                        colors={colors}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: colors.primary[500], p: 2 }}>
                    <Button onClick={handleCloseAddDialog} >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveInvoice}
                        variant="contained"
                        
                        disabled={isSaving}
                        sx={{ minWidth: '130px',backgroundColor:colors.greenAccent[600] }}
                    >
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Invoice'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FinancialTab;