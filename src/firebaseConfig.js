// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQELYhekopmx9fBKO3sam9VEW5vBXMSto",
  authDomain: "blockchain-518cf.firebaseapp.com",
  projectId: "blockchain-518cf",
  storageBucket: "blockchain-518cf.firebasestorage.app",
  messagingSenderId: "887961412449",
  appId: "1:887961412449:web:5167a2a898c3bf84309b20",
  measurementId: "G-MQ2WKS3PRG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

export { storage };