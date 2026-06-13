// Firebase Configuration - IIFE to avoid redeclaration if script loads twice
(function () {
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

  // Initialize Firebase (CDN SDK is loaded via <script> in the HTML head)
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
  }

  // Helper accessors
  window.getFirebaseAuth = window.getFirebaseAuth || function () {
    if (typeof firebase !== 'undefined') return firebase.auth();
    console.error('Firebase not loaded');
    return null;
  };

  window.getFirebaseDB = window.getFirebaseDB || function () {
    if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
      return firebase.firestore();
    }
    console.error('Firestore not loaded');
    return null;
  };
})();
