import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import XListPage from './pages/Xlist';
import ComingSoon from './pages/ComingSoon';
import BTCAzukiSearch from './pages/BTCAzukiSearch';
import BEANZSearch from './pages/BEANZSearch';
import GamePage from './pages/GamePage';
import ReucursivePunks from './pages/RecursivePunks'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/x-list" element={<XListPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path='/azuki-search' element={<BTCAzukiSearch />} />
        <Route path='/recursive-punks' element={<ReucursivePunks />} />
        <Route path='/beanz-search' element={<BEANZSearch />} />
        <Route path='/game' element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;