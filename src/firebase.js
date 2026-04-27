import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAwP_ZsdryrWOUrqMrWrdGzlt1kqQ71Bh0",
  authDomain: "dcsproject-80c46.firebaseapp.com",
  projectId: "dcsproject-80c46",
  storageBucket: "dcsproject-80c46.firebasestorage.app",
  messagingSenderId: "745006892455",
  appId: "1:745006892455:web:f81e00d7c99b5a685ce282"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app)

export { db }

