import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import api from '../service/api';

export default function Favorites() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await api.get('/favorites?page=0&size=20');
      setCars(res.data.data.content || res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Heart className="fill-red-500 text-red-500" />
        Избранные автомобили
      </h1>

      {cars.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">В избранном пока пусто</p>
          <Link to="/cars" className="text-blue-600 font-medium hover:underline">
            Перейти в каталог →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {car.images?.length > 0 ? (
                  <img
                    src={car.images[0].imageUrl}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>
                )}
                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                  <Heart size={20} className="fill-red-500 text-red-500" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{car.make} {car.model}</h3>
                <p className="text-gray-500 text-sm mb-3">{car.year} • {car.mileage} км</p>

                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    {car.price?.toLocaleString('ru-RU')} ₽
                  </span>
                  <Link
                    to={`/cars/${car.id}`}
                    className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-800"
                  >
                    Подробнее <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}