import { createSlice } from "@reduxjs/toolkit";
import { Appearance } from "react-native";

let initialState = Appearance.getColorScheme();

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    value: initialState !== null ? initialState : "dark",
  },

  reducers: {
    changeTheme: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
