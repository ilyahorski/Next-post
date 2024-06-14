"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { MdOutlineNotificationsOff } from "react-icons/md";

const SubscribeToPush = () => {
  const { data: session, status, update } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);

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
        ("serviceWorker" in navigator && "Notification" in window && "PushManager" in window)
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
            userId: session?.user?.id,
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
              userId: session?.user?.id,
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
          className="flex gap-0.5 items-center flex-col cursor-pointer text-amber-600 hover:text-amber-700 active:text-amber-800"
          onClick={unsubscribeUser}
        >
          <MdOutlineNotificationsActive
            className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
            placeholder="Open chats list"
          />
          <span className="font-normal text-6xs">Push alert</span>
        </button>
      ) : (
        <button
          className="flex gap-0.5 items-center flex-col cursor-pointer text-amber-600 hover:text-amber-700 active:text-amber-800"
          onClick={subscribeUser}
        >
          <MdOutlineNotificationsOff
            className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
            placeholder="Open chats list"
          />
          <span className="font-normal text-6xs">Push alert</span>
        </button>
      )}
    </div>
  );
};

export default SubscribeToPush;
