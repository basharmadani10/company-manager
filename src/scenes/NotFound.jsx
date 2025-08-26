import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { tokens } from '../theme'; // تأكد من صحة المسار

const NotFound = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%', // سيجعل الصندوق يملأ المساحة المتاحة
                textAlign: 'center',
                p: 3,
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: '100px', color: colors.redAccent[500] }} />
            <Typography variant="h1" fontWeight="bold" sx={{ mt: 3, color: colors.grey[100] }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, color: colors.grey[300] }}>
                الصفحة غير موجودة
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: colors.grey[400] }}>
                عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </Typography>
            <Button
                variant="contained"
                onClick={() => navigate('/dashboard/')}
                sx={{
                    mt: 4,
                    backgroundColor: colors.greenAccent[600],
                    '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                    },
                    color: colors.grey[100],
                    fontWeight: 'bold',
                    padding: '10px 20px',
                }}
            >
                العودة إلى لوحة التحكم
            </Button>
        </Box>
    );
};

export default NotFound;