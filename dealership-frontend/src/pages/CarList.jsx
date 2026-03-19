import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Car } from 'lucide-react';
import { carService } from '../service/CarService';

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: '',
    minPrice: '',
    maxPrice: '',
    year: '',
  });

  const loadCars = async () => {
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const res = await carService.filter(cleanFilters);
      setCars(res.data.content || res.data);
    } catch (err) {
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold mb-10">Каталог автомобилей</h1>

      {/* Фильтры */}
      <div className="mb-8 p-8 bg-gray-50 rounded-xl border-2">
        <div className="flex items-center gap-4 mb-6">
          <Filter size={28} className="text-blue-600" />
          <h2 className="text-2xl font-bold">Фильтры</h2>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <input
            type="text"
            placeholder="Марка"
            value={filters.make}
            onChange={(e) => setFilters({...filters, make: e.target.value})}
            className="p-4 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Мин. цена"
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            className="p-4 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Макс. цена"
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            className="p-4 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={loadCars}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition"
          >
            Применить
          </button>
        </div>
      </div>

      {/* Результаты */}
      {loading ? (
        <div className="text-center text-2xl py-16">Загрузка...</div>
      ) : (
        <>
          <div className="mb-6 text-gray-600 text-xl">
            Найдено: <span className="font-bold text-2xl">{cars.length}</span> автомобилей
          </div>

          <div className="grid grid-cols-3 gap-8">
            {cars.map(car => (
              <Link
                key={car.id}
                to={`/cars/${car.id}`}
                className="bg-white border-2 rounded-xl overflow-hidden hover:shadow-2xl transition group"
              >
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <Car className="text-gray-400" size={100} />
                  {car.isNew && (
                    <span className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                      Новый
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition">
                    {car.make} {car.model}
                  </h3>
                  <div className="space-y-3 mb-6 text-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Год:</span>
                      <span className="font-bold">{car.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Пробег:</span>
                      <span className="font-bold">{car.mileage?.toLocaleString() || 0} км</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Коробка:</span>
                      <span className="font-bold">{car.transmission}</span>
                    </div>
                  </div>
                  <div className="pt-6 border-t-2">
                    <span className="text-4xl font-bold text-green-600">
                      {car.price?.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}