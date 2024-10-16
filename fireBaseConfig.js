// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQrAFKiigBdyRYAleaytgymQfaz9DKu4U",
  authDomain: "db-app-capy3ra.firebaseapp.com",
  projectId: "db-app-capy3ra",
  storageBucket: "db-app-capy3ra.appspot.com",
  messagingSenderId: "342491331500",
  appId: "1:342491331500:web:40828663053aa819a11809"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)