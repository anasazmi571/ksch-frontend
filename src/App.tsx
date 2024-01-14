import './App.css';
import { AppBar, Link, Stack } from '@mui/material';
import SiteHeader from './components/SiteHeader';
import { Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<HomePage />} />
          <Route path='user' element={<UserPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
