import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Check } from 'lucide-react';
import api from '../service/api';

const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RESERVED:  'bg-yellow-100 text-yellow-800',
  SOLD:      'bg-red-100 text-red-800',
  SERVICE:   'bg-gray-100 text-gray-800',
};
const STATUS_LABELS = {
  AVAILABLE: 'В наличии',
  RESERVED:  'Забронирован',
  SOLD:      'Продан',
  SERVICE:   'Сервис',
};
const FIELDS = [
  { key: 'vin',          label: 'VIN',               type: 'text',   req: true  },
  { key: 'make',         label: 'Марка',      type: 'text',   req: true  },
  { key: 'model',        label: 'Модель',     type: 'text',   req: true  },
  { key: 'year',         label: 'Год',         type: 'number', req: true  },
  { key: 'price',        label: 'Цена',        type: 'number', req: true  },
  { key: 'mileage',      label: 'Пробег (км)', type: 'number', req: false },
  { key: 'fuelType',     label: 'Тип топлива', type: 'text', req: false },
  { key: 'transmission', label: 'КПП',           type: 'text',   req: false },
  { key: 'color',        label: 'Цвет',        type: 'text',   req: false },
  { key: 'bodyType',     label: 'Тип кузова', type: 'text', req: false },
  { key: 'engineVolume', label: 'Объем дв.',  type: 'number', req: false },
  { key: 'power',        label: 'Мощность (л.с.)', type: 'number', req: false },
];
const EMPTY = {
  vin:'',make:'',model:'',year:'',price:'',mileage:'',fuelType:'',
  transmission:'',color:'',bodyType:'',engineVolume:'',power:'',description:'',isNew:true,
};

