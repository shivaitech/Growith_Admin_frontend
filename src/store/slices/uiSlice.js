import { createSlice } from '@reduxjs/toolkit';

// Reset any previously saved dark default so light is the new default
const savedTheme = localStorage.getItem('theme');
if (!savedTheme) localStorage.setItem('theme', 'light');

const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: savedTheme || 'light',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    addNotification(state, action) {
      state.notifications.push({ id: Date.now(), ...action.payload });
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  setTheme,
  addNotification,
  removeNotification,
} = uiSlice.actions;
export default uiSlice.reducer;
