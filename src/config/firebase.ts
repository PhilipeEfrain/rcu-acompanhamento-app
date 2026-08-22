import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'rcu-acompanhamento-app',
  appId: '1:347514269640:web:0eddf29deb12c4e07a1afd',
  storageBucket: 'rcu-acompanhamento-app.firebasestorage.app',
  apiKey: 'AIzaSyBGSwiEfmVqXSNCrUiJ7buOB81kXS58WcQ',
  authDomain: 'rcu-acompanhamento-app.firebaseapp.com',
  messagingSenderId: '347514269640',
};

// Initialize Firebase without re-initialization error
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
