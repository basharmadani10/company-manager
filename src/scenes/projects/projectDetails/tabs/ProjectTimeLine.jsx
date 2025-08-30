import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Tooltip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import StepConnector from "@mui/material/StepConnector";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { tokens } from "../../../../theme";
import TasksKanbanView from "../../../../components/Task";
import AddNewStage from "../../../../components/AddStage";
import useProjectStagesData from "../../../../hooks/getAllProjectStagesDataHook";
import { baseUrl } from "../../../../shared/baseUrl";
import { getAuthToken, havePermission } from "../../../../shared/Permissions";
import axios from "axios";
import { deleteStageApi } from "../../../../shared/APIs";
import AddNewTaskDialog from "../../../../components/dialogs/AddNewTaskDialog";

// --- Helper function to format dates ---
const formatDateRange = (start, end) => {
  if (!start || !end) return "Date not set";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options = { month: "short", day: "numeric" };
  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", {
    ...options,
    year: "numeric",
  });
  return `${startStr} -> ${endStr}`;
};

const ProjectStagesComponent = ({ consultingCompanyId,participants }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    stages: fetchedStages,
    loading,
    error,
    refetchData,
  } = useProjectStagesData();

  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [stageForNewTask, setStageForNewTask] = useState(null); // لتخزين ID المرحلة المختارة

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentStageId, setCurrentStageId] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (fetchedStages && fetchedStages.length > 0) {
      setExpanded(fetchedStages[0].id);
      setTasks(fetchedStages.flatMap((stage) => stage.tasks || []));
    }
  }, [fetchedStages]);

  const handleMenuOpen = (event, stageId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentStageId(stageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log("Editing stage:", currentStageId);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
    setCurrentStageId(null);
  };

  const handleConfirmDelete = async () => {
    if (!currentStageId) return;
    setIsDeleting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      const response = await axios.delete(
        `${baseUrl}${deleteStageApi}${currentStageId}`,
        config
      );
      console.log(response);
    } catch (err) {
      console.error("Failed to delete stage:", err);
    } finally {
      setIsDeleting(false);
      handleDeleteDialogClose();
      refetchData();
    }
  };

  const handleOpenTaskDialog = (stageId) => {
    setStageForNewTask(stageId);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsTaskDialogOpen(false);
    setStageForNewTask(null);
  };

  const statusConfig = {
    done: {
      icon: <CheckCircleOutlineIcon />,
      color: colors.greenAccent[400],
      label: "Done",
    },
    in_progress: {
      icon: <AutorenewIcon />,
      color: theme.palette.warning.main,
      label: "In Progress",
    },
    waiting: {
      icon: <HourglassEmptyIcon />,
      color: colors.blueAccent[500],
      label: "Waiting",
    },
    ToDo: {
      icon: <RadioButtonUncheckedIcon />,
      color: colors.grey[500],
      label: "To Do",
    },
  };

  const projectStages = useMemo(() => {
    if (!fetchedStages) return [];
    const exampleToday = new Date(); // Use current date
    return fetchedStages.map((stage) => {
      const stageTasks = (stage.tasks || [])
        .map((st) => tasks.find((t) => t.id === st.id))
        .filter(Boolean);
      const totalTasksCount = stage.tasks?.length || 0;
      const counts = {
        done: stageTasks.filter((t) => t.status === "Done").length,
        in_progress: stageTasks.filter((t) => t.status === "Doing")
          .length,
        waiting: stageTasks.filter((t) => t.status === "pendingApproval").length,
      };
      let stageStatus = "notStarted";
      if (counts.done === totalTasksCount && totalTasksCount > 0) {
        stageStatus = "completed";
      } else if (
        counts.done > 0 ||
        counts.in_progress > 0 ||
        counts.waiting > 0
      ) {
        stageStatus = "inProgress";
      }
      const isCurrent =
        exampleToday >= new Date(stage.startDate) &&
        exampleToday <= new Date(stage.endDate);
      return {
        ...stage,
        tasks: stageTasks,
        totalTasksCount,
        counts,
        stageStatus,
        isCurrent,
        formattedDateRange: formatDateRange(stage.startDate, stage.endDate),
        percentages: {
          done: totalTasksCount > 0 ? (counts.done / totalTasksCount) * 100 : 0,
          in_progress:
            totalTasksCount > 0
              ? (counts.in_progress / totalTasksCount) * 100
              : 0,
          waiting:
            totalTasksCount > 0 ? (counts.waiting / totalTasksCount) * 100 : 0,
        },
      };
    });
  }, [fetchedStages, tasks]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ✅ THE FIX IS HERE
  const activeStepIndex = expanded
    ? (projectStages || []).findIndex((stage) => stage.id === expanded)
    : -1;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "50vh" }}
      >
        <CircularProgress color="success" />
        <Typography variant="h6" sx={{ ml: 2, color: colors.grey[300] }}>
          Loading Project Stages...
        </Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "50vh" }}
      >
        <Typography variant="h5" color="error">
          Failed to load project stages.
        </Typography>
        <Typography color={colors.grey[400]}>{error.message}</Typography>
        <Button
          onClick={refetchData}
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: colors.blueAccent[600],
            "&:hover": { backgroundColor: colors.blueAccent[700] },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" gap={2}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ width: "100%" }}>
            {(projectStages || []).map((stage) => (
              <Accordion
                key={stage.id}
                expanded={expanded === stage.id}
                onChange={handleAccordionChange(stage.id)}
                disableGutters
                elevation={0}
                sx={{
                  backgroundColor: "transparent",
                  borderBottom: `1px solid ${colors.grey[700]}`,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: colors.greenAccent[400] }} />
                  }
                  sx={{
                    borderRadius: 1,
                    backgroundColor:
                      expanded === stage.id
                        ? colors.primary[800]
                        : "transparent",
                    "&:hover": { backgroundColor: colors.primary[900] },
                  }}
                >
                  <Box display="flex" alignItems="center" width="100%" gap={1}>
                    <Box flexGrow={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="h5"
                          fontWeight="600"
                          color={colors.grey[100]}
                        >
                          {stage.title}
                        </Typography>
                        {stage.isCurrent && (
                          <Chip
                            label="Current Stage"
                            
                            size="small"
                            color="success"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color={colors.grey[400]}>
                        {stage.description}
                      </Typography>
                    </Box>
         
                    <Box display="flex" alignItems="center" gap={1}>
                      {stage.totalTasksCount > 0 && (
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          mr="10px"
                        >
                          <Typography
                            variant="body2"
                            color={colors.grey[300]}
                            fontWeight="bold"
                          >{`${Math.round(
                            stage.percentages.done
                          )}%`}</Typography>
                          <Tooltip
                            title={`Done: ${stage.counts.done} | in progress: ${stage.counts.in_progress} | waiting: ${stage.counts.waiting}`}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                width: "15vw",
                                height: "8px",
                                borderRadius: "4px",
                                overflow: "hidden",
                                backgroundColor: colors.grey[600],
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${stage.percentages.done}%`,
                                  backgroundColor: statusConfig.done.color,
                                }}
                              />
                              <Box
                                sx={{
                                  width: `${stage.percentages.in_progress}%`,
                                  backgroundColor:
                                    statusConfig.in_progress.color,
                                }}
                              />
                              <Box
                                sx={{
                                  width: `${stage.percentages.waiting}%`,
                                  backgroundColor: statusConfig.waiting.color,
                                }}
                              />
                            </Box>
                          </Tooltip>
                        </Box>
                      )}

                      {havePermission("create tasks")&&
                      <Tooltip title="Add Task">
                        <IconButton
                          aria-label="add-task"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation(); // لمنع فتح/إغلاق الأكورديون
                            handleOpenTaskDialog(stage.id);
                          }}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
}
                   
                      <IconButton
                        aria-label="stage-actions"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, stage.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ p: 2, backgroundColor: colors.primary[900] }}
                >
                  <TasksKanbanView tasks={stage.tasks} 
                     participants={participants}
                     consultingCompanyId={consultingCompanyId}
                     stageId={stage.id}
                 />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          {havePermission("create stages") &&
          <AddNewStage onStageAdded={refetchData} />
          }
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="start"
          sx={{
            width: isTimelineCollapsed ? "auto" : "25%",
            minWidth: isTimelineCollapsed ? "auto" : "25%",
            transition: "width 0.3s ease-in-out, min-width 0.3s ease-in-out",
            flexShrink: 0,
          }}
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            width="100%"
            sx={{ pl: "10px" }}
          >
            <IconButton
              onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
              sx={{
                backgroundColor: colors.primary[700],
                "&:hover": { backgroundColor: colors.primary[600] },
              }}
            >
              {isTimelineCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>
          <Stepper
            activeStep={activeStepIndex}
            orientation="vertical"
            connector={
              <StepConnector
                sx={{
                  ml: 2,
                  "& .MuiStepConnector-line": {
                    borderColor: colors.grey[700],
                    borderWidth: 2,
                    minHeight: "35px",
                  },
                  "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line":
                    { borderColor: colors.greenAccent[500] },
                }}
              />
            }
          >
            {(projectStages || []).map((stage, index) => {
              const isActive = activeStepIndex === index;
              const timelineIcon = {
                completed: (
                  <Avatar
                    sx={{
                      backgroundColor: isActive
                        ? colors.greenAccent[700]
                        : colors.primary[700],
                      color: colors.grey[100],
                      border: `1px solid ${colors.grey[600]}`,
                    }}
                  >
                    <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
                  </Avatar>
                ),
                inProgress: (
                  <Avatar
                    sx={{
                      backgroundColor: isActive
                        ? colors.greenAccent[700]
                        : colors.primary[700],
                      color: colors.grey[100],
                      border: `1px solid ${colors.grey[600]}`,
                    }}
                  >
                    <Typography fontWeight="bold">{stage.number}</Typography>
                  </Avatar>
                ),
                notStarted: (
                  <Avatar
                    sx={{
                      backgroundColor: colors.primary[900],
                      color: colors.grey[600],
                      border: `1px solid ${colors.grey[700]}`,
                    }}
                  >
                    <Typography fontWeight="bold">{stage.number}</Typography>
                  </Avatar>
                ),
              };
              return (
                <Step
                  key={stage.id}
                  expanded={true}
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease-in-out",
                    "&:hover": { backgroundColor: colors.primary[900] },
                    cursor: "pointer",
                  }}
                >
                  <StepLabel
                    onClick={() => setExpanded(stage.id)}
                    icon={timelineIcon[stage.stageStatus]}
                  >
                    <Box
                      sx={{
                        opacity: isTimelineCollapsed ? 0 : 1,
                        visibility: isTimelineCollapsed ? "hidden" : "visible",
                        whiteSpace: "nowrap",
                        transition: "opacity 0.2s, visibility 0.2s, width 0.3s",
                        ml: 1,
                        overflow: "hidden",
                        width: isTimelineCollapsed ? 0 : "auto",
                      }}
                    >
                      <Typography
                        fontWeight="600"
                        color={isActive ? colors.grey[100] : colors.grey[300]}
                      >
                        {stage.title}
                      </Typography>
                      <Typography variant="body2" color={colors.grey[400]}>
                        {stage.formattedDateRange}
                      </Typography>
                      {stage.isCurrent && (
                        <Chip
                          label="Current Stage"
                          size="small"
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {havePermission("edit stages")&&
        <MenuItem onClick={handleEdit}>Edit</MenuItem>}
        
        {havePermission("delete stages")&&
        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: colors.redAccent[500] }}
        >
          Delete
        </MenuItem>
}
      </Menu>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Stage Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stage? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <AddNewTaskDialog
      consultingCompanyId={consultingCompanyId}
      participants={participants}
    open={isTaskDialogOpen}
    onClose={handleCloseTaskDialog}
    stageId={stageForNewTask}
    onTaskAdded={refetchData} // تمرير دالة التحديث لتحديث القائمة بعد الإضافة
  />
    </>
  );
};

export default ProjectStagesComponent;
