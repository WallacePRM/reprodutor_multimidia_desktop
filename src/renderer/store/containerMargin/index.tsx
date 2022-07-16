import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const containerMarginSlice = createSlice({
    name: 'containerMargin',
    initialState: {
      data: {
        margin: 3,
        appWidth: document.body.clientWidth,
      }
    },
    reducers: {
      setContainerMargin: (state, action: PayloadAction<Partial<ContainerMargin>>) => {
        state.data = {
          ...state.data,
          ...action.payload
        };
      }
    }
});

type ContainerMargin = {
  margin?: number,
  appWidth?: number,
};

export const { setContainerMargin } = containerMarginSlice.actions;
export const selectContainerMargin = (state: RootState) => state.containerMargin.data;

export default containerMarginSlice.reducer;