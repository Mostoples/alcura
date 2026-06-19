/* ============================================================
   ALCURA — Landing interactions
   Theme (dark/light) · Language (ID/EN) · FAQ · scroll reveal · dot-nav
   ============================================================ */

/* ---- Theme (shared key with the rest of the app) ---- */
(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})();
function toggleTheme(){
  const r=document.documentElement;
  const next=r.getAttribute('data-theme')==='dark'?'light':'dark';
  r.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
}

/* ---- Internationalisation: Indonesian (id) + English (en) ---- */
const I18N={
  id:{
    'nav.general':'Umum','nav.validation':'Data','nav.features':'Fitur','nav.pricing':'Langganan','nav.team':'Tim','nav.faq':'FAQ',
    'nav.login':'Masuk','nav.register':'Mulai Gratis',

    'hero.eyebrow':'AIoT Photobioreactor',
    'hero.h1':'Udara <em>Hidup</em><br>untuk Ruang yang<br><span class="grad">Hidup.</span>',
    'hero.lead':'ALCURA adalah lampu multifungsi yang dapat berperan sebagai photobioreactor pintar untuk budi daya mikroalga Spirulina dan air purifier. Alat ini dapat memurnikan udara, memproduksi oksigen, dan dipantau real-time oleh AI.',
    'hero.start.title':'Mulai bernapas lebih bersih',
    'hero.start.desc':'Buat akun gratis dan pantau ALCURA Anda secara real-time.',
    'hero.start.register':'Daftar Akun','hero.start.login':'Sudah punya akun',
    'hero.stat1':'CO₂ terserap','hero.stat2':'VOC & HCHO bersih','hero.stat3':'siklus panen',
    'phone.hint':'Coba ketuk menu','phone.health':'Culture Health · Hari 25/30',
    'phone.live':'Sensor Langsung','phone.harvest':'Panen Berikutnya','phone.trend':'Tren CO₂ 24 jam',
    'phone.harvest.sub':'Spirulina 83% siap','phone.harvest.val':'5 hari',
    'phone.ctrl':'Kontrol Cepat','phone.aeration':'Aerasi','phone.light':'Mode Lampu',
    'phone.air.title':'Kualitas Udara','phone.alerts.title':'Peringatan','phone.more.title':'Pengaturan',
    'phone.tab.home':'Beranda','phone.tab.air':'Udara','phone.tab.alerts':'Alarm','phone.tab.more':'Lainnya',
    'phone.greet':'Selamat pagi 👋','phone.room':'ALCURA · Ruang Tamu','phone.temp':'Suhu',
    'phone.on':'Aktif','phone.off':'Mati','phone.mode.grow':'Pertumbuhan','phone.mode.day':'Siang','phone.mode.night':'Malam',
    'phone.aq':'Air Quality','phone.good':'Baik','phone.permonth':'L/bulan',
    'phone.air.sub':'Indoor real-time','phone.aqi.label':'AQI Indoor','phone.aqi.status':'Sangat Baik',
    'phone.culture.sub':'Spirulina · Hari 25/30','phone.biomass':'Biomass OD680 · Fase eksponensial',
    'phone.harvest.days':'5 hari lagi','phone.harvest.ready':'Spirulina 83% siap dipanen',
    'phone.alerts.new':'3 baru','phone.al1.t':'pH kultur turun','phone.al1.s':'Sesuaikan nutrisi dalam 24 jam.',
    'phone.al2.t':'Panen siap 3 hari','phone.al2.s':'Siapkan peralatan panen.',
    'phone.al3.t':'Kualitas udara +23%','phone.al3.s':'Dibanding minggu lalu. Bagus!',
    'phone.al4.t':'Aerasi optimal','phone.al4.s':'DO stabil di 11 mg/L.',
    'phone.more.sub':'Perangkat & akun','phone.device':'Perangkat','phone.uptime':'Uptime','phone.uptime.val':'45 hari','phone.conn':'Koneksi',
    'phone.dayval':'Hari 25/30','phone.cycle':'Siklus kultur','phone.o2today':'O₂ hari ini',
    'phone.phase':'Eksponensial','phone.growth':'Pertumbuhan',

    'val.tag':'Validasi','val.title':'Dibangun di atas <em>data</em>, bukan klaim',
    'val.sub':'Landasan ilmiah pembuatan ALCURA — hasil peer-reviewed dan prediksi performa alat.',
    'val.c1.title':'Hasil Peer-Reviewed','val.c1.desc':'Studi tervalidasi tentang penyerapan CO₂ dan produksi O₂ oleh mikroalga Spirulina.',
    'val.c2.title':'Prediksi Pengurangan CO₂','val.c2.desc':'Estimasi kemampuan alat menyerap karbon dioksida per unit per bulan.',
    'val.c3.title':'Pemurnian VOC & HCHO','val.c3.desc':'Efektivitas penghilangan senyawa organik volatil dan formaldehida dari udara indoor.',
    'val.unit1':'CO₂ / bulan','val.unit2':'penyerapan','val.unit3':'udara bersih',

    'val.kpi':'makalah peer-reviewed','val.lead.title':'Landasan Peer-Reviewed',
    'val.lead.desc':'ALCURA dikembangkan berdasarkan 39 makalah peer-reviewed melalui tinjauan literatur sistematis sesuai PRISMA untuk periode 2018–2026 via PubMed, Consensus, dan basis data terkait.',
    'val.src.more':'+ basis data terkait',
    'val.m1':'Penurunan CO₂ dalam ruangan','val.m2':'Produktivitas budi daya mikroalga','val.m3':'Konsumsi energi sistem HVAC','val.m4':'Kenyamanan termal',

    'inst.tag':'Instalasi','inst.title':'Hidup dalam <em>empat</em> langkah','inst.sub':'Dari pemasangan sampai panen — ALCURA membuat semuanya sederhana.',
    'inst.s1.title':'Sambungkan Daya','inst.s1.desc':'Colok ALCURA ke sumber listrik rumah tangga.',
    'inst.s2.title':'Pasang & Nyalakan','inst.s2.desc':'Masukkan mikroalga ke unit, pastikan semua komponen terpasang benar, lalu nyalakan unit.',
    'inst.s3.title':'Pantau Pertumbuhan','inst.s3.desc':'Pantau pertumbuhan mikroalga lewat notifikasi atau data pertumbuhan di web app ALCURA.',
    'inst.s4.title':'Panen Tiap 14 Hari','inst.s4.desc':'Panen dan ganti mikroalga setiap 14 hari.',

    'feat.tag':'Fitur Alat','feat.title':'Satu unit, <em>tujuh</em> manfaat hidup','feat.sub':'Bukan sekadar lampu hias. Ini ekosistem mini untuk udara dan kesehatan ruangan Anda.',
    'feat.f1.title':'Lampu Photobioreactor','feat.f1.desc':'Lampu photobioreactor akrilik di atas rangka logam. Pas di sudut kantor atau ruang tamu mana pun.',
    'feat.f2.title':'Pemurnian Udara Aktif','feat.f2.desc':'Menyerap 55–90% CO₂ dan menghilangkan VOC hingga 100%. Mengurangi PM2.5 dan PM10.',
    'feat.f3.title':'Produksi Oksigen','feat.f3.desc':'Fotosintesis kultur Spirulina menghasilkan O₂ segar secara terus-menerus.',
    'feat.f4.title':'Monitoring Real-Time','feat.f4.desc':'Kesehatan kultur Spirulina, produksi biomassa, dan konsentrasi CO₂–O₂ dipantau real-time.',
    'feat.f5.title':'Budi Daya Spirulina','feat.f5.desc':'Biomassa tinggi dapat dipanen setiap siklus 30 hari.',
    'feat.f6.title':'Pencahayaan Ambient','feat.f6.desc':'LED tunable spectrum untuk pertumbuhan mikroalga yang optimal.',
    'feat.f7.title':'Optimasi AI Otomatis','feat.f7.desc':'Machine learning mengatur LED, aerasi, dan injeksi CO₂ secara otomatis.',

    'innov.tag':'Inovasi','innov.title':'Dua dunia dalam <em>satu</em> alat','innov.sub':'Manfaat nyata untuk kualitas udara dalam ruangan dan budi daya mikroalga.',
    'innov.a.title':'Kualitas Udara Dalam Ruangan','innov.a.desc':'ALCURA mengurangi CO₂ dan memproduksi O₂ beserta udara segar, berperan sebagai air purifier:',
    'innov.a.li1':'Menyerap CO₂ dan melepas oksigen segar','innov.a.li2':'Menyegarkan udara layaknya air purifier','innov.a.li3':'Mengurangi VOC dan polutan dalam ruangan',
    'innov.b.title':'Budi Daya Mikroalga','innov.b.desc':'ALCURA membudidayakan dan mendukung produksi biomassa Spirulina yang kaya manfaat kesehatan:',
    'innov.b.li1':'Memproduksi biomassa Spirulina bergizi tinggi','innov.b.li2':'Kaya manfaat kesehatan','innov.b.li3':'Panen berkelanjutan tiap siklus',
    'innov.fn1':'Fungsi 01','innov.fn2':'Fungsi 02','innov.a.pill':'Air Purifier','innov.b.pill':'Photobioreactor',

    'cmp.tag':'Perbandingan','cmp.title':'Mengapa <em>ALCURA</em>?','cmp.sub':'Dibandingkan air purifier dan lampu konvensional di pasaran.',
    'cmp.feature':'Fitur','cmp.purifier':'Air Purifier Biasa','cmp.lamp':'Lampu Pintar',
    'cmp.r1':'Memurnikan udara','cmp.r2':'Memproduksi oksigen','cmp.r3':'Budi daya Spirulina','cmp.r4':'Pencahayaan ambient','cmp.r5':'Monitoring AI real-time','cmp.r6':'Tanpa filter habis pakai',

    'price.tag':'Langganan','price.title':'Pilih paket yang <em>hidup</em>','price.sub':'Harga, benefit, dan nama langganan — detail menyusul.',
    'price.p1.name':'Spora','price.p1.desc':'Untuk memulai perjalanan udara bersih.','price.p1.f1':'1 unit ALCURA','price.p1.f2':'Monitoring dasar','price.p1.f3':'Notifikasi panen',
    'price.p2.name':'Bloom','price.p2.badge':'Populer','price.p2.desc':'Untuk pengalaman penuh ALCURA.','price.p2.f1':'Semua fitur Spora','price.p2.f2':'Optimasi AI penuh','price.p2.f3':'Prediksi hasil panen','price.p2.f4':'Riwayat data tak terbatas',
    'price.p3.name':'Canopy','price.p3.desc':'Untuk ruang dan tim yang lebih besar.','price.p3.f1':'Semua fitur Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Dukungan prioritas',
    'price.choose':'Pilih Paket','price.month':'/bulan',
    'price.bestseller':'Paling Populer','price.p1.tag':'Pemula','price.p2.tag':'Terlaris','price.p3.tag':'Skala',

    'team.tag':'Tim Kami','team.title':'Orang di balik <em>ALCURA</em>','team.sub':'Tujuh orang yang menghidupkan udara untuk ruang yang hidup. Detail menyusul.',
    'team.m1':'Anggota 1','team.m2':'Anggota 2','team.m3':'Anggota 3','team.m4':'Anggota 4','team.m5':'Anggota 5','team.m6':'Anggota 6','team.m7':'Anggota 7',

    'rev.tag':'Review Pengguna','rev.title':'Apa kata <em>mereka</em>','rev.sub':'Pengalaman nyata dari ruang yang sudah bernapas lebih bersih.',

    'faq.tag':'FAQ','faq.title':'Pertanyaan yang <em>sering</em> muncul','faq.sub':'Klik pertanyaan untuk melihat jawabannya.',
    'faq.q1':'Apa itu ALCURA?','faq.a1':'ALCURA adalah lampu multifungsi yang berperan sebagai photobioreactor pintar untuk budi daya mikroalga Spirulina sekaligus air purifier — memurnikan udara, memproduksi oksigen, dan dipantau real-time oleh AI.',
    'faq.q2':'Apakah aman digunakan di dalam rumah?','faq.a2':'Ya. ALCURA dirancang sebagai perangkat indoor yang aman; mikroalga tertutup rapat dalam tabung dan tidak melepas partikel berbahaya ke udara.',
    'faq.q3':'Seberapa sering Spirulina perlu dipanen?','faq.a3':'Umumnya tiap siklus sekitar 30 hari. Aplikasi akan memberi tahu Anda kapan kultur siap dipanen berdasarkan data sensor.',
    'faq.q4':'Apakah perlu mengganti filter?','faq.a4':'Tidak. Berbeda dengan air purifier konvensional, ALCURA memurnikan udara secara biologis sehingga tidak membutuhkan filter habis pakai.',
    'faq.q5':'Bagaimana cara memantau alat?','faq.a5':'Melalui aplikasi ALCURA yang menampilkan DO, pH, suhu, CO₂, dan kesehatan kultur secara real-time, di mana pun Anda berada.',

    'auth.tag':'Mulai','auth.title':'Siap menghidupkan <em>udara</em> Anda?','auth.desc':'Buat akun atau masuk untuk mulai memantau ALCURA. Prosesnya cepat dan gratis.',
    'auth.fs1.t':'Daftar','auth.fs1.s':'Buat akun dengan email atau Google.',
    'auth.fs2.t':'Pair Alat','auth.fs2.s':'Hubungkan ALCURA Anda via QR atau Bluetooth.',
    'auth.fs3.t':'Pantau','auth.fs3.s':'Lihat data kultur Anda secara real-time.',

    'wl.label':'Belum siap mendaftar? Gabung waitlist:','wl.ph':'email@anda.com','wl.btn':'Gabung',
    'wl.count':'calon pengguna sudah bergabung',
    'wl.success':'🎉 Kamu masuk daftar! Kami kabari saat ALCURA rilis.',
    'wl.invalid':'Masukkan alamat email yang valid.',
    'wl.already':'Email ini sudah terdaftar. Sampai jumpa saat rilis!',
    'social.title':'Tetap terhubung dengan <em>ALCURA</em>','social.desc':'Ikuti perjalanan kami di media sosial.',
    'foot.tagline':'Lampu photobioreactor pintar untuk udara yang lebih bersih dan budi daya Spirulina — memurnikan udara, memproduksi oksigen, dan dipantau real-time oleh AI.',
    'foot.product':'Produk','foot.science':'Sains & Riset','foot.legal':'Legal',
    'foot.l.features':'Fitur','foot.l.how':'Cara Kerja','foot.l.pricing':'Langganan','foot.l.demo':'Demo App','foot.l.faq':'FAQ',
    'foot.l.evidence':'Bukti Riset','foot.l.innovation':'Inovasi','foot.l.comparison':'Perbandingan','foot.l.about':'Tentang Kami',
    'foot.l.privacy':'Kebijakan Privasi','foot.l.terms':'Syarat Layanan','foot.l.help':'Bantuan',
    'footer.copy':'© 2026 ALCURA — Algae Cultivation Unit with Real-time AI.',
    'common.soon':'Data menyusul',
  },
  en:{
    'nav.general':'General','nav.validation':'Data','nav.features':'Features','nav.pricing':'Pricing','nav.team':'Team','nav.faq':'FAQ',
    'nav.login':'Sign in','nav.register':'Get Started',

    'hero.eyebrow':'AIoT Photobioreactor',
    'hero.h1':'Living <em>Air</em><br>for Living<br><span class="grad">Spaces.</span>',
    'hero.lead':'ALCURA is a multifunctional lamp that doubles as a smart photobioreactor for cultivating Spirulina microalgae and as an air purifier. It purifies the air, produces oxygen, and is monitored in real time by AI.',
    'hero.start.title':'Start breathing cleaner',
    'hero.start.desc':'Create a free account and monitor your ALCURA in real time.',
    'hero.start.register':'Create Account','hero.start.login':'I have an account',
    'hero.stat1':'CO₂ absorbed','hero.stat2':'VOC & HCHO cleared','hero.stat3':'harvest cycle',
    'phone.hint':'Try the menu','phone.health':'Culture Health · Day 25/30',
    'phone.live':'Live Sensors','phone.harvest':'Next Harvest','phone.trend':'CO₂ Trend 24h',
    'phone.harvest.sub':'Spirulina 83% ready','phone.harvest.val':'5 days',
    'phone.ctrl':'Quick Controls','phone.aeration':'Aeration','phone.light':'Light Mode',
    'phone.air.title':'Air Quality','phone.alerts.title':'Alerts','phone.more.title':'Settings',
    'phone.tab.home':'Home','phone.tab.air':'Air','phone.tab.alerts':'Alerts','phone.tab.more':'More',
    'phone.greet':'Good morning 👋','phone.room':'ALCURA · Living Room','phone.temp':'Temp',
    'phone.on':'Active','phone.off':'Off','phone.mode.grow':'Growth','phone.mode.day':'Day','phone.mode.night':'Night',
    'phone.aq':'Air Quality','phone.good':'Good','phone.permonth':'L/mo',
    'phone.air.sub':'Indoor real-time','phone.aqi.label':'Indoor AQI','phone.aqi.status':'Excellent',
    'phone.culture.sub':'Spirulina · Day 25/30','phone.biomass':'Biomass OD680 · Exponential phase',
    'phone.harvest.days':'In 5 days','phone.harvest.ready':'Spirulina 83% ready',
    'phone.alerts.new':'3 new','phone.al1.t':'Culture pH dropping','phone.al1.s':'Adjust nutrients within 24h.',
    'phone.al2.t':'Harvest ready in 3 days','phone.al2.s':'Prepare harvest equipment.',
    'phone.al3.t':'Air quality +23%','phone.al3.s':'Vs last week. Great progress!',
    'phone.al4.t':'Aeration optimal','phone.al4.s':'DO stable at 11 mg/L.',
    'phone.more.sub':'Device & account','phone.device':'Device','phone.uptime':'Uptime','phone.uptime.val':'45 days','phone.conn':'Connection',
    'phone.dayval':'Day 25/30','phone.cycle':'Culture cycle','phone.o2today':'O₂ today',
    'phone.phase':'Exponential','phone.growth':'Growth',

    'val.tag':'Validation','val.title':'Built on <em>data</em>, not claims',
    'val.sub':'The science behind ALCURA — peer-reviewed results and predicted device performance.',
    'val.c1.title':'Peer-Reviewed Results','val.c1.desc':'Validated studies on CO₂ uptake and O₂ production by Spirulina microalgae.',
    'val.c2.title':'Predicted CO₂ Reduction','val.c2.desc':'Estimated carbon dioxide absorption capacity per unit per month.',
    'val.c3.title':'VOC & HCHO Removal','val.c3.desc':'Effectiveness in removing volatile organic compounds and formaldehyde from indoor air.',
    'val.unit1':'CO₂ / month','val.unit2':'absorption','val.unit3':'cleaner air',

    'val.kpi':'peer-reviewed papers','val.lead.title':'Peer-Reviewed Foundation',
    'val.lead.desc':'ALCURA was developed based on 39 peer-reviewed papers, using a PRISMA-compliant systematic literature review covering 2018–2026 via PubMed, Consensus, and related databases.',
    'val.src.more':'+ related databases',
    'val.m1':'Indoor CO₂ reduction','val.m2':'Microalgae cultivation productivity','val.m3':'HVAC system energy consumption','val.m4':'Thermal comfort',

    'inst.tag':'Installation','inst.title':'Alive in <em>four</em> steps','inst.sub':'From setup to harvest — ALCURA keeps everything simple.',
    'inst.s1.title':'Plug In','inst.s1.desc':'Plug ALCURA into a household power source.',
    'inst.s2.title':'Set Up & Power On','inst.s2.desc':'Add the microalgae to the unit, make sure all components are properly installed, then turn it on.',
    'inst.s3.title':'Monitor Growth','inst.s3.desc':'Monitor the microalgae’s growth via notifications or the growth data in the ALCURA web app.',
    'inst.s4.title':'Harvest Every 14 Days','inst.s4.desc':'Harvest and replace the microalgae every 14 days.',

    'feat.tag':'Features','feat.title':'One unit, <em>seven</em> living benefits','feat.sub':'Not just a decorative lamp. A mini ecosystem working for your air and indoor health.',
    'feat.f1.title':'Photobioreactor Lamp','feat.f1.desc':'An acrylic photobioreactor lamp on a metal frame. Fits a corner of any office or living room.',
    'feat.f2.title':'Active Air Purification','feat.f2.desc':'Absorbs 55–90% CO₂ and eliminates VOCs up to 100%. Reduces PM2.5 and PM10.',
    'feat.f3.title':'Oxygen Production','feat.f3.desc':'Spirulina culture photosynthesis produces fresh O₂ continuously.',
    'feat.f4.title':'Real-Time Monitoring','feat.f4.desc':'Spirulina culture health, biomass production, and CO₂–O₂ concentration are monitored in real time.',
    'feat.f5.title':'Spirulina Cultivation','feat.f5.desc':'High biomass can be harvested every 30-day cycle.',
    'feat.f6.title':'Ambient Lighting','feat.f6.desc':'LED tunable spectrum for optimal microalgae growth.',
    'feat.f7.title':'Automatic AI Optimization','feat.f7.desc':'Machine learning adjusts LED, aeration, and CO₂ injection.',

    'innov.tag':'Innovation','innov.title':'Two worlds in <em>one</em> device','innov.sub':'Real benefits for indoor air quality and microalgae cultivation.',
    'innov.a.title':'Indoor Air Quality','innov.a.desc':'ALCURA reduces CO₂ and produces O₂ along with fresh air, acting as an air purifier:',
    'innov.a.li1':'Absorbs CO₂ and releases fresh oxygen','innov.a.li2':'Refreshes the air like an air purifier','innov.a.li3':'Cuts indoor VOCs and pollutants',
    'innov.b.title':'Microalgae Cultivation','innov.b.desc':'ALCURA cultivates and supports Spirulina biomass that is rich in health benefits:',
    'innov.b.li1':'Produces nutrient-rich Spirulina biomass','innov.b.li2':'Rich in health benefits','innov.b.li3':'Sustainable harvest every cycle',
    'innov.fn1':'Function 01','innov.fn2':'Function 02','innov.a.pill':'Air Purifier','innov.b.pill':'Photobioreactor',

    'cmp.tag':'Comparison','cmp.title':'Why <em>ALCURA</em>?','cmp.sub':'Compared to conventional air purifiers and lamps on the market.',
    'cmp.feature':'Feature','cmp.purifier':'Typical Air Purifier','cmp.lamp':'Smart Lamp',
    'cmp.r1':'Purifies air','cmp.r2':'Produces oxygen','cmp.r3':'Cultivates Spirulina','cmp.r4':'Ambient lighting','cmp.r5':'Real-time AI monitoring','cmp.r6':'No disposable filters',

    'price.tag':'Pricing','price.title':'Choose a <em>living</em> plan','price.sub':'Pricing, benefits, and plan names — details coming soon.',
    'price.p1.name':'Spore','price.p1.desc':'To begin your clean-air journey.','price.p1.f1':'1 ALCURA unit','price.p1.f2':'Basic monitoring','price.p1.f3':'Harvest notifications',
    'price.p2.name':'Bloom','price.p2.badge':'Popular','price.p2.desc':'For the full ALCURA experience.','price.p2.f1':'Everything in Spore','price.p2.f2':'Full AI optimization','price.p2.f3':'Harvest yield predictions','price.p2.f4':'Unlimited data history',
    'price.p3.name':'Canopy','price.p3.desc':'For larger spaces and teams.','price.p3.f1':'Everything in Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Priority support',
    'price.choose':'Choose Plan','price.month':'/month',
    'price.bestseller':'Best Seller','price.p1.tag':'Starter','price.p2.tag':'Most Popular','price.p3.tag':'Scale',

    'team.tag':'Our Team','team.title':'The people behind <em>ALCURA</em>','team.sub':'Seven people bringing living air to living spaces. Details coming soon.',
    'team.m1':'Member 1','team.m2':'Member 2','team.m3':'Member 3','team.m4':'Member 4','team.m5':'Member 5','team.m6':'Member 6','team.m7':'Member 7',

    'rev.tag':'User Reviews','rev.title':'What they <em>say</em>','rev.sub':'Real experiences from spaces already breathing cleaner.',

    'faq.tag':'FAQ','faq.title':'Frequently <em>asked</em> questions','faq.sub':'Tap a question to reveal its answer.',
    'faq.q1':'What is ALCURA?','faq.a1':'ALCURA is a multifunctional lamp that acts as a smart photobioreactor for cultivating Spirulina microalgae as well as an air purifier — purifying the air, producing oxygen, and monitored in real time by AI.',
    'faq.q2':'Is it safe to use indoors?','faq.a2':'Yes. ALCURA is designed as a safe indoor device; the microalgae are fully sealed inside the tube and release no harmful particles into the air.',
    'faq.q3':'How often does Spirulina need harvesting?','faq.a3':'Typically every cycle of about 30 days. The app notifies you when the culture is ready to harvest based on sensor data.',
    'faq.q4':'Do I need to replace filters?','faq.a4':'No. Unlike conventional air purifiers, ALCURA purifies air biologically, so it needs no disposable filters.',
    'faq.q5':'How do I monitor the device?','faq.a5':'Through the ALCURA app, which shows DO, pH, temperature, CO₂, and culture health in real time, wherever you are.',

    'auth.tag':'Get Started','auth.title':'Ready to bring your <em>air</em> to life?','auth.desc':'Create an account or sign in to start monitoring ALCURA. It is quick and free.',
    'auth.fs1.t':'Sign up','auth.fs1.s':'Create an account with email or Google.',
    'auth.fs2.t':'Pair Device','auth.fs2.s':'Connect your ALCURA via QR or Bluetooth.',
    'auth.fs3.t':'Monitor','auth.fs3.s':'Watch your culture data in real time.',

    'wl.label':'Not ready to sign up? Join the waitlist:','wl.ph':'you@email.com','wl.btn':'Join',
    'wl.count':'people have already joined',
    'wl.success':'🎉 You’re on the list! We’ll email you when ALCURA launches.',
    'wl.invalid':'Please enter a valid email address.',
    'wl.already':'This email is already on the list. See you at launch!',
    'social.title':'Stay connected with <em>ALCURA</em>','social.desc':'Follow our journey on social media.',
    'foot.tagline':'A smart photobioreactor lamp for cleaner air and Spirulina cultivation — purifying the air, producing oxygen, and monitored in real time by AI.',
    'foot.product':'Product','foot.science':'Science & Research','foot.legal':'Legal',
    'foot.l.features':'Features','foot.l.how':'How It Works','foot.l.pricing':'Pricing','foot.l.demo':'Demo App','foot.l.faq':'FAQ',
    'foot.l.evidence':'Research Evidence','foot.l.innovation':'Innovation','foot.l.comparison':'Comparison','foot.l.about':'About Us',
    'foot.l.privacy':'Privacy Policy','foot.l.terms':'Terms of Service','foot.l.help':'Help',
    'footer.copy':'© 2026 ALCURA — Algae Cultivation Unit with Real-time AI.',
    'common.soon':'Coming soon',
  }
};

