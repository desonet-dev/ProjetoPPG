import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Cole aqui a configuração do seu app (Firebase Console → Configurações do projeto → Seus apps)
const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  appId: "COLE_AQUI",
};

export const auth = getAuth(initializeApp(firebaseConfig));
