import { useState, useEffect } from 'react';
import { FileText, Car, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../service/api';

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await api.get('/leads/my');
      setLeads(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800';
      case 'NEGOTIATION': return 'bg-purple-100 text-purple-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      'NEW': 'Новая',
      'CONTACTED': 'На рассмотрении',
      'NEGOTIATION': 'Переговоры',
      'APPROVED': 'Одобрена',
      'CLOSED': 'Закрыта',
      'REJECTED': 'Отклонена'
    };
    return statuses[status] || status;
  };

  if (loading) return <div className="p-8 text-center text-xl">Загрузка...</div>;

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <FileText size={36} className="text-blue-600" />
        Мои заявки
      </h1>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">У вас пока нет заявок</h2>
          <p className="text-gray-600 mb-6">Оставьте заявку на понравившийся автомобиль</p>
          <a href="/cars" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Перейти в каталог
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {leads.map(lead => (
            <div key={lead.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {lead.car?.make} {lead.car?.model}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={18} />
                      {new Date(lead.createdAt).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(lead.status)}`}>
                  {getStatusText(lead.status)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Тип заявки:</span>
                    <p className="font-medium">{lead.type === 'TEST_DRIVE' ? 'Тест-драйв' : lead.type === 'PURCHASE' ? 'Покупка' : 'Trade-in'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Источник:</span>
                    <p className="font-medium">{lead.source || 'Сайт'}</p>
                  </div>
                </div>
                {lead.comment && (
                  <div>
                    <span className="text-sm text-gray-600">Комментарий:</span>
                    <p className="text-gray-700">{lead.comment}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}