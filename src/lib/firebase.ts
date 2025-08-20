"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import { getMessaging, type Messaging } from "firebase/messaging";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let firebaseMessaging: Messaging | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;
  if (getApps().length) {
    firebaseApp = getApp();
  } else {
    // minotau4@gmail.com
    firebaseApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  return firebaseApp;
}

export function getFirebaseAuth(): Auth {
  if (firebaseAuth) return firebaseAuth;
  const app = getFirebaseApp();
  firebaseAuth = getAuth(app);
  // Ensure local persistence in the browser
  setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {
    // no-op; default persistence will be used if this fails
  });
  return firebaseAuth;
}

export function getFirebaseMessaging(): Messaging {
  if (firebaseMessaging) return firebaseMessaging;
  const app = getFirebaseApp();
  firebaseMessaging = getMessaging(app);
  return firebaseMessaging;
}


