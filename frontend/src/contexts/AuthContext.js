import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  async function signup(email, password, displayName) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName || user.email.split('@')[0],
        createdAt: new Date(),
        uid: user.uid,
        balances: {
          usd: 1000,
          eur: 0,
          gbp: 0,
          jpy: 0,
          aud: 0,
          cad: 0,
          mxn: 0
        }
      });
      
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  // Sign in with email and password
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user);
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create or update user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        createdAt: new Date(),
        uid: user.uid,
        photoURL: user.photoURL,
        balances: {
          usd: 1000,
          eur: 0,
          gbp: 0,
          jpy: 0,
          aud: 0,
          cad: 0,
          mxn: 0
        }
      }, { merge: true }); // Use merge to update if exists
      
      setCurrentUser(user);
      toast.success('Welcome to Warp!');
      return result;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  // Sign out
  async function logout() {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  // Get current user's ID token
  async function getIdToken() {
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
