import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './AppStyles.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import MyLeads from './pages/MyLeads';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';
import AdminLeads from './pages/AdminLeads';
import ProtectedRoute from './components/ProtectedRoute';
 import Notifications from './pages/Notifications';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={
          <ProtectedRoute requiredRoles={['CLIENT', 'ADMIN', 'MANAGER']}>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/my-leads" element={
          <ProtectedRoute requiredRoles={['CLIENT', 'ADMIN', 'MANAGER']}>
            <MyLeads />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute requiredRoles={['CLIENT', 'ADMIN', 'MANAGER']}>
            <Favorites />
          </ProtectedRoute>
        } />
        <Route path="/admin/leads" element={
          <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
            <AdminLeads />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold">Админ-панель</h1>
              <p className="text-gray-600 mt-4">Здесь будет управление системой</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;