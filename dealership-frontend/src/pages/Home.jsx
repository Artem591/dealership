import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Search, TrendingUp, Shield, Phone } from 'lucide-react';
import { carService } from '../service/CarService';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carService.getAvailable()
      .then(res => setCars(res.data.content || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-6">
              Найдите автомобиль своей мечты
            </h1>
            <p className="text-2xl mb-8 text-blue-100">
              Более 1000 проверенных автомобилей с пробегом и новых
            </p>
            <div className="flex gap-4">
              <Link
                to="/cars"
                className="bg-white text-blue-600 px-10 py-5 rounded-lg font-bold text-xl hover:bg-blue-50 transition flex items-center gap-3"
              >
                <Search size={28} />
                Подобрать авто
              </Link>
              <a
                href="tel:+375291234567"
                className="border-2 border-white text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-white hover:text-blue-600 transition flex items-center gap-3"
              >
                <Phone size={28} />
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Преимущества */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Проверенные авто</h3>
              <p className="text-gray-600 text-lg">Все автомобили проходят полную диагностику</p>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-lg text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Выгодные цены</h3>
              <p className="text-gray-600 text-lg">Лучшие предложения на рынке</p>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-lg text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="text-purple-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Большой выбор</h3>
              <p className="text-gray-600 text-lg">От эконом до премиум класса</p>
            </div>
          </div>
        </div>
      </div>

      {/* Популярные автомобили */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Популярные автомобили</h2>

        {loading ? (
          <div className="text-center text-2xl">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {cars.slice(0, 6).map(car => (
              <Link
                key={car.id}
                to={`/cars/${car.id}`}
                className="bg-white border-2 rounded-xl overflow-hidden hover:shadow-2xl transition group"
              >
                <div className="h-56 bg-gray-200 flex items-center justify-center">
                  <Car className="text-gray-400" size={80} />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition">
                    {car.make} {car.model}
                  </h3>
                  <div className="flex justify-between text-gray-600 text-lg mb-6">
                    <span>{car.year} год</span>
                    <span>{car.mileage?.toLocaleString()} км</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-green-600">
                      {car.price?.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-blue-600 font-medium text-lg">Подробнее →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/cars"
            className="inline-block bg-blue-600 text-white px-12 py-4 rounded-lg font-bold text-xl hover:bg-blue-700 transition"
          >
            Смотреть все автомобили
          </Link>
        </div>
      </div>
    </div>
  );
}