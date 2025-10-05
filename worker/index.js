const channel = new BroadcastChannel("sw-messages");
const CACHE_NAME = "notification-icons-v1";
const ICONS_TO_CACHE = ["/assets/icons/call.png", "/assets/icons/callr.png"];

const CALL_STATUS_CACHE = "call-status";
const CHAT_DATA_CACHE = "chat-data";

async function getCallStatus(chatId) {
  const cache = await caches.open(CALL_STATUS_CACHE);
  const response = await cache.match(`call-status-${chatId}`);

  if (!response) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    console.error("Failed to parse call status", error);
    return null;
  }
}

async function setCallStatus(chatId, status) {
  const cache = await caches.open(CALL_STATUS_CACHE);
  const payload = {
    status,
    chatId,
    timestamp: Date.now(),
  };

  await cache.put(
    `call-status-${chatId}`,
    new Response(JSON.stringify(payload), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
}

async function clearChatData() {
  const cache = await caches.open(CHAT_DATA_CACHE);
  await cache.delete("current-chat-data");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ICONS_TO_CACHE))
  );
});

self.addEventListener("fetch", (event) => {
  if (ICONS_TO_CACHE.includes(event.request.url)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

self.addEventListener("notificationclose", function (event) {
  event.stopImmediatePropagation();
  const notification = event.notification;
  const data = notification.data;
  console.log("notification close", data);

  if (data && data.type === "call") {
    // Отправляем сообщение через BroadcastChannel
    channel.postMessage({
      type: "CALL_ENDED",
      action: "reject",
      chatId: data.chatId,
    });
    // Отправляем сообщение всем активным клиентам
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "CALL_ENDED",
          action: "reject",
          chatId: data.chatId,
        });
      });
    });

    // Сохраняем информацию о закрытии вызова в кэше
    event.waitUntil(setCallStatus(data.chatId, "closed"));
  }
});

self.addEventListener("push", function (event) {
  event.preventDefault();
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  if (data.chatId) {
    const chatDataResponse = new Response(
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    event.waitUntil(
      caches
        .open(CHAT_DATA_CACHE)
        .then((cache) => cache.put("current-chat-data", chatDataResponse))
    );
  }

  event.waitUntil(
    (async function () {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      try {
        let isChatOpen = false;
        const chatUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${data.chatId}`;

        for (let client of clients) {
          if (
            client.url.includes(chatUrl) &&
            "focus" in client &&
            data.type !== "call"
          ) {
            isChatOpen = true;
            await client.focus();
            break;
          }
        }

        const title = data.title || "Message from Next Post";
        const userIcon = data.userIcon;
        const type = data.type || "message";
        const notificationTag = `chat-${data.chatId}-${data.body}`;

        const options = {
          body: data.body || "Click to open chat",
          icon: userIcon,
          badge: "/assets/email.png",
          sound: "/assets/notif.mp3",
          vibrate: [
            500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110,
            170, 40, 500
          ],
          tag: notificationTag,
          renotify: false,
        };

        if (type === "call") {
          if (!data.chatId) {
            return;
          }

          const callStatus = await getCallStatus(data.chatId);
          if (callStatus && ["accepted", "closed"].includes(callStatus.status)) {
            return;
          }

          await setCallStatus(data.chatId, "ringing");

          options.actions = [
            {
              action: "accept",
              type: "button",
              title: "Accept Call",
              icon: "/assets/icons/callr.png",
            },
            {
              action: "reject",
              type: "button",
              title: "Reject Call",
              icon: "/assets/icons/call.png",
            },
          ];

          // Отправляем сообщение через BroadcastChannel
          channel.postMessage({
            type: "INCOMING_CALL",
            chatId: data.chatId,
          });

          return self.registration.showNotification(title, options);
        } else if (!isChatOpen) {
          const existingNotifications = await self.registration.getNotifications({
            tag: notificationTag,
          });

          if (existingNotifications.length === 0) {
            return self.registration.showNotification(title, options);
          }
        }
      } catch (error) {
        console.error("Failed to process push event", error);
      }
    })()
  );
});

self.addEventListener("notificationclick", function (event) {
  event.preventDefault();
  event.notification.close();

  console.log("Notification click received:", event);

  event.waitUntil(
    (async function () {
      try {
        // Открываем кэш и пытаемся получить данные текущего чата
        const cache = await caches.open(CHAT_DATA_CACHE);
        const response = await cache.match("current-chat-data");

        if (response) {
          const data = await response.json();
          const { chatId, type } = data;

          console.log("Chat Data:", data);

          // Определяем базовый URL
          const baseUrl = self.location.origin; // Используем self.location.origin вместо process.env

          // Формируем URL чата
          let chatUrl = chatId
            ? `${baseUrl}/chat/${chatId}`
            : `${baseUrl}/chat`;

          if (type === "call") {
            chatUrl += `?source=push`;

            if (event.action === "reject" || event.action === "accept") {
              chatUrl += `&type=${event.action}`;

              // Отправляем сообщение через BroadcastChannel
              channel.postMessage({
                type: "CALL_ENDED",
                action: event.action,
                chatId: chatId,
              });

              console.log(`Call ${event.action} for chatId: ${chatId}`);

              if (event.action === "accept") {
                await setCallStatus(chatId, "accepted");
                await clearChatData();
              } else if (event.action === "reject") {
                await setCallStatus(chatId, "closed");
              }
            }

            if (event.action === "reject") {
              console.log("Call rejected");
              return; // Завершаем обработку, если звонок отклонён
            }
          }

          // Пытаемся найти уже открытое окно PWA
          const allClients = await self.clients.matchAll({
            type: "window",
            includeUncontrolled: true,
          });

          let client = allClients.find((c) =>
            c.url.startsWith(baseUrl) && "navigate" in c
          );

          if (client) {
            console.log("Found existing client, navigating...");
            // Навигация к нужному URL
            await client.navigate(chatUrl);
            await client.focus();
          } else {
            console.log("No existing client found, opening new window...");
            // Открываем новое окно с нужным URL
            await self.clients.openWindow(chatUrl);
          }
        } else {
          console.log("No chat data found in cache, opening default chat window.");
          // Если данных нет, очищаем кэш и открываем стандартное окно чата
          await caches.delete("action-data");
          await caches.delete(CHAT_DATA_CACHE);
          await self.clients.openWindow(`${self.location.origin}/chat`);
        }
      } catch (error) {
        console.error("Error handling notification click:", error);
        // В случае ошибки открываем стандартное окно чата
        await self.clients.openWindow(`${self.location.origin}/chat`);
      }
    })()
  );
});


// Добавляем обработчик сообщений от основного потока (если понадобится)
self.addEventListener("message", (event) => {
  console.log("SW received message:", event.data);

  const { data } = event;
  if (!data) {
    return;
  }

  if (data.type === "CALL_ENDED" && data.chatId) {
    event.waitUntil(
      (async () => {
        if (data.action === "accept") {
          await setCallStatus(data.chatId, "accepted");
          await clearChatData();
        } else if (data.action === "reject" || data.action === "closed") {
          await setCallStatus(data.chatId, "closed");
        }
      })()
    );
  }
});
