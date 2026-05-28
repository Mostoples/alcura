// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3A2CkSIlAQFP0QShi1GFhT8ds3WA1bAA",
  authDomain: "alcura-id.firebaseapp.com",
  projectId: "alcura-id",
  storageBucket: "alcura-id.firebasestorage.app",
  messagingSenderId: "978633752737",
  appId: "1:978633752737:web:3b7418f607a52c711270e0"
};

// Initialize Firebase (loaded dynamically via CDN in HTML)
// Configuration will be set when Firebase SDK loads
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

// Export config for use in other modules
const getFirebaseAuth = () => {
  if (typeof firebase !== 'undefined') {
    return firebase.auth();
  }
  console.error('Firebase not loaded');
  return null;
};

const getFirebaseDB = () => {
  if (typeof firebase !== 'undefined') {
    return firebase.database();
  }
  console.error('Firebase not loaded');
  return null;
};
