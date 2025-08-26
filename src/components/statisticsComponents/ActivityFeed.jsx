// src/components/ActivityFeed.jsx
import React from 'react';
import { Box, Typography, useTheme, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { tokens } from '../../theme';

const ActivityFeed = ({ data }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Paper elevation={3} sx={{ height: "300px", p: 2, borderRadius: '12px', backgroundColor: colors.primary[800], overflowY: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" color={colors.grey[100]} mb={2}>Recent Activity</Typography>
            <List>
                {data.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            <ListItemText
                                primary={<Typography color={colors.grey[100]}>{`${item.user} ${item.action} '${item.project}'`}</Typography>}
                                secondary={<Typography variant="body2" color={colors.grey[400]}>{item.time}</Typography>}
                            />
                        </ListItem>
                        {index < data.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};
export default ActivityFeed;