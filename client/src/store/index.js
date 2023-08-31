import { combineReducers, createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        token: null,
      };

    }

    return {
      token
    }


  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem('token', state.token);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
    },
  },
});

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    mode: "light",
    errorMessage: "",
    successMessage: "",
  },
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload.errorMessage;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload.successMessage;
    }
  },
});

export const classSlice = createSlice({
  name: "classes",
  initialState: {
    allClasses: [],
    filteredClasses: [],
    selectedClass: null,
    isSelectedClassEnrolled: false,
    enrolledClaases: [],
  },
  reducers: {
    setClassList: (state, action) => {
      state.allClasses = action.payload.allClasses;
    },
    setfilteredClassList: (state, action) => {
      state.filteredClasses = action.payload.filteredClasses;
    },
    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload.selectedClass;
    },
    setEnrolledClaases: (state, action) => {
      state.enrolledClaases = action.payload.enrolledClasses;
    },
    addEnrolledClaases: (state, action) => {
      state.enrolledClaases.push(action.payload.newEnrolledClasses);
    },
    setIsSelectedClassEnrolled: (state, action) => {
      state.isSelectedClassEnrolled = action.payload.isSelectedClassEnrolled;
    },
    resetClasses: (state) => {
      state.filteredClasses = [];
      state.selectedClass = null;
      state.isSelectedClassEnrolled = false;
      state.enrolledClaases = [];
    },
  },
});

const reducers = combineReducers({
  auth: authSlice.reducer,
  settings: settingsSlice.reducer,
  classes: classSlice.reducer
})

export const { setMode, setErrorMessage, setSuccessMessage } =
  settingsSlice.actions;
export const { setLogin, setLogout } =
  authSlice.actions;
export const { setClassList, setfilteredClassList, setSelectedClass, setEnrolledClaases, addEnrolledClaases,
  setIsSelectedClassEnrolled, resetClasses, removeEnrolledClasses } =
  classSlice.actions;

export default reducers;