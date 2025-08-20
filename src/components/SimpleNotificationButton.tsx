"use client";

import { useNotifications } from "@/hooks/useNotifications";

interface SimpleNotificationButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SimpleNotificationButton({ 
  className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors",
  children = "Enable Notifications"
}: SimpleNotificationButtonProps) {
  const { permission, requestPermission, isSupported } = useNotifications();

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500">
        Notifications not supported
      </div>
    );
  }

  if (permission === 'granted') {
    return (
      <div className="text-sm text-green-600">
        ✅ Notifications enabled
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      className={className}
      disabled={permission === 'denied'}
    >
      {permission === 'denied' ? 'Notifications blocked' : children}
    </button>
  );
}
