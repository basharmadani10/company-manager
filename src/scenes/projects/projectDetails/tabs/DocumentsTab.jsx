import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tokens } from "../../../../theme";
import useProjectFilesData from "../../../../hooks/getProjectFilesDataHook";
import DeleteConfirmationComponent from "../../../../components/DeleteConfirmation";
import { deleteProjectFileApi,getOneParticipantApi  } from "../../../../shared/APIs";
import { baseUrl } from "../../../../shared/baseUrl";
import { Header } from "../../../../components/Header";
import AddProjectFile from "../AddFile"; // Import the new Dialog component
import { havePermission } from "../../../../shared/Permissions";
import { useProject } from '../../../../contexts/ProjectContext';
import axios from "axios";
import { PdfViewerDialog } from "../../../../components/dialogs/PdfViewerDialog";
import UploadVersionDialog from "../../../../components/dialogs/UploadVersionDialog"; // <-- 1. Import the new dialog







const DocumentsTab = ({  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const { selectedProjectId } = useProject();

  const { projectFiles, loading, error, refetchFiles } = useProjectFilesData({
  });
  

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const [currentFileName, setCurrentFileName] = useState("");
 
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false); // State for the AddFileDialog
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  const [isUploadVersionOpen, setIsUploadVersionOpen] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState(null);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleOpenUploadNewerVersion = (file) => {
    setFileToUpdate(file); // Store the entire file object
    setIsUploadVersionOpen(true);
  };

  const handleCloseUploadNewerVersion = () => {
    setIsUploadVersionOpen(false);
    setFileToUpdate(null); // Clear the file on close
  };


  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // const handleOpenViewer = (fileUrl, fileName, fileType) => {
  //   window.open(fileUrl, '_blank', 'noopener,noreferrer');
  //   // setCurrentFileUrl(fileUrl);
  //   // setCurrentFileName(fileName);
  //   // setCurrentFileType(fileType);
  //   // setOpenViewer(true);
  // };

  // const handleCloseViewer = () => {
  //   setOpenViewer(false);
  //   setCurrentFileUrl("");
  //   setCurrentFileName("");
  //   setCurrentFileType("");
  // };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setPdfBlob(null);
};

