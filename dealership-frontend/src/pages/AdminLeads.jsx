import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, Phone, MessageSquare } from 'lucide-react';
import api from '../service/api';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await api.get('/leads?page=0&size=50');
      setLeads(res.data.data.content || res.data.data);
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (leadId, newStatus) => {
    try {
      await api.put(`/leads/${leadId}/status?status=${newStatus}`);
      await loadLeads(); // Обновляем список
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CLOSED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      NEW: 'Новая',
      CONTACTED: 'На связи',
      APPROVED: 'Одобрена',
      REJECTED: 'Отклонена',
      CLOSED: 'Закрыта'
    };
    return texts[status] || status;
  };

  const getTypeText = (type) => {
    const texts = {
      TEST_DRIVE: 'Тест-драйв',
      PURCHASE: 'Покупка',
      TRADE_IN: 'Trade-in'
    };
    return texts[type] || type;
  };

  const filteredLeads = filter === 'ALL'
    ? leads
    : leads.filter(lead => lead.status === filter);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Управление заявками</h1>

        <div className="flex gap-2 flex-wrap">
          {['ALL', 'NEW', 'CONTACTED', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'ALL' ? 'Все' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Заявок не найдено
          </div>
        ) : (
          filteredLeads.map(lead => (
            <div key={lead.id} className="bg-white rounded-xl shadow p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Информация о клиенте */}
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    {lead.clientFirstName} {lead.clientLastName}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <a href={`tel:${lead.clientPhone}`} className="hover:text-blue-600">
                        {lead.clientPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} />
                      <a href={`mailto:${lead.clientEmail}`} className="hover:text-blue-600">
                        {lead.clientEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Автомобиль:</div>
                  <div className="font-medium">
                    {lead.carMake} {lead.carModel}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Тип заявки: <span className="font-medium">{getTypeText(lead.type)}</span>
                  </div>
                  {lead.comment && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Комментарий:</strong> {lead.comment}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                      {getStatusText(lead.status)}
                    </span>
                    <div className="text-sm text-gray-500 mt-2">
                      Создана: {new Date(lead.createdAt).toLocaleString('ru-RU')}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    {lead.status === 'NEW' && (
                      <>
                        <button
                          onClick={() => updateStatus(lead.id, 'CONTACTED')}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                        >
                          <Phone size={14} /> На связи
                        </button>
                        <button
                          onClick={() => updateStatus(lead.id, 'REJECTED')}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          <X size={14} /> Отклонить
                        </button>
                      </>
                    )}
                    {lead.status === 'CONTACTED' && (
                      <>
                        <button
                          onClick={() => updateStatus(lead.id, 'APPROVED')}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                        >
                          <Check size={14} /> Одобрить
                        </button>
                        <button
                          onClick={() => updateStatus(lead.id, 'REJECTED')}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          <X size={14} /> Отклонить
                        </button>
                      </>
                    )}
                    {lead.status === 'APPROVED' && (
                      <button
                        onClick={() => updateStatus(lead.id, 'CLOSED')}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                      >
                        Закрыть
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}