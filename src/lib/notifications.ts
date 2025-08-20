"use client";

import { getToken, onMessage, type MessagePayload, type Messaging } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

// Your VAPID key from Firebase Console
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, string>;
}

class NotificationService {
  private messaging: Messaging | null = null;
  private token: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Check if running in browser and service workers are supported
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        console.warn('Service workers are not supported in this environment');
        return;
      }

      // Register service worker
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service worker registered successfully');

      // Initialize messaging
      this.messaging = getFirebaseMessaging();
      
      // Request permission and get token
      await this.requestPermission();
      
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        
        if (!VAPID_KEY) {
          console.error('VAPID key is not configured');
          return null;
        }

        // Get FCM token
        if (this.messaging) {
          this.token = await getToken(this.messaging, {
            vapidKey: VAPID_KEY,
          });
        }
        
        if (this.token) {
          console.log('FCM Token:', this.token);
          // TODO: Send token to your server to store for sending notifications
          await this.sendTokenToServer(this.token);
          return this.token;
        } else {
          console.log('No registration token available');
        }
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
    }
    
    return null;
  }

  async sendTokenToServer(token: string): Promise<void> {
    try {
      // TODO: Implement API call to your backend to store the token
      // This token should be associated with the current user
      console.log('Token to send to server:', token);
      
      // Example API call (uncomment and modify as needed):
      // const response = await fetch('/api/notifications/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ token, userId: getCurrentUserId() }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to register token');
      // }
    } catch (error) {
      console.error('Failed to send token to server:', error);
    }
  }

  setupForegroundMessageHandler(onMessageReceived: (payload: MessagePayload) => void): void {
    if (!this.messaging) {
      console.warn('Messaging not initialized');
      return;
    }

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      onMessageReceived(payload);
      
      // Show notification if the app is in focus
      if (payload.notification) {
        this.showLocalNotification({
          title: payload.notification.title || 'New Notification',
          body: payload.notification.body || 'You have a new message',
          icon: payload.notification.icon,
          data: payload.data,
        });
      }
    });
  }

  showLocalNotification(notification: NotificationPayload): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const { title, body, icon, badge, data } = notification;
      console.log('Showing local notification:', { title, body, icon, badge, data });

      new Notification(title, {
        body,
        icon: icon || '/firebase-logo.svg',
        badge: badge || '/firebase-logo.svg',
        tag: 'local-notification',
        data,
      });
    }
  }

  getToken(): string | null {
    return this.token;
  }

  async refreshToken(): Promise<string | null> {
    this.token = null;
    return await this.requestPermission();
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper function to initialize notifications
export async function initializeNotifications(): Promise<void> {
  await notificationService.initialize();
}

// Helper function to setup message handler
export function setupMessageHandler(onMessageReceived: (payload: MessagePayload) => void): void {
  notificationService.setupForegroundMessageHandler(onMessageReceived);
}