export default function AdminCars() {
  const [cars,      setCars]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [formFiles, setFormFiles] = useState([]);
  const [carFiles,  setCarFiles]  = useState({});
  const [uploading, setUploading] = useState(null);
  const [msg,       setMsg]       = useState('');

  useEffect(() => { loadCars(); }, []);

  async function loadCars() {
    try {
      const r = await api.get('/cars?page=0&size=100');
      setCars(r.data.content || r.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setForm(EMPTY); setEditId(null); setFormFiles([]); setShowForm(true);
  }
  function openEdit(car) {
    setForm({
      vin:car.vin||'',make:car.make||'',model:car.model||'',year:car.year||'',
      price:car.price||'',mileage:car.mileage||'',fuelType:car.fuelType||'',
      transmission:car.transmission||'',color:car.color||'',bodyType:car.bodyType||'',
      engineVolume:car.engineVolume||'',power:car.power||'',
      description:car.description||'',isNew:car.isNew??true,
    });
    setEditId(car.id); setFormFiles([]); setShowForm(true);
  }

  function setCarFilesFor(carId, files) {
    setCarFiles((prev) => ({ ...prev, [carId]: files }));
  }

  async function uploadFiles(carId, files) {
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('imageType', 'gallery');
      fd.append('sortOrder', '0');
      await api.post('/cars/' + carId + '/images', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setMsg('');
    try {
      const p = { ...form,
        year: Number(form.year), price: Number(form.price),
        mileage: form.mileage ? Number(form.mileage) : null,
        power: form.power ? Number(form.power) : null,
        engineVolume: form.engineVolume ? Number(form.engineVolume) : null,
      };
      let id = editId;
      if (editId) { await api.put('/cars/' + editId, p); }
      else { const r = await api.post('/cars', p); id = r.data.id; }
      if (formFiles.length) await uploadFiles(id, formFiles);
      setMsg(editId ? 'Сохранено' : 'Добавлено');
      setShowForm(false);
      await loadCars();
    } catch(e) { setMsg('Error: ' + (e.response?.data?.message || e.message)); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Удалить автомобиль?')) return;
    try { await api.delete('/cars/' + id); await loadCars(); }
    catch(e) { console.error(e); }
  }

  async function handleImgDelete(carId, imgId) {
    try { await api.delete('/cars/' + carId + '/images/' + imgId); await loadCars(); }
    catch(e) { console.error(e); }
  }

  async function handleUploadForCar(carId) {
    const files = carFiles[carId];
    if (!files || !files.length) return;
    setUploading(carId);
    try {
      await uploadFiles(carId, files);
      setCarFilesFor(carId, []);
      await loadCars();
    } catch(e) { console.error(e); }
    finally { setUploading(null); }
  }

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление каталогом</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium">
          <Plus size={20} />Добавить автомобиль
        </button>
      </div>

      {msg && <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">{msg}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-2xl relative my-8">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editId ? 'Редактировать' : 'Добавить автомобиль'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {FIELDS.map(({ key, label, type, req }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[key]} required={req}
                      onChange={(e) => setF(key, e.target.value)}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea value={form.description} rows={3}
                  onChange={(e) => setF('description', e.target.value)}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div className="mb-4 flex items-center gap-3">
                <input type="checkbox" id="isNewCb" checked={form.isNew}
                  onChange={(e) => setF('isNew', e.target.checked)} className="w-4 h-4" />
                <label htmlFor="isNewCb" className="text-sm font-medium text-gray-700">Новый автомобиль</label>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Фотографии</label>
                <input type="file" accept="image/*" multiple
                  onChange={(e) => setFormFiles(Array.from(e.target.files))}
                  className="w-full p-2 border rounded-lg text-sm text-gray-600" />
                {formFiles.length > 0 && <p className="text-sm text-blue-600 mt-1">{formFiles.length} файл(ов) выбрано</p>}
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
                  Отмена
                </button>
                <button type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Check size={18} />{editId ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {cars.length === 0
          ? <div className="text-center py-16 text-gray-500 bg-white rounded-xl shadow">Каталог пуст</div>
          : cars.map((car) => {
              const myFiles = carFiles[car.id] || [];
              return (
                <div key={car.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-shrink-0 w-36 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {car.images && car.images.length > 0
                        ? <img src={car.images[0].imageUrl} alt={car.make} className="w-full h-full object-cover" />
                        : <span className="text-gray-400 text-xs">Нет фото</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold">{car.make} {car.model} ({car.year})</h3>
                          <p className="text-sm text-gray-500">VIN: {car.vin}</p>
                        </div>
                        <span className={"px-3 py-1 rounded-full text-sm font-medium " + (STATUS_COLORS[car.status] || 'bg-gray-100 text-gray-700')}>
                          {STATUS_LABELS[car.status] || car.status}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <span>Цена: <strong>{car.price ? car.price.toLocaleString('ru-RU') : 0} ₽</strong></span>
                        <span>Пробег: <strong>{car.mileage ? car.mileage.toLocaleString() : 0} км</strong></span>
                        <span>КПП: <strong>{car.transmission || '—'}</strong></span>
                        <span>Топливо: <strong>{car.fuelType || '—'}</strong></span>
                      </div>
                      {car.images && car.images.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {car.images.map((img) => (
                            <div key={img.id} className="relative group">
                              <img src={img.imageUrl} alt="car" className="w-16 h-12 object-cover rounded border" />
                              <button onClick={() => handleImgDelete(car.id, img.id)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <label className="flex items-center gap-1 text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                          <Upload size={14} />Загрузить фото
                          <input type="file" accept="image/*" multiple className="hidden"
                            onChange={(e) => setCarFilesFor(car.id, Array.from(e.target.files))} />
                        </label>
                        {myFiles.length > 0 && uploading !== car.id && (
                          <button onClick={() => handleUploadForCar(car.id)}
                            className="text-sm text-green-600 hover:text-green-800 font-medium">
                            Отправить ({myFiles.length})
                          </button>
                        )}
                        {uploading === car.id && <span className="text-xs text-gray-400">Загрузка...</span>}
                      </div>
                    </div>
                    <div className="flex lg:flex-col gap-2">
                      <button onClick={() => openEdit(car)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium">
                        <Pencil size={15} />Изменить
                      </button>
                      <button onClick={() => handleDelete(car.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium">
                        <Trash2 size={15} />Удалить
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}