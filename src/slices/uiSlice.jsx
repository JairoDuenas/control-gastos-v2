import { createSlice } from "@reduxjs/toolkit";

const storedTheme = localStorage.getItem("gastos_theme") ?? "dark";

const uiSlice = createSlice({
  name: "ui",
  initialState: { themeMode: storedTheme },
  reducers: {
    setTheme: (state, action) => {
      state.themeMode = action.payload;
      localStorage.setItem("gastos_theme", action.payload);
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === "dark" ? "light" : "dark";
      localStorage.setItem("gastos_theme", state.themeMode);
    },
  },
});

export const { setTheme, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
