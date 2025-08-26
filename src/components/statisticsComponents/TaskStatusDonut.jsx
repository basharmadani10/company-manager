// src/components/TaskStatusDonut.jsx
import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { tokens } from '../../theme';

const TaskStatusDonut = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const statusCounts = data.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(status => ({
        id: status, label: status, value: statusCounts[status],
    }));
    return (
        <Paper elevation={3} sx={{ height: "300px", p: 2, borderRadius: '12px', backgroundColor: colors.primary[800] }}>
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={2}>Tasks Breakdown</Typography>
            <ResponsivePie
                data={pieData}
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                innerRadius={0.6}
                padAngle={2}
                cornerRadius={3}
                theme={{ tooltip: { container: { color: colors.primary[500] } } }}
            />
        </Paper>
    );
};
export default TaskStatusDonut;