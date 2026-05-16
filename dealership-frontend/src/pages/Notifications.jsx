import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../service/api';

const STATUS_TRANSLATIONS = {
  'NEW': 'Новая',
  'CONTACTED': 'Связались',
  'NEGOTIATION': 'В процессе переговоров',
  'APPROVED': 'Одобрена',
  'CLOSED': 'Закрыта',
  'REJECTED': 'Отклонена'
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/leads/my?page=0&size=20');
        const leads = res.data.data?.content || res.data.data || [];

        const notifs = leads.map(lead => {
          const russianStatus = STATUS_TRANSLATIONS[lead.status] || lead.status;

          return {
            id: lead.id,
            text: `Статус заявки на ${lead.carMake} ${lead.carModel} изменен на "${russianStatus}"`,
            date: lead.updatedAt || lead.createdAt,
            read: lead.status === 'NEW'
          };
        });
        setNotifications(notifs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Bell className="text-blue-600" /> Уведомления
      </h1>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500">У вас нет новых уведомлений</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-lg border ${n.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
              <p className="text-gray-800">{n.text}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(n.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}