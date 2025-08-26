// src/components/FinancialSummaryChart.jsx
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { tokens } from '../../theme';

const FinancialSummaryChart = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // تأكد من أن البيانات التي تصل هنا ليست فارغة
    const chartData = data.map(p => ({
        project: p.name,
        "Revenue": p.revenue,
        "Cost": p.cost,
    }));

    return (
        // A. الحاوية الرئيسية يجب أن تكون flex container عمودي
        <Paper 
            elevation={3} 
            sx={{ 
                height: "400px", // يمكنك تعديل هذا الارتفاع
                p: 2, 
                borderRadius: '12px', 
                backgroundColor: colors.primary[800],
                display: 'flex',          // <--- مهم جداً
                flexDirection: 'column'   // <--- مهم جداً
            }}
        >
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={2}>
                Financial Summary
            </Typography>

            {/* B. يجب وضع المخطط داخل Box يأخذ كل المساحة المتبقية */}
            <Box sx={{ flexGrow: 1, minHeight: 0, width: '100%' }}> {/* <--- مهم جداً، خاصة minHeight */}
                <ResponsiveBar
                    data={chartData}
                    keys={['Revenue', 'Cost']}
                    indexBy="project"
                    margin={{ top: 20, right: 130, bottom: 80, left: 60 }}
                    padding={0.3}
                    colors={{ scheme: 'category10' }}
                    groupMode="grouped"
                    axisBottom={{
                        tickSize: 5, tickPadding: 5, tickRotation: -15,
                    }}
                    legends={[
                        { dataFrom: 'keys', anchor: 'bottom-right', direction: 'column',
                          justify: false, translateX: 120, translateY: 0, itemsSpacing: 2,
                          itemWidth: 100, itemHeight: 20, itemDirection: 'left-to-right',
                          itemOpacity: 0.85, symbolSize: 20,
                        },
                    ]}
                    theme={{
                        axis: { ticks: { text: { fill: colors.grey[300] } }, legend: { text: { fill: colors.grey[100] } } },
                        legends: { text: { fill: colors.grey[100] } },
                        tooltip: { container: { color: colors.primary[500] } },
                    }}
                />
            </Box>
        </Paper>
    );
};

export default FinancialSummaryChart;