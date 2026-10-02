import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC97jFFsEawtLb2yxFIHGtNO1MsU15jgo8",
  authDomain: "projeto-ppg.firebaseapp.com",
  projectId: "projeto-ppg",
  storageBucket: "projeto-ppg.firebasestorage.app",
  messagingSenderId: "204179425449",
  appId: "1:204179425449:web:4e60ede51690413e68c1b8"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);