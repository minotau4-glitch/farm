# Firebase Cloud Messaging (FCM) Setup

This project now includes Firebase Cloud Messaging for web push notifications.

## 🚀 Quick Setup

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env
   ```

2. Get your Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project → Project Settings → General
   - Scroll down to "Your apps" and find your web app
   - Copy the config values

3. Update `.env` with your Firebase values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   # ... etc
   ```

### 2. Enable Cloud Messaging & Get VAPID Key

1. In Firebase Console, go to **Project Settings** > **Cloud Messaging**
2. Scroll down to **Web configuration**
3. Click **Generate key pair** to create a VAPID key
4. Copy the key and add it to your `.env`:
   ```env
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
   ```

### 3. Generate Service Worker

After setting up your environment variables:

```bash
npm run generate-sw
```

This creates `public/firebase-messaging-sw.js` with your Firebase configuration.

### 4. Start Development

```bash
npm run dev
```

The service worker will be automatically generated each time you run dev or build.

## ✨ Features

- ✅ **Auto Service Worker Generation**: No manual config needed
- ✅ **Permission Management**: Request and manage notification permissions  
- ✅ **FCM Token Management**: Automatic token generation and refresh
- ✅ **Background Notifications**: Works when app is closed
- ✅ **Foreground Notifications**: Custom handling when app is active
- ✅ **Message History**: View recent notifications
- ✅ **Test Notifications**: Built-in test functionality
- ✅ **Toast Notifications**: Real-time notification display

## Components

### NotificationManager
A complete UI component that provides:
- Permission status and request button
- FCM token display
- Recent notification history
- Test notification functionality
- Toast notifications for real-time messages

### useNotifications Hook
A React hook that provides:
- `token`: Current FCM token
- `permission`: Current notification permission status
- `isSupported`: Whether notifications are supported
- `requestPermission()`: Function to request permissions
- `refreshToken()`: Function to refresh the FCM token

## Sending Notifications

### From Firebase Console
1. Go to **Engage** > **Messaging** in Firebase Console
2. Create a new campaign
3. Target your app users
4. Send test or campaign messages

### Programmatically (Server-side)
```javascript
// Example server-side code (Node.js)
const admin = require('firebase-admin');

const message = {
  notification: {
    title: 'Hello World',
    body: 'This is a notification message'
  },
  token: 'user_fcm_token_here'
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
```

## Testing

1. Open your app in a browser
2. Navigate to the private dashboard
3. Click "Enable Notifications" if permissions aren't granted
4. Use the "Send Test Notification" button to test local notifications
5. Send messages from the Firebase Console to test FCM

## Browser Support

- Chrome 50+
- Firefox 44+
- Safari 16+ (macOS 13+)
- Edge 17+

## Troubleshooting

### Service Worker Issues
- Ensure `firebase-messaging-sw.js` is in the `public` directory
- Check browser dev tools for service worker registration errors
- Clear browser cache and re-register service worker

### Permission Denied
- Check browser notification settings
- Some browsers block notifications on localhost - test on HTTPS
- Users can manually enable notifications in browser settings

### No FCM Token
- Verify VAPID key is correct and added to environment variables
- Ensure Firebase project has Cloud Messaging enabled
- Check network connectivity and Firebase project configuration
