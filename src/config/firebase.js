import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzRg6nsE4TZgdvMeeU7Nvjo64k7m8HrrE",
  authDomain: "tiendapasteleriamilsabor-de980.firebaseapp.com",
  projectId: "tiendapasteleriamilsabor-de980",
  storageBucket: "tiendapasteleriamilsabor-de980.appspot.com",
  messagingSenderId: "925496431859",
  appId: "1:925496431859:web:ff7f0ae09b002fe94e5386",
  measurementId: "G-1X6TSB46XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Conectar Firestore
export const db = getFirestore(app);