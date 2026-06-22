/* ============================================================
   ALCURA — Trilingual i18n (English / Indonesia / 日本語)
   • Cycles EN → ID → JA on the button next to the theme toggle.
   • Translates ALL static text via a dictionary keyed by source
     phrase (works regardless of the phrase's original language).
   • Skips dynamic [data-bind]/[data-sensor] values, the SVG stage
     and the spark chart. Preserves leading/trailing whitespace so
     phrases wrapped around dynamic numbers translate cleanly.
   • Dispatches `alcura:lang` so sensors-engine / greeting / chat
     can re-render their generated text in the chosen language.
   ============================================================ */
(function () {
  var LANGS = ['en', 'id', 'ja'];
  var LABEL = { en: 'EN', id: 'ID', ja: 'JA' };

  // source phrase -> [en, id, ja]
  var D = {
    // ---- nav / shell ----
    'Home': ['Home', 'Beranda', 'ホーム'],
    'Air': ['Air', 'Udara', '空気'],
    'Alerts': ['Alerts', 'Peringatan', '通知'],
    'More': ['More', 'Lainnya', 'その他'],
    'Sensor': ['Sensor', 'Sensor', 'センサー'],
    'Sensors': ['Sensors', 'Sensor', 'センサー'],
    'Kontrol': ['Controls', 'Kontrol', 'コントロール'],
    'Pengaturan': ['Settings', 'Pengaturan', '設定'],
    'Tanya AI': ['Ask AI', 'Tanya AI', 'AIに質問'],
    'Online': ['Online', 'Online', 'オンライン'],
    'ALCURA · Living Room': ['ALCURA · Living Room', 'ALCURA · Ruang Tamu', 'ALCURA · リビング'],

    // ---- dashboard ----
    'Selamat datang 👋': ['Welcome 👋', 'Selamat datang 👋', 'ようこそ 👋'],
    'HEALTH': ['HEALTH', 'KESEHATAN', '健康度'],
    'Air Quality': ['Air Quality', 'Kualitas Udara', '空気の質'],
    'Day 25 / 30': ['Day 25 / 30', 'Hari 25 / 30', '25 / 30 日目'],
    'Exponential growth': ['Exponential growth', 'Pertumbuhan eksponensial', '指数的成長'],
    'diproduksi hari ini': ['produced today', 'diproduksi hari ini', '本日生成'],
    'Photobioreactor Live': ['Photobioreactor Live', 'Fotobioreaktor Live', 'フォトバイオリアクター（ライブ）'],
    'Detail': ['Details', 'Detail', '詳細'],
    'Spirulina Culture': ['Spirulina Culture', 'Kultur Spirulina', 'スピルリナ培養'],
    'OD680': ['OD680', 'OD680', 'OD680'],
    'DO mg/L': ['DO mg/L', 'DO mg/L', 'DO mg/L'],
    'LED PAR': ['LED PAR', 'LED PAR', 'LED PAR'],
    'AERASI': ['AERATION', 'AERASI', 'エアレーション'],
    'Metrik Cepat': ['Quick Metrics', 'Metrik Cepat', 'クイック指標'],
    'Semua sensor': ['All sensors', 'Semua sensor', '全センサー'],
    'Suhu Kultur': ['Culture Temp', 'Suhu Kultur', '培養温度'],
    'TDS ppm': ['TDS ppm', 'TDS ppm', 'TDS ppm'],
    'Optimal': ['Optimal', 'Optimal', '最適'],
    'Panen Berikutnya': ['Next Harvest', 'Panen Berikutnya', '次の収穫'],
    'Spirulina siap dalam': ['Spirulina ready in', 'Spirulina siap dalam', 'スピルリナ収穫まで'],
    'hari': ['days', 'hari', '日'],
    'hari lagi': ['days left', 'hari lagi', '日'],
    'Probabilitas kesiapan': ['Readiness probability', 'Probabilitas kesiapan', '準備完了の確率'],
    'Estimasi yield': ['Estimated yield', 'Estimasi yield', '推定収量'],
    'Densitas': ['Density', 'Densitas', '密度'],
    'OD': ['OD', 'OD', 'OD'],
    'Rencanakan Panen': ['Plan Harvest', 'Rencanakan Panen', '収穫を計画'],
    'Dampak Hari Ini': ['Today’s Impact', 'Dampak Hari Ini', '本日のインパクト'],
    'Ringkasan hari ini': ['Today’s summary', 'Ringkasan hari ini', '本日のまとめ'],
    'Hari ini Anda menghirup udara lebih bersih —': ['Today you breathed cleaner air —', 'Hari ini Anda menghirup udara lebih bersih —', '今日はよりきれいな空気を吸いました —'],
    'terserap.': ['absorbed.', 'terserap.', 'を吸収。'],
    'O₂ diproduksi': ['O₂ produced', 'O₂ diproduksi', 'O₂ 生成'],
    'VOC dihapus': ['VOC removed', 'VOC dihapus', 'VOC 除去'],
    'HVAC dihemat': ['HVAC saved', 'HVAC dihemat', 'HVAC 節約'],
    'Tren Udara 24 Jam': ['24-Hour Air Trend', 'Tren Udara 24 Jam', '24時間の空気トレンド'],
    'Rata-rata CO₂': ['Average CO₂', 'Rata-rata CO₂', '平均 CO₂'],
    '23% lebih bersih': ['23% cleaner', '23% lebih bersih', '23% クリーン'],
    'Aksi Cepat': ['Quick Actions', 'Aksi Cepat', 'クイック操作'],
    '13 aktif': ['13 active', '13 aktif', '13 稼働中'],
    'LED': ['LED', 'LED', 'LED'],
    'Aerasi': ['Aeration', 'Aerasi', 'エアレーション'],
    'Mode': ['Mode', 'Mode', 'モード'],
    'Growth': ['Growth', 'Growth', 'グロース'],

    // ---- air quality ----
    'CO₂ Level': ['CO₂ Level', 'Level CO₂', 'CO₂ レベル'],
    'Skor udara': ['Air score', 'Skor udara', '空気スコア'],
    'Baik': ['Good', 'Baik', '良好'],
    'Metrik Udara Lainnya': ['Other Air Metrics', 'Metrik Udara Lainnya', 'その他の空気指標'],
    'Humidity': ['Humidity', 'Kelembapan', '湿度'],
    'Tren 24 Jam': ['24-Hour Trend', 'Tren 24 Jam', '24時間トレンド'],
    'Rata-rata CO₂ turun 23% dibanding kemarin': ['Average CO₂ down 23% vs yesterday', 'Rata-rata CO₂ turun 23% dibanding kemarin', '平均CO₂は昨日比23%減'],
    'Comparison': ['Comparison', 'Perbandingan', '比較'],
    'Dalam Ruangan': ['Indoor', 'Dalam Ruangan', '室内'],
    'Luar Ruangan (est.)': ['Outdoor (est.)', 'Luar Ruangan (est.)', '屋外（推定）'],
    'ALCURA membantu mengurangi CO₂ indoor hingga optimal': ['ALCURA helps reduce indoor CO₂ to optimal', 'ALCURA membantu mengurangi CO₂ indoor hingga optimal', 'ALCURAは室内CO₂を最適まで削減します'],
    'Kualitas udara indoor real-time': ['Real-time indoor air quality', 'Kualitas udara indoor real-time', 'リアルタイム室内空気質'],

    // ---- culture health ----
    'Culture Health': ['Culture Health', 'Kesehatan Kultur', '培養の健康'],
    'Status kultur Spirulina': ['Spirulina culture status', 'Status kultur Spirulina', 'スピルリナ培養の状態'],
    'Biomass Density': ['Biomass Density', 'Densitas Biomassa', 'バイオマス密度'],
    'Kesiapan': ['Readiness', 'Kesiapan', '準備度'],
    '% · panen ~': ['% · harvest ~', '% · panen ~', '% · 収穫まで約'],
    'GROW': ['GROW', 'TUMBUH', '成長'],
    'Culture Parameters': ['Culture Parameters', 'Parameter Kultur', '培養パラメータ'],
    'TDS': ['TDS', 'TDS', 'TDS'],
    'Nutrisi': ['Nutrient', 'Nutrisi', '栄養'],
    'Temperature': ['Temperature', 'Suhu', '温度'],
    'Ideal': ['Ideal', 'Ideal', '理想的'],
    'Chlorophyll': ['Chlorophyll', 'Klorofil', 'クロロフィル'],
    'Healthy': ['Healthy', 'Sehat', '健康'],
    'Culture Photo': ['Culture Photo', 'Foto Kultur', '培養の写真'],
    'Spirulina terlihat hijau pekat — indikator kesehatan optimal': ['Spirulina looks deep green — a sign of optimal health', 'Spirulina terlihat hijau pekat — indikator kesehatan optimal', 'スピルリナは濃い緑色 — 最適な健康の証'],
    'Growth Curve (30 hari)': ['Growth Curve (30 days)', 'Growth Curve (30 hari)', '成長曲線（30日）'],
    'Hari ke-25 dari 30 — Fase pertumbuhan eksponensial': ['Day 25 of 30 — Exponential growth phase', 'Hari ke-25 dari 30 — Fase pertumbuhan eksponensial', '30日中25日目 — 指数的成長期'],
    'Diagnosa & Rekomendasi': ['Diagnosis & Recommendations', 'Diagnosa & Rekomendasi', '診断と推奨'],
    'Status kultur': ['Culture status', 'Status kultur', '培養の状態'],
    'Culture Status': ['Culture Status', 'Status Kultur', '培養の状態'],

    // ---- controls ----
    'Controls': ['Controls', 'Kontrol', 'コントロール'],
    'Atur LED, aerasi & mode': ['Adjust LED, aeration & mode', 'Atur LED, aerasi & mode', 'LED・エアレーション・モードを調整'],
    'LED & Environment': ['LED & Environment', 'LED & Lingkungan', 'LED と環境'],
    'LED Intensity': ['LED Intensity', 'Intensitas LED', 'LED 強度'],
    'Spectrum Tuning': ['Spectrum Tuning', 'Penyetelan Spektrum', 'スペクトル調整'],
    'Red': ['Red', 'Merah', '赤'],
    'Blue': ['Blue', 'Biru', '青'],
    'Green': ['Green', 'Hijau', '緑'],
    'Far-Red': ['Far-Red', 'Merah-Jauh', '遠赤'],
    'UV': ['UV', 'UV', '紫外線'],
    'Aeration Rate': ['Aeration Rate', 'Laju Aerasi', 'エアレーション量'],
    'Advanced Settings': ['Advanced Settings', 'Pengaturan Lanjutan', '詳細設定'],
    'CO₂ Injection': ['CO₂ Injection', 'Injeksi CO₂', 'CO₂ 注入'],
    'Status:': ['Status:', 'Status:', 'ステータス:'],
    'Aktif': ['Active', 'Aktif', '有効'],
    'Mode Preset': ['Mode Preset', 'Preset Mode', 'モードプリセット'],
    'Siang': ['Day', 'Siang', '昼'],
    'Malam': ['Night', 'Malam', '夜'],
    'Simpan Pengaturan': ['Save Settings', 'Simpan Pengaturan', '設定を保存'],
    'AI Auto Mode aktif': ['AI Auto Mode active', 'AI Auto Mode aktif', 'AIオートモード有効'],
    '— Sistem menyesuaikan parameter otomatis dari data sensor.': ['— The system auto-adjusts parameters from sensor data.', '— Sistem menyesuaikan parameter otomatis dari data sensor.', '— システムがセンサーデータからパラメータを自動調整します。'],
    'Auto Mode (AI Optimized)': ['Auto Mode (AI Optimized)', 'Mode Otomatis (AI Optimized)', 'オートモード（AI最適化）'],
    '% bright': ['% bright', '% terang', '% 明るさ'],
    'baru saja': ['just now', 'baru saja', 'たった今'],
    'Online · ditenagai Gemini': ['Online · powered by Gemini', 'Online · ditenagai Gemini', 'オンライン · Gemini 搭載'],
    '13 sensor & 8 modul lampu melaporkan data dalam rentang normal. Terakhir diperbarui': ['13 sensors & 8 lamp modules report data within normal range. Last updated', '13 sensor & 8 modul lampu melaporkan data dalam rentang normal. Terakhir diperbarui', '13センサーと8照明モジュールが正常範囲のデータを報告。最終更新'],

    // ---- alerts ----
    'Notifikasi & peringatan sistem': ['System notifications & alerts', 'Notifikasi & peringatan sistem', 'システム通知とアラート'],
    'Semua': ['All', 'Semua', 'すべて'],
    'Belum dibaca': ['Unread', 'Belum dibaca', '未読'],
    'Critical': ['Critical', 'Kritis', '重大'],

    // ---- impact ----
    'Impact Report': ['Impact Report', 'Laporan Dampak', 'インパクトレポート'],
    'Dampak lingkungan Anda': ['Your environmental impact', 'Dampak lingkungan Anda', 'あなたの環境インパクト'],
    'Impact Bulan Ini': ['Impact This Month', 'Impact Bulan Ini', '今月のインパクト'],
    'CO₂ dihapus': ['CO₂ removed', 'CO₂ dihapus', 'CO₂ 除去'],
    'Setara': ['Equivalent to', 'Setara', '相当'],
    'km berkendara mobil': ['km of driving', 'km berkendara mobil', 'km の運転'],
    'Key Metrics': ['Key Metrics', 'Metrik Utama', '主要指標'],
    'O₂ Diproduksi': ['O₂ Produced', 'O₂ Diproduksi', 'O₂ 生成量'],
    'VOC Dihapus': ['VOC Removed', 'VOC Dihapus', 'VOC 除去量'],
    'Energy Saved': ['Energy Saved', 'Energi Dihemat', '節約エネルギー'],
    'Tree Equivalent': ['Tree Equivalent', 'Setara Pohon', '樹木換算'],
    'pohon': ['trees', 'pohon', '本'],
    'Trend Bulanan': ['Monthly Trend', 'Trend Bulanan', '月間トレンド'],
    'CO₂ removal meningkat konsisten setiap minggu': ['CO₂ removal rises steadily every week', 'CO₂ removal meningkat konsisten setiap minggu', 'CO₂除去は毎週着実に増加'],
    'Bagikan Dampak Saya': ['Share My Impact', 'Bagikan Dampak Saya', 'インパクトを共有'],
    '🌱 Good for the Planet': ['🌱 Good for the Planet', '🌱 Baik untuk Bumi', '🌱 地球にやさしい'],
    'Anda berkontribusi pada peningkatan kualitas udara global': ['You’re helping improve global air quality', 'Anda berkontribusi pada peningkatan kualitas udara global', '世界の空気質の向上に貢献しています'],
    'History': ['History', 'Riwayat', '履歴'],
    'Bulan lalu': ['Last month', 'Bulan lalu', '先月'],
    '2 bulan lalu': ['2 months ago', '2 bulan lalu', '2か月前'],
    '3 bulan lalu': ['3 months ago', '3 bulan lalu', '3か月前'],

    // ---- settings ----
    'Settings': ['Settings', 'Pengaturan', '設定'],
    'Akun, perangkat & preferensi': ['Account, device & preferences', 'Akun, perangkat & preferensi', 'アカウント・デバイス・設定'],
    'Account': ['Account', 'Akun', 'アカウント'],
    'Pengguna ALCURA': ['ALCURA User', 'Pengguna ALCURA', 'ALCURA ユーザー'],
    'Edit Profile': ['Edit Profile', 'Edit Profil', 'プロフィール編集'],
    'Device Info': ['Device Info', 'Info Perangkat', 'デバイス情報'],
    'Serial Number': ['Serial Number', 'Nomor Seri', 'シリアル番号'],
    'Firmware': ['Firmware', 'Firmware', 'ファームウェア'],
    'Uptime': ['Uptime', 'Waktu Aktif', '稼働時間'],
    '45 hari': ['45 days', '45 hari', '45 日'],
    'Connectivity': ['Connectivity', 'Konektivitas', '接続'],
    'WiFi Connected': ['WiFi Connected', 'WiFi Terhubung', 'WiFi 接続済み'],
    'Notifications': ['Notifications', 'Notifikasi', '通知'],
    'Alert Notifications': ['Alert Notifications', 'Notifikasi Peringatan', 'アラート通知'],
    'Harvest Reminders': ['Harvest Reminders', 'Pengingat Panen', '収穫リマインダー'],
    'Weekly Impact Report': ['Weekly Impact Report', 'Laporan Dampak Mingguan', '週間インパクトレポート'],
    'Display': ['Display', 'Tampilan', '表示'],
    'Dark Mode': ['Dark Mode', 'Mode Gelap', 'ダークモード'],
    'Off': ['Off', 'Mati', 'オフ'],
    'On': ['On', 'Nyala', 'オン'],
    'Ganti': ['Toggle', 'Ganti', '切替'],
    'Language': ['Language', 'Bahasa', '言語'],
    'Lainnya': ['Other', 'Lainnya', 'その他'],
    'Laporan Dampak': ['Impact Report', 'Laporan Dampak', 'インパクトレポート'],
    'Kontrol Perangkat': ['Device Controls', 'Kontrol Perangkat', 'デバイス操作'],
    'Support': ['Support', 'Dukungan', 'サポート'],
    'Help & FAQ': ['Help & FAQ', 'Bantuan & FAQ', 'ヘルプ & FAQ'],
    'About ALCURA': ['About ALCURA', 'Tentang ALCURA', 'ALCURA について'],
    'Danger Zone': ['Danger Zone', 'Zona Berbahaya', '危険ゾーン'],
    'Logout': ['Logout', 'Keluar', 'ログアウト'],

    // ---- sensors page ----
    'Monitoring semua perangkat real-time': ['Real-time monitoring of all devices', 'Monitoring semua perangkat real-time', '全デバイスをリアルタイム監視'],
    'Perangkat Aktif': ['Active Devices', 'Perangkat Aktif', '稼働デバイス'],
    '/ 13 sensor': ['/ 13 sensors', '/ 13 sensor', '/ 13 センサー'],
    '· 8 modul lampu online': ['· 8 lamp modules online', '· 8 modul lampu online', '· 8 照明モジュール オンライン'],
    'UPTIME': ['UPTIME', 'UPTIME', '稼働率'],
    'Keamanan — Asap & Gas': ['Safety — Smoke & Gas', 'Keamanan — Asap & Gas', '安全 — 煙とガス'],
    'Memuat…': ['Loading…', 'Memuat…', '読み込み中…'],
    'Sensor Gas & VOC': ['Gas & VOC Sensors', 'Sensor Gas & VOC', 'ガス・VOC センサー'],
    'Asap / Gas — MQ-2': ['Smoke / Gas — MQ-2', 'Asap / Gas — MQ-2', '煙 / ガス — MQ-2'],
    'Aman': ['Safe', 'Aman', '安全'],
    'CO₂ — MG811': ['CO₂ — MG811', 'CO₂ — MG811', 'CO₂ — MG811'],
    'TVOC — ENS160': ['TVOC — ENS160', 'TVOC — ENS160', 'TVOC — ENS160'],
    'Baik': ['Good', 'Baik', '良好'],
    'Ultraviolet': ['Ultraviolet', 'Ultraviolet', '紫外線'],
    'Rendah': ['Low', 'Rendah', '低い'],
    'Suhu & Kelembapan': ['Temperature & Humidity', 'Suhu & Kelembapan', '温度と湿度'],
    'DHT-11 (ruang)': ['DHT-11 (room)', 'DHT-11 (ruang)', 'DHT-11 (室内)'],
    'AHT21 (ENS160)': ['AHT21 (ENS160)', 'AHT21 (ENS160)', 'AHT21 (ENS160)'],
    'Presisi': ['Precise', 'Presisi', '高精度'],
    'Suhu Kultur — MLX90614': ['Culture Temp — MLX90614', 'Suhu Kultur — MLX90614', '培養温度 — MLX90614'],
    'Non-kontak': ['Non-contact', 'Non-kontak', '非接触'],
    'Kultur Cairan': ['Liquid Culture', 'Kultur Cairan', '液体培養'],
    'pH Meter': ['pH Meter', 'pH Meter', 'pH メーター'],
    'TDS (nutrisi)': ['TDS (nutrient)', 'TDS (nutrisi)', 'TDS (栄養)'],
    'Normal': ['Normal', 'Normal', '正常'],
    'Level Air — HC-SR04': ['Water Level — HC-SR04', 'Level Air — HC-SR04', '水位 — HC-SR04'],
    'Cukup': ['Adequate', 'Cukup', '十分'],
    'Jarak': ['Distance', 'Jarak', '距離'],
    'Warna Kultur': ['Culture Color', 'Warna Kultur', '培養の色'],
    'Hijau pekat': ['Deep green', 'Hijau pekat', '濃い緑'],
    'Warna Spirulina — TCS3200 / GY-31': ['Spirulina Color — TCS3200 / GY-31', 'Warna Spirulina — TCS3200 / GY-31', 'スピルリナの色 — TCS3200 / GY-31'],
    'Pin: S0 · S1 · S2 · S3 · OUT · LED · VCC · GND — dominasi hijau = klorofil sehat': ['Pins: S0 · S1 · S2 · S3 · OUT · LED · VCC · GND — green dominance = healthy chlorophyll', 'Pin: S0 · S1 · S2 · S3 · OUT · LED · VCC · GND — dominasi hijau = klorofil sehat', 'ピン: S0 · S1 · S2 · S3 · OUT · LED · VCC · GND — 緑優勢 = 健康なクロロフィル'],
    'Lampu LED': ['LED Lights', 'Lampu LED', 'LED ライト'],
    '8 modul': ['8 modules', '8 modul', '8 モジュール'],
    'Atur': ['Adjust', 'Atur', '調整'],
    'WS2812B Ring 12 LED': ['WS2812B Ring 12 LED', 'WS2812B Ring 12 LED', 'WS2812B リング12 LED'],
    'WS2812B Ring 8 LED': ['WS2812B Ring 8 LED', 'WS2812B Ring 8 LED', 'WS2812B リング8 LED'],
    'LED Strip SMD 30': ['LED Strip SMD 30', 'LED Strip SMD 30', 'LED ストリップ SMD 30'],
    'Total Daya LED': ['Total LED Power', 'Total Daya LED', 'LED 総電力'],
    '8 modul · 160 px aktif': ['8 modules · 160 px active', '8 modul · 160 px aktif', '8 モジュール · 160 px 稼働'],
    'Semua perangkat sehat': ['All devices healthy', 'Semua perangkat sehat', '全デバイス正常'],

    // ---- AI chat (static) ----
    'Halo! Saya ALCURA AI 🌱': ['Hi! I’m ALCURA AI 🌱', 'Halo! Saya ALCURA AI 🌱', 'こんにちは！ALCURA AI です 🌱'],
    'Tanya apa saja tentang kualitas udara, kesehatan kultur Spirulina, jadwal panen, atau perawatan perangkat Anda.': ['Ask anything about air quality, Spirulina culture health, harvest schedule, or device care.', 'Tanya apa saja tentang kualitas udara, kesehatan kultur Spirulina, jadwal panen, atau perawatan perangkat Anda.', '空気の質、スピルリナ培養の健康、収穫予定、デバイスのケアなど何でも聞いてください。'],
    'Bagaimana kualitas udara saya?': ['How is my air quality?', 'Bagaimana kualitas udara saya?', '空気の質はどうですか？'],
    'Status kultur Spirulina?': ['Spirulina culture status?', 'Status kultur Spirulina?', 'スピルリナ培養の状態は？'],
    'Kapan waktu panen?': ['When is harvest time?', 'Kapan waktu panen?', '収穫はいつ？'],
    'Apa itu Spirulina?': ['What is Spirulina?', 'Apa itu Spirulina?', 'スピルリナとは？'],
    'Tulis pesan…': ['Type a message…', 'Tulis pesan…', 'メッセージを入力…']
  };

  // Build a lookup that matches a phrase in ANY language -> [en,id,ja]
  var MAP = {};
  Object.keys(D).forEach(function (k) {
    var tri = D[k];
    MAP[k.trim()] = tri;
    tri.forEach(function (s) { if (s) MAP[String(s).trim()] = tri; });
  });

  var IDX = { en: 0, id: 1, ja: 2 };
  var lang = localStorage.getItem('lang');
  if (LANGS.indexOf(lang) < 0) lang = 'en';

  var origin = new WeakMap(); // textNode -> source key (or null if not translatable)
  var observer = null;

  function skipParent(p) {
    return !p || !p.closest || p.closest('[data-bind],[data-sensor],[data-user-name],[data-user-email],[data-no-i18n],[data-status],#greeting,.spark,.pbr-stage,svg,script,style,select,textarea');
  }

  function translateNode(node) {
    var raw = node.nodeValue;
    if (!raw) return;
    var key = origin.get(node);
    if (key === undefined) {
      if (skipParent(node.parentNode)) { origin.set(node, null); return; }
      var t = raw.trim();
      if (!t || !MAP[t]) { origin.set(node, null); return; }
      key = t; origin.set(node, t);
    }
    if (!key) return;
    var tri = MAP[key]; if (!tri) return;
    var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
    node.nodeValue = lead + tri[IDX[lang]] + trail;
  }

  function collect() {
    var nodes = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n; while ((n = w.nextNode())) { if (n.nodeValue && n.nodeValue.trim()) nodes.push(n); }
    return nodes;
  }

  function applyAll() {
    if (!document.body) return;
    if (observer) observer.disconnect();
    collect().forEach(translateNode);
    document.documentElement.setAttribute('lang', lang);
    syncBtn();
    if (observer) observe();
  }

  // Re-translate nodes inserted/changed later (dynamic content)
  function observe() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  function onMutations(muts) {
    observer.disconnect();
    muts.forEach(function (m) {
      if (m.type === 'characterData') { origin.delete(m.target); translateNode(m.target); }
      else m.addedNodes && m.addedNodes.forEach(function (nd) {
        if (nd.nodeType === 3) translateNode(nd);
        else if (nd.nodeType === 1) {
          var w = document.createTreeWalker(nd, NodeFilter.SHOW_TEXT, null), t;
          while ((t = w.nextNode())) { if (t.nodeValue && t.nodeValue.trim()) translateNode(t); }
        }
      });
    });
    observe();
  }

  // ---- Segmented ID / EN / JA language toggle (matches the dashboard) ----
  var btn;
  function syncBtn() {
    if (!btn) return;
    btn.classList.remove('id', 'en', 'ja');
    btn.classList.add(lang);
    btn.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }
  function makeButton() {
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    btn = document.createElement('div');
    btn.className = 'lang-toggle';
    btn.id = 'langToggle';
    btn.setAttribute('data-no-i18n', '');
    btn.innerHTML =
      '<span class="lang-knob"></span>' +
      '<button type="button" data-lang="id">ID</button>' +
      '<button type="button" data-lang="en">EN</button>' +
      '<button type="button" data-lang="ja">JA</button>';
    btn.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    toggle.parentNode.insertBefore(btn, toggle); // sits to the LEFT of the theme toggle
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === lang) { if (l === lang) syncBtn(); return; }
    lang = l;
    localStorage.setItem('lang', lang);
    applyAll();
    document.dispatchEvent(new CustomEvent('alcura:lang', { detail: { lang: lang } }));
  }

  // Public helpers for other scripts (sensors-engine, greeting, chat) + uniform global setLang
  window.setLang = setLang;
  window.ALCURA_I18N = {
    get lang() { return lang; },
    setLang: setLang,
    t: function (en, id, ja) { return ({ en: en, id: id, ja: ja })[lang]; },
    pick: function (obj) { return obj[lang] != null ? obj[lang] : obj.en; },
    cycle: function () { cycle(); },                       // advance en→id→ja→en
    set: function (l) {                                    // jump straight to a language
      if (LANGS.indexOf(l) < 0 || l === lang) return;
      lang = l; localStorage.setItem('lang', lang); applyAll();
      document.dispatchEvent(new CustomEvent('alcura:lang', { detail: { lang: lang } }));
    }
  };

  function boot() {
    makeButton();
    observer = new MutationObserver(onMutations);
    applyAll();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
