import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
const firebaseConfig = {
    apiKey: "AIzaSyBUqvUymKLeSQSyEGiLCh9Hxh1-eyMv6vw",
    authDomain: "metro-29872.firebaseapp.com",
    // databaseURL: "https://metro-29872-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "metro-29872",
    storageBucket: "metro-29872.firebasestorage.app",
    messagingSenderId: "743150289722",
    appId: "1:743150289722:web:8511e7e5ffd32cc9bb0603",
    measurementId: "G-LTGBJH4MMM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
