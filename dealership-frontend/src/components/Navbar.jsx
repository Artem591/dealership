import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем роль из токена или localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error('Ошибка декодирования токена', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600">
            <Car size={36} />
            <span>AutoDealer</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium text-lg">
              Главная
            </Link>
            <Link to="/cars" className="text-gray-700 hover:text-blue-600 font-medium text-lg">
              Каталог
            </Link>

            {/* Админ-панель — только для ADMIN */}
            {userRole === 'ADMIN' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium text-lg flex items-center gap-1">
                <Shield size={18} />
                Админка
              </Link>
            )}

            {userRole ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium text-lg">
                  <User size={20} />
                  Кабинет
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut size={20} />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-lg">
                  Войти
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-lg">
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