import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const selectedFilesSlice = createSlice({
    name: 'selectedFiles',
    initialState: {
      data: [] as SelectedFiles[],
    },
    reducers: {
        setSelectedFiles: (state, action: PayloadAction<SelectedFiles[]>) => {
            state.data = action.payload;
        },
        setSelectedFile: (state, action: PayloadAction<SelectedFiles>) => {

            const index = state.data.findIndex(x => x.id === action.payload.id);
            if (index === -1) {
                state.data.push(action.payload);
            }
        },
        removeSelectedFile: (state, action: PayloadAction<SelectedFiles>) => {

            const index = state.data.findIndex(x => x.id === action.payload.id);
            if (index !== -1) {
                state.data.splice(index , 1);
            }
        },
    }
});

export const { setSelectedFiles, setSelectedFile, removeSelectedFile } = selectedFilesSlice.actions;
export const selectSelectedFiles = (state: RootState) => state.selectedFiles.data;

type SelectedFiles = {
    id: number
};

export default selectedFilesSlice.reducer;