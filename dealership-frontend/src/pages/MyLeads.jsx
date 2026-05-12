import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../service/api';

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await api.get('/leads/my?page=0&size=50');
      setLeads(res.data.data.content || res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1"><Clock size={12} /> Новая</span>;
      case 'CONTACTED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1"><AlertCircle size={12} /> На связи</span>;
      case 'APPROVED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={12} /> Одобрена</span>;
      case 'REJECTED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1"><XCircle size={12} /> Отклонена</span>;
      case 'CLOSED': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Закрыта</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const getTypeText = (type) => {
    if (type === 'TEST_DRIVE') return 'Тест-драйв';
    if (type === 'PURCHASE') return 'Покупка';
    if (type === 'TRADE_IN') return 'Trade-in';
    return type;
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Мои заявки</h1>

      {leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-lg mb-4">У вас пока нет заявок</p>
          <Link to="/cars" className="text-blue-600 font-medium hover:underline">Перейти в каталог</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map(lead => (
            <div
              key={lead.id}
              className={`bg-white rounded-xl shadow p-6 border-l-4 transition hover:shadow-md ${
                lead.status !== 'NEW' && lead.status !== 'CLOSED'
                  ? 'border-yellow-400 bg-yellow-50/30'
                  : 'border-transparent'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">

                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Автомобиль:</div>
                  <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    {lead.carMake} {lead.carModel}
                    {lead.status !== 'NEW' && lead.status !== 'CLOSED' && (
                      <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200 font-bold uppercase tracking-wide">
                        Есть ответ
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Тип: {getTypeText(lead.type)}</div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="text-sm text-gray-500">Статус:</div>
                  {getStatusBadge(lead.status)}

                  {lead.comment && (
                    <div className="mt-2 text-sm bg-white p-2 rounded border border-gray-200 max-w-xs italic text-gray-600">
                      "{lead.comment}"
                    </div>
                  )}
                </div>

                <div className="text-right min-w-[100px]">
                  <div className="text-xs text-gray-400">Создана:</div>
                  <div className="text-sm font-medium">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}