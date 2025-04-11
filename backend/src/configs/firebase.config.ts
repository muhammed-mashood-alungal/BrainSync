// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAQTkrDnzSmkrXu_E73yciDaG42fyf8xdI',
  authDomain: 'brainsync-f91d6.firebaseapp.com',
  projectId: 'brainsync-f91d6',
  storageBucket: 'brainsync-f91d6.firebasestorage.app',
  messagingSenderId: '1015056107512',
  appId: '1:1015056107512:web:70d295458e40ba1e8bf80d',
  measurementId: 'G-L8WHMWZD9T',
  databaseURL: 'https://brainsync-f91d6-default-rtdb.firebaseio.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseDB = getDatabase(app);
export { app, firebaseDB };
