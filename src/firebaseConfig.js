// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqg-22Oo2js7Dj6_zYwZFG6_ZgYOm6GsA",
  authDomain: "productsinventory-fedcapstone.firebaseapp.com",
  projectId: "productsinventory-fedcapstone",
  storageBucket: "productsinventory-fedcapstone.firebasestorage.app",
  messagingSenderId: "450693775318",
  appId: "1:450693775318:web:b31b8bc1e7b95a9221ae77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const fireDB = getFirestore(app); // Firestore Database
const auth = getAuth(app); // Authentication

// Export Firebase services
export { fireDB, auth };
