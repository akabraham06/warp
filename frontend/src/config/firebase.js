import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Mock Firebase configuration for testing
  apiKey: "AIzaSyBvOkBwqKzJzJzJzJzJzJzJzJzJzJzJzJz",
  authDomain: "flux-cross-currency.firebaseapp.com",
  projectId: "flux-cross-currency",
  storageBucket: "flux-cross-currency.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
