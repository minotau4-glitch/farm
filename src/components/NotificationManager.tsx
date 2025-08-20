"use client";

import { useState } from "react";
import { type MessagePayload } from "firebase/messaging";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationManager() {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [latestMessage, setLatestMessage] = useState<MessagePayload | null>(null);

  const { token, permission, isSupported, requestPermission } = useNotifications(
    (payload: MessagePayload) => {
      console.log('Received foreground message:', payload);
      setMessages(prev => [payload, ...prev.slice(0, 9)]); // Keep last 10 messages
      setLatestMessage(payload);
      setShowToast(true);
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => setShowToast(false), 5000);
    }
  );

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const dismissToast = () => {
    setShowToast(false);
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <p>Push notifications are not supported in this browser.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Permission Status */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Notification Settings</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Permission: </span>
            <span className={`capitalize ${
              permission === 'granted' ? 'text-green-600' : 
              permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {permission || 'unknown'}
            </span>
          </p>
          
          {token && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">FCM Token: </span>
              <code className="bg-gray-100 px-1 rounded text-xs break-all">
                {token.substring(0, 20)}...
              </code>
            </p>
          )}
          
          {permission !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Enable Notifications
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && latestMessage && (
        <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {latestMessage.notification?.title || 'New Notification'}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {latestMessage.notification?.body || 'You have a new message'}
              </p>
            </div>
            <button
              onClick={dismissToast}
              className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message History */}
      {messages.length > 0 && (
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Recent Notifications</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <h4 className="font-medium text-sm">
                  {message.notification?.title || 'Untitled'}
                </h4>
                <p className="text-sm text-gray-600">
                  {message.notification?.body || 'No content'}
                </p>
                {message.data && Object.keys(message.data).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">
                      Data payload
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(message.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Notification Button */}
      {permission === 'granted' && (
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Notifications</h3>
          <button
            onClick={() => {
              if ('Notification' in window) {
                new Notification('Test Notification', {
                  body: 'This is a test notification from your app!',
                  icon: '/firebase-logo.svg',
                  tag: 'test-notification',
                });
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Send Test Notification
          </button>
        </div>
      )}
    </div>
  );
}
