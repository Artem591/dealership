import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, MapPin } from 'lucide-react';
import { carService } from '../service/CarService';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carService.getById(id)
      .then(res => setCar(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-xl">Загрузка...</div>;
  if (!car) return <div className="p-8 text-center text-xl">Автомобиль не найден</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/cars" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft size={20} />
        Назад к каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {car.images && car.images.length > 0 ? (
            <div className="space-y-4">
              {/* Главное фото */}
              <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center overflow-hidden">
                <img
                  src={car.images.find(img => img.imageType === 'MAIN')?.imageUrl || car.images[0]?.imageUrl}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              </div>


              {car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {car.images.map((image, index) => (
                    <div key={image.id} className="bg-gray-100 rounded-lg h-24 overflow-hidden cursor-pointer hover:opacity-75 transition">
                      <img
                        src={image.imageUrl}
                        alt={`${car.make} ${car.model} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center mb-6">
              <CarIcon size={120} className="text-gray-400" />
            </div>
          )}

          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Характеристики</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
                <div>
                  <div className="text-sm text-gray-600">Год выпуска</div>
                  <div className="font-bold">{car.year}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Gauge className="text-green-600" size={24} />
                <div>
                  <div className="text-sm text-gray-600">Пробег</div>
                  <div className="font-bold">{car.mileage?.toLocaleString() || 0} км</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Fuel className="text-orange-600" size={24} />
                <div>
                  <div className="text-sm text-gray-600">Тип топлива</div>
                  <div className="font-bold">{car.fuelType}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Settings className="text-purple-600" size={24} />
                <div>
                  <div className="text-sm text-gray-600">Коробка передач</div>
                  <div className="font-bold">{car.transmission}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-red-600" size={24} />
                <div>
                  <div className="text-sm text-gray-600">Кузов</div>
                  <div className="font-bold">{car.bodyType}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                <div>
                  <div className="text-sm text-gray-600">Цвет</div>
                  <div className="font-bold">{car.color}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-6 sticky top-4">
            <div className="text-4xl font-bold text-green-600 mb-6">
              {car.price?.toLocaleString('ru-RU')} ₽
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition mb-4">
              Оставить заявку
            </button>

            <button className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition mb-6">
              Позвонить
            </button>

            <div className="border-t pt-6">
              <h3 className="font-bold mb-4">Преимущества покупки</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Полная диагностика
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Гарантия юридической чистоты
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Возможность кредита
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Trade-in
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarIcon({ size, className }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}