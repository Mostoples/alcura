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

    'cmp.tag':'Perbandingan','cmp.title':'Mengapa <em>ALCURA</em>?','cmp.sub':'Dibandingkan air purifier dan lampu konvensional di pasaran.',
    'cmp.feature':'Fitur','cmp.purifier':'Air Purifier Biasa','cmp.lamp':'Lampu Pintar',
    'cmp.r1':'Memurnikan udara','cmp.r2':'Memproduksi oksigen','cmp.r3':'Budi daya Spirulina','cmp.r4':'Pencahayaan ambient','cmp.r5':'Monitoring AI real-time','cmp.r6':'Tanpa filter habis pakai',

    'price.tag':'Langganan','price.title':'Pilih paket yang <em>hidup</em>','price.sub':'Harga, benefit, dan nama langganan — detail menyusul.',
    'price.p1.name':'Spora','price.p1.desc':'Untuk memulai perjalanan udara bersih.','price.p1.f1':'1 unit ALCURA','price.p1.f2':'Monitoring dasar','price.p1.f3':'Notifikasi panen',
    'price.p2.name':'Bloom','price.p2.badge':'Populer','price.p2.desc':'Untuk pengalaman penuh ALCURA.','price.p2.f1':'Semua fitur Spora','price.p2.f2':'Optimasi AI penuh','price.p2.f3':'Prediksi hasil panen','price.p2.f4':'Riwayat data tak terbatas',
    'price.p3.name':'Canopy','price.p3.desc':'Untuk ruang dan tim yang lebih besar.','price.p3.f1':'Semua fitur Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Dukungan prioritas',
    'price.choose':'Pilih Paket','price.month':'/bulan',

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

    'cmp.tag':'Comparison','cmp.title':'Why <em>ALCURA</em>?','cmp.sub':'Compared to conventional air purifiers and lamps on the market.',
    'cmp.feature':'Feature','cmp.purifier':'Typical Air Purifier','cmp.lamp':'Smart Lamp',
    'cmp.r1':'Purifies air','cmp.r2':'Produces oxygen','cmp.r3':'Cultivates Spirulina','cmp.r4':'Ambient lighting','cmp.r5':'Real-time AI monitoring','cmp.r6':'No disposable filters',

    'price.tag':'Pricing','price.title':'Choose a <em>living</em> plan','price.sub':'Pricing, benefits, and plan names — details coming soon.',
    'price.p1.name':'Spore','price.p1.desc':'To begin your clean-air journey.','price.p1.f1':'1 ALCURA unit','price.p1.f2':'Basic monitoring','price.p1.f3':'Harvest notifications',
    'price.p2.name':'Bloom','price.p2.badge':'Popular','price.p2.desc':'For the full ALCURA experience.','price.p2.f1':'Everything in Spore','price.p2.f2':'Full AI optimization','price.p2.f3':'Harvest yield predictions','price.p2.f4':'Unlimited data history',
    'price.p3.name':'Canopy','price.p3.desc':'For larger spaces and teams.','price.p3.f1':'Everything in Bloom','price.p3.f2':'Multi-unit dashboard','price.p3.f3':'Priority support',
    'price.choose':'Choose Plan','price.month':'/month',

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

  // Dot-nav active state (+ relocate the algae accent per section)
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

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;


  /* ---- Cursor-following glass glare ---- */
  if(finePointer){
    document.querySelectorAll('.glass').forEach(el=>{
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
        el.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
      });
    });
  }

  /* ---- Gentle 3D tilt toward the cursor ---- */
  if(finePointer && !reduced){
    const MAX=5; // degrees
    document.querySelectorAll('.feat-card,.team-card,.val-card,.step-card,.review-card,.price-card,.innov-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-.5;
        const py=(e.clientY-r.top)/r.height-.5;
        card.style.transform='perspective(900px) rotateX('+(-py*MAX).toFixed(2)+'deg) rotateY('+(px*MAX).toFixed(2)+'deg) translateY(-6px)';
      });
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
      dpr=Math.min(window.devicePixelRatio||1,2);
      w=canvas.clientWidth;h=canvas.clientHeight;
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=Math.round(Math.min(70,Math.max(26,(w*h)/26000)));
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
    function frame(){
      ctx.clearRect(0,0,w,h);
      const rgb=dotRGB();
      ctx.shadowColor='rgba('+rgb+',.6)';ctx.shadowBlur=6;
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
      raf=requestAnimationFrame(frame);
    }
    function start(){if(!raf)raf=requestAnimationFrame(frame);}
    function stop(){if(raf){cancelAnimationFrame(raf);raf=null;}}
    let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(resize,160);});
    document.addEventListener('visibilitychange',()=>{document.hidden?stop():start();});
    resize();start();
  })();
});
