// src/components/ProjectDataTable.jsx
import React from 'react';
import { Box, useTheme, Paper, Typography, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';

const ProjectDataTable = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Project Name', flex: 1 },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'progress', headerName: 'Progress', width: 150,
            renderCell: (params) => {
                const progress = params.row.tasks.total > 0 ? Math.round((params.row.tasks.completed / params.row.tasks.total) * 100) : 0;
                return (
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}><LinearProgress variant="determinate" value={progress} /></Box>
                        <Typography variant="body2" color="text.secondary">{`${progress}%`}</Typography>
                    </Box>
                )
            }
        },
        { field: 'deadline', headerName: 'Deadline', width: 120 },
        { field: 'riskLevel', headerName: 'Risk', width: 100 },
    ];

    return (
        <Paper elevation={3} sx={{ height: 400, width: '100%', p:2, borderRadius: '12px', backgroundColor: colors.primary[800] }}>
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={2}>Active Projects Overview</Typography>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.blueAccent[800] },
                    '& .MuiDataGrid-cell': { borderBottom: `1px solid ${colors.primary[700]}` },
                }}
            />
        </Paper>
    );
};
export default ProjectDataTable;