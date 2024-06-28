self.addEventListener('push', function(event) {
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
        if (client.url.includes(chatUrl) && 'focus' in client) {
          isChatOpen = true;
          client.focus();
          break;
        }
      }

      const title = data.title || 'Message from Next Post';
      const userIcon = data.userIcon;
      const type = data.type || 'message';
      const options = {
        body: data.body || 'Click to open chat',
        icon: userIcon,
        badge: '/assets/email.png',
        sound: '/assets/notif.mp3',
        tag: 'renotify',
        renotify: true,
      };

      if (type === 'call') {
        options.actions = [
          { action: 'accept', type: 'button', title: 'Accept Call', icon: '/assets/icons/incoming-call.png' },
          { action: 'reject', type: 'button', title: 'Reject Call', icon: '/assets/icons/rejected.png' },
        ];

        return self.registration.showNotification(title, options);
      } else if (!isChatOpen) {
        return self.registration.showNotification(title, options);
      }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    caches.open('chat-data').then(cache => cache.match('current-chat-data')).then(response => {
      if (response) {
        return response.json().then(data => {
          const { chatId, type } = data;
          
          if (type === 'call') {
            let chatUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}?source=push`;
            
            if (event.action === 'reject') {
              chatUrl += '&type=reject';
            }

            return clients.openWindow(chatUrl);
          } else {
            const chatUrl = chatId ? `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}` : `${process.env.NEXT_PUBLIC_BASE_URL}/chat`;
            return clients.openWindow(chatUrl);
          }
        });
      } else {
        caches.delete('action-data');
        caches.delete('chat-data');
        return clients.openWindow(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`);
      }
    })
  );
});
