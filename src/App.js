import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
// NEW: Import Outlet and Navigate for routing logic
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import Engineers from "./scenes/engineers/Index";
import Projects from "./scenes/projects/Index";
import SalesManagers from "./scenes/salesManagers/Index";
import AddEngineer from "./scenes/engineers/addEngineer/index";
import ConsultingEngineers from "./scenes/consultingCompanies/consultingEngineers/Index";
import ConsultingCompanies from "./scenes/consultingCompanies";
import AddConsultingCompany from "./scenes/consultingCompanies/addConsultingCompany";
import Owners from "./scenes/owners";
import AddOwner from "./scenes/owners/addOwner";
import AddProject from "./scenes/projects/addProject";
import ProjectDetails from "./scenes/projects/projectDetails";
import Login from "./scenes/auth/Login";
import AddConsultingEngineer from "./scenes/consultingCompanies/consultingEngineers/addConsultingEngineer";
import AddParticipant from "./scenes/projects/projectDetails/AddParticipant";
import ProjectManagers from "./scenes/projectManagers/Index";
import AddProjectManager from "./scenes/projectManagers/addProjectManger";
import AddFile from "./scenes/projects/projectDetails/AddFile";
import AddProjectFile from "./scenes/projects/projectDetails/AddFile";
import { ProjectProvider } from "./contexts/ProjectContext";
import AddSalesManager from "./scenes/salesManagers/addSalesManager/Index";
import SalesDashboard from "./scenes/salesDashboard/Index";
import AddProjectToSale from "./scenes/salesDashboard/AddProjectToSale";
import EditProjectSale from "./scenes/salesDashboard/EditProjectToSale";
import SaleDetailDialog from "./components/dialogs/SaleDetailDialog";
import SaleDetailPage from "./scenes/salesDashboard/SaleDetailPage";
import ProjectConsultingCompanyTab from "./scenes/projects/projectDetails/tabs/ConsultingCompanyTab";
import ConsultingCompanyDetails from "./scenes/consultingCompanies/CompanyDetails";
import NotFound from "./scenes/NotFound";

// NEW: ProtectedRoutes component
// This component checks if a token exists in localStorage.
// If it exists, it renders the child routes using <Outlet />.
// If not, it redirects the user to the login page.
const ProtectedRoutes = () => {
  // IMPORTANT: Change 'authToken' to the key you use to store the token.
  const token = localStorage.getItem("authToken");
  return token ? <Outlet /> : <Navigate to="/dashboard/login" replace />;
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const noLayoutRoutes = ["/dashboard/login","*"];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  const collapsedSidebarWidth = "80px";
  const expandedSidebarWidth = "270px";

  const mainContentMargin = showLayout
    ? isSidebarCollapsed
      ? collapsedSidebarWidth
      : expandedSidebarWidth
    : "0px";

  // NEW: Check for token for the initial redirect logic
  const token = localStorage.getItem("authToken");

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <ProjectProvider>
          <CssBaseline />
          <div
            className="app"
            style={{
              display: "flex",
              minHeight: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            {showLayout && (
              <Sidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
              />
            )}

            <main
              className="content"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                maxHeight: "100vh",
                marginLeft: mainContentMargin,
                transition: "margin-left 0.3s ease-in-out",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {showLayout && <Topbar />}

              <Box flexGrow={1} overflow="auto">
                <Routes>
               
                  <Route
                    path="/"
                    element={
                      token ? (
                        <Navigate to="/dashboard/" />
                      ) : (
                        <Navigate to="/dashboard/login" />
                      )
                    }
                  />
                  
                  {/* Public route for login */}
                  <Route path="/dashboard/login" element={<Login />} />

                  {/* NEW: All protected routes are now nested under the ProtectedRoutes component */}
                  <Route element={<ProtectedRoutes />}>
                    <Route path="/dashboard/" element={<Dashboard />} />
                    <Route path="/dashboard/engineers" element={<Engineers />} />
                    <Route path="/dashboard/engineers/add" element={<AddEngineer />} />
                    <Route path="/dashboard/ConsultingCompanies" element={<ConsultingCompanies />} />
                    <Route path="/dashboard/ConsultingCompanies/add" element={<AddConsultingCompany />} />
                    <Route path="/dashboard/ConsultingCompanies/:id/ConsultingEngineers" element={<ConsultingEngineers />} />
                    <Route path="/dashboard/ConsultingCompanies/:id/ConsultingEngineers/add" element={<AddConsultingEngineer />} />
                    <Route path="/dashboard/ConsultingCompanies/:id/details" element={<ConsultingCompanyDetails />} />
                    <Route path="/dashboard/projects" element={<Projects />} />
                    <Route path="/dashboard/projects/add" element={<AddProject />} />
                    <Route path="/dashboard/projects/:id" element={<ProjectDetails />} />
                    <Route path="/dashboard/projects/:id/files/add" element={<AddProjectFile />} />
                    <Route path="/dashboard/owners" element={<Owners />} />
                    <Route path="/dashboard/owners/add" element={<AddOwner />} />
                    <Route path="/dashboard/projectManagers" element={<ProjectManagers />} />
                    <Route path="/dashboard/projectManagers/add" element={<AddProjectManager />} />
                    <Route path="/dashboard/salesManagers" element={<SalesManagers />} />
                    <Route path="/dashboard/salesManagers/add" element={<AddSalesManager />} />
                    <Route path="/dashboard/sales" element={<SalesDashboard />} />
                    <Route path="/dashboard/sales/add" element={<AddProjectToSale />} />
                    <Route path="/dashboard/sales/edit/:id" element={<EditProjectSale />} />
                    <Route path="/dashboard/sales/saleDetails/:saleId" element={<SaleDetailPage />} />
                    <Route path="/dashboard/sales/saleDetails/:saleId/edit" element={<EditProjectSale />} />
                  </Route>

                  {/* A catch-all route for 404 Not Found pages */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Box>
            </main>
          </div>
        </ProjectProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;