// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgOGglwzFPx2_RgE6X8IJuHIwHqYdbK8M",
  authDomain: "ruaconkg-f4802.firebaseapp.com",
  projectId: "ruaconkg-f4802",
  storageBucket: "ruaconkg-f4802.appspot.com",
  messagingSenderId: "205669129959",
  appId: "1:205669129959:web:7c61c63b13acca071e8c42",
  measurementId: "G-Y3QVDQRMNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };