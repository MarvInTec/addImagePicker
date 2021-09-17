import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA3jVL5zEP812Ppx5TS5WbiRDnuoKblT30",
    authDomain: "soulcode-4d4a5.firebaseapp.com",
    projectId: "soulcode-4d4a5",
    storageBucket: "soulcode-4d4a5.appspot.com",
    messagingSenderId: "77750976064",
    appId: "1:77750976064:web:14d2afacd8ab46005e29a5",
    measurementId: "G-C4XB49DMR0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const storage = firebase.storage();
  export default {
      db, firebase, storage
  }