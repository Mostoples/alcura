# Firebase Authentication Setup Guide

## Prerequisites

Sebelum dapat menggunakan Firebase Authentication, Anda perlu:

1. Project Firebase aktif di https://console.firebase.google.com
2. Credentials Firebase (API Key, Auth Domain, Project ID, dll)

## Step 1: Enable Firebase Authentication

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project "alcura-id"
3. Di sidebar, klik **Authentication**
4. Klik tab **Sign-in method**
5. Enable provider:
   - **Email/Password** — klik enable
   - **Google** — klik enable, setup Google OAuth credentials
6. Klik **Save**

## Step 2: Get Firebase Credentials

1. Di Firebase Console, klik **Project Settings** (ikon gear)
2. Di tab **General**, scroll ke section **Your apps**
3. Cari app **Web** (nama seperti "ALCURA")
4. Copy Firebase SDK config:
   ```javascript
   {
     "apiKey": "YOUR_API_KEY",
     "authDomain": "alcura-id.firebaseapp.com",
     "projectId": "alcura-id",
     "storageBucket": "alcura-id.appspot.com",
     "messagingSenderId": "YOUR_SENDER_ID",
     "appId": "YOUR_APP_ID"
   }
   ```

## Step 3: Update Config Files

Update semua file dengan Firebase credentials:

- `js/firebase-config.js`
- `login.html` (dalam `<script>` tag)
- `register.html` (dalam `<script>` tag)
- `app.html` (dalam `<script>` tag)
- `pages/dashboard.html` (dalam `<script>` tag)
- `pages/settings.html` (dalam `<script>` tag)

Replace nilai-nilai:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← dari credentials
  authDomain: "alcura-id.firebaseapp.com",
  projectId: "alcura-id",
  storageBucket: "alcura-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID", // ← dari credentials
  appId: "YOUR_APP_ID"                 // ← dari credentials
};
```

## Step 4: Setup Google OAuth

Untuk Google Sign-In:

1. Di Firebase Console → Authentication → Sign-in method
2. Klik provider **Google**
3. Pastikan status **Enabled**
4. Input **Project name** dan **Project support email**
5. Klik **Save**

## Step 5: Add Authorized Domains

1. Di Firebase Console → Authentication → Settings
2. Scroll ke **Authorized domains**
3. Tambahkan domain:
   - `alcura-id.web.app` (production)
   - `localhost:5000` (testing dengan emulator)
   - Domain custom jika ada

## Step 6: Test Locally (Opsional)

Untuk test dengan Firebase Emulator:

```bash
firebase emulators:start --only auth,hosting
```

Browser akan buka `http://localhost:5000`

## Features yang Sudah Setup

✅ **Email/Password Sign-In** — `login.html`
- Form email + password
- Create account di `register.html`
- Remember me checkbox (localStorage)

✅ **Google Sign-In** — Semua auth pages
- Button "Google" untuk instant login
- Redirect ke dashboard otomatis

✅ **Protected Pages**
- Dashboard & semua pages cek authentication
- Redirect ke login jika belum auth
- Persist session via localStorage

✅ **Logout**
- Button di `pages/settings.html`
- Clear session, redirect ke login

✅ **User Info Display**
- Display nama user di header
- Auto-update saat login/logout

## Flow Diagram

```
Landing (index.html)
    ↓
    ├→ Login (login.html)
    │   ├→ Email/Password sign-in
    │   ├→ Google sign-in
    │   └→ Register (register.html)
    │
    └→ Dashboard (app.html / pages/dashboard.html)
        ├→ Air Quality
        ├→ Culture Health
        ├→ Controls
        ├→ Alerts
        ├→ Impact Report
        └→ Settings (Logout)
```

## Troubleshooting

### "Firebase not loaded" error
- Pastikan Firebase SDK CDN link ada di `<head>`
- Check network tab di DevTools

### Google Sign-In tidak berfungsi
- Verify Google OAuth credentials di Firebase Console
- Check Authorized domains
- Clear browser cache

### Logout tidak bekerja
- Check console untuk error message
- Verify `handleLogout()` function di settings.html

### Session hilang saat refresh
- Check localStorage di DevTools → Application → Local Storage
- Verify `alcuraUser` key tersimpan

## Next Steps

1. Daftarkan Google OAuth credentials (jika belum)
2. Update Firebase config di semua files
3. Deploy ulang ke Firebase Hosting:
   ```bash
   firebase deploy
   ```
4. Test sign-in flow di production: https://alcura-id.web.app

## Debugging Checklist

Jika Google login tidak berfungsi, ikuti checklist ini:

### 1. Check Firebase Config
```bash
# Buka browser DevTools → Console
# Paste:
console.log('Firebase config:', firebaseConfig)
console.log('Firebase initialized:', firebase.apps.length > 0)
```

**Expected output:**
```
Firebase config: {apiKey: "...", authDomain: "alcura-id.firebaseapp.com", ...}
Firebase initialized: true
```

**If error:**
- Credentials belum diupdate di login.html
- Firebase SDK tidak load

### 2. Check Auth Instance
```bash
# Di Console:
console.log('Auth instance:', alcuraAuth.auth)
console.log('Auth initialized:', alcuraAuth.initialized)
```

**Expected output:**
```
Auth instance: Auth {config: {...}, currentUser: null, ...}
Auth initialized: true
```

**If error:**
- Firebase SDK not loaded
- Config invalid

### 3. Check Google OAuth Setup
```bash
# Di Firebase Console:
# 1. Authentication → Sign-in method
# 2. Cek Google provider status → harus "Enabled"
# 3. Jika "Disabled" → klik enable
```

### 4. Add Authorized Domain
```bash
# Di Firebase Console:
# 1. Authentication → Settings
# 2. Scroll ke "Authorized domains"
# 3. Tambahkan:
#    - alcura-id.web.app (production)
#    - localhost:5000 (testing lokal)
```

### 5. Check Browser Console Errors
```bash
# Buka DevTools → Console
# Klik tombol "Google" di login page
# Lihat error messages
```

**Common errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `auth/invalid-api-key` | API key tidak valid | Update credentials dari Firebase |
| `auth/operation-not-allowed` | Google provider disabled | Enable di Firebase Console |
| `auth/unauthorized-domain` | Domain belum authorized | Add ke Authorized domains |
| `Firebase not loaded` | SDK tidak load | Check CDN link di `<head>` |
| `Auth not initialized` | Firebase config invalid | Update config dengan credentials |

### 6. Test Step by Step
1. Buka https://alcura-id.web.app/login.html
2. Di Console ketik: `alcuraAuth.signInWithGoogle()`
3. Lihat error message (jika ada)
4. Perbaiki sesuai error

## Support

Untuk bantuan lebih lanjut:
- Firebase Docs: https://firebase.google.com/docs/auth
- Google OAuth: https://firebase.google.com/docs/auth/web/google-signin
- Troubleshooting: https://firebase.google.com/support
- Stack Overflow: https://stackoverflow.com/questions/tagged/firebase-authentication
