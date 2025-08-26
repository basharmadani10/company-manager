// src/components/ProjectRiskChart.jsx
import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { tokens } from '../../theme';

const ProjectRiskChart = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const riskCounts = data.reduce((acc, p) => {
        acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(riskCounts).map(risk => ({
        id: risk, label: risk, value: riskCounts[risk],
    }));
    return (
        <Paper elevation={3} sx={{ height: "400px", p: 2, borderRadius: '12px', backgroundColor: colors.primary[800] }}>
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={2}>Project Risk Levels</Typography>
            <ResponsivePie
                data={pieData}
                margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                colors={{ scheme: 'red_yellow_green' }}
                arcLinkLabelsTextColor={colors.grey[100]}
                theme={{
                    legends: { text: { fill: colors.grey[100] } },
                    tooltip: { container: { color: colors.primary[500] } },
                }}
            />
        </Paper>
    );
};
export default ProjectRiskChart;