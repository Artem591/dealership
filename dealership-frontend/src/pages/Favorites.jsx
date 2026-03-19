import { useState, useEffect } from 'react';
import { Heart, Car, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    setFavorites(saved ? JSON.parse(saved) : []);
    setLoading(false);
  };

  const removeFromFavorites = (carId) => {
    const updated = favorites.filter(c => c.id !== carId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  if (loading) return <div className="p-8 text-center text-xl">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Heart size={36} className="text-red-600" />
        Избранное
      </h1>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Список избранного пуст</h2>
          <p className="text-gray-600 mb-6">Добавляйте автомобили в избранное, чтобы не потерять</p>
          <Link to="/cars" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(car => (
            <div key={car.id} className="bg-white border-2 rounded-xl overflow-hidden hover:shadow-2xl transition">
              <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <Car className="text-gray-400" size={80} />
                <button
                  onClick={() => removeFromFavorites(car.id)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-50 transition"
                >
                  <Trash2 size={20} className="text-red-600" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{car.make} {car.model}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Год:</span>
                    <span className="font-bold">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Пробег:</span>
                    <span className="font-bold">{car.mileage?.toLocaleString()} км</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-3xl font-bold text-green-600">
                    {car.price?.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <Link
                  to={`/cars/${car.id}`}
                  className="block mt-4 bg-blue-600 text-white text-center px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}