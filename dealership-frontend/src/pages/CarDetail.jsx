import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Phone, MessageSquare, Calendar, Check } from 'lucide-react';
import api from '../service/api';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ type: 'TEST_DRIVE', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCar();
  }, [id]);

  const loadCar = async () => {
    try {
      const res = await api.get(`/cars/${id}`);
      setCar(res.data.data || res.data);

      const favRes = await api.get(`/favorites/cars/${id}/status`);
      const isFav = favRes.data.data;
      setIsFavorite(!!isFav);

    } catch (err) {
      console.error('Ошибка загрузки авто:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      await api.post(`/favorites/cars/${id}`);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Ошибка избранного:', err);
    }
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post(`/cars/${id}/lead`, leadData);
      setMessage({ type: 'success', text: 'Заявка успешно отправлена! Менеджер свяжется с вами.' });
      setShowLeadForm(false);
      setLeadData({ type: 'TEST_DRIVE', comment: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка при отправке' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Загрузка данных...</div>;
  if (!car) return <div className="p-8 text-center text-xl text-red-500">Автомобиль не найден</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <Link to="/cars" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition">
        <ArrowLeft size={20} />
        Назад к каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          {/* Блок изображений */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-sm">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0].imageUrl}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <span className="text-4xl mb-2"></span>
                Фото отсутствует
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Описание</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {car.description || 'Описание не добавлено продавцом.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500">Год</p>
              <p className="font-bold text-lg">{car.year}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500">Пробег</p>
              <p className="font-bold text-lg">{car.mileage?.toLocaleString()} км</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500">КПП</p>
              <p className="font-bold text-lg">{car.transmission}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500">Двигатель</p>
              <p className="font-bold text-lg">{car.fuelType}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <div className="text-4xl font-extrabold text-blue-600 mb-6">
              {car.price?.toLocaleString('ru-RU')} ₽
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={toggleFavorite}
                className={`w-full py-3.5 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 border-2 ${
                  isFavorite
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart
                  size={24}
                  className={isFavorite ? "fill-red-500" : ""}
                />
                {isFavorite ? 'В избранном' : 'В избранное'}
              </button>

              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md shadow-blue-200"
              >
                Оставить заявку
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
               <div className="flex items-center gap-3 text-gray-600">
                 <Check size={20} className="text-green-500" />
                 <span>Полная диагностика</span>
               </div>
               <div className="flex items-center gap-3 text-gray-600">
                 <Check size={20} className="text-green-500" />
                 <span>Юридическая чистота</span>
               </div>
               <div className="flex items-center gap-3 text-gray-600">
                 <Check size={20} className="text-green-500" />
                 <span>Trade-in с выгодой</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {showLeadForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowLeadForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-gray-800">Заявка на автомобиль</h2>
            <p className="text-gray-500 mb-6">{car.make} {car.model}</p>

            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип заявки</label>
                <select
                  value={leadData.type}
                  onChange={e => setLeadData({...leadData, type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="TEST_DRIVE"> Тест-драйв</option>
                  <option value="PURCHASE"> Покупка</option>
                  <option value="TRADE_IN"> Trade-in</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea
                  value={leadData.comment}
                  onChange={e => setLeadData({...leadData, comment: e.target.value})}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Удобное время, вопросы..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}