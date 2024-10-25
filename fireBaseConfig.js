// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';  // Thêm import này nếu chưa có
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, db, auth };
