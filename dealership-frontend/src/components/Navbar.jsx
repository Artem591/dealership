import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Shield, List, Heart, Bell } from 'lucide-react';
import api from '../service/api';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifCount(0);
    }
  }, [isLoggedIn]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/leads?page=0&size=50');
      const leads = res.data.data?.content || res.data.data || [];

      if (userRole === 'ADMIN' || userRole === 'MANAGER') {
        const newLeads = leads.filter(l => l.status === 'NEW').length;
        setNotifCount(newLeads);
      }
      else if (userRole === 'CLIENT') {
        const updates = leads.filter(l => l.status !== 'NEW' && l.status !== 'CLOSED').length;
        setNotifCount(updates);
      }
    } catch (err) {
      console.error('Ошибка загрузки уведомлений', err);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        let role = payload.role || localStorage.getItem('userRole') || '';
        if (role.startsWith('ROLE_')) role = role.replace('ROLE_', '');
        setUserRole(role);
      } catch (e) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setNotifCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    setNotifCount(0);
    navigate('/');
  };

  const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';
  const resetNotifs = () => setNotifCount(0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
              <Car size={28} />
              <span className="text-xl font-bold tracking-tight">AutoDealer</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Главная</Link>
              <Link to="/cars" className="text-gray-600 hover:text-blue-600 font-medium transition">Каталог</Link>

              {isAdmin && (
                <div className="relative group">
                  <Link
                    to="/admin/leads"
                    onClick={resetNotifs}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition px-1"
                  >
                    <List size={18} /> Заявки
                  </Link>
                  {notifCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </div>
              )}

              {!isAdmin && (
                <div className="relative group">
                  <Link
                    to="/my-leads"
                    onClick={resetNotifs}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition px-1"
                  >
                    Мои заявки
                  </Link>
                  {notifCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/notifications" className="p-2 text-gray-500 hover:text-blue-600 transition relative">
                  <Bell size={22} />
                </Link>

                <Link to="/favorites" className="p-2 text-gray-500 hover:text-red-500 transition">
                  <Heart size={22} />
                </Link>

                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition px-2 py-1 rounded-lg hover:bg-gray-50">
                  <User size={20} />
                  <span className="hidden sm:inline">Кабинет</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2">Войти</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}