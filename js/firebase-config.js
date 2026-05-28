// Firebase Configuration - IIFE to avoid redeclaration if script loads twice
(function() {
  if (typeof window.firebaseConfig === 'undefined') {
    window.firebaseConfig = {
      apiKey: "AIzaSyB3A2CkSIlAQFP0QShi1GFhT8ds3WA1bAA",
      authDomain: "alcura-id.firebaseapp.com",
      projectId: "alcura-id",
      storageBucket: "alcura-id.firebasestorage.app",
      messagingSenderId: "978633752737",
      appId: "1:978633752737:web:3b7418f607a52c711270e0"
    };
  }

  // Create global reference for backward compatibility
  if (typeof window.firebaseConfig !== 'undefined') {
    window.firebaseConfig = window.firebaseConfig;
  }

  // Initialize Firebase (loaded dynamically via CDN in HTML)
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length && typeof window.firebaseConfig !== 'undefined') {
      firebase.initializeApp(window.firebaseConfig);
    }
  }

  // Export helper functions to window
  if (typeof window.getFirebaseAuth === 'undefined') {
    window.getFirebaseAuth = () => {
      if (typeof firebase !== 'undefined') {
        return firebase.auth();
      }
      console.error('Firebase not loaded');
      return null;
    };
  }

  if (typeof window.getFirebaseDB === 'undefined') {
    window.getFirebaseDB = () => {
      if (typeof firebase !== 'undefined') {
        return firebase.database();
      }
      console.error('Firebase not loaded');
      return null;
    };
  }
})();
