
import { useState } from "react"; // For Snackbar state management

import { Header } from "../../../../components/Header";
import { tokens } from "../../../../theme";

// Import action icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add"; // Icon for the Add button

// Import the new Delete Confirmation component
import DeleteConfirmationComponent from "../../../../components/DeleteConfirmation"; // Ensure correct path

import { baseUrl } from "../../../../shared/baseUrl";
import { deleteParticipantApi } from "../../../../shared/APIs";


import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  Snackbar,
  Alert,} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddParticipant from "../AddParticipant";
import UserCard from "../../../../components/UserCard";
import { useEffect } from "react";
import { havePermission } from "../../../../shared/Permissions";

const TeamTab = ({ participants }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false); // حالة للتحكم في فتح/إغلاق الـ Dialog
  const handleOpenAddParticipant = () => {
    setIsAddParticipantOpen(true);
  };

  const handleCloseAddParticipant = () => {
    setIsAddParticipantOpen(false);
  };



  const formattedData = participants.reduce((acc, participant) => {
    const user = participant.participant.user;
    const specialization = participant.participant.specialization;
  
    const formattedParticipant = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      specialization_name: user.first_name,
    };
  
    if (participant.participant_type === 'project_manager') { 
      acc.projectManager = formattedParticipant;
    } else if (participant.participant_type === 'engineer') {
      acc.formatedEngineers.push(formattedParticipant);
    }
  
    return acc;
  }, { formatedEngineers: [], projectManager: null });
  
  // Now you can access the formatted data like this:
  const formatedEngineers = formattedData.formatedEngineers;
  const projectManager = formattedData.projectManager;
  
  console.log('Engineers:', formatedEngineers);
  console.log('Project Manager:', projectManager);





  // State for Snackbar messages (notifications)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be: 'success' | 'error' | 'warning' | 'info'

  // Function to open the Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Function to close the Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Define DataGrid columns
  const columns =[
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,

    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell", // Custom class for name styling
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell", // Custom class for name styling
    },
    {
      field: "specialization_name",
      headerName: "Specialization",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex:0.5,
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
       
 
  

            {/* Delete Confirmation Component */}
            <DeleteConfirmationComponent
              itemId={params.row.id}
              deleteApi={`${baseUrl}${deleteParticipantApi}`}
              onDeleteSuccess={() => {
                showSnackbar("Engineer deleted successfully!", "success");
                // refetchEngineers(); // 🚨 Refetch data to update the table
              }}
              onDeleteError={(errorMessage) => {
                showSnackbar(`Failed to delete engineer: ${errorMessage}`, "error");
              }}
              // Pass the delete icon to be rendered inside the component's button
              icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
              // You can also pass custom confirmation text if needed
              confirmationText="Are you sure you want to delete this engineer?"
            />
        
          </Box>
        );
      },
    },];



  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header
          title={"Participants"}
          subtitle={"Managing the engineers participating in the project. "}
        />

          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[800],
              },
            }}
            startIcon={<AddIcon />} // Icon for the Add button
          onClick={handleOpenAddParticipant}
          >
            Add Participant
          </Button>

      </Box>
  
             <UserCard
              label="Project Manager"
              firstName= {projectManager.first_name}
              lastName= {projectManager.last_name}
              email= {projectManager.email}
              phoneNumber= {projectManager.phone_number}
              address= {"N/A"}
            />
            <Box mt="30px" mb="15px">
           <Header 
          title={"Engineers"}
          subtitle={"all the Engineers in the project"}
        /></Box>

   <YourComponent columns={columns} formatedEngineers={formatedEngineers}/>


      <AddParticipant
        open={isAddParticipantOpen}    // تمرير حالة الفتح
        onClose={handleCloseAddParticipant} // تمرير دالة الإغلاق
      />
   

      {/* Snackbar for notifications at the bottom right */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Snackbar disappears after 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeamTab;



// Your component
const YourComponent = ({ formatedEngineers, columns }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box  
    m="20px 0 0 0"
    height="70vh" // Fixed height for DataGrid
    sx={{
      // Custom styles for DataGrid
      "& .MuiDataGrid-root": {
        border: "none", // Remove outer border of the table
      },
      "& .MuiDataGrid-cell": {
        borderBottom: "none", // Remove bottom borders between cells
      },
      "& .name-column--cell": {
        // color: colors.greenAccent[300], // Distinct color for engineer names
        fontWeight: "bold", // Bold font for names
      },
      "& .MuiDataGrid-columnHeaders": {
        
        color: colors.greenAccent[400],
        // backgroundColor: colors.primary[800], // Background color for column headers
        borderBottom: "none",
        // fontSize: "1rem", // Larger font size for column headers
        fontWeight: "bold",
      },

    }}>
    
    <DataGrid
      rows={formatedEngineers}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20]}
    />
    </Box>
  );
};