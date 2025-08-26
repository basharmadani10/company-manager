// src/components/KPI_Card.jsx
import React from 'react';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { tokens } from '../../theme';

const KPI_Card = ({ title, value, icon, info, critical = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const valueColor = critical ? colors.redAccent[500] : colors.greenAccent[500];

    return (
        <Paper elevation={3} sx={{ p: '20px', borderRadius: '12px', backgroundColor: colors.primary[800] }}>
            <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                    <Typography variant="h5" color={colors.grey[300]}>{title}</Typography>
                    <Typography variant="h2" fontWeight="bold" color={valueColor}>{value}</Typography>
                    {info && <Typography variant="body2" color={colors.grey[400]}>{info}</Typography>}
                </Box>
                <Box sx={{ color: valueColor, fontSize: '2.5rem' }}>{icon}</Box>
            </Box>
        </Paper>
    );
};
export default KPI_Card;