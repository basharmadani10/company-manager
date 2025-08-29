export const LoginApi="/api/login"
export const getMyPermissions="/api/my-permissions";

export const getAllEngineersApi="/api/engineers/all";
export const createEngineerApi="/api/engineers/create";
export const deleteEngineerApi="/api/engineers/delete/"; //it takes the Engineer id
export const updateEngineerApi="/api/engineers/update/";

// export const activateEngineerApi="/api/users/activate";
export const getAllConsultingEngineersApi="/api/consultingEngineers/";
export const createConsultingEngineerApi="/api/consultingEngineers/create";
export const deleteConsultingEngineerApi="/api/consultingEngineers/delete/";
export const updateConsultingEngineerApi="/api/consultingEngineers/update/";

export const getAllConsultingCompaniesApi="/api/consultingCompany/all";
export const deleteConsultingCompanyApi="/api/consultingCompany/delete/";
export const createConsultingCompanyApi="/api/consultingCompany/create";
export const updateConsultingCompanyApi="/api/consultingCompany/update/";
export const getConsultingCompanyDetailsApi="/api/consultingCompany/";

export const getAllOwnersApi="/api/owner/all";
export const deleteOwnerApi="/api/owner/delete/";
export const createOwnerApi="/api/owner/create";

export const createProjectApi="/api/project/create";
export const getAllProjectsApi="/api/project/all";
export const getOneProjectApi="/api/project/";
export const updateProjectApi="/api/project/update/"

export const updateSalesManagerApi="/api/realStateManager/update/";
export const getAllSalesManagersApi="/api/realStateManager/all";
export const deleteSalesManagerApi="/api/realStateManager/delete/";
export const createSalesManagerApi="/api/realStateManager/create";

export const addParticipantApi="/api/projectParticipant/create";
export const deleteParticipantApi="/api/projectParticipant/delete/"
export const getOneParticipantApi="/api/projectParticipant/"

export const createProjectManagerApi="/api/projectManagers/create";
export const getAllProjectManagersApi="/api/projectManagers/all";
export const deleteProjectManagerApi="/api/projectManagers/delete/";
export const updateProjectManagerApi="/api/projectManagers/update/"

export const deleteProjectFileApi="/api/projectFiles/delete/";
export const addProjectFileApi=(projectId) =>{return `/api/projectFiles/${projectId}/create`; }
export const getProjectFilesApi=(projectId) =>{return `/api/projectFiles/${projectId}/all`; }

export const createStageApi="/api/projectStage/create";
export const deleteStageApi="/api/projectStage/delete/"
export const getAllProjectStagesApi="/api/projectStage/";

export const createTaskApi="/api/task/create";
export const deleteTaskApi="/api/task/delete/";
export const updateTaskApi="/api/task/update/";
export const changeTaskStatusApi=(taskId)=>{return `/api/task/${taskId}/change-status`;};

export const getAllItemsApi="/api/item/all";
export const getAllProjectItemsApi=(projectId)=>{return `/api/projectContainer/${projectId}/all`;};
export const addExistingItemToProjectContainer ="/api/projectContainer/create/";
export const createNewItemApi="/api/projectContainer/createNewItems/";
export const getProjectInventoryApi=(projectId)=>{return `/api/projectContainer/${projectId}/warehouse`;};
export const addItemToProjectInventoryApi=(projectId)=>{return `/api/projectContainer/${projectId}/addItemsToWarehouse`;};
export const getprojectContainerReportsApi=(projectId)=>{return `/api/projectContainer/${projectId}/reports`;};
export const getProjectBillsApi="/api/projectBills/";
export const createProjectBillApi="/api/projectBills/create";



export const addResourceToTask="/api/taskContainer/create";
export const getTaskResourcesApi=(taskId)=>{return `/api/taskContainer/all?task_id=${taskId}`;};
export const deleteTaskResourceApi= `/api/taskContainer/delete/`;

export const createProjectSalingDetailsApi="/api/projectSalesDetails/create";
export const getAllProjectSalingDetailsApi="/api/projectSalesDetails/all";
export const getSingleProjectSaleApi="/api/projectSalesDetails/";
export const deleteProjectSaleApi="/api/projectSalesDetails/delete/";
export const updateProjectSaleApi=(saleId)=>{return `/api/projectSalesDetails/update/${saleId}?_method=PUT`};

export const getProjectNewsApi="/api/projectNews/all/";
export const deleteProjectNewsApi="/api/projectNews/delete/";
export const createProjectNewsApi="/api/projectNews/create";


export const getProjectMediaApi="/api/projectMedia/";
export const deleteProjectMediaApi="/api/projectMedia/delete/";
export const addProjectMediaApi="/api/projectMedia/create";


export const getProjectBooksApi="/api/propertyBook/all/";
export const getProjectBookDetailsApi="/api/propertyBook/";
export const createProjectBookApi="/api/propertyBook/create";

export const createProjectBookBillApi="/api/propertyBookBill/create";
export const getProjectBookBillsApi="/api/propertyBookBill/all/";
export const deleteProjectBookBillsApi="/api/propertyBookBill/delete/";

export const getBookOrdersApi="/api/propertyUnitOrder/all/";

export const approveOrderApi=({orderId})=>{return `/api/contract-flow/${orderId}/disicion/approve`;}
export const rejectOrderApi=({orderId})=>{return `/api/contract-flow/${orderId}/disicion/reject`;}
export const cancelOrderApi=({orderId})=>{return `/api/contract-flow/${orderId}/cancel`;}





