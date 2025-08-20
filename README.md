This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- 🔐 **Firebase Authentication** - Email/password and Google OAuth
- 📱 **Push Notifications** - Firebase Cloud Messaging (FCM) web push notifications  
- 🎨 **Modern UI** - Tailwind CSS styling
- 🔒 **Protected Routes** - Private dashboard with authentication
- ⚡ **Next.js 15** - Latest Next.js with App Router

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy the environment example:
   ```bash
   cp .env.local.example .env
   ```

2. Update `.env` with your Firebase configuration values

3. Check your configuration:
   ```bash
   npm run check-config
   ```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Push Notifications

This project includes full FCM (Firebase Cloud Messaging) support for web push notifications.

### Quick Setup
1. Enable Cloud Messaging in your Firebase project
2. Generate a VAPID key in Firebase Console
3. Add it to your `.env` file
4. Run `npm run generate-sw` to create the service worker

See [FCM_SETUP.md](./FCM_SETUP.md) for detailed instructions.

### Usage
```tsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { permission, requestPermission } = useNotifications();
  
  return (
    <button onClick={requestPermission}>
      Enable Notifications
    </button>
  );
}
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
