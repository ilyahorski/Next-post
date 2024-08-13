const channel = new BroadcastChannel('sw-messages');

self.addEventListener('push', function(event) {
  event.preventDefault();
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  if (data.chatId) {
    const chatDataResponse = new Response(new Blob([JSON.stringify(data)], { type: 'application/json' }));
    event.waitUntil(caches.open('chat-data').then(cache => cache.put('current-chat-data', chatDataResponse)));
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      let isChatOpen = false;
      const chatUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${data.chatId}`;

      for (let client of clients) {
        if (client.url.includes(chatUrl) && 'focus' in client && data.type !== 'call') {
          isChatOpen = true;
          client.focus();
          break;
        }
      }

      const title = data.title || 'Message from Next Post';
      const userIcon = data.userIcon;
      const type = data.type || 'message';
      const notificationTag = `chat-${data.chatId}-${data.body}`;

      const options = {
        body: data.body || 'Click to open chat',
        icon: userIcon,
        badge: '/assets/email.png',
        sound: '/assets/notif.mp3',
        vibrate: [
          500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170,
          40, 500,
        ],
        tag: notificationTag,
        renotify: false, 
      };

      if (type === 'call') {
        options.actions = [
          { action: 'accept', type: 'button', title: 'Accept Call', icon: '/assets/icons/incoming-call.png' },
          { action: 'reject', type: 'button', title: 'Reject Call', icon: '/assets/icons/rejected.png' },
        ];

        // Отправляем сообщение через BroadcastChannel
        channel.postMessage({
          type: 'INCOMING_CALL',
          chatId: data.chatId
        });

        return self.registration.showNotification(title, options);
      } else if (!isChatOpen) {
        return self.registration.getNotifications({ tag: notificationTag }).then(existingNotifications => {
          if (existingNotifications.length === 0) {
            return self.registration.showNotification(title, options);
          }
        });
      }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.preventDefault();
  event.notification.close();

  event.waitUntil(
    caches.open('chat-data').then(cache => cache.match('current-chat-data')).then(response => {
      if (response) {
        return response.json().then(data => {
          const { chatId, type } = data;

          self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
            let client = clients.find(c => c.url.startsWith(process.env.NEXT_PUBLIC_BASE_URL) && 'navigate' in c);
            
            if (type === 'call') {
              let chatUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}?source=push`;
              
              if (event.action === 'reject' || event.action === 'accept') {
                chatUrl += `&type=${event.action}`;
          
                // Отправляем сообщение через BroadcastChannel
                channel.postMessage({
                  type: 'CALL_ENDED',
                  action: event.action,
                  chatId: chatId
                });
              }
  
              if (event.action === 'reject') {
                return;
              }
              
              if (client) {
                return client.navigate(chatUrl).then(client => client.focus());
              } else {
                return clients.openWindow(chatUrl);
              }
            } else {
              const chatUrl = chatId ? `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}` : `${process.env.NEXT_PUBLIC_BASE_URL}/chat`;
              return clients.openWindow(chatUrl);
            }
          })
        
        });
      } else {
        caches.delete('action-data');
        caches.delete('chat-data');
        return clients.openWindow(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`);
      }
    })
  );
});

// Добавляем обработчик сообщений от основного потока (если понадобится)
self.addEventListener('message', (event) => {
  console.log('SW received message:', event.data);
  // Здесь можно обрабатывать сообщения от основного потока, если это необходимо
});