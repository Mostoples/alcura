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

    'innov.tag':'Inovasi','innov.title':'Satu alat, <em>dua</em> sistem hidup','innov.sub':'Satu unit menjalankan dua peran sekaligus — pemurni udara sekaligus photobioreactor.',
    'dual.row.how':'Cara kerja','dual.row.get':'Manfaat','dual.core':'1 alat',
    'dual.air.title':'Pemurni Udara','dual.air.lead':'Mikroalga hidup membersihkan udara ruangan secara biologis — bukan sekadar menyaring.',
    'dual.air.how':'Menyerap CO₂, VOC, dan partikel halus; melepas oksigen segar.','dual.air.get':'Udara lebih sehat tanpa filter habis pakai.','dual.air.statlabel':'CO₂ dalam ruangan diserap',
    'dual.bio.title':'Photobioreactor','dual.bio.lead':'Alat yang sama membudidayakan Spirulina bergizi tinggi di rumah Anda.',
    'dual.bio.how':'Fotosintesis di bawah LED tunable menumbuhkan biomassa Spirulina.','dual.bio.get':'Panen bergizi tiap siklus, dioptimalkan AI.','dual.bio.statlabel':'produktivitas budi daya',
    'pf.co2':'CO₂ udara','pf.do':'Oksigen terlarut','pf.harvest':'Siap panen',
    'innov.a.title':'Kualitas Udara Dalam Ruangan','innov.a.desc':'ALCURA mengurangi CO₂ dan memproduksi O₂ beserta udara segar, berperan sebagai air purifier:',
    'innov.a.li1':'Menyerap CO₂ dan melepas oksigen segar','innov.a.li2':'Menyegarkan udara layaknya air purifier','innov.a.li3':'Mengurangi VOC dan polutan dalam ruangan',
    'innov.b.title':'Budi Daya Mikroalga','innov.b.desc':'ALCURA membudidayakan dan mendukung produksi biomassa Spirulina yang kaya manfaat kesehatan:',
    'innov.b.li1':'Memproduksi biomassa Spirulina bergizi tinggi','innov.b.li2':'Kaya manfaat kesehatan','innov.b.li3':'Panen berkelanjutan tiap siklus',
    'innov.fn1':'Fungsi 01','innov.fn2':'Fungsi 02','innov.a.pill':'Air Purifier','innov.b.pill':'Photobioreactor',

    'cmp.tag':'Perbandingan','cmp.title':'Mengapa <em>ALCURA</em>?','cmp.sub':'Lebih dari sekadar pembersih udara. Begini posisinya dibanding solusi konvensional.',
    'cmp.feature':'Fitur','cmp.purifier':'Air Purifier HEPA','cmp.lamp':'Lampu Pintar',
    'cmp.r1':'Metode pemurnian','cmp.r1.p':'Filter HEPA (mekanis)','cmp.r1.u':'Mikroalga hidup (biologis)',
    'cmp.r2':'Produksi oksigen','cmp.r2.u':'~240 L/bln',
    'cmp.r3':'Filter habis pakai','cmp.r3.p':'Ganti tiap 3–6 bln','cmp.r3.l':'Tidak ada','cmp.r3.u':'Tidak ada — terbarukan',
    'cmp.r4':'Biaya berjalan','cmp.r4.p':'Filter + listrik','cmp.r4.l':'Listrik','cmp.r4.u':'Listrik saja',
    'cmp.r5':'Pencahayaan ambient','cmp.r5.u':'Spektrum tunable',
    'cmp.r6':'Monitoring AI real-time','cmp.r6.l':'Dasar',
    'cmp.r7':'Keberlanjutan','cmp.r7.p':'Limbah filter','cmp.r7.l':'Dampak rendah','cmp.r7.u':'Karbon-negatif + panen',
    'cmp.takeaway':'ALCURA menyatukan pemurnian udara, produksi oksigen, dan budi daya — dalam satu alat berkelanjutan.',
    'cmp.note':'Perbandingan harga & merk spesifik menyusul.',

    'price.tag':'Langganan','price.title':'Pilih paket yang <em>hidup</em>','price.sub':'Tiga paket fleksibel — untuk rumah, kantor, hingga tim yang berkembang.','price.note':'Coba 30 hari tanpa risiko · Batalkan kapan saja · Termasuk pembaruan AI.',
    'price.p1.name':'Spora','price.p1.desc':'Untuk memulai perjalanan udara bersih.','price.p1.f1':'1 unit ALCURA','price.p1.f2':'Monitoring dasar','price.p1.f3':'Notifikasi panen',
    'price.p2.name':'Bloom','price.p2.badge':'Populer','price.p2.desc':'Untuk pengalaman penuh ALCURA.','price.p2.f1':'Semua fitur Spora','price.p2.f2':'Optimasi AI penuh','price.p2.f3':'Prediksi hasil panen','price.p2.f4':'Riwayat data tak terbatas',
    'price.p3.name':'Canopy','price.p3.desc':'Untuk ruang dan tim yang lebih besar.','price.p3.f1':'Semua fitur Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Dukungan prioritas',
    'price.choose':'Pilih Paket','price.month':'/bulan',
    'price.bestseller':'Paling Populer','price.p1.tag':'Pemula','price.p2.tag':'Terlaris','price.p3.tag':'Skala',

    'team.tag':'Tim Kami','team.title':'Orang di balik <em>ALCURA</em>','team.sub':'Tujuh orang yang menghidupkan udara untuk ruang yang hidup.',
    'team.m1':'Anggota 1','team.m2':'Anggota 2','team.m3':'Anggota 3','team.m4':'Anggota 4','team.m5':'Anggota 5','team.m6':'Anggota 6','team.m7':'Anggota 7',

    'rev.tag':'Review Pengguna','rev.title':'Apa kata <em>mereka</em>','rev.sub':'Pengalaman nyata dari ruang yang sudah bernapas lebih bersih.',
    'rev.1.t':'"Ruang kerja terasa jauh lebih segar sejak ada ALCURA. Memantau kultur lewat aplikasinya bikin ketagihan."','rev.1.s':'Desainer Interior · Jakarta',
    'rev.2.t':'"Desainnya estetik sekaligus fungsional. Panen Spirulina pertama saya berhasil dalam 28 hari!"','rev.2.s':'Software Engineer · Bandung',
    'rev.3.t':'"Optimasi AI-nya benar-benar otomatis — tinggal pasang, lalu nikmati udara bersih tiap hari."','rev.3.s':'Pemilik Kafe · Surabaya',
    'rev.4.t':'"CO₂ di ruang meeting kami turun drastis. Klien sering bertanya soal \'lampu hijau\' yang menyala itu."','rev.4.s':'Manajer Kantor · Jakarta',
    'rev.5.t':'"Sebagai pemilik studio yoga, kualitas udara itu segalanya. ALCURA jadi pembeda yang dirasakan member."','rev.5.s':'Pemilik Studio Yoga · Tangerang',
    'rev.6.t':'"Tidak ada filter yang perlu diganti — hemat dan ramah lingkungan. Investasi yang langsung terasa manfaatnya."','rev.6.s':'Founder Startup · Jakarta',

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

    'innov.tag':'Innovation','innov.title':'One device, <em>two</em> living systems','innov.sub':'A single unit plays two roles at once — an air purifier and a photobioreactor.',
    'dual.row.how':'How it works','dual.row.get':'What you get','dual.core':'1 device',
    'dual.air.title':'Air Purifier','dual.air.lead':'Living microalgae clean your indoor air biologically — not just filtering it.',
    'dual.air.how':'Absorbs CO₂, VOCs, and fine particles; releases fresh oxygen.','dual.air.get':'Healthier air with no disposable filters.','dual.air.statlabel':'indoor CO₂ absorbed',
    'dual.bio.title':'Photobioreactor','dual.bio.lead':'The same device cultivates nutrient-rich Spirulina at home.',
    'dual.bio.how':'Photosynthesis under tunable LEDs grows Spirulina biomass.','dual.bio.get':'A nutritious harvest each cycle, AI-optimized.','dual.bio.statlabel':'cultivation productivity',
    'pf.co2':'Air CO₂','pf.do':'Dissolved oxygen','pf.harvest':'Harvest ready',
    'innov.a.title':'Indoor Air Quality','innov.a.desc':'ALCURA reduces CO₂ and produces O₂ along with fresh air, acting as an air purifier:',
    'innov.a.li1':'Absorbs CO₂ and releases fresh oxygen','innov.a.li2':'Refreshes the air like an air purifier','innov.a.li3':'Cuts indoor VOCs and pollutants',
    'innov.b.title':'Microalgae Cultivation','innov.b.desc':'ALCURA cultivates and supports Spirulina biomass that is rich in health benefits:',
    'innov.b.li1':'Produces nutrient-rich Spirulina biomass','innov.b.li2':'Rich in health benefits','innov.b.li3':'Sustainable harvest every cycle',
    'innov.fn1':'Function 01','innov.fn2':'Function 02','innov.a.pill':'Air Purifier','innov.b.pill':'Photobioreactor',

    'cmp.tag':'Comparison','cmp.title':'Why <em>ALCURA</em>?','cmp.sub':'More than an air purifier. Here is how it stacks up against conventional options.',
    'cmp.feature':'Feature','cmp.purifier':'HEPA Air Purifier','cmp.lamp':'Smart Lamp',
    'cmp.r1':'Purification method','cmp.r1.p':'HEPA filter (mechanical)','cmp.r1.u':'Living microalgae (biological)',
    'cmp.r2':'Oxygen production','cmp.r2.u':'~240 L/mo',
    'cmp.r3':'Consumable filters','cmp.r3.p':'Every 3–6 months','cmp.r3.l':'None','cmp.r3.u':'None — self-renewing',
    'cmp.r4':'Ongoing cost','cmp.r4.p':'Filters + power','cmp.r4.l':'Power','cmp.r4.u':'Power only',
    'cmp.r5':'Ambient lighting','cmp.r5.u':'Tunable spectrum',
    'cmp.r6':'Real-time AI monitoring','cmp.r6.l':'Basic',
    'cmp.r7':'Sustainability','cmp.r7.p':'Filter waste','cmp.r7.l':'Low impact','cmp.r7.u':'Carbon-negative + harvest',
    'cmp.takeaway':'ALCURA unites air purification, oxygen production, and cultivation in one sustainable device.',
    'cmp.note':'Detailed pricing & specific brands coming soon.',

    'price.tag':'Pricing','price.title':'Choose a <em>living</em> plan','price.sub':'Three flexible plans — for homes, offices, and growing teams.','price.note':'30-day risk-free trial · Cancel anytime · AI updates included.',
    'price.p1.name':'Spore','price.p1.desc':'To begin your clean-air journey.','price.p1.f1':'1 ALCURA unit','price.p1.f2':'Basic monitoring','price.p1.f3':'Harvest notifications',
    'price.p2.name':'Bloom','price.p2.badge':'Popular','price.p2.desc':'For the full ALCURA experience.','price.p2.f1':'Everything in Spore','price.p2.f2':'Full AI optimization','price.p2.f3':'Harvest yield predictions','price.p2.f4':'Unlimited data history',
    'price.p3.name':'Canopy','price.p3.desc':'For larger spaces and teams.','price.p3.f1':'Everything in Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Priority support',
    'price.choose':'Choose Plan','price.month':'/month',
    'price.bestseller':'Best Seller','price.p1.tag':'Starter','price.p2.tag':'Most Popular','price.p3.tag':'Scale',

    'team.tag':'Our Team','team.title':'The people behind <em>ALCURA</em>','team.sub':'Seven people bringing living air to living spaces.',
    'team.m1':'Member 1','team.m2':'Member 2','team.m3':'Member 3','team.m4':'Member 4','team.m5':'Member 5','team.m6':'Member 6','team.m7':'Member 7',

    'rev.tag':'User Reviews','rev.title':'What they <em>say</em>','rev.sub':'Real experiences from spaces already breathing cleaner.',
    'rev.1.t':'"My workspace feels so much fresher with ALCURA, and tracking the culture in the app is honestly addictive."','rev.1.s':'Interior Designer · Jakarta',
    'rev.2.t':'"Beautiful yet functional design. My first Spirulina harvest succeeded in just 28 days!"','rev.2.s':'Software Engineer · Bandung',
    'rev.3.t':'"The AI optimization is truly hands-off — just set it up and enjoy clean air every day."','rev.3.s':'Café Owner · Surabaya',
    'rev.4.t':'"CO₂ in our meeting room dropped dramatically. Clients keep asking about the glowing green lamp."','rev.4.s':'Office Manager · Jakarta',
    'rev.5.t':'"As a yoga studio owner, air quality is everything. ALCURA is a difference our members can feel."','rev.5.s':'Yoga Studio Owner · Tangerang',
    'rev.6.t':'"No filters to replace — cost-effective and eco-friendly. An investment that pays off right away."','rev.6.s':'Startup Founder · Jakarta',

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
  },
  ja:{
    'nav.general':'概要','nav.validation':'データ','nav.features':'機能','nav.pricing':'料金','nav.team':'チーム','nav.faq':'FAQ',
    'nav.login':'ログイン','nav.register':'始める',

    'hero.eyebrow':'AIoT フォトバイオリアクター',
    'hero.h1':'生きた<em>空気</em>を<br>生きた<br><span class="grad">空間へ。</span>',
    'hero.lead':'ALCURAは、スピルリナ微細藻類を培養するスマートなフォトバイオリアクターと空気清浄機を兼ねた多機能ランプです。空気を浄化し、酸素を生み出し、AIがリアルタイムで監視します。',
    'hero.start.title':'よりきれいな呼吸を始めよう',
    'hero.start.desc':'無料アカウントを作成して、ALCURAをリアルタイムで監視しましょう。',
    'hero.start.register':'アカウント作成','hero.start.login':'アカウントをお持ちの方',
    'hero.stat1':'CO₂吸収','hero.stat2':'VOC・HCHO除去','hero.stat3':'収穫サイクル',
    'phone.hint':'メニューを試す','phone.health':'培養状態 · 25/30日目',
    'phone.live':'ライブセンサー','phone.harvest':'次の収穫','phone.trend':'CO₂推移 24時間',
    'phone.harvest.sub':'スピルリナ 83%準備完了','phone.harvest.val':'5日',
    'phone.ctrl':'クイック操作','phone.aeration':'エアレーション','phone.light':'ライトモード',
    'phone.air.title':'空気品質','phone.alerts.title':'アラート','phone.more.title':'設定',
    'phone.tab.home':'ホーム','phone.tab.air':'空気','phone.tab.alerts':'アラート','phone.tab.more':'その他',
    'phone.greet':'おはようございます 👋','phone.room':'ALCURA · リビング','phone.temp':'温度',
    'phone.on':'稼働中','phone.off':'オフ','phone.mode.grow':'成長','phone.mode.day':'昼','phone.mode.night':'夜',
    'phone.aq':'空気品質','phone.good':'良好','phone.permonth':'L/月',
    'phone.air.sub':'屋内リアルタイム','phone.aqi.label':'屋内AQI','phone.aqi.status':'非常に良い',
    'phone.culture.sub':'スピルリナ · 25/30日目','phone.biomass':'バイオマス OD680 · 指数増殖期',
    'phone.harvest.days':'あと5日','phone.harvest.ready':'スピルリナ 83%準備完了',
    'phone.alerts.new':'新着3件','phone.al1.t':'培養pHが低下','phone.al1.s':'24時間以内に栄養を調整してください。',
    'phone.al2.t':'3日後に収穫可能','phone.al2.s':'収穫用機材を準備してください。',
    'phone.al3.t':'空気品質 +23%','phone.al3.s':'先週比。素晴らしい進捗です！',
    'phone.al4.t':'エアレーション最適','phone.al4.s':'DOは11 mg/Lで安定。',
    'phone.more.sub':'デバイスとアカウント','phone.device':'デバイス','phone.uptime':'稼働時間','phone.uptime.val':'45日','phone.conn':'接続',
    'phone.dayval':'25/30日目','phone.cycle':'培養サイクル','phone.o2today':'本日のO₂',
    'phone.phase':'指数増殖','phone.growth':'成長',

    'val.tag':'検証','val.title':'主張ではなく<em>データ</em>に基づく',
    'val.sub':'ALCURAを支える科学 — 査読付きの結果とデバイス性能の予測。',
    'val.c1.title':'査読付きの結果','val.c1.desc':'スピルリナ微細藻類によるCO₂吸収とO₂生成に関する検証済み研究。',
    'val.c2.title':'CO₂削減予測','val.c2.desc':'ユニットあたり1か月の二酸化炭素吸収能力の推定値。',
    'val.c3.title':'VOC・HCHO除去','val.c3.desc':'屋内空気から揮発性有機化合物とホルムアルデヒドを除去する効果。',
    'val.unit1':'CO₂ / 月','val.unit2':'吸収','val.unit3':'きれいな空気',

    'val.kpi':'査読付き論文','val.lead.title':'査読に基づく基盤',
    'val.lead.desc':'ALCURAは39本の査読付き論文に基づき、PubMed・Consensusなどのデータベースで2018〜2026年を対象としたPRISMA準拠の系統的文献レビューを用いて開発されました。',
    'val.src.more':'+ 関連データベース',
    'val.m1':'屋内CO₂削減','val.m2':'微細藻類培養の生産性','val.m3':'HVACシステムのエネルギー消費','val.m4':'温熱快適性',

    'inst.tag':'設置','inst.title':'<em>4</em>ステップで稼働','inst.sub':'セットアップから収穫まで — ALCURAはすべてをシンプルに。',
    'inst.s1.title':'電源に接続','inst.s1.desc':'ALCURAを家庭用電源に接続します。',
    'inst.s2.title':'セットアップして起動','inst.s2.desc':'微細藻類をユニットに加え、すべての部品が正しく取り付けられていることを確認してから電源を入れます。',
    'inst.s3.title':'成長を監視','inst.s3.desc':'通知やALCURAウェブアプリの成長データで微細藻類の成長を監視します。',
    'inst.s4.title':'14日ごとに収穫','inst.s4.desc':'14日ごとに微細藻類を収穫して入れ替えます。',

    'feat.tag':'機能','feat.title':'1台で<em>7</em>つの生きた恩恵','feat.sub':'単なる装飾ランプではありません。あなたの空気と室内の健康のために働く小さな生態系です。',
    'feat.f1.title':'フォトバイオリアクターランプ','feat.f1.desc':'金属フレームにアクリル製フォトバイオリアクターを備えたランプ。オフィスやリビングの一角にぴったり。',
    'feat.f2.title':'能動的な空気浄化','feat.f2.desc':'CO₂を55〜90%吸収し、VOCを最大100%除去。PM2.5とPM10も低減します。',
    'feat.f3.title':'酸素生成','feat.f3.desc':'スピルリナ培養の光合成が新鮮なO₂を継続的に生み出します。',
    'feat.f4.title':'リアルタイム監視','feat.f4.desc':'スピルリナ培養の状態、バイオマス生産、CO₂–O₂濃度をリアルタイムで監視します。',
    'feat.f5.title':'スピルリナ培養','feat.f5.desc':'30日サイクルごとに高いバイオマスを収穫できます。',
    'feat.f6.title':'アンビエント照明','feat.f6.desc':'微細藻類の最適な成長のためにスペクトル調整可能なLED。',
    'feat.f7.title':'AIによる自動最適化','feat.f7.desc':'機械学習がLED・エアレーション・CO₂注入を調整します。',

    'innov.tag':'イノベーション','innov.title':'1台のデバイス、<em>2</em>つの生きたシステム','innov.sub':'1台が同時に2つの役割を果たします — 空気清浄機とフォトバイオリアクター。',
    'dual.row.how':'仕組み','dual.row.get':'得られるもの','dual.core':'1台',
    'dual.air.title':'空気清浄機','dual.air.lead':'生きた微細藻類が室内の空気を生物学的に浄化します — 単なるろ過ではありません。',
    'dual.air.how':'CO₂・VOC・微粒子を吸収し、新鮮な酸素を放出します。','dual.air.get':'使い捨てフィルター不要で、より健康的な空気。','dual.air.statlabel':'屋内CO₂吸収',
    'dual.bio.title':'フォトバイオリアクター','dual.bio.lead':'同じデバイスで栄養豊富なスピルリナを家庭で培養します。',
    'dual.bio.how':'スペクトル調整可能なLEDの下での光合成でスピルリナのバイオマスを育てます。','dual.bio.get':'AI最適化により毎サイクル栄養豊富な収穫を。','dual.bio.statlabel':'培養の生産性',
    'pf.co2':'空気中CO₂','pf.do':'溶存酸素','pf.harvest':'収穫準備',
    'innov.a.title':'室内空気品質','innov.a.desc':'ALCURAはCO₂を削減し、新鮮な空気とともにO₂を生み出し、空気清浄機として機能します：',
    'innov.a.li1':'CO₂を吸収し新鮮な酸素を放出','innov.a.li2':'空気清浄機のように空気をリフレッシュ','innov.a.li3':'室内のVOCと汚染物質を削減',
    'innov.b.title':'微細藻類培養','innov.b.desc':'ALCURAは健康効果が豊富なスピルリナのバイオマスを培養・サポートします：',
    'innov.b.li1':'栄養豊富なスピルリナのバイオマスを生成','innov.b.li2':'健康効果が豊富','innov.b.li3':'毎サイクル持続可能な収穫',
    'innov.fn1':'機能 01','innov.fn2':'機能 02','innov.a.pill':'空気清浄機','innov.b.pill':'フォトバイオリアクター',

    'cmp.tag':'比較','cmp.title':'なぜ<em>ALCURA</em>なのか？','cmp.sub':'単なる空気清浄機ではありません。従来の選択肢との比較をご覧ください。',
    'cmp.feature':'特徴','cmp.purifier':'HEPA空気清浄機','cmp.lamp':'スマートランプ',
    'cmp.r1':'浄化方式','cmp.r1.p':'HEPAフィルター（機械式）','cmp.r1.u':'生きた微細藻類（生物学的）',
    'cmp.r2':'酸素生成','cmp.r2.u':'約240 L/月',
    'cmp.r3':'消耗フィルター','cmp.r3.p':'3〜6か月ごと','cmp.r3.l':'なし','cmp.r3.u':'なし — 自己再生',
    'cmp.r4':'ランニングコスト','cmp.r4.p':'フィルター＋電力','cmp.r4.l':'電力','cmp.r4.u':'電力のみ',
    'cmp.r5':'アンビエント照明','cmp.r5.u':'スペクトル調整可能',
    'cmp.r6':'リアルタイムAI監視','cmp.r6.l':'基本的',
    'cmp.r7':'持続可能性','cmp.r7.p':'フィルター廃棄物','cmp.r7.l':'低負荷','cmp.r7.u':'カーボンネガティブ＋収穫',
    'cmp.takeaway':'ALCURAは空気浄化・酸素生成・培養を1台の持続可能なデバイスに統合します。',
    'cmp.note':'詳細な料金と具体的なブランドは近日公開。',

    'price.tag':'料金','price.title':'<em>生きた</em>プランを選ぶ','price.sub':'ご家庭からオフィス、成長するチームまで、3つの柔軟なプラン。','price.note':'30日間リスクなしでお試し · いつでもキャンセル可 · AIアップデート込み。',
    'price.p1.name':'Spore','price.p1.desc':'きれいな空気の旅を始めるために。','price.p1.f1':'ALCURA 1台','price.p1.f2':'基本監視','price.p1.f3':'収穫通知',
    'price.p2.name':'Bloom','price.p2.badge':'人気','price.p2.desc':'ALCURAをフルに体験。','price.p2.f1':'Sporeの全機能','price.p2.f2':'AI最適化（フル）','price.p2.f3':'収穫量予測','price.p2.f4':'無制限のデータ履歴',
    'price.p3.name':'Canopy','price.p3.desc':'より大きな空間とチームに。','price.p3.f1':'Bloomの全機能','price.p3.f2':'マルチユニットダッシュボード','price.p3.f3':'優先サポート',
    'price.choose':'プランを選ぶ','price.month':'/月',
    'price.bestseller':'ベストセラー','price.p1.tag':'スターター','price.p2.tag':'最も人気','price.p3.tag':'スケール',

    'team.tag':'チーム','team.title':'<em>ALCURA</em>を支える人々','team.sub':'生きた空気を生きた空間へ届ける7人のチーム。',
    'team.m1':'メンバー1','team.m2':'メンバー2','team.m3':'メンバー3','team.m4':'メンバー4','team.m5':'メンバー5','team.m6':'メンバー6','team.m7':'メンバー7',

    'rev.tag':'ユーザーレビュー','rev.title':'<em>声</em>をご紹介','rev.sub':'すでにきれいな空気を呼吸している空間からの実体験。',
    'rev.1.t':'「ALCURAを置いてから仕事場の空気が格段に新鮮に。アプリで培養を見守るのが楽しくて仕方ありません。」','rev.1.s':'インテリアデザイナー · ジャカルタ',
    'rev.2.t':'「美しくて機能的なデザイン。初めてのスピルリナ収穫がわずか28日で成功しました！」','rev.2.s':'ソフトウェアエンジニア · バンドン',
    'rev.3.t':'「AI最適化は完全おまかせ — 設置したら毎日きれいな空気を楽しむだけ。」','rev.3.s':'カフェオーナー · スラバヤ',
    'rev.4.t':'「会議室のCO₂が劇的に下がりました。来客によく『光る緑のランプ』について聞かれます。」','rev.4.s':'オフィスマネージャー · ジャカルタ',
    'rev.5.t':'「ヨガスタジオを営む身として空気品質は最重要。ALCURAは会員も実感できる違いです。」','rev.5.s':'ヨガスタジオオーナー · タンゲラン',
    'rev.6.t':'「交換するフィルターがなく、経済的でエコ。すぐに効果を実感できる投資です。」','rev.6.s':'スタートアップ創業者 · ジャカルタ',

    'faq.tag':'FAQ','faq.title':'よくある<em>質問</em>','faq.sub':'質問をタップすると回答が表示されます。',
    'faq.q1':'ALCURAとは？','faq.a1':'ALCURAは、スピルリナ微細藻類を培養するスマートなフォトバイオリアクターと空気清浄機を兼ねた多機能ランプです。空気を浄化し、酸素を生み出し、AIがリアルタイムで監視します。',
    'faq.q2':'屋内で安全に使えますか？','faq.a2':'はい。ALCURAは安全な屋内デバイスとして設計されています。微細藻類はチューブ内に完全に密閉されており、有害な粒子を空気中に放出しません。',
    'faq.q3':'スピルリナはどのくらいの頻度で収穫が必要ですか？','faq.a3':'通常は約30日のサイクルごとです。センサーデータに基づき、培養が収穫可能になるとアプリが通知します。',
    'faq.q4':'フィルターの交換は必要ですか？','faq.a4':'いいえ。従来の空気清浄機と異なり、ALCURAは生物学的に空気を浄化するため、使い捨てフィルターは不要です。',
    'faq.q5':'デバイスはどのように監視しますか？','faq.a5':'ALCURAアプリを通じて、DO・pH・温度・CO₂・培養状態をどこにいてもリアルタイムで確認できます。',

    'auth.tag':'始める','auth.title':'あなたの<em>空気</em>に命を吹き込む準備はできましたか？','auth.desc':'アカウントを作成またはログインしてALCURAの監視を始めましょう。簡単で無料です。',
    'auth.fs1.t':'登録','auth.fs1.s':'メールまたはGoogleでアカウントを作成。',
    'auth.fs2.t':'デバイスを接続','auth.fs2.s':'QRまたはBluetoothでALCURAを接続。',
    'auth.fs3.t':'監視','auth.fs3.s':'培養データをリアルタイムで確認。',

    'wl.label':'登録の準備はまだ？ ウェイトリストに参加：','wl.ph':'you@email.com','wl.btn':'参加',
    'wl.count':'人がすでに参加しています',
    'wl.success':'🎉 リストに登録されました！ALCURA公開時にメールでお知らせします。',
    'wl.invalid':'有効なメールアドレスを入力してください。',
    'wl.already':'このメールはすでに登録されています。公開時にお会いしましょう！',
    'social.title':'<em>ALCURA</em>とつながろう','social.desc':'SNSで私たちの歩みをフォローしてください。',
    'foot.tagline':'きれいな空気とスピルリナ培養のためのスマートなフォトバイオリアクターランプ — 空気を浄化し、酸素を生み出し、AIがリアルタイムで監視します。',
    'foot.product':'製品','foot.science':'科学と研究','foot.legal':'法的事項',
    'foot.l.features':'機能','foot.l.how':'仕組み','foot.l.pricing':'料金','foot.l.demo':'デモアプリ','foot.l.faq':'FAQ',
    'foot.l.evidence':'研究エビデンス','foot.l.innovation':'イノベーション','foot.l.comparison':'比較','foot.l.about':'会社概要',
    'foot.l.privacy':'プライバシーポリシー','foot.l.terms':'利用規約','foot.l.help':'ヘルプ',
    'footer.copy':'© 2026 ALCURA — Algae Cultivation Unit with Real-time AI.',
    'common.soon':'近日公開',
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
  if(tog){tog.classList.remove('id','en','ja');tog.classList.add(lang);tog.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));}
}
function setLang(lang){applyLang(lang);}

/* Render a simple research-style SVG trendline (same look as the app's
   ALCURA_HISTORY trend; uses the .trend CSS classes from styles.css). */
var __phTrendN=0;
function phTrend(host,vals){
  if(!host||!vals||!vals.length)return;
  var W=100,H=100,padY=10;
  var min=Math.min.apply(null,vals),max=Math.max.apply(null,vals),span=(max-min)||1,n=vals.length;
  var pts=vals.map(function(v,i){return [n>1?(i/(n-1))*W:W/2,(H-padY)-((v-min)/span)*(H-2*padY)];});
  var line='M '+pts.map(function(p){return p[0].toFixed(2)+' '+p[1].toFixed(2);}).join(' L ');
  var area=line+' L '+W+' '+H+' L 0 '+H+' Z';
  var last=pts[n-1];
  var grid=[25,50,75].map(function(gy){return '<line class="trend-grid" x1="0" y1="'+gy+'" x2="'+W+'" y2="'+gy+'" vector-effect="non-scaling-stroke"/>';}).join('');
  var gid='phTrend'+(++__phTrendN);
  host.classList.add('trend');
  host.innerHTML=
    '<svg class="trend-svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true">'+
    '<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ts-0"/><stop offset="1" class="ts-1"/></linearGradient></defs>'+
    grid+
    '<path class="trend-area" d="'+area+'" fill="url(#'+gid+')"/>'+
    '<path class="trend-line" d="'+line+'" vector-effect="non-scaling-stroke"/>'+
    '</svg>'+
    '<i class="trend-cap" style="left:'+last[0].toFixed(2)+'%;top:'+last[1].toFixed(2)+'%"></i>';
}

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

  // Trendline in the phone mock (mirrors the app's CO₂ trendline)
  const spark=document.getElementById('phSpark');
  if(spark)phTrend(spark,[42,48,55,60,52,46,40,44,50,58,62,57,49,45,53,59]);

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
    function render(){if(countEl){var L=document.documentElement.getAttribute('lang')||'id';countEl.textContent=(SEED+stored().length).toLocaleString(L==='en'?'en-US':L==='ja'?'ja-JP':'id-ID');}}
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
      // refresh the trendline when Home is visible
      if(spark&&phone.querySelector('.ph-view[data-view="home"]').classList.contains('active')){
        var d=[];for(var k=0;k<16;k++)d.push(38+Math.random()*30);phTrend(spark,d);
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
