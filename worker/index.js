self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  if (data.chatId) {
    const chatIdData = new Response(new Blob([data.chatId], { type: 'text/plain' }));
    event.waitUntil(caches.open('chat-ids').then(cache => cache.put('current-chat-id', chatIdData)));
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

      if (!isChatOpen) {
        const title = data.title || 'Message from Next Post';
        const userIcon = data.userIcon;
        const options = {
          body: data.body || 'Click to open chat',
          icon: userIcon,
          badge: '/assets/email.png',
          sound: '/assets/notif.mp3',
          tag: 'renotify',
          renotify: true,
        };

        return self.registration.showNotification(title, options);
      }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    caches.open('chat-ids').then(cache => cache.match('current-chat-id')).then(response => {
      if (response) {
        return response.text().then(chatId => {
          const chatUrl = chatId ? `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}` : `${process.env.NEXT_PUBLIC_BASE_URL}/chat`;
          return clients.openWindow(chatUrl);
        });
      } else {
        return clients.openWindow(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`);
      }
    })
  );
});