function applyLang(lang){
  const dict=I18N[lang]||I18N.id;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const v=dict[el.getAttribute('data-i18n')];
    if(v!=null)el.innerHTML=v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const v=dict[el.getAttribute('data-i18n-ph')];
    if(v!=null)el.setAttribute('placeholder',v);
  });
  document.documentElement.setAttribute('lang',lang);
  localStorage.setItem('lang',lang);
  if(window.__wlRender)window.__wlRender();
  const tog=document.getElementById('langToggle');
  if(tog){tog.classList.toggle('en',lang==='en');tog.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));}
}
function setLang(lang){applyLang(lang);}

/* ---- Nav (mobile + scroll state) ---- */
function toggleNav(){
  const n=document.getElementById('navLinks'),b=document.getElementById('burger');
  if(!n)return;const open=n.classList.toggle('mobile-open');
  if(b){const i=b.querySelector('i');if(i)i.className='ph '+(open?'ph-x':'ph-list');}
}
function closeNav(){
  const n=document.getElementById('navLinks'),b=document.getElementById('burger');
  if(n)n.classList.remove('mobile-open');
  if(b){const i=b.querySelector('i');if(i)i.className='ph ph-list';}
}

/* ---- FAQ accordion ---- */
function toggleFaq(el){
  const item=el.closest('.faq-item');
  if(!item)return;
  const wasOpen=item.classList.contains('open');
  item.parentElement.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!wasOpen)item.classList.add('open');
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded',()=>{
  applyLang(localStorage.getItem('lang')||'id');

  // Sparkline bars in the phone mock
  const spark=document.getElementById('phSpark');
  if(spark){[42,48,55,60,52,46,40,44,50,58,62,57,49,45,53,59].forEach(v=>{const b=document.createElement('div');b.className='bar';b.style.height=v+'%';spark.appendChild(b);});}

  // Nav scroll state
  const nav=document.getElementById('lgNav');
  window.addEventListener('scroll',()=>{if(nav)nav.classList.toggle('scrolled',window.scrollY>20);});

  // Interactive mobile menu: close on outside-click, Escape, or scroll
  const navLinks=document.getElementById('navLinks');
  const isOpen=()=>navLinks&&navLinks.classList.contains('mobile-open');
  document.addEventListener('click',(e)=>{ if(isOpen()&&nav&&!nav.contains(e.target)) closeNav(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'&&isOpen()) closeNav(); });
  window.addEventListener('scroll',()=>{ if(isOpen())closeNav(); },{passive:true});

  // Scroll reveal
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Dot-nav active state + storyline background (recolour/drift per section)
  const dots=[...document.querySelectorAll('.dot-nav a')];
  const sections=dots.map(d=>document.querySelector(d.getAttribute('href'))).filter(Boolean);
  const storyBg=document.querySelector('.story-bg');
  if(sections.length){
    const so=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          dots.forEach(d=>d.classList.toggle('active',d.getAttribute('href')==='#'+e.target.id));
          if(storyBg){
            const idx=sections.indexOf(e.target);
            const rgb=(getComputedStyle(e.target).getPropertyValue('--accent-rgb')||'46,158,94').trim();
            storyBg.style.setProperty('--story-col','rgba('+rgb+',.18)');
            storyBg.style.setProperty('--story-x',(idx%2?68:32)+'%');
            storyBg.style.setProperty('--story-y',(14+idx*6)+'%');
          }
        }
      });
    },{threshold:.4});
    sections.forEach(s=>so.observe(s));
  }

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- Count-up on the validated numbers (runs once on scroll-in) ---- */
  (function(){
    function countUp(el){
      const m=el.textContent.trim().match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
      if(!m)return;
      const prefix=m[1],target=parseFloat(m[2]),suffix=m[3],dec=(m[2].split('.')[1]||'').length;
      if(reduced){el.textContent=prefix+target.toFixed(dec)+suffix;return;}
      const dur=1400,start=performance.now();
      (function tick(now){
        const p=Math.min((now-start)/dur,1),e=1-Math.pow(1-p,3);
        el.textContent=prefix+(target*e).toFixed(dec)+suffix;
        if(p<1)requestAnimationFrame(tick);
      })(start);
    }
    const targets=document.querySelectorAll('[data-countup]');
    if(!targets.length)return;
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){countUp(e.target);obs.unobserve(e.target);}});
    },{threshold:.6});
    targets.forEach(el=>obs.observe(el));
  })();

  /* ---- Waitlist (email capture + momentum counter) ---- */
  (function(){
    const form=document.getElementById('waitlist');
    if(!form)return;
    const input=document.getElementById('wlEmail'),msg=document.getElementById('wlMsg'),
          countEl=document.getElementById('wlCount'),wrap=form.querySelector('.wl-input');
    const SEED=1240;                 // TODO: set to your real waitlist size
    const KEY='alcura_waitlist';
    const ENDPOINT='';               // TODO: put a Formspree/Firebase URL here to actually collect emails
    const stored=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
    const t=(k)=>{const d=I18N[document.documentElement.getAttribute('lang')||'id']||I18N.id;return d[k]||k;};
    function render(){if(countEl)countEl.textContent=(SEED+stored().length).toLocaleString(
      (document.documentElement.getAttribute('lang')||'id')==='en'?'en-US':'id-ID');}
    window.__wlRender=render; render();
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const email=(input.value||'').trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        wrap.classList.add('invalid');msg.className='wl-msg err';msg.textContent=t('wl.invalid');return;
      }
      wrap.classList.remove('invalid');
      const list=stored();
      if(list.includes(email.toLowerCase())){msg.className='wl-msg ok';msg.textContent=t('wl.already');return;}
      list.push(email.toLowerCase());try{localStorage.setItem(KEY,JSON.stringify(list));}catch(e){}
      if(ENDPOINT){try{fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});}catch(e){}}
      render();msg.className='wl-msg ok';msg.textContent=t('wl.success');input.value='';
    });
  })();


  // Perf: mark off-screen slides so their shine/glow animations pause
  const vis=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{e.target.classList.toggle('offscreen',!e.isIntersecting);});
  },{rootMargin:'160px 0px'});
  document.querySelectorAll('.slide').forEach(s=>vis.observe(s));

  // Click aura: brief accent-coloured glow when a card is clicked/tapped
  document.querySelectorAll('.slide .glass').forEach(el=>{
    el.addEventListener('click',()=>{
      el.classList.add('lit');clearTimeout(el._lt);
      el._lt=setTimeout(()=>el.classList.remove('lit'),650);
    },{passive:true});
  });

  /* ---- Cursor-following glass glare (rAF-throttled, one write/frame) ---- */
  if(finePointer){
    document.querySelectorAll('.glass').forEach(el=>{
      let pend=false,mx=50,my=50;
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        mx=(e.clientX-r.left)/r.width*100;my=(e.clientY-r.top)/r.height*100;
        if(!pend){pend=true;requestAnimationFrame(()=>{pend=false;el.style.setProperty('--mx',mx.toFixed(1)+'%');el.style.setProperty('--my',my.toFixed(1)+'%');});}
      },{passive:true});
    });
  }

  /* ---- Gentle 3D tilt toward the cursor (rAF-throttled) ---- */
  if(finePointer && !reduced){
    const MAX=5; // degrees
    document.querySelectorAll('.feat-card,.team-card,.val-card,.step-card,.review-card,.price-card,.innov-card').forEach(card=>{
      let pend=false,rx=0,ry=0;
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        rx=((e.clientY-r.top)/r.height-.5)*-MAX;ry=((e.clientX-r.left)/r.width-.5)*MAX;
        if(!pend){pend=true;requestAnimationFrame(()=>{pend=false;card.style.transform='perspective(900px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateY(-6px)';});}
      },{passive:true});
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    });
  }

  /* ---- Ambient particle field ---- */
  (function(){
    const canvas=document.getElementById('particles');
    if(!canvas||reduced)return;
    const ctx=canvas.getContext('2d');
    let w=0,h=0,dpr=1,parts=[],raf=null;
    const dotRGB=()=>document.documentElement.getAttribute('data-theme')==='dark'?'160,228,188':'42,128,86';
    function resize(){
      dpr=Math.min(window.devicePixelRatio||1,1.5);
      w=canvas.clientWidth;h=canvas.clientHeight;
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=Math.round(Math.min(46,Math.max(20,(w*h)/34000)));
      parts=[];
      for(let i=0;i<count;i++){
        parts.push({
          x:Math.random()*w,y:Math.random()*h,
          r:Math.random()*1.7+.6,
          vx:(Math.random()-.5)*.16,
          vy:-(Math.random()*.22+.04),
          base:Math.random()*.4+.12,
          tw:Math.random()*Math.PI*2,
          ts:Math.random()*.015+.005
        });
      }
    }
    let last=0;
    function frame(ts){
      raf=requestAnimationFrame(frame);
      if(ts-last<32)return; last=ts;   // cap ~30fps to ease backdrop recompute
      ctx.clearRect(0,0,w,h);
      const rgb=dotRGB();
      for(const p of parts){
        p.x+=p.vx;p.y+=p.vy;p.tw+=p.ts;
        if(p.y<-6)p.y=h+6;
        if(p.x<-6)p.x=w+6;else if(p.x>w+6)p.x=-6;
        const a=p.base+Math.sin(p.tw)*.12;
        ctx.beginPath();
        ctx.fillStyle='rgba('+rgb+','+Math.max(0,a).toFixed(3)+')';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
    }
    function start(){if(!raf)raf=requestAnimationFrame(frame);}
    function stop(){if(raf){cancelAnimationFrame(raf);raf=null;}}
    let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(resize,160);});
    document.addEventListener('visibilitychange',()=>{document.hidden?stop():start();});
    resize();start();
  })();

  /* ---- Interactive phone app (tabs, toggles, live data) ---- */
  (function(){
    const phone=document.querySelector('.phone-screen');
    if(!phone)return;
    const tabs=[...phone.querySelectorAll('.ph-tab')];
    const views=[...phone.querySelectorAll('.ph-view')];
    const viewsWrap=phone.querySelector('.ph-views');
    const hint=document.getElementById('phHint');
    let hintHidden=false;
    function show(v){
      tabs.forEach(t=>t.classList.toggle('active',t.dataset.view===v));
      views.forEach(s=>s.classList.toggle('active',s.dataset.view===v));
      if(viewsWrap)viewsWrap.scrollTop=0;
      if(hint&&!hintHidden){hint.classList.add('hide');hintHidden=true;}
    }
    tabs.forEach(t=>t.addEventListener('click',()=>show(t.dataset.view)));

    // Language-aware label helper (keeps data-i18n in sync so switching ID/EN works)
    const curLang=()=>document.documentElement.getAttribute('lang')||localStorage.getItem('lang')||'id';
    const t=(k)=>{const d=I18N[curLang()]||I18N.id;return d[k]!=null?d[k]:k;};
    function setLabel(el,key){if(el){el.setAttribute('data-i18n',key);el.textContent=t(key);}}

    // Aeration toggle
    const aer=document.getElementById('phAer');
    if(aer)aer.addEventListener('click',()=>{
      const on=aer.classList.toggle('is-on');
      setLabel(aer.querySelector('.st'),on?'phone.on':'phone.off');
    });
    // Light-mode cycle
    const mode=document.getElementById('phMode');
    if(mode){
      const keys=['phone.mode.grow','phone.mode.day','phone.mode.night'];let mi=0;
      mode.addEventListener('click',()=>{mi=(mi+1)%keys.length;setLabel(mode.querySelector('.md'),keys[mi]);});
    }

    // Gauge fill-in on first reveal (all SVG gauges sweep from 0)
    if(!reduced){
      phone.querySelectorAll('.ph-gauge .prg').forEach(prg=>{
        const target=prg.style.getPropertyValue('--val')||'80';
        prg.style.setProperty('--val','0');
        requestAnimationFrame(()=>requestAnimationFrame(()=>prg.style.setProperty('--val',target)));
      });
    }

    // Live values — gentle mean-reverting random walk on the active view only
    const liveEls=[...phone.querySelectorAll('[data-live]')].map(el=>{
      const raw=el.textContent.trim();
      const m=raw.match(/^(-?[\d.]+)(.*)$/);
      const num=m?parseFloat(m[1]):0;
      const dec=(m&&m[1].indexOf('.')>=0)?m[1].split('.')[1].length:0;
      const amp=Math.max(Math.abs(num)*0.02,dec?Math.pow(10,-dec):1);
      // Only the health % drives its gauge ring; others just update text.
      const prg=el.dataset.live==='health'?(el.closest('.ph-hero')||document).querySelector('.ph-gauge .prg'):null;
      return {el,base:num,cur:num,dec,suffix:m?m[2]:'',amp,prg};
    });
    const spark=document.getElementById('phSpark');
    function tick(){
      liveEls.forEach(s=>{
        const view=s.el.closest('.ph-view');
        if(view&&!view.classList.contains('active'))return;
        const drift=(Math.random()-0.5)*2*s.amp;
        let v=s.base+(s.cur-s.base)*0.55+drift;
        const lo=s.base-2*s.amp,hi=s.base+2*s.amp;
        v=Math.min(hi,Math.max(lo,v));s.cur=v;
        s.el.textContent=v.toFixed(s.dec)+s.suffix;
        if(s.prg)s.prg.style.setProperty('--val',Math.round(v));
        s.el.classList.remove('pulse');void s.el.offsetWidth;s.el.classList.add('pulse');
      });
      // animate the sparkline when Home is visible
      if(spark&&phone.querySelector('.ph-view[data-view="home"]').classList.contains('active')){
        [...spark.children].forEach(b=>{b.style.height=(38+Math.random()*30).toFixed(0)+'%';});
      }
    }
    let timer=null;
    if(!reduced){
      const io=new IntersectionObserver(es=>es.forEach(e=>{
        if(e.isIntersecting){if(!timer)timer=setInterval(tick,2600);}
        else if(timer){clearInterval(timer);timer=null;}
      }),{threshold:.2});
      io.observe(phone);
    }
  })();
});
