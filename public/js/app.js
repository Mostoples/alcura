(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})();
function toggleTheme(){const r=document.documentElement;const next=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',next);localStorage.setItem('theme',next);}
function go(name){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));const view=document.getElementById('view-'+name);if(view)view.classList.add('active');window.scrollTo(0,0);}
function togglePw(id,el){const inp=document.getElementById(id);const show=inp.type==='password';inp.type=show?'text':'password';el.className='ph '+(show?'ph-eye-slash':'ph-eye')+' eye';}
function toggleNav(){const n=document.getElementById('navLinks'),b=document.getElementById('burger');if(!n)return;const open=n.classList.toggle('open');if(b){const i=b.querySelector('i');if(i)i.className='ph '+(open?'ph-x':'ph-list');}}
function closeNav(){const n=document.getElementById('navLinks'),b=document.getElementById('burger');if(n)n.classList.remove('open');if(b){const i=b.querySelector('i');if(i)i.className='ph ph-list';}}

window.addEventListener('scroll',()=>{const n=document.getElementById('nav');if(n)n.classList.toggle('scrolled',window.scrollY>20);});

document.querySelectorAll('.bottom-nav .bn').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.bottom-nav .bn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.bottom-nav .bn i').forEach(i=>{i.className=i.className.replace('ph-fill','ph');});const ic=b.querySelector('i');if(ic)ic.className=ic.className.replace('ph ','ph-fill ');});});

(function(){const data=[42,48,55,60,52,46,40,38,44,50,58,62,57,49,45,41,47,53,59,64,55,48,43,46];const el=document.getElementById('spark');if(el)data.forEach(v=>{const b=document.createElement('div');b.className='bar';b.style.height=v+'%';b.style.opacity=(0.55+v/160).toFixed(2);el.appendChild(b);});})();

