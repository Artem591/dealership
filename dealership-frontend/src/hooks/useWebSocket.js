import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

export default function useWebSocket(onMessage) {
  const clientRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ Токен не найден');
      return;
    }

    let userEmail = '';
    let userRole = '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.sub || payload.email || '';
      userRole = payload.role || localStorage.getItem('userRole') || '';
      if (userRole.startsWith('ROLE_')) userRole = userRole.replace('ROLE_', '');
      console.log('✅ Email:', userEmail, 'Role:', userRole);
    } catch (e) {
      console.error('❌ Ошибка парсинга токена:', e);
      return;
    }

    const client = new Client({
      brokerURL: `ws://localhost:8080/ws?token=${encodeURIComponent(token)}`,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('✅ WebSocket подключён');

        if (userRole === 'ADMIN' || userRole === 'MANAGER') {
          client.subscribe('/topic/leads/new', (msg) => {
            const data = JSON.parse(msg.body);
            console.log('📬 Новая заявка:', data);
            onMessageRef.current?.(data, 'NEW_LEAD');
          });
        }

       if (userEmail) {
         client.subscribe(`/user/${userEmail}/queue/lead-updates`, (msg) => {
           const data = JSON.parse(msg.body);
           onMessageRef.current?.(data, 'MY_LEAD_UPDATE'); // ← ВАЖНО
         });
       }

        client.subscribe('/topic/chat', (msg) => {
          const data = JSON.parse(msg.body);
          console.log('💬 Сообщение чата:', data);
          onMessageRef.current?.(data, 'CHAT_MESSAGE');
        });
      },
      onStompError: (frame) => console.error('❌ STOMP Error:', frame.headers['message']),
      onWebSocketError: (error) => console.error('❌ WebSocket Error:', error),
      onDisconnect: () => console.log('❌ WebSocket отключён')
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return clientRef.current;
}