const handleViewFile = async (fileUrl, fileName) => {
  try {
      const relativeUrl = new URL(fileUrl).pathname;
      const response = await axios.get(relativeUrl, { responseType: 'blob' });
      
      // 👇 --- التغيير الثاني: لا ننشئ URL، بل نستخدم الـ Blob مباشرة ---
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });
      
      setPdfBlob(fileBlob); // تخزين الـ Blob في الحالة
      setCurrentFileName(fileName);
      setIsViewerOpen(true);

  } catch (error) {
      console.error("Error preparing PDF for viewing:", error);
      alert("Sorry, the file could not be prepared for viewing.");
  }
};



  const handleDownloadFile = (fileUrl, fileName) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar(`Downloading: ${fileName}`, "success");
    } catch (error) {
      console.error("Failed to download file:", error);
      showSnackbar(`Failed to download: ${fileName}`, "error");
    }
  };


  const handleOpenAddFileDialog = () => {
    setIsAddFileDialogOpen(true);
  };

  const handleCloseAddFileDialog = () => {
    setIsAddFileDialogOpen(false);
  };

  if (loading) {
    return (
      <Box
        m="20px"
        p="20px"
        sx={{
          backgroundColor: colors.primary[800],
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
        <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
          Loading project files...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        m="20px"
        p="20px"
        sx={{
          backgroundColor: colors.primary[800],
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="error" sx={{ textAlign: "center" }}>
          Error loading files: {error.message || "An unknown error occurred."}
        </Typography>
        <Button
          onClick={refetchFiles}
          variant="outlined"
          sx={{
            mt: 2,
            color: colors.blueAccent[500],
            borderColor: colors.blueAccent[500],
          }}
        >
          Retry
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[800],
        borderRadius: "18px",
        minHeight: "300px",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Header
          title={"Project Files"}
          subtitle={"Managing the Files of the project"}
        />
        {havePermission("upload diagrams") && (
          <Button
            variant="contained"
            onClick={handleOpenAddFileDialog}
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[800],
              },
            }}
          >
            Add File
          </Button>
        )}
      </Box>
      <Typography
        variant="h4"
        mb={3}
        sx={{
          color: colors.greenAccent[300],
          fontWeight: "bold",
          borderBottom: `1px solid ${colors.grey[700]}`,
          pb: 1,
        }}
      >
        Project Files (Project ID: {selectedProjectId})
      </Typography>

      {projectFiles.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography
            variant="h6"
            sx={{ color: colors.grey[400], textAlign: "center", mt: 4 }}
          >
            No files found for this project.
          </Typography>
        </Box>
      ) : (
        <List sx={{ mt: 2 }}>
          {projectFiles.map((file, index) => (
            <React.Fragment key={file.id}>
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  py: 2,
                  px: 0,
                  "&:hover": {
                    backgroundColor: colors.primary[800],
                    borderRadius: "8px",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px", mb: { xs: 1, sm: 0 } }}>
                  <FilePresentIcon
                    sx={{ color: colors.blueAccent[300], fontSize: "2rem" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grey[300], mt: 0.5 }}
                    >
                      {file.description || "No description available."}
                      {file.uploader_name}
                    </Typography>
                  }
                
                  sx={{ flexGrow: 1, mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}
                />
                {file.type === "pdf" ||
                file.type === "png" ||
                file.type === "jpg" ||
                file.type === "jpeg" ||
                file.type === "gif" ||
                file.type === "svg" ? (
                  <Box
                    display="flex"
                    gap={1}
                    flexDirection={{ xs: "column", sm: "row" }}
                    minWidth={{ xs: "100%", sm: "auto" }}
                  >
                    {havePermission("view diagrams")&&(
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() =>
                        handleViewFile(file.file_path, file.name)
                      }
                      sx={{
                        backgroundColor: colors.blueAccent[600],
                        color: colors.primary[100],
                        "&:hover": { backgroundColor: colors.blueAccent[700] },
                        flexGrow: 1,
                      }}
                    >
View
                    </Button>
                    )}
                        {havePermission("update diagrams")&&(
                                              <Button
                                                variant="contained"
                                                startIcon={<UploadIcon />}
                                                onClick={() =>
                                                  handleOpenUploadNewerVersion(file)
                                                }
                                                sx={{
                                                  backgroundColor: colors.grey[600],
                                                  color: colors.primary[100],
                                                  "&:hover": {
                                                    backgroundColor: colors.grey[800],
                                                  },
                                                  flexGrow: 1,
                                                }}
                                              >
                                                upload newer version
                                              </Button>
                        )}
                    {havePermission("download diagrams") && (
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownloadFile(file.file_path, file.name)
                        }
                        sx={{
                          backgroundColor: colors.greenAccent[700],
                          color: colors.primary[100],
                          "&:hover": {
                            backgroundColor: colors.greenAccent[800],
                          },
                          flexGrow: 1,
                        }}
                      >
                        Download
                      </Button>
                      
                    )}
                    {havePermission("delete diagrams") && (
                      <DeleteConfirmationComponent
                        itemId={file.id}
                        deleteApi={`${baseUrl}${deleteProjectFileApi}`}
                        onDeleteSuccess={() => {
                          showSnackbar("File deleted successfully!", "success");
                          refetchFiles();
                        }}
                        onDeleteError={(errorMessage) => {
                          showSnackbar(
                            `Failed to delete file: ${errorMessage}`,
                            "error"
                          );
                        }}
                        icon={
                          <DeleteOutlineIcon
                            sx={{ color: colors.redAccent[500] }}
                          />
                        }
                        confirmationText="Are you sure you want to delete this file?"
                      />
                    )}
                  </Box>
                ) : (
                  <Box
                  display="flex"
                  gap={1}
                  flexDirection={{ xs: "column", sm: "row" }}
                  minWidth={{ xs: "100%", sm: "auto" }}>
{havePermission("upload diagrams") &&(
                    <Button
                                                  variant="contained"
                                                  startIcon={<UploadIcon />}
                                                  onClick={() =>
                                                    handleOpenUploadNewerVersion(file)
                                                  }
                                                  sx={{
                                                    backgroundColor: colors.grey[600],
                                                    color: colors.primary[100],
                                                    "&:hover": {
                                                      backgroundColor: colors.grey[800],
                                                    },
                                                    flexGrow: 1,
                                                  }}
                                                >
                                                  upload newer version
                                                </Button>
)}       

{havePermission("download diagrams")&&(
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadFile(file.file_path, file.name)
                    }
                    sx={{
                      backgroundColor: colors.greenAccent[700],
                      color: colors.primary[100],
                      "&:hover": {
                        backgroundColor: colors.greenAccent[800],
                      },
                    
                    }}
                  >
                    Download
                  </Button>
                  )}
                    </Box>
                  
                )}
              </ListItem>
              {index < projectFiles.length - 1 && (
                <Divider
                  component="li"
                  sx={{ borderColor: colors.grey[700] }}
                />
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <PdfViewerDialog
                open={isViewerOpen}
                onClose={handleCloseViewer}
              pdfFile={pdfBlob}
                fileName={currentFileName}
            />

            <UploadVersionDialog
        open={isUploadVersionOpen}
        onClose={handleCloseUploadNewerVersion}
        onUploadSuccess={() => {
          refetchFiles();
          handleCloseUploadNewerVersion(); // Also close dialog on success
        }}
        originalFileId={fileToUpdate?.id}
        originalFileName={fileToUpdate?.name}
      />

      <AddProjectFile
        open={isAddFileDialogOpen}
        onClose={handleCloseAddFileDialog}
        onUploadSuccess={refetchFiles} // Callback to refetch files after successful upload
      />
    </Box>
  );
};

export default DocumentsTab;
