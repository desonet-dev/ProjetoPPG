import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGY4a1Hsj6CnzkjtLZv_LSiIf3yNueciM",
  authDomain: "projetoppg.firebaseapp.com",
  projectId: "projetoppg",
  storageBucket: "projetoppg.firebasestorage.app",
  messagingSenderId: "513133137574",
  appId: "1:513133137574:web:b0cc099afaa252d0cbee67"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);