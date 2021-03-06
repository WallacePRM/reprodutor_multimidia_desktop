import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Media } from "../../../common/medias/types";
import { RootState } from "..";

const mediasSlice = createSlice({
    name: 'selectedFiles',
    initialState: {
      data: [] as Media[],
    },
    reducers: {
        setMedias: (state, action: PayloadAction<Media[]>) => {
            state.data = action.payload;
        }
    }
});

export const { setMedias } = mediasSlice.actions;
export const selectMedias = (state: RootState) => state.medias.data;

export default mediasSlice.reducer;