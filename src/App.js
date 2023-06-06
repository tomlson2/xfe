import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import XListPage from './pages/Xlist';
import ComingSoon from './pages/ComingSoon';
import BTCAzukiSearch from './pages/BTCAzukiSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/x-list" element={<XListPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path='/azuki-search' element={<BTCAzukiSearch />} />
      </Routes>
    </Router>
  );
}

export default App;