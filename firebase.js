// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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
let auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
