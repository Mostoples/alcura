// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfN0-xyzYourApiKeyHere",
  authDomain: "alcura-id.firebaseapp.com",
  projectId: "alcura-id",
  storageBucket: "alcura-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
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
