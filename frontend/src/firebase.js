// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU65TI5aX2ncXFFBW37LGc0LlIST04ZUc",
  authDomain: "scribe-449619.firebaseapp.com",
  projectId: "scribe-449619",
  storageBucket: "scribe-449619.firebasestorage.app",
  messagingSenderId: "524818858620",
  appId: "1:524818858620:web:3099919058718538653ff9",
  measurementId: "G-J7KLWKWDCX"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, collection, addDoc };