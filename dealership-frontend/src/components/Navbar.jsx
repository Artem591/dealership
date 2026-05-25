import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, List, Heart, Bell, Settings } from 'lucide-react';
import api from '../service/api';

const SEEN_CLIENT = 'leads_seen_at_client';
const SEEN_ADMIN  = 'leads_seen_at_admin';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole,   setUserRole]   = useState(null);
  const [count,      setCount]      = useState(0);
  const navigate = useNavigate();
  const roleRef  = useRef(null);

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    roleRef.current = userRole;
    if (isLoggedIn && userRole) {
      loadCount();
      const id = setInterval(loadCount, 15000);
      return () => clearInterval(id);
    } else {
      setCount(0);
    }
  }, [isLoggedIn, userRole]);

  function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const p = JSON.parse(atob(token.split('.')[1]));
        let role = p.role || localStorage.getItem('userRole') || '';
        if (role.startsWith('ROLE_')) role = role.replace('ROLE_', '');
        setUserRole(role);
      } catch {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setCount(0);
    }
  }

  async function loadCount() {
    const role = roleRef.current;
    if (!role) return;
    const isAdmin = role === 'ADMIN' || role === 'MANAGER';

    try {
      if (isAdmin) {
        const res  = await api.get('/leads?page=0&size=100');
        const leads = res.data.data?.content || res.data.data || [];
        const seenAt = localStorage.getItem(SEEN_ADMIN);
        const n = leads.filter(l => {
          if (l.status !== 'NEW') return false;
          if (!seenAt) return true;
          return new Date(l.createdAt) > new Date(seenAt);
        }).length;
        setCount(n);
      } else {
        const res  = await api.get('/leads/my?page=0&size=100');
        const leads = res.data.data?.content || res.data.data || [];
        const seenAt = localStorage.getItem(SEEN_CLIENT);
        const n = leads.filter(l => {
          if (l.status === 'NEW') return false;
          const t = new Date(l.updatedAt || l.createdAt);
          if (!seenAt) return true;
          return t > new Date(seenAt);
        }).length;
        setCount(n);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function markSeen() {
    const role = roleRef.current;
    const key  = (role === 'ADMIN' || role === 'MANAGER') ? SEEN_ADMIN : SEEN_CLIENT;
    localStorage.setItem(key, new Date().toISOString());
    setCount(0);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    setCount(0);
    navigate('/');
  }

  const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';

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
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Главная
              </Link>
              <Link to="/cars" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Каталог
              </Link>

              {isAdmin && (
                <>
                  <Link to="/admin/cars"
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition">
                    <Settings size={16} />Автомобили
                  </Link>

                  <div className="relative">
                    <Link to="/admin/leads" onClick={markSeen}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition px-1">
                      <List size={18} />Заявки
                    </Link>
                    {count > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                        {count > 9 ? '9+' : count}
                      </span>
                    )}
                  </div>
                </>
              )}

              {!isAdmin && isLoggedIn && (
                <div className="relative">
                  <Link to="/my-leads" onClick={markSeen}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition px-1">
                    Мои заявки
                  </Link>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/notifications" className="p-2 text-gray-500 hover:text-blue-600 transition">
                    <Bell size={22} />
                  </Link>
                )}
                <Link to="/favorites" className="p-2 text-gray-500 hover:text-red-500 transition">
                  <Heart size={22} />
                </Link>
                <Link to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition px-2 py-1 rounded-lg hover:bg-gray-50">
                  <User size={20} />
                  <span className="hidden sm:inline">Кабинет</span>
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition px-3 py-2">
                  Войти
                </Link>
                <Link to="/register"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}