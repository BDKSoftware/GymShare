import { createSlice } from "@reduxjs/toolkit";

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    value: "metric",
  },

  reducers: {
    changeUnit: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeUnit } = unitSlice.actions;
export default unitSlice.reducer;
