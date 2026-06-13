// Small shared helpers for the login/register pages:
// inline messages, button loading state, and friendly error text.

function getAuthMsgEl() {
  return document.getElementById('authMsg');
}

function showAuthMsg(text, type) {
  const el = getAuthMsgEl();
  if (!el) return;
  el.textContent = text;
  el.className = 'auth-msg ' + (type || 'error');
  el.hidden = false;
}

function clearAuthMsg() {
  const el = getAuthMsgEl();
  if (!el) return;
  el.hidden = true;
  el.textContent = '';
}

function setBtnLoading(btn, text) {
  if (!btn) return;
  if (!btn.dataset.original) btn.dataset.original = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('is-loading');
  btn.innerHTML = '<i class="ph ph-circle-notch spin"></i> ' + text;
}

function resetBtn(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.classList.remove('is-loading');
  if (btn.dataset.original) btn.innerHTML = btn.dataset.original;
}

// Guard: make sure the auth layer finished initializing before we use it.
function authReady(btnId) {
  if (typeof alcuraAuth === 'undefined' || !alcuraAuth.initialized || !alcuraAuth.auth) {
    showAuthMsg('Sistem belum siap. Tunggu sebentar lalu coba lagi.', 'error');
    console.error('alcuraAuth not ready', typeof alcuraAuth !== 'undefined' ? alcuraAuth : null);
    return false;
  }
  return true;
}

// Map Firebase error codes to clear Indonesian messages.
function friendlyAuthError(error) {
  const code = (error && error.code) || '';
  const map = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
    'auth/user-not-found': 'Akun dengan email ini tidak ditemukan.',
    'auth/wrong-password': 'Password salah. Coba lagi.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/invalid-login-credentials': 'Email atau password salah.',
    'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
    'auth/weak-password': 'Password terlalu lemah (minimal 6 karakter).',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
    'auth/network-request-failed': 'Koneksi bermasalah. Periksa internet Anda.',
    'auth/popup-closed-by-user': 'Jendela Google ditutup sebelum selesai.',
    'auth/cancelled-popup-request': 'Permintaan login dibatalkan.',
    'auth/popup-blocked': 'Popup diblokir browser. Izinkan popup lalu coba lagi.',
    'auth/operation-not-allowed': 'Metode login ini belum diaktifkan di Firebase Console.',
    'auth/unauthorized-domain': 'Domain ini belum diizinkan di Firebase (Authorized domains).',
    'auth/invalid-api-key': 'Konfigurasi Firebase tidak valid.'
  };
  return map[code] || (error && error.message) || 'Terjadi kesalahan. Coba lagi.';
}
