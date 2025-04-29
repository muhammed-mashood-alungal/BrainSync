
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { env } from './env.config';

const firebaseConfig = {
  apiKey:env.FIREBASE_API_KEY! ,
  authDomain: env.FIREBASE_AUTH_DOMAIN!,
  projectId: env.FIREBASE_PROJECT_ID! || 'brainsync-f91d6',
  storageBucket: env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: env.FIREBASE_MESSSAGE_SENDER_ID!,
  appId: env.FIREBASE_APP_ID!,
  measurementId: env.FIREBASE_MEASUREMENT_ID!,
  databaseURL:env.FIREBASE_DATABASE_URL! ,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDB = getDatabase(app);
export { app, firebaseDB };
