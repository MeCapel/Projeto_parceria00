import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 
declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}
 
// Ativa modo debug (necessário em localhost)
if (typeof window !== "undefined") {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
 
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
 
// Inicializa App Check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.APP_CHECK_PROVIDER),
  isTokenAutoRefreshEnabled: true
});
 
export { app, appCheck };
export const auth = getAuth(app);
export const db = getFirestore(app);