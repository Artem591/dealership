import { Shield, TrendingUp, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-5xl font-bold mb-12 text-center">О компании AutoDealer</h1>

      <div className="grid grid-cols-2 gap-8 mb-16">
        <div className="bg-blue-50 p-8 rounded-xl text-center">
          <Shield size={48} className="mx-auto text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Надёжность</h3>
          <p className="text-gray-600">Все автомобили проходят полную диагностику</p>
        </div>
        <div className="bg-green-50 p-8 rounded-xl text-center">
          <TrendingUp size={48} className="mx-auto text-green-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Выгодные цены</h3>
          <p className="text-gray-600">Лучшие предложения на рынке</p>
        </div>
        <div className="bg-purple-50 p-8 rounded-xl text-center">
          <Users size={48} className="mx-auto text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Профессионалы</h3>
          <p className="text-gray-600">Опытные менеджеры помогут с выбором</p>
        </div>
        <div className="bg-yellow-50 p-8 rounded-xl text-center">
          <Award size={48} className="mx-auto text-yellow-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Гарантия</h3>
          <p className="text-gray-600">Гарантия на все автомобили</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold mb-6">О нас</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          AutoDealer — это современный автосалон, предлагающий широкий выбор новых автомобилей
          и автомобилей с пробегом. Мы работаем на рынке уже более 10 лет и помогли тысячам
          клиентов найти автомобиль своей мечты.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Наша миссия — сделать процесс покупки автомобиля максимально простым, прозрачным
          и удобным для каждого клиента.
        </p>
      </div>
    </div>
  );
}