import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Страница не найдена</h2>
        <p className="text-xl text-gray-600 mb-8">
          Извините, но страница, которую вы ищете, не существует
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition"
        >
          <Home size={24} />
          На главную
        </Link>
      </div>
    </div>
  );
}