// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA540s3U1xS0l64v6ynL3DANnjNsK5q2YY",
  authDomain: "gymshare-2cbf8.firebaseapp.com",
  projectId: "gymshare-2cbf8",
  storageBucket: "gymshare-2cbf8.appspot.com",
  messagingSenderId: "193414617192",
  appId: "1:193414617192:web:e4d26c6b5b8f52953e03dd",
  measurementId: "G-CBH9RQHMQH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
