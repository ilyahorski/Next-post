"use client";

import { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { MdOutlineNotificationsOff } from "react-icons/md";
import { SessionContext } from "~/utils/context/SocketContext";

const SubscribeToPush = () => {
  const { data: session, status, update } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const sessionId = useContext(SessionContext);

  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setIsSubscribed(true);
        }
      }
    };

    checkSubscription();
  }, []);

  const subscribeUser = async () => {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
    if (!vapidPublicKey) {
      console.error("VAPID public key is missing.");
      return;
    }

    try {
      if (
        (navigator.userActivation && navigator.userActivation.isActive) ||
        ("serviceWorker" in navigator && "PushManager" in window)
      ) {
        const registration = await navigator.serviceWorker.ready;

        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        await fetch("/api/subscribe", {
          method: "POST",
          body: JSON.stringify({
            subscription,
            userId: sessionId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        setIsSubscribed(true);
        console.log("User is subscribed:", subscription);
      }
    } catch (error) {
      console.error("Failed to subscribe the user: ", error);
    }
  };

  const unsubscribeUser = async () => {
    try {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          await subscription.unsubscribe();
          await fetch("/api/subscribe", {
            method: "DELETE",
            body: JSON.stringify({
              userId: sessionId,
              endpoint: subscription.endpoint,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          setIsSubscribed(false);
          console.log("User is unsubscribed:", subscription);
        }
      }
    } catch (error) {
      console.error("Failed to unsubscribe the user: ", error);
    }
  };

  function urlBase64ToUint8Array(base64String) {
    if (!base64String || base64String.length === 0) {
      throw new Error("VAPID key is missing or invalid.");
    }

    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <div>
      {isSubscribed ? (
        <button
          className="flex gap-4 text-[20px] font-light items-center cursor-pointer text-zinc-200 hover:text-zinc-300/60 active:text-zinc-400/60"
          onClick={unsubscribeUser}
          placeholder="Push alert on"
        >
          <MdOutlineNotificationsActive className="w-10 h-10" />
          <span>Push alert on</span>
        </button>
      ) : (
        <button
          className="flex gap-4 text-[20px] font-light items-center cursor-pointer text-zinc-200 hover:text-zinc-300/60 active:text-zinc-400/60"
          onClick={subscribeUser}
          placeholder="Push alert off"
        >
          <MdOutlineNotificationsOff className="w-10 h-10" />
          <span>Push alert off</span>
        </button>
      )}
    </div>
  );
};

export default SubscribeToPush;
