import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/todo-app/',
    define: {
        'process.env': {
            REACT_APP_FIREBASE_API_KEY: "AIzaSyBUqvUymKLeSQSyEGiLCh9Hxh1-eyMv6vw",
            REACT_APP_FIREBASE_AUTH_DOMAIN: "metro-29872.firebaseapp.com",
            REACT_APP_FIREBASE_PROJECT_ID: "metro-29872",
            REACT_APP_FIREBASE_STORAGE_BUCKET: "metro-29872.firebasestorage.app",
            REACT_APP_FIREBASE_MESSAGING_SENDER_ID: "743150289722",
            REACT_APP_FIREBASE_APP_ID: "1:743150289722:web:8511e7e5ffd32cc9bb0603",
            REACT_APP_FIREBASE_MEASUREMENT_ID: "G-LTGBJH4MMM",
        }
    }
});
