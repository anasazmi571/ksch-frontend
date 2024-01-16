import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import Paper from '@mui/material/Paper';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <Paper elevation={4} className='app'>
      <Routes>
        <Route path='/' element={<Outlet />}>
          <Route index element={<HomePage />} />
          <Route path='pengguna' element={<UserPage />} />
          <Route path='daftar-masuk' element={<SignInPage />} />
          <Route path='daftar' element={<SignUpPage />} />
        </Route>
      </Routes>
    </Paper>
  );
}

export default App;
