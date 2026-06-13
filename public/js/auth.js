// Firebase Authentication + Firestore Handler
class AlcuraAuth {
  constructor() {
    this.auth = null;
    this.db = null;
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

    // Firestore is optional — only wire it up if the SDK is present
    if (typeof firebase.firestore === 'function') {
      try {
        this.db = firebase.firestore();
      } catch (e) {
        console.warn('Firestore not available:', e.message);
      }
    } else {
      console.warn('Firestore SDK not loaded — user data will not be saved to Firestore.');
    }

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

  // Create / merge the user's profile document in Firestore.
  // Never blocks the auth flow: resolves even if Firestore is unavailable or denied.
  saveUserToFirestore(user, extra = {}) {
    if (!this.db || !user) return Promise.resolve(null);

    const ref = this.db.collection('users').doc(user.uid);
    const providerId = (user.providerData && user.providerData[0] && user.providerData[0].providerId) || 'password';

    const ts = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      uid: user.uid,
      email: user.email || '',
      displayName: extra.displayName || user.displayName || '',
      photoURL: user.photoURL || '',
      provider: extra.provider || providerId,
      lastLoginAt: ts,
      updatedAt: ts
    };

    const writeNew = () => ref.set(Object.assign({ createdAt: ts, role: 'user' }, data), { merge: true });
    const writeExisting = () => ref.set(data, { merge: true });

    // Decide create-vs-update from the existing doc; if the read is blocked or
    // offline, still write the document (treating it as new) so data is saved.
    return ref.get()
      .then((snap) => (snap.exists ? writeExisting() : writeNew()))
      .catch(() => writeNew())
      .then(() => {
        console.log('✓ User saved to Firestore:', user.uid);
        return user;
      })
      .catch((error) => {
        // Don't break login if the write itself is denied/offline — log it.
        console.warn('Could not save user to Firestore:', error.code || error.message);
        return user;
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
        return this.saveUserToFirestore(result.user, { provider: 'google.com' })
          .then(() => result.user);
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
        return this.saveUserToFirestore(result.user, { provider: 'password' })
          .then(() => result.user);
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
        // Update Firebase Auth profile, then persist to Firestore
        return result.user.updateProfile({ displayName })
          .then(() => this.saveUserToFirestore(result.user, { displayName, provider: 'password' }))
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
