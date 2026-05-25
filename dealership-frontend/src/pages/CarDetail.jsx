import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Check } from 'lucide-react';
import api from '../service/api';

const SPECS = [
  { key: 'year',         label: 'Год',              fmt: v => v },
  { key: 'mileage',      label: 'Пробег',          fmt: v => v ? v.toLocaleString() + ' км' : '—' },
  { key: 'transmission', label: 'КПП',              fmt: v => v || '—' },
  { key: 'fuelType',     label: 'Тип двигателя',  fmt: v => v || '—' },
  { key: 'engineVolume', label: 'Объем дв.',  fmt: v => v ? v + ' л' : '—' },
  { key: 'power',        label: 'Мощность',         fmt: v => v ? v + ' л.с.' : '—' },
  { key: 'bodyType',     label: 'Тип кузова',  fmt: v => v || '—' },
  { key: 'color',        label: 'Цвет',            fmt: v => v || '—' },
  { key: 'isNew',        label: 'Состояние',        fmt: v => v ? 'Новый' : 'С пробегом' },
  { key: 'vin',          label: 'VIN',             fmt: v => v || '—' },
];

const LEAD_TYPES = {
  TEST_DRIVE: 'Тест-драйв',
  PURCHASE:   'Покупка',
  TRADE_IN:   'Trade-in',
  CREDIT:     'Кредит',
};

export default function CarDetail() {
  const { id } = useParams();
  const [car,        setCar]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [isFav,      setIsFav]      = useState(false);
  const [activeImg,  setActiveImg]  = useState(0);
  const [showForm,   setShowForm]   = useState(false);
  const [leadData,   setLeadData]   = useState({ type: 'TEST_DRIVE', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg,        setMsg]        = useState({ type: '', text: '' });

  useEffect(() => { loadCar(); }, [id]);

  async function loadCar() {
    try {
      const r = await api.get('/cars/' + id);
      setCar(r.data.data || r.data);
      try {
        const f = await api.get('/favorites/cars/' + id + '/status');
        setIsFav(!!f.data.data);
      } catch (_) {}
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function toggleFav() {
    try { await api.post('/favorites/cars/' + id); setIsFav(!isFav); }
    catch (e) { console.error(e); }
  }

  async function submitLead(e) {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      await api.post('/cars/' + id + '/lead', leadData);
      setMsg({ type: 'success', text: 'Заявка отправлена! Менеджер свяжется с вами.' });
      setShowForm(false);
      setLeadData({ type: 'TEST_DRIVE', comment: '' });
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.message || 'Ошибка при отправке' });
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="p-8 text-center text-xl">Загрузка...</div>;
  if (!car)    return <div className="p-8 text-center text-xl text-red-500">Автомобиль не найден</div>;

  const images = car.images && car.images.length > 0 ? car.images : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <Link to="/cars" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition">
        <ArrowLeft size={20} />Назад к каталогу
      </Link>

      {msg.text && (
        <div className={"mb-4 p-4 rounded-lg " + (msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200')}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{car.make} {car.model} ({car.year})</h1>
            {car.isNew && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Новый
              </span>
            )}
          </div>

          <div className="bg-gray-100 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-sm">
            {images.length > 0 ? (
              <img src={images[activeImg].imageUrl} alt={car.make + ' ' + car.model}
                className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Фото отсутствует</span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button key={img.id} onClick={() => setActiveImg(idx)}
                  className={"flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition " +
                    (idx === activeImg ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400')}>
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {car.description && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-3 text-gray-800">Описание</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{car.description}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Характеристики</h2>
            <div className="divide-y divide-gray-100">
              {SPECS.map(({ key, label, fmt }) => {
                const val = car[key];
                if (val === null || val === undefined || val === '') return null;
                return (
                  <div key={key} className="flex justify-between items-center py-3">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[60%] break-all">{fmt(val)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <div className="text-4xl font-extrabold text-blue-600 mb-6">
              {car.price?.toLocaleString('ru-RU')} ₽
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <button onClick={toggleFav}
                className={"w-full py-3.5 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 border-2 " +
                  (isFav ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-700 hover:border-gray-300')}>
                <Heart size={24} className={isFav ? 'fill-red-500' : ''} />
                {isFav ? 'В избранном' : 'В избранное'}
              </button>
              <button onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md shadow-blue-200">
                Оставить заявку
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              {[
                ['Год',     car.year?.toString()],
                ['Пробег',  car.mileage ? car.mileage.toLocaleString() + ' км' : null],
                ['КПП',     car.transmission],
                ['Топливо', car.fuelType],
                ['Объем',   car.engineVolume ? car.engineVolume + ' л' : null],
                ['Мощность', car.power ? car.power + ' л.с.' : null],
                ['Кузов',   car.bodyType],
                ['Цвет',    car.color],
              ].filter(r => r[1]).map(([lbl, val]) => (
                <div key={lbl} className="flex justify-between text-sm">
                  <span className="text-gray-500">{lbl}</span>
                  <span className="font-medium text-gray-800">{val}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              {['Полная диагностика', 'Юридическая чистота', 'Trade-in с выгодой'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500 flex-shrink-0" />{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">
              &#x2715;
            </button>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Заявка на автомобиль</h2>
            <p className="text-gray-500 mb-6">{car.make} {car.model}</p>
            <form onSubmit={submitLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип заявки</label>
                <select value={leadData.type}
                  onChange={e => setLeadData({ ...leadData, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.entries(LEAD_TYPES).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                <textarea value={leadData.comment} rows={3}
                  onChange={e => setLeadData({ ...leadData, comment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Удобное время, вопросы..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition">
                  Отмена
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-bold transition disabled:opacity-50">
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