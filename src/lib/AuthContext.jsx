import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../lib/firebase'; // Ensure this path points to your firebase.js
import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Start as true while checking Firebase
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // 1. Listen for Auth Changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoadingAuth(true);
      
      if (firebaseUser) {
        // User is signed in (either Anonymous or Permanent)
        setUser(firebaseUser);
        setIsLoadingAuth(false);
      } else {
        // No user exists, so let's sign them in Anonymously by default
        try {
          await signInAnonymously(auth);
          // onAuthStateChanged will trigger again once sign-in completes
        } catch (error) {
          console.error("Anonymous Auth Failed:", error);
          setAuthError(error);
          setIsLoadingAuth(false);
        }
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Helper to check if the current user is just a "Guest"
  const isAnonymous = user?.isAnonymous || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAnonymous,
      isAuthenticated: !!user, // Helper: true if user object exists
      isLoadingAuth,
      authError,
      logout,
    }}>
      {!isLoadingAuth && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};