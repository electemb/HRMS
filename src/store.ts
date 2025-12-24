import { configureStore } from "@reduxjs/toolkit";
import employeesReducer from "./slices/employeesSlice";
import departmentsReducer from "./slices/departmentsSlice";
import designationsReducer from "./slices/designationsSlice";
import projectsReducer from "./slices/projectsSlice";
import clientsReducer from "./slices/clientsSlice";
import leaveTypesReducer from "./slices/leaveTypesSlice";

const store = configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
    designations: designationsReducer,
    projects: projectsReducer,
    clients: clientsReducer,
    leaveTypes: leaveTypesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
