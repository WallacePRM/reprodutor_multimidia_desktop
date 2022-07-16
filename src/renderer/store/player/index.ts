import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Media } from "../../service/media/types";

const playerSlice = createSlice({
    name: 'playerState',
    initialState: {
      currentMedias: null as Media[] | null,
    },
    reducers: {
      setCurrentMedias: (state, action: PayloadAction<Media[] | null>) => {
        state.currentMedias = action.payload;
      }
    }
});

export const { setCurrentMedias } = playerSlice.actions;
export const selectCurrentMedias = (state: RootState) => state.player.currentMedias;

export default playerSlice.reducer;