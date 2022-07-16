import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const sidebarOpenedSlice = createSlice({
    name: 'sidebarOpened',
    initialState: {
      isOpened: false,
    },
    reducers: {
      toggleSidebar: (state) => {
        state.isOpened = !state.isOpened;
      },
      setSidebarOpened: (state, action: PayloadAction<{ isOpened: boolean }>) => {
        state.isOpened = action.payload.isOpened;
      }
    }
});

export const { toggleSidebar, setSidebarOpened } = sidebarOpenedSlice.actions;
export const selectSidebarOpened = (state: RootState) => state.sidebarOpened.isOpened;

export default sidebarOpenedSlice.reducer;