/* ============================================================
   ALCURA — shared Gemini client (text + vision)
   One transport reused by AI Chat, AI Vision Scan & Daily Briefing.
   Keys come from js/ai-secret.js (window.ALCURA_AI_DEV_KEYS),
   gitignored-but-deployed. Auto-rotates keys on quota/limit.

   API (window.ALCURA_AI):
     .ready()                 -> boolean, any key present
     .generate({system, contents, generationConfig}) -> Promise<string>
     .text(prompt, system?)   -> Promise<string>   (single user turn)
     .vision(prompt, {mime,data}, system?) -> Promise<string> (image+text)
   ============================================================ */
(function () {
  'use strict';
  var ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  function keys() {
    return Array.isArray(window.ALCURA_AI_DEV_KEYS) ? window.ALCURA_AI_DEV_KEYS.filter(Boolean)
      : (typeof window.ALCURA_AI_DEV_KEY === 'string' && window.ALCURA_AI_DEV_KEY ? [window.ALCURA_AI_DEV_KEY] : []);
  }
  var idx = (function () { var n = parseInt(localStorage.getItem('alcuraKeyIdx') || '0', 10); return n >= 0 ? n : 0; })();

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function isLimit(s) { return s === 429 || s === 403 || s === 401 || s === 400; }
  function extract(j) {
    var c = j && j.candidates && j.candidates[0];
    var t = c && c.content && c.content.parts && c.content.parts.map(function (p) { return p.text || ''; }).join('');
    if (!t) { var b = j && j.promptFeedback && j.promptFeedback.blockReason; if (b) t = '(diblokir: ' + b + ')'; }
    return t || '';
  }

  function generate(opts) {
    opts = opts || {};
    var K = keys();
    if (!K.length) return Promise.reject(new Error('API key belum tersedia (js/ai-secret.js).'));
    if (idx >= K.length) idx = 0;
    var body = {
      contents: opts.contents || [],
      generationConfig: Object.assign({ temperature: 0.7, maxOutputTokens: 1024, topP: 0.95, thinkingConfig: { thinkingBudget: 0 } }, opts.generationConfig || {})
    };
    if (opts.system) body.system_instruction = { parts: [{ text: opts.system }] };

    var attempts = 0, max = K.length + 2;
    function once() {
      attempts++;
      var key = K[idx];
      return fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok) {
            var t = extract(j);
            if (!t) throw new Error('Tidak ada jawaban dari AI.');
            localStorage.setItem('alcuraKeyIdx', String(idx));
            return t;
          }
          if (isLimit(r.status) && attempts < max) {
            idx = (idx + 1) % K.length; localStorage.setItem('alcuraKeyIdx', String(idx));
            return once();
          }
          if (r.status === 503 && attempts < max) return sleep(1200).then(once);
          throw new Error((j.error && j.error.message) || ('Gemini error ' + r.status));
        });
      });
    }
    return once();
  }

  function text(prompt, system) {
    return generate({ system: system, contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  }
  function vision(prompt, img, system) {
    return generate({
      system: system,
      contents: [{ role: 'user', parts: [{ text: prompt }, { inline_data: { mime_type: img.mime, data: img.data } }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 900 }
    });
  }

  window.ALCURA_AI = { ready: function () { return keys().length > 0; }, generate: generate, text: text, vision: vision };
})();
