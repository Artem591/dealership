import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRoles }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();

    window.addEventListener('storage', checkAuthorization);

    return () => {
      window.removeEventListener('storage', checkAuthorization);
    };
  }, [requiredRoles]);

    const checkAuthorization = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log(' Токен не найден');
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📦 Payload токена:', payload);

        let userRole = payload.role ||
                       payload.roles ||
                       payload.authorities ||
                       payload.sub;

        if (Array.isArray(userRole)) {
          userRole = userRole[0];
        }

        if (userRole && typeof userRole === 'string' && userRole.startsWith('ROLE_')) {
          userRole = userRole.replace('ROLE_', '');
        }

        console.log(' Полученная роль:', userRole);
        console.log(' Требуемые роли:', requiredRoles);

        if (!userRole) {
          console.log(' Роль не найдена в токене');
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Проверяем роль
        if (requiredRoles && !requiredRoles.includes(userRole)) {
          console.log(' Недостаточно прав. Есть:', userRole, 'Нужно:', requiredRoles);
          setIsAuthorized(false);
        } else {
          console.log(' Доступ разрешён');
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error(' Ошибка при проверке токена:', error);
        setIsAuthorized(false);
      }

      setLoading(false);
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    if (!localStorage.getItem('token')) {
      return <Navigate to="/login" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}