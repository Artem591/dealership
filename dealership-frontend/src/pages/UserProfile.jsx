import { useState, useEffect } from 'react';
import api from '../service/api';
import { User, Save, AlertCircle } from 'lucide-react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/me');
      const userData = response.data.data;
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || ''
      });
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      setMessage({ type: 'error', text: 'Не удалось загрузить профиль' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/me', formData);
      setMessage({ type: 'success', text: response.data.message || 'Профиль успешно обновлен!' });
      setEditing(false);
      setUser(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при сохранении' });
    }
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Личный кабинет</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle size={18} />
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={!editing}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={!editing}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={!editing}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (нельзя изменить)</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Редактировать
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      phone: user.phone || ''
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save size={18} />
                  Сохранить
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}