// src/lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

let firebaseApp: FirebaseApp;

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  // Optional: Initialize Analytics if needed
  // if (typeof window !== 'undefined') {
  //   getAnalytics(firebaseApp);
  // }
} else {
  firebaseApp = getApps()[0];
}

const auth = getAuth(firebaseApp);
// const db = getFirestore(firebaseApp);
// const storage = getStorage(firebaseApp);

export { firebaseApp, auth /*, db, storage */ };
