import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./utils/appSlice"
export const store = configureStore({
  reducer: {
    app:appSlice,
  },
});
