import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import sidebarOpenedReducer from './sidebarOpened';
import containerMarginReducer from './containerMargin';
import mediasReducer from './medias';
import mediaPlayingReducer from './mediaPlaying';
import playerReducer from './player';
import playerStateReducer from './playerState';
import playerModeReducer from './playerMode';
import playerConfigReducer from './playerConfig';
import pageConfigReducer from './pageConfig';
import selectedFilesReducer from './selectedFiles';

// LOCAL STORAGE
const saveToLocalStorage = (state: any) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem('state');
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    sidebarOpened: sidebarOpenedReducer,
    containerMargin: containerMarginReducer,
    medias: mediasReducer,
    mediaPlaying: mediaPlayingReducer,
    playerState: playerStateReducer,
    playerMode: playerModeReducer,
    playerConfig: playerConfigReducer,
    player: playerReducer,
    pageConfig: pageConfigReducer,
    selectedFiles: selectedFilesReducer,
  },
  // preloadedState: loadFromLocalStorage()
});

// store.subscribe(() => {
//   saveToLocalStorage(store.getState());
// });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;