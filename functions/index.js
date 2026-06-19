/* ============================================================
   ALCURA — server-side AI proxy (Cloud Functions, 2nd gen)

   Purpose: keep the Gemini API key OFF the client. The browser
   calls /api/chat (Hosting rewrite -> this function) with the
   signed-in user's Firebase ID token; the function verifies the
   token, then calls Gemini using a key stored in Secret Manager.
   The key is never shipped to the browser and never committed.

   Set the secret once (NOT stored in any file in the repo):
     firebase functions:secrets:set GEMINI_KEY
   ============================================================ */
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();

const GEMINI_KEY = defineSecret('GEMINI_KEY');
const MODEL = 'gemini-2.5-flash';
const MAX_CHARS = 16000;   // hard cap on incoming text to limit abuse/cost

exports.chat = onRequest(
  { secrets: [GEMINI_KEY], region: 'us-central1', cors: true, maxInstances: 10 },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // --- AuthN: require a valid Firebase ID token ---
    const authz = req.headers.authorization || '';
    const m = authz.match(/^Bearer (.+)$/);
    if (!m) { res.status(401).json({ error: 'Tidak terautentikasi.' }); return; }
    try {
      await admin.auth().verifyIdToken(m[1]);
    } catch (e) {
      res.status(401).json({ error: 'Sesi tidak valid. Silakan login ulang.' });
      return;
    }

    // --- Validate input ---
    const body = req.body || {};
    const contents = body.contents;
    const system = body.system ? String(body.system) : '';
    if (!Array.isArray(contents) || contents.length === 0) {
      res.status(400).json({ error: 'Permintaan tidak valid.' });
      return;
    }
    const totalChars = system.length + JSON.stringify(contents).length;
    if (totalChars > MAX_CHARS) {
      res.status(413).json({ error: 'Percakapan terlalu panjang. Mulai chat baru.' });
      return;
    }

    // --- Proxy to Gemini ---
    try {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY.value() },
        body: JSON.stringify({
          system_instruction: system ? { parts: [{ text: system }] } : undefined,
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048, topP: 0.95, thinkingConfig: { thinkingBudget: 0 } }
        })
      });
      const j = await r.json();
      if (!r.ok) {
        res.status(r.status === 429 ? 429 : 502).json({ error: (j.error && j.error.message) || 'Layanan AI sedang sibuk.' });
        return;
      }
      const cand = j.candidates && j.candidates[0];
      let reply = cand && cand.content && cand.content.parts && cand.content.parts.map(p => p.text || '').join('');
      if (!reply) {
        const blocked = j.promptFeedback && j.promptFeedback.blockReason;
        reply = blocked ? 'Maaf, permintaan tidak dapat diproses (' + blocked + ').' : 'Maaf, tidak ada jawaban. Coba lagi.';
      }
      res.json({ reply });
    } catch (e) {
      res.status(502).json({ error: 'Gagal menghubungi layanan AI.' });
    }
  }
);
