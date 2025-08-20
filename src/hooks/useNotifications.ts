"use client";

import { useEffect, useState } from "react";
import { type MessagePayload } from "firebase/messaging";
import { initializeNotifications, setupMessageHandler, notificationService } from "@/lib/notifications";

export interface UseNotificationsReturn {
  token: string | null;
  permission: NotificationPermission | null;
  isSupported: boolean;
  requestPermission: () => Promise<string | null>;
  refreshToken: () => Promise<string | null>;
}

export function useNotifications(
  onMessageReceived?: (payload: MessagePayload) => void
): UseNotificationsReturn {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);

    if (!supported) {
      console.warn('Notifications are not supported in this browser');
      return;
    }

    // Get current permission status
    setPermission(Notification.permission);

    // Initialize notifications
    const init = async () => {
      try {
        await initializeNotifications();
        setToken(notificationService.getToken());
        setPermission(Notification.permission);

        // Setup message handler if provided
        if (onMessageReceived) {
          setupMessageHandler(onMessageReceived);
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    init();
  }, [onMessageReceived]);

  const requestPermission = async (): Promise<string | null> => {
    try {
      const newToken = await notificationService.requestPermission();
      setToken(newToken);
      setPermission(Notification.permission);
      return newToken;
    } catch (error) {
      console.error('Failed to request permission:', error);
      return null;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const newToken = await notificationService.refreshToken();
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  };

  return {
    token,
    permission,
    isSupported,
    requestPermission,
    refreshToken,
  };
}
