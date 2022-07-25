import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useWindowState } from './App.hook';

import Main from './components/Main';
import Home from './components/pages/Home';
import Musics from './components/pages/Musics';
import NotFound from './components/pages/NotFound';
import PlayQueue from './components/pages/PlayQueue';
import Videos from './components/pages/Videos';
import Playlists from './components/pages/Playlists';
import Configs from './components/pages/Configs';
import { CheckInteraction } from './common/dom';

import './App.css';

function App() {

  const windowState = useWindowState();
  let lastRoute = localStorage.getItem('lastRoute') || '/home';
  if (lastRoute === '/') {
    lastRoute = '/home';
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main windowState={windowState} /> }>
          <Route path="/home" element={<Home />} />
          <Route path="/musics" element={<Musics />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/queue" element={<PlayQueue />} />
          <Route path="/configs" element={<Configs />} />
          {/* <Route path="/playlists/youtube" element={<Playlists />} /> */}
          <Route path="/" element={<Navigate to={lastRoute} replace/>}></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

CheckInteraction.getInstance();

export default App;
