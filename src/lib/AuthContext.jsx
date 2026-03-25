
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase';
import { 
  signInAnonymously, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  linkWithPopup
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in (could be Anonymous or Google)
        setUser(firebaseUser);
      } else {
        // 1. SIGN OUT DETECTED: 
        // We manually clear the user first so the UI resets
        setUser(null); 
        
        try {
          // 2. BLANK SLATE: Create a brand new anonymous identity
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous Auth Failed:", error);
        }
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      // If they are currently a guest, link the guest ID to the Google ID
      if (user?.isAnonymous) {
        await linkWithPopup(user, provider);
        // Firebase automatically updates the 'user' object to no longer be anonymous
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      if (error.code === 'auth/credential-already-in-use') {
        // If the Google account is already linked to another ID, just log into that one
        await signInWithPopup(auth, provider);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const isAnonymous = user?.isAnonymous || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAnonymous,
      isAuthenticated: !!user,
      isLoadingAuth,
      authError,
      loginWithGoogle,
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