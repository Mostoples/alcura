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
    'phone.hint':'Geser ke bawah','phone.health':'Culture Health · Hari 25/30',
    'phone.live':'Sensor Langsung','phone.harvest':'Panen Berikutnya','phone.trend':'Tren CO₂ 24 jam',
    'phone.harvest.sub':'Spirulina 83% siap','phone.harvest.val':'5 hari',

    'val.tag':'Validasi','val.title':'Dibangun di atas <em>data</em>, bukan klaim',
    'val.sub':'Landasan ilmiah pembuatan ALCURA — hasil peer-reviewed dan prediksi performa alat.',
    'val.c1.title':'Hasil Peer-Reviewed','val.c1.desc':'Studi tervalidasi tentang penyerapan CO₂ dan produksi O₂ oleh mikroalga Spirulina.',
    'val.c2.title':'Prediksi Pengurangan CO₂','val.c2.desc':'Estimasi kemampuan alat menyerap karbon dioksida per unit per bulan.',
    'val.c3.title':'Pemurnian VOC & HCHO','val.c3.desc':'Efektivitas penghilangan senyawa organik volatil dan formaldehida dari udara indoor.',
    'val.unit1':'CO₂ / bulan','val.unit2':'penyerapan','val.unit3':'udara bersih',

    'inst.tag':'Instalasi','inst.title':'Hidup dalam <em>empat</em> langkah','inst.sub':'Dari pemasangan sampai panen — ALCURA membuat semuanya sederhana.',
    'inst.s1.title':'Pasang & Pair','inst.s1.desc':'Scan QR atau hubungkan via Bluetooth. Aktif dalam hitungan menit.',
    'inst.s2.title':'Isi Kultur','inst.s2.desc':'Tuang starter Spirulina dan medium nutrisi ke dalam tabung.',
    'inst.s3.title':'AI Memantau','inst.s3.desc':'Sensor dan model ML menjaga kultur tetap optimal otomatis.',
    'inst.s4.title':'Panen & Nikmati','inst.s4.desc':'Aplikasi memberi tahu kapan Spirulina siap dipanen.',

    'feat.tag':'Fitur Alat','feat.title':'Satu unit, <em>lima</em> manfaat hidup','feat.sub':'Bukan sekadar lampu hias. Ini ekosistem mini untuk udara dan kesehatan ruangan Anda.',
    'feat.f1.title':'Pemurni Udara','feat.f1.desc':'Mikroalga menyerap CO₂ serta menghilangkan VOC dan formaldehida dari udara indoor.',
    'feat.f2.title':'Produksi Oksigen','feat.f2.desc':'Fotosintesis aktif menghasilkan O₂ segar terus-menerus, langsung ke ruangan Anda.',
    'feat.f3.title':'Budidaya Spirulina','feat.f3.desc':'Panen biomassa Spirulina bergizi tinggi tiap siklus, lengkap dengan prediksi hasil.',
    'feat.f4.title':'Lampu Ambient','feat.f4.desc':'LED tunable spectrum untuk pertumbuhan algae sekaligus pencahayaan estetik.',
    'feat.f5.title':'AI Optimasi','feat.f5.desc':'Model ML mengatur LED, aerasi, dan injeksi CO₂ otomatis untuk hasil maksimal.',
    'feat.f6.title':'Monitor Real-time','feat.f6.desc':'Sensor memantau DO, pH, suhu, dan kualitas udara — semua dalam genggaman.',

    'innov.tag':'Inovasi','innov.title':'Dua dunia dalam <em>satu</em> alat','innov.sub':'Manfaat nyata untuk kualitas udara dalam ruangan dan budi daya mikroalga.',
    'innov.a.title':'Kualitas Udara Dalam Ruangan','innov.a.desc':'Solusi alami untuk ruang yang lebih sehat:',
    'innov.a.li1':'Menyerap CO₂ dan melepas oksigen segar','innov.a.li2':'Menghilangkan VOC, asap, dan formaldehida','innov.a.li3':'Mengurangi ketergantungan filter HVAC',
    'innov.b.title':'Budi Daya Mikroalga','innov.b.desc':'Photobioreactor pintar di rumah Anda:',
    'innov.b.li1':'Produksi Spirulina bergizi tinggi','innov.b.li2':'Panen berkelanjutan tiap siklus','innov.b.li3':'Dioptimalkan AI untuk hasil maksimal',

    'cmp.tag':'Perbandingan','cmp.title':'Mengapa <em>ALCURA</em>?','cmp.sub':'Dibandingkan air purifier dan lampu konvensional di pasaran.',
    'cmp.feature':'Fitur','cmp.purifier':'Air Purifier Biasa','cmp.lamp':'Lampu Pintar',
    'cmp.r1':'Memurnikan udara','cmp.r2':'Memproduksi oksigen','cmp.r3':'Budi daya Spirulina','cmp.r4':'Pencahayaan ambient','cmp.r5':'Monitoring AI real-time','cmp.r6':'Tanpa filter habis pakai',

    'price.tag':'Langganan','price.title':'Pilih paket yang <em>hidup</em>','price.sub':'Harga, benefit, dan nama langganan — detail menyusul.',
    'price.p1.name':'Spora','price.p1.desc':'Untuk memulai perjalanan udara bersih.','price.p1.f1':'1 unit ALCURA','price.p1.f2':'Monitoring dasar','price.p1.f3':'Notifikasi panen',
    'price.p2.name':'Bloom','price.p2.badge':'Populer','price.p2.desc':'Untuk pengalaman penuh ALCURA.','price.p2.f1':'Semua fitur Spora','price.p2.f2':'Optimasi AI penuh','price.p2.f3':'Prediksi hasil panen','price.p2.f4':'Riwayat data tak terbatas',
    'price.p3.name':'Canopy','price.p3.desc':'Untuk ruang dan tim yang lebih besar.','price.p3.f1':'Semua fitur Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Dukungan prioritas',
    'price.choose':'Pilih Paket','price.month':'/bulan',

    'team.tag':'Tim Kami','team.title':'Orang di balik <em>ALCURA</em>','team.sub':'Tim yang menghidupkan udara untuk ruang yang hidup.',
    'team.role1':'Hardware & IoT','team.role2':'AI & Data','team.role3':'Bioproses','team.role4':'Produk & Desain',

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

    'social.title':'Tetap terhubung dengan <em>ALCURA</em>','social.desc':'Ikuti perjalanan kami di media sosial.',
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
    'phone.hint':'Scroll down','phone.health':'Culture Health · Day 25/30',
    'phone.live':'Live Sensors','phone.harvest':'Next Harvest','phone.trend':'CO₂ Trend 24h',
    'phone.harvest.sub':'Spirulina 83% ready','phone.harvest.val':'5 days',

    'val.tag':'Validation','val.title':'Built on <em>data</em>, not claims',
    'val.sub':'The science behind ALCURA — peer-reviewed results and predicted device performance.',
    'val.c1.title':'Peer-Reviewed Results','val.c1.desc':'Validated studies on CO₂ uptake and O₂ production by Spirulina microalgae.',
    'val.c2.title':'Predicted CO₂ Reduction','val.c2.desc':'Estimated carbon dioxide absorption capacity per unit per month.',
    'val.c3.title':'VOC & HCHO Removal','val.c3.desc':'Effectiveness in removing volatile organic compounds and formaldehyde from indoor air.',
    'val.unit1':'CO₂ / month','val.unit2':'absorption','val.unit3':'cleaner air',

    'inst.tag':'Installation','inst.title':'Alive in <em>four</em> steps','inst.sub':'From setup to harvest — ALCURA keeps everything simple.',
    'inst.s1.title':'Plug & Pair','inst.s1.desc':'Scan the QR or connect via Bluetooth. Live in minutes.',
    'inst.s2.title':'Fill the Culture','inst.s2.desc':'Pour the Spirulina starter and nutrient medium into the tube.',
    'inst.s3.title':'AI Monitors','inst.s3.desc':'Sensors and ML models keep the culture optimal automatically.',
    'inst.s4.title':'Harvest & Enjoy','inst.s4.desc':'The app tells you when the Spirulina is ready to harvest.',

    'feat.tag':'Features','feat.title':'One unit, <em>five</em> living benefits','feat.sub':'Not just a decorative lamp. A mini ecosystem working for your air and indoor health.',
    'feat.f1.title':'Air Purifier','feat.f1.desc':'Microalgae absorb CO₂ and remove VOCs and formaldehyde from indoor air.',
    'feat.f2.title':'Oxygen Production','feat.f2.desc':'Active photosynthesis produces fresh O₂ continuously, straight into your room.',
    'feat.f3.title':'Spirulina Cultivation','feat.f3.desc':'Harvest nutrient-rich Spirulina biomass each cycle, with yield predictions.',
    'feat.f4.title':'Ambient Lighting','feat.f4.desc':'Tunable-spectrum LEDs for algae growth and aesthetic lighting alike.',
    'feat.f5.title':'AI Optimization','feat.f5.desc':'ML models tune LEDs, aeration, and CO₂ injection automatically for peak yield.',
    'feat.f6.title':'Real-time Monitor','feat.f6.desc':'Sensors track DO, pH, temperature, and air quality — all in your hand.',

    'innov.tag':'Innovation','innov.title':'Two worlds in <em>one</em> device','innov.sub':'Real benefits for indoor air quality and microalgae cultivation.',
    'innov.a.title':'Indoor Air Quality','innov.a.desc':'A natural solution for healthier spaces:',
    'innov.a.li1':'Absorbs CO₂ and releases fresh oxygen','innov.a.li2':'Removes VOCs, smoke, and formaldehyde','innov.a.li3':'Reduces reliance on HVAC filters',
    'innov.b.title':'Microalgae Cultivation','innov.b.desc':'A smart photobioreactor at home:',
    'innov.b.li1':'Produces nutrient-rich Spirulina','innov.b.li2':'Sustainable harvest every cycle','innov.b.li3':'AI-optimized for maximum yield',

    'cmp.tag':'Comparison','cmp.title':'Why <em>ALCURA</em>?','cmp.sub':'Compared to conventional air purifiers and lamps on the market.',
    'cmp.feature':'Feature','cmp.purifier':'Typical Air Purifier','cmp.lamp':'Smart Lamp',
    'cmp.r1':'Purifies air','cmp.r2':'Produces oxygen','cmp.r3':'Cultivates Spirulina','cmp.r4':'Ambient lighting','cmp.r5':'Real-time AI monitoring','cmp.r6':'No disposable filters',

    'price.tag':'Pricing','price.title':'Choose a <em>living</em> plan','price.sub':'Pricing, benefits, and plan names — details coming soon.',
    'price.p1.name':'Spore','price.p1.desc':'To begin your clean-air journey.','price.p1.f1':'1 ALCURA unit','price.p1.f2':'Basic monitoring','price.p1.f3':'Harvest notifications',
    'price.p2.name':'Bloom','price.p2.badge':'Popular','price.p2.desc':'For the full ALCURA experience.','price.p2.f1':'Everything in Spore','price.p2.f2':'Full AI optimization','price.p2.f3':'Harvest yield predictions','price.p2.f4':'Unlimited data history',
    'price.p3.name':'Canopy','price.p3.desc':'For larger spaces and teams.','price.p3.f1':'Everything in Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Priority support',
    'price.choose':'Choose Plan','price.month':'/month',

    'team.tag':'Our Team','team.title':'The people behind <em>ALCURA</em>','team.sub':'The team bringing living air to living spaces.',
    'team.role1':'Hardware & IoT','team.role2':'AI & Data','team.role3':'Bioprocess','team.role4':'Product & Design',

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

    'social.title':'Stay connected with <em>ALCURA</em>','social.desc':'Follow our journey on social media.',
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
  document.documentElement.setAttribute('lang',lang);
  localStorage.setItem('lang',lang);
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

  // Scroll reveal
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Dot-nav active state
  const dots=[...document.querySelectorAll('.dot-nav a')];
  const sections=dots.map(d=>document.querySelector(d.getAttribute('href'))).filter(Boolean);
  if(sections.length){
    const so=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          dots.forEach(d=>d.classList.toggle('active',d.getAttribute('href')==='#'+e.target.id));
        }
      });
    },{threshold:.4});
    sections.forEach(s=>so.observe(s));
  }
});
