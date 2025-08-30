import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import { tokens } from "../theme"; // Adjust path to your theme file
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Icon for estimated time
import TaskDetailDialog from "./dialogs/TaskDetailsDialog";
import { havePermission } from "../shared/Permissions";

// --- The Kanban Board Component ---
const TasksKanbanView = ({ tasks,participants,consultingCompanyId ,stageId}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const [selectedTask, setSelectedTask] = useState(null);

  // --- 2. Configuration for Column appearance ---
  const columnsConfig = {
    ToDo: { title: "To Do", color: colors.grey[500] },
    Doing: { title: "In Progress", color: theme.palette.warning.main },
    pendingApproval: { title: "Waiting", color: colors.blueAccent[500] },
    Done: { title: "Done", color: colors.greenAccent[500] },
  };


  const handleOpenDialog = (task) => {
    {havePermission("details tasks")&&
    setSelectedTask(task);
  }
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
  };


  // Define the order of the columns
  const columnOrder = ["ToDo", "Doing", "pendingApproval", "Done"];

  // --- 3. Group tasks by status for rendering ---
  const taskColumns = useMemo(() => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const status = task.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});
    return groupedTasks;
  }, [tasks]);

  return (
    <>
    <Box
      sx={{
        display: "flex",
        gap: 2,
      }}
    >
      {/* Map over the defined order to render columns correctly */}
      {columnOrder.map((columnId) => {
        const column = columnsConfig[columnId];
        const tasksInColumn = taskColumns[columnId] || [];

        return (
          // --- Column ---
          <Box
            key={columnId}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: colors.primary[900],
              borderRadius: "12px",
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `3px solid ${column.color}`,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ color: colors.grey[100] }}
              >
                {column.title}
              </Typography>
              <Avatar
                sx={{
                  backgroundColor: column.color,
                  color: "#fff",
                  width: 28,
                  height: 28,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {tasksInColumn.length}
                </Typography>
              </Avatar>
            </Box>

            {/* Tasks Container */}
            <Box
              sx={{
                pt: 1.5,
                flexGrow: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {tasksInColumn.map((task) => (
                // --- Task Card ---
                <Paper
                  key={task.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    backgroundColor: colors.primary[800],
                    border: `1px solid ${colors.grey[700]}`,
                    borderRadius: "8px",
                    transition: "all 0.2s ease-in-out", // For a smooth effect

                    // --- Add this for the hover effect ---
                    "&:hover": {
                      cursor: "pointer", // Show the hand cursor
                      borderColor: column.color, // Change the border color
                      boxShadow: `0px 0px 10px -5px ${column.color}`, // Add a subtle shadow to "lift" the card
                    },
                  }}
                  
                  onClick={() => handleOpenDialog(task)}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: colors.grey[100] }}
                    >
                      {task.title}
                    </Typography>
                    
                    <Chip
                      label={`T-${task.id}`}
                      size="small"
                      sx={{ color: colors.grey[300] }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    
                    sx={{ color: colors.grey[300], mb: 2,     
                }}
                  >
                    {task.description}
                  </Typography>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon
                        sx={{ color: colors.grey[400], fontSize: "1rem" }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: colors.grey[400] }}
                      >
                        {task.expected_period_to_complete}
                      </Typography>
                    </Box>

                    {/* assigned to */}
                    <Tooltip
                      title={`assigned to ${task.employeeAssigned.name}`}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: column.color,
                          color: "#fff",
                          width: 22,
                          height: 22,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {task.employeeAssigned.name.charAt(0).toUpperCase()}
                        </Typography>
                      </Avatar>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        );
      })}
      
    </Box>
          {selectedTask && (
            <TaskDetailDialog
              open={!!selectedTask}
              onClose={handleCloseDialog}
              task={selectedTask}
              participants={participants} 
              consultingCompanyId={consultingCompanyId}
              stageId={stageId}
            />
          )}
          </>
  );
};

export default TasksKanbanView;
