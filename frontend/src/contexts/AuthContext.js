import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Mock Firebase authentication for testing
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email, password) => {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'test@example.com' && password === 'password') {
      return {
        user: {
          uid: 'mock-user-123',
          email: 'test@example.com',
          displayName: 'Test User',
          getIdToken: async () => 'mock-firebase-token-123'
        }
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },
  createUserWithEmailAndPassword: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        uid: 'mock-user-123',
        email: email,
        displayName: email.split('@')[0],
        getIdToken: async () => 'mock-firebase-token-123'
      }
    };
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  onAuthStateChanged: (callback) => {
    // Simulate initial auth state
    setTimeout(() => callback(null), 100);
    return () => {}; // unsubscribe function
  }
};

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
      const result = await mockAuth.createUserWithEmailAndPassword(email, password);
      const user = result.user;
      
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
      const result = await mockAuth.signInWithEmailAndPassword(email, password);
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
      // Mock Google sign-in - simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate OAuth flow
      
      const result = await mockAuth.createUserWithEmailAndPassword('google@example.com', 'google');
      setCurrentUser(result.user);
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
      await mockAuth.signOut();
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
    const unsubscribe = mockAuth.onAuthStateChanged((user) => {
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
