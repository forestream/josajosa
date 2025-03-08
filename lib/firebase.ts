// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8Dy7R5h0dxKEifzkz6ekv0YJBLzus5Ag",
  authDomain: "josajosa-bd7c2.firebaseapp.com",
  projectId: "josajosa-bd7c2",
  storageBucket: "josajosa-bd7c2.firebasestorage.app",
  messagingSenderId: "168346814772",
  appId: "1:168346814772:web:5b03ecef820fa974a2bd61",
  measurementId: "G-7XK617RE4F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export let analytics: Analytics;
(async () => {
  if (await isSupported()) analytics = getAnalytics(app);
})();
export const db = getFirestore(app);
