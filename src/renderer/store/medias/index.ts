import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Media } from "../../service/media/types";

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