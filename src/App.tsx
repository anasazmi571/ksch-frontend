import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import Paper from '@mui/material/Paper';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import SignOutPage from './pages/SignOutPage';
import TeamsPage from './pages/TeamsPage';
import EventsPage from './pages/EventsPage';

function App() {
  return (
    <Paper elevation={4} className='app'>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<HomePage />} />
          <Route path='/pengguna' element={<UserPage />} />
          <Route path='/pasukan' element={<TeamsPage />} />
          <Route path='/acara' element={<EventsPage />} />
          <Route path='/daftar-masuk' element={<SignInPage />} />
          <Route path='/daftar' element={<SignUpPage />} />
          <Route path='/tetapan' element={<SettingsPage />} />
          <Route path='/daftar-keluar' element={<SignOutPage />} />
        </Route>
      </Routes>
    </Paper>
  );
}

export default App;
