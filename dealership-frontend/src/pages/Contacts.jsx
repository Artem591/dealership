import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center">Контакты</h1>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <MapPin size={32} className="text-blue-600" />
            <h3 className="text-2xl font-bold">Адрес</h3>
          </div>
          <p className="text-gray-700 text-lg">
            г. Минск, ул. Автомобильная, 1<br />
            Бизнес-центр "АвтоСити"
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <Phone size={32} className="text-blue-600" />
            <h3 className="text-2xl font-bold">Телефон</h3>
          </div>
          <p className="text-gray-700 text-lg">
            <a href="tel:+375291234567" className="hover:text-blue-600">
              +375 (29) 123-45-67
            </a>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <Mail size={32} className="text-blue-600" />
            <h3 className="text-2xl font-bold">Email</h3>
          </div>
          <p className="text-gray-700 text-lg">
            <a href="mailto:info@autodealer.by" className="hover:text-blue-600">
              info@autodealer.by
            </a>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <Clock size={32} className="text-blue-600" />
            <h3 className="text-2xl font-bold">Режим работы</h3>
          </div>
          <p className="text-gray-700 text-lg">
            Пн-Пт: 9:00 - 20:00<br />
            Сб-Вс: 10:00 - 18:00
          </p>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Остались вопросы?</h2>
        <p className="text-xl mb-6">
          Наши менеджеры готовы ответить на все ваши вопросы и помочь с выбором автомобиля
        </p>
        <a
          href="tel:+375291234567"
          className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-xl hover:bg-blue-50 transition"
        >
          Позвонить сейчас
        </a>
      </div>
    </div>
  );
}