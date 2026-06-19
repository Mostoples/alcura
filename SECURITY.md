# ALCURA — Keamanan

## Ringkasan

| Aspek | Status |
|---|---|
| Gemini API key | **Hanya di server** (Cloud Function + Secret Manager). Tidak pernah dikirim ke browser, tidak pernah masuk git. |
| Autentikasi AI | Setiap permintaan ke `/api/chat` butuh **Firebase ID token** user yang login. |
| Firestore | Rules ketat: user hanya bisa baca/tulis dokumen miliknya sendiri. |
| HTTP headers | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. |
| Rahasia di git | `.env`, `.secret.local`, `node_modules/` di-ignore. |

## Arsitektur API key (penting)

Situs ini statik, jadi **apa pun yang ada di JS browser bisa dilihat publik**. Karena itu key Gemini TIDAK ditaruh di client. Alurnya:

```
Browser (ai-chat.html)
   │  POST /api/chat  + Authorization: Bearer <Firebase ID token>
   ▼
Cloud Function "chat"  (functions/index.js)
   │  - verifikasi ID token (admin.auth().verifyIdToken)
   │  - ambil key dari Secret Manager (GEMINI_KEY)
   ▼
Gemini API (server-to-server)
```

## Cara setup & deploy

> Cloud Functions butuh paket **Blaze** (pay-as-you-go) di Firebase. Penggunaan kecil praktis gratis, tapi billing harus aktif.

```bash
# 1. Install dependency function
cd functions && npm install && cd ..

# 2. Simpan API key ke Secret Manager (TIDAK tersimpan di file mana pun)
firebase functions:secrets:set GEMINI_KEY
#   -> tempel API key Gemini saat diminta

# 3. Deploy
firebase deploy --only functions,hosting,firestore:rules
```

### Menjalankan lokal (emulator)
```bash
# Beri key ke emulator lewat file lokal yang sudah di-gitignore:
echo "GEMINI_KEY=PASTE_KEY_DISINI" > functions/.env
firebase emulators:start
```
`functions/.env` ada di `.gitignore` — jangan pernah di-commit.

## Lapisan keamanan tambahan (disarankan)

1. **Batasi API key di Google Cloud Console** sebagai pertahanan berlapis:
   *APIs & Services → Credentials → key Gemini → API restrictions → hanya "Generative Language API".*
2. **App Check** (opsional) untuk memastikan request hanya dari aplikasi resmi.
3. **Data perangkat** sebaiknya disimpan per-user di `users/{uid}/devices/...` (sudah diizinkan rules), bukan koleksi root `devices` (saat ini ditolak rules demi keamanan). Sesuaikan firmware/engine bila menghubungkan hardware nyata.

## Kalau TIDAK memakai Blaze / Cloud Functions

Alternatif minimum (kurang aman — key tetap terlihat publik): taruh key di `public/js/secrets.js` yang di-gitignore lalu batasi key dengan **HTTP referrer restriction** ke domain Anda di Google Cloud Console. Ini hanya mempersulit, tidak menyembunyikan. Pendekatan proxy di atas tetap yang direkomendasikan.
