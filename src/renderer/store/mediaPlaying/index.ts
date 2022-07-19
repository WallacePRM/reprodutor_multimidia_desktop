import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Media } from "../../../common/medias/types";
import { RootState } from "..";

const mediaPlayingSlice = createSlice({
    name: 'mediaPlaying',
    initialState: {
      data: null as Media | null,
    },
    reducers: {
      setMediaPlaying: (state, action: PayloadAction<Media | null>) => {
        state.data = action.payload;
      }
    }
});

export const { setMediaPlaying } = mediaPlayingSlice.actions;
export const selectMediaPlaying = (state: RootState) => state.mediaPlaying.data;

export default mediaPlayingSlice.reducer;