import { createSlice } from "@reduxjs/toolkit";
const appSlice = createSlice({
  name: "app",
  initialState: {
    isLoggedIn: false,
    token: "",
  },
  reducers: {
    toggleLogIn: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});
export const { toggleLogIn,setToken } = appSlice.actions;
export default appSlice.reducer;
