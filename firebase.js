// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import dotenv from 'dotenv';
import { getFirestore } from 'firebase/firestore';

//TELEGRAM BOT
dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'tele-bible-bot.firebaseapp.com',
  projectId: 'tele-bible-bot',
  storageBucket: 'tele-bible-bot.appspot.com',
  messagingSenderId: '1006295160437',
  appId: '1:1006295160437:web:f9f2df905d248afcb48a3c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
