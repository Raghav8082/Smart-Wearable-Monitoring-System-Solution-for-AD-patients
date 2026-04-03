import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBcC0mzPLM8-Sk_GI5MS4Jjfcb-WE85-QU',
  authDomain: 'iotmedicaldiagnosis.firebaseapp.com',
  databaseURL: 'https://iotmedicaldiagnosis-default-rtdb.firebaseio.com',
  projectId: 'iotmedicaldiagnosis',
  storageBucket: 'iotmedicaldiagnosis.firebasestorage.app',
  messagingSenderId: '183747678404',
  appId: '1:183747678404:web:4dad2ca23c333f0dd1f991',
  measurementId: 'G-Z4Y5XYL87Y',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