(function(){
  let bubbles='';
  const cols=[{x:118,r:3.2,dur:3.4,delay:0},{x:135,r:5,dur:4.2,delay:.8},{x:150,r:3.8,dur:3.0,delay:1.6},{x:165,r:5.6,dur:4.6,delay:.4},{x:182,r:3,dur:3.6,delay:2.2},{x:128,r:2.6,dur:2.8,delay:1.2},{x:172,r:4.2,dur:3.9,delay:2.6},{x:155,r:2.4,dur:2.6,delay:.2}];
  cols.forEach((b,i)=>{bubbles+='<circle cx="'+b.x+'" r="'+b.r+'" fill="url(#bub)" opacity="0.75"><animate attributeName="cy" from="232" to="92" dur="'+b.dur+'s" begin="'+b.delay+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.8;0.8;0" dur="'+b.dur+'s" begin="'+b.delay+'s" repeatCount="indefinite"/><animate attributeName="cx" values="'+b.x+';'+(b.x+(i%2?6:-6))+';'+b.x+'" dur="'+b.dur+'s" begin="'+b.delay+'s" repeatCount="indefinite"/></circle>';});
  let specks='';
  for(let i=0;i<22;i++){const cx=110+Math.random()*80,r=0.8+Math.random()*1.8,dur=4+Math.random()*4,d=Math.random()*5,sway=(Math.random()*16-8).toFixed(1);specks+='<circle cx="'+cx.toFixed(0)+'" cy="'+(150+Math.random()*70).toFixed(0)+'" r="'+r.toFixed(1)+'" fill="#1f6b3e" opacity="'+(0.3+Math.random()*0.4).toFixed(2)+'"><animate attributeName="cy" values="225;100;225" dur="'+dur.toFixed(1)+'s" begin="'+d.toFixed(1)+'s" repeatCount="indefinite"/><animate attributeName="cx" values="'+cx.toFixed(0)+';'+(cx+ +sway).toFixed(0)+';'+cx.toFixed(0)+'" dur="'+dur.toFixed(1)+'s" begin="'+d.toFixed(1)+'s" repeatCount="indefinite"/></circle>';}
  const svg='<svg viewBox="0 0 300 300" width="240" height="240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Animated photobioreactor with live Spirulina culture">'+
  '<defs>'+
  '<linearGradient id="cult" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4fbf78"/><stop offset="45%" stop-color="#2e9c5b"/><stop offset="100%" stop-color="#13502f"/></linearGradient>'+
  '<linearGradient id="glassG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="18%" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="50%" stop-color="#ffffff" stop-opacity="0"/><stop offset="82%" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.35"/></linearGradient>'+
  '<radialGradient id="bub" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="60%" stop-color="#d7f5e3" stop-opacity="0.5"/><stop offset="100%" stop-color="#bfeccf" stop-opacity="0.15"/></radialGradient>'+
  '<radialGradient id="ledglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#7dffae" stop-opacity="0.55"/><stop offset="100%" stop-color="#7dffae" stop-opacity="0"/></radialGradient>'+
  '<linearGradient id="capG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3a4a40"/><stop offset="100%" stop-color="#1d2823"/></linearGradient>'+
  '<clipPath id="tubeClip"><rect x="100" y="92" width="100" height="146" rx="50"/></clipPath>'+
  '</defs>'+
  '<ellipse cx="150" cy="165" rx="120" ry="120" fill="url(#ledglow)"><animate attributeName="rx" values="112;126;112" dur="5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;1;0.7" dur="5s" repeatCount="indefinite"/></ellipse>'+
  '<ellipse cx="150" cy="262" rx="62" ry="13" fill="#0f1a13" opacity="0.5"/>'+
  '<rect x="108" y="244" width="84" height="20" rx="9" fill="url(#capG)"/>'+
  '<rect x="100" y="92" width="100" height="146" rx="50" fill="#0e2c1c" opacity="0.25"/>'+
  '<g clip-path="url(#tubeClip)">'+
  '<rect x="100" y="100" width="100" height="138" fill="url(#cult)"/>'+
  '<ellipse cx="150" cy="170" rx="60" ry="44" fill="#56c47e" opacity="0.18"><animate attributeName="rx" values="58;64;58" dur="6s" repeatCount="indefinite"/><animate attributeName="cy" values="168;176;168" dur="6s" repeatCount="indefinite"/></ellipse>'+
  specks+bubbles+
  '<path fill="#bff0d0" opacity="0.85"><animate attributeName="d" values="M100,104 Q150,98 200,104 L200,112 L100,112 Z;M100,102 Q150,108 200,102 L200,112 L100,112 Z;M100,104 Q150,98 200,104 L200,112 L100,112 Z" dur="4s" repeatCount="indefinite"/></path>'+
  '</g>'+
  '<rect x="126" y="230" width="48" height="7" rx="3" fill="#26352d"/>'+
  '<circle cx="134" cy="233" r="1.4" fill="#0c130e"/><circle cx="142" cy="233" r="1.4" fill="#0c130e"/><circle cx="150" cy="233" r="1.4" fill="#0c130e"/><circle cx="158" cy="233" r="1.4" fill="#0c130e"/><circle cx="166" cy="233" r="1.4" fill="#0c130e"/>'+
  '<rect x="100" y="92" width="100" height="146" rx="50" fill="url(#glassG)"/>'+
  '<rect x="100" y="92" width="100" height="146" rx="50" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.4"/>'+
  '<rect x="113" y="104" width="9" height="118" rx="4.5" fill="#ffffff" opacity="0.30"/>'+
  '<rect x="112" y="78" width="76" height="26" rx="13" fill="url(#capG)"/>'+
  '<rect x="120" y="84" width="60" height="6" rx="3" fill="#7dffae" opacity="0.9"><animate attributeName="opacity" values="0.55;1;0.55" dur="2.6s" repeatCount="indefinite"/></rect>'+
  '<circle cx="150" cy="74" r="4" fill="#7dffae"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/></circle>'+
  '</svg>';
  const stage=document.getElementById('pbrStage');if(stage)stage.innerHTML=svg;
})();
