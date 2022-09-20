import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useWindowState } from './App.hook';
import { CheckInteraction } from './common/dom';

import Main from './components/Main';
import Home from './pages/Home';
import Musics from './pages/Musics';
import NotFound from './pages/NotFound';
import PlayQueue from './pages/PlayQueue';
import Videos from './pages/Videos';
import Playlists from './pages/Playlists';
import Configs from './pages/Configs';
import SearchResults from './pages/SearchResults';

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
          <Route path="/search-results/:search" element={<SearchResults />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/" element={<Navigate to={lastRoute} replace />}></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

CheckInteraction.getInstance();

export default App;
