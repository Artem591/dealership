import { useState, useEffect } from 'react';
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
    } else {
      setNotifCount(0);
    }
  }, [isLoggedIn]);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/leads/my?page=0&size=50');
      const leads = res.data.data.content || res.data.data;

      const updates = leads.filter(l =>
        l.status !== 'NEW' && l.status !== 'CLOSED'
      ).length;

      setNotifCount(updates);
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
        let role = payload.role || '';
        if (role.startsWith('ROLE_')) role = role.replace('ROLE_', '');
        setUserRole(role);
      } catch (e) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setNotifCount(0);
    navigate('/');
  };

  const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Логотип */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
              <Car size={28} />
              <span className="text-xl font-bold tracking-tight">AutoDealer</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Главная</Link>
              <Link to="/cars" className="text-gray-600 hover:text-blue-600 font-medium transition">Каталог</Link>

              {isAdmin && (
                <>
                  <Link to="/admin/leads" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition">
                    <List size={18} /> Заявки
                  </Link>
                  <Link to="/admin" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition">
                    <Shield size={18} /> Админка
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="relative group">
                  <Link to="/my-leads" className="relative p-2 text-gray-500 hover:text-blue-600 transition">
                    <Bell size={22} />
                    {notifCount > 0 && (
                      <span className="absolute top-4 left-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </Link>

                  {notifCount > 0 && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white p-3 shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                      <p className="text-sm text-gray-800 font-medium">У вас {notifCount} обновление(-я)</p>
                      <p className="text-xs text-gray-500 mt-1">Менеджер ответил на заявку</p>
                    </div>
                  )}
                </div>

                <Link to="/favorites" className="p-2 text-gray-500 hover:text-red-500 transition">
                  <Heart size={22} />
                </Link>

                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition px-2 py-1 rounded-lg hover:bg-gray-50">
                  <User size={20} />
                  <span className="hidden sm:inline">Кабинет</span>
                </Link>

                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition">
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