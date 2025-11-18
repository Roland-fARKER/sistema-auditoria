import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhkUROIiimbCWM_tuI-Ahq15dJmqTE1-s",
  authDomain: "nova-b364a.firebaseapp.com",
  projectId: "nova-b364a",
  storageBucket: "nova-b364a.appspot.com",
  messagingSenderId: "544247291865",
  appId: "1:544247291865:web:d178a325973e108064c3c8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
