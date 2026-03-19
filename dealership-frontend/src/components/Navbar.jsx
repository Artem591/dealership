import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Heart, FileText } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center py-4">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600">
            <Car size={36} />
            <span>AutoDealer</span>
          </Link>

          {/* Меню */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition">
              Главная
            </Link>
            <Link to="/cars" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition">
              Каталог
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition">
              О нас
            </Link>
            <Link to="/contacts" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition">
              Контакты
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/favorites" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition flex items-center gap-1">
                  <Heart size={20} />
                  Избранное
                </Link>
                <Link to="/my-leads" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition flex items-center gap-1">
                  <FileText size={20} />
                  Заявки
                </Link>
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
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition">
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-lg"
                >
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