// Firebase Authentication + Firestore Handler
class AlcuraAuth {
  constructor() {
    this.auth = null;
    this.currentUser = null;
    this.initialized = false;
    this.initAuth();
  }

  initAuth() {
    // Wait for Firebase to be loaded
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded');
      return;
    }

    // Make sure the app is initialized (CDN config may load after this script)
    if (!firebase.apps.length && typeof window.firebaseConfig !== 'undefined') {
      firebase.initializeApp(window.firebaseConfig);
    }

    this.auth = firebase.auth();

    // The app intentionally does NOT persist user/activity data to Firestore.
    // Profile info (name/avatar) comes from Firebase Auth + localStorage only,
    // so no login-activity documents are ever written.

    this.setupAuthListener();
    this.initialized = true;
  }

  setupAuthListener() {
    if (!this.auth) return;

    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        localStorage.setItem('alcuraUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }));
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
      } else {
        localStorage.removeItem('alcuraUser');
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
      }
    });
  }

  // Sign in with Google
  signInWithGoogle() {
    if (!this.auth) return Promise.reject(new Error('Auth not initialized'));

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    return this.auth.signInWithPopup(provider)
      .then((result) => {
        console.log('Google sign-in successful:', result.user.email);
        return result.user;
      })
      .catch((error) => {
        console.error('Google sign-in error:', error.message);
        throw error;
      });
  }

  // Sign in with email/password
  signInWithEmail(email, password) {
    if (!this.auth) return Promise.reject(new Error('Auth not initialized'));

    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Email sign-in successful:', result.user.email);
        return result.user;
      })
      .catch((error) => {
        console.error('Email sign-in error:', error.message);
        throw error;
      });
  }

  // Create account with email/password
  createAccount(email, password, displayName) {
    if (!this.auth) return Promise.reject(new Error('Auth not initialized'));

    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // Update the Firebase Auth profile only (no Firestore persistence)
        return result.user.updateProfile({ displayName })
          .then(() => result.user);
      })
      .catch((error) => {
        console.error('Account creation error:', error.message);
        throw error;
      });
  }

  // Sign out
  signOut() {
    if (!this.auth) return Promise.reject(new Error('Auth not initialized'));

    return this.auth.signOut()
      .then(() => {
        console.log('Sign-out successful');
      })
      .catch((error) => {
        console.error('Sign-out error:', error.message);
        throw error;
      });
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user from localStorage (for offline check)
  getCachedUser() {
    const cached = localStorage.getItem('alcuraUser');
    return cached ? JSON.parse(cached) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null || this.getCachedUser() !== null;
  }

  // Get user ID token
  getIdToken() {
    if (!this.currentUser) return Promise.reject(new Error('No user logged in'));
    return this.currentUser.getIdToken();
  }
}

// Create global instance with delay to ensure Firebase SDK loaded
let alcuraAuth;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    alcuraAuth = new AlcuraAuth();
  });
} else {
  alcuraAuth = new AlcuraAuth();
}

// Utility function to redirect if not authenticated
function requireAuth() {
  if (!alcuraAuth.isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Utility function to redirect if authenticated
function requireGuest() {
  if (alcuraAuth.isAuthenticated()) {
    window.location.href = '/pages/dashboard.html';
    return false;
  }
  return true;
}
