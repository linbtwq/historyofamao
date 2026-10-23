const $=(s,r=document)=>[...r.querySelectorAll(s)],B=document.body,cl=(x,a,b)=>Math.min(b,Math.max(a,x));
const E=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
// слова, которые Амао пишет и сам же зачёркивает (рисуется красным зигзагом)
const SX=/(^|[^а-яё])(ненавид[а-яё]*|ненавист[а-яё]*|избива[а-яё]*|избиени[а-яё]*|блева[а-яё]*|рвот[а-яё]*)/gi;
const em=t=>E(t).replace(/\{\{(.+?)\}\}/g,'<mark class="hl">$1</mark>').replace(SX,(m,a,w)=>a+'<s class="sx">'+w+'</s>');
const LV={s8:1,s9:2,s10:2,s11:3,p2:3,s12:3,s13:3};
const rot=()=>(Math.random()*16-8).toFixed(1);
// настроение глав: от него зависит бумага, цвет и поведение текста (см. style.css)
const MOOD={s3:'roots',s4:'mother',s5:'father',s6:'granny',s7:'fight',s8:'child',s9:'teen',s10:'swing',s11:'loss'};
// абзацы, где он плачет, — на бумаге остаётся пятно от слезы
const WET=/плак|плач|рыда|рыдал|слез|истерик|плаксив/i;
const wp=t=>WET.test(t)?{c:' wet',s:` style="--tx:${(Math.random()*55+15)|0}%;--ty:${(Math.random()*60-15)|0}%"`}:{c:'',s:''};

let fired = 0, _themeKey = '', _curSec = null, _pages = [], _kscene = [];

// ============ Сцена ============
const KS=()=>`<svg viewBox="0 0 400 300" class="d" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
${P('M14 18h76v70h-76zM52 18v70M14 53h76',C.n)}${P('M20 36Q33 26 46 36Q33 46 20 36Z',C.k)}${pu(33,36,5)}
${O(312,68,20,'#222')}${P('M312 88V185M312 185L292 262M312 185L332 262M312 112L346 152','#222','',6)}
<g class="arm">${P('M312 112L262 152','#222','',6)}${P('M262 152L222 184L238 150Z','#555','#ddd')}</g>
${O(62,182,15,C.b)}${P('M62 197V250M62 250L50 285M62 250L74 285M62 214L48 192M62 214L76 192',C.b)}${P('M10 285H390','#8a8')}
${P('M20 215H380',C.n,'',6)}${P('M70 215V285M330 215V285',C.n,'',6)}
<svg class="kb" x="125" y="116" width="110" height="100" viewBox="0 0 100 100">${D.bunny()}</svg>
<svg class="kd" x="108" y="116" width="135" height="100" viewBox="0 0 100 100">${D.deadbunny()}</svg></svg>`;

const kscene=p=>`<section class="kscene" style="height:${(p.caps.length+1)*80}vh" data-n="${p.caps.length}" data-kill="${p.kill}"><div class="stage"><figure class="d-w ksw">${KS()}</figure><div class="caps">${p.caps.map(t=>`<p class="cap">${em(t)}</p>`).join('')}</div></div></section>`;

const blk=(bs,ci,c,first)=>{
  let pendingNote = null;
  return bs.map((p,i)=>{
    if (p.k === 'mnote') { pendingNote = p.t; return ''; }
    const dk=p.dk||c.dark;
    const note = pendingNote
      ? `<span class="mnote" style="--rot:${(Math.random()*12-6).toFixed(1)}deg">${em(pendingNote)}</span>`
      : '';
    pendingNote = null;

    // ===== РИТМ: каждый блок получает свой характер =====
    let extra = '';
    if (p.k === 'p') {
      if (i > 2 && i % 5 === 0) extra = ' inset';        // цветная врезка
      else if (i > 1 && i % 7 === 4) extra = ' whisper'; // тише
      else if (i > 3 && i % 4 === 1) extra = ' beat';    // пауза-многоточие
      else if (i > 5 && i % 6 === 2) extra = ' echo';    // эхо-повтор
    }

    const w=p.k==='p'?wp(p.t):{c:'',s:''};
    let h=p.k==='u'?`<ul>${p.i.map(x=>`<li class="rv">${em(x)}</li>`).join('')}</ul>`
        :p.k==='q'?`<p class="q rv">${em(p.t)}${note}</p>`
        :`<p class="rv${first&&!i?' fp':''}${extra}${w.c}"${w.s}>${em(p.t)}${note}</p>`;

    // Рисунок каждый 3-й абзац
    if(i%3==2&&i<bs.length-1&&p.k==='p'){
      const pool=c.mora?MO:dk?DK:(ART[c.id]||LT),n=pool[(Math.floor(i/3)+ci)%pool.length];
      h+=`<figure class="d-w ${i%2?'l':'r'}" style="--r:${rot()}deg">${svg(n)}</figure>`;
    }
    return h;
  }).join('');
};

// ============ Сборка ============
const st=[['star',16,8,12],['heart',14,82,16],['bunny',22,10,70],['sun',18,80,72],['flower',12,50,6]]
  .map(([n,w,l,t],i)=>`<figure class="stk" style="width:${w}vmin;left:${l}%;top:${t}%;--r:${i*9-18}deg">${svg(n)}</figure>`).join('');

let h=`<header class="cover">${st}<div class="label"><small>Дневник</small><h1>${DATA.name}</h1><div class="nick">🍓 клубничка</div><button class="lock" aria-label="открыть дневник"><svg viewBox="0 0 60 70" aria-hidden="true"><path class="sh" d="M16 32V22a14 14 0 0 1 28 0v10" fill="none" stroke="#d9b45a" stroke-width="6" stroke-linecap="round"/><rect x="8" y="30" width="44" height="34" rx="6" fill="#b8862f" stroke="#6b4a12" stroke-width="2"/><circle cx="30" cy="44" r="5" fill="#2a1604"/><rect x="28" y="46" width="4" height="10" rx="2" fill="#2a1604"/></svg></button></div><div class="hint">листай ↓</div></header>`;

h+=`<section class="page toc rv"><h2><span>Содержание</span></h2><ol>${DATA.chapters.map((c,i)=>c.part?`<li class="pt">${c.part} · ${c.title}</li>`:`<li><a href="#${c.id}">Глава ${c.num} · ${c.title}</a><b>${i+1}</b></li>`).join('')}</ol></section>`;

h+=`<section class="page tl rv"><h2><span>Мои даты</span></h2>${DATA.timeline.map(([y,a,c])=>`<div class="ti"><b>${y}</b><em>${a}</em><span>${c}</span></div>`).join('')}</section>`;

DATA.chapters.forEach((c,ci)=>{
  const r=`data-lv="${LV[c.id]||0}"${c.mora?' data-th="m"':''}${MOOD[c.id]?` data-mood="${MOOD[c.id]}"`:''}`;
  if(c.part){
    h+=`<section class="page part rv" ${r} id="${c.id}"><small>${c.part}</small><h2><span>${c.title}</span></h2><figure class="d-w">${svg(c.mora?'berry':c.dark?'eyes':'sun')}</figure><div class="nick">${c.nick||''}</div></section>`;
    return;
  }
  const k=c.blocks.findIndex(b=>b.k==='kscene'),A=k<0?c.blocks:c.blocks.slice(0,k);
  h+=`<section class="page" ${r} id="${c.id}"><div class="num">${c.num}</div>${c.id==='s4'?'<i class="grade rv" aria-hidden="true">4<small>/10</small></i>':''}<div class="chead rv"><div class="kick">Глава ${c.num}</div><h2><span>${c.title}</span></h2><div class="orn">${c.mora?'● ● ●':'🍓 🍓 🍓'}</div></div>${scene(c.id)}${blk(A,ci,c,1)}${k<0&&c.secret?`<aside class="secret rv"><h3>Вырванная страница</h3><div class="veil">${c.secret.map(p=>`<p>${E(p.t)}</p>`).join('')}</div><button>открыть</button></aside>`:''}<div class="pn">${ci+1}</div></section>`;
  if(k>=0){
    h+=kscene(c.blocks[k]);
    h+=`<section class="page cont" data-lv="1">${blk(c.blocks.slice(k+1),ci,c,0)}<div class="pn">${ci+1}</div></section>`;
  }
});

h+=`<details class="page notes"><summary>Замысел автора</summary><div>${DATA.notes.map(p=>p.k==='u'?p.i.map(x=>`<p>• ${E(x)}</p>`).join(''):`<p>${E(p.t)}</p>`).join('')}</div></details><footer class="end rv">продолжение следует</footer>`;
document.getElementById('app').innerHTML=h;

// ============ Кэш ============
_pages = [...document.querySelectorAll('.page[data-lv]')];
_kscene = [...document.querySelectorAll('.kscene')];

// ============ Появление блоков ============
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15, rootMargin: '0px 0px -50px 0px' });
$('.rv,.d-w,.stk').forEach(el => io.observe(el));

// ============ Тема ============
const applyTheme = (sec) => {
  if (!sec) return;
  const th = sec.dataset.th;
  const lv = sec.dataset.lv || '0';
  const isMora = th === 'm';
  const isDark = !isMora && (lv === '2' || lv === '3' || (lv === '1' && fired));
  const key = (isMora ? 'm' : isDark ? 'd' : 'l') + lv;
  if (key === _themeKey) return;
  _themeKey = key;

  if (B.classList.contains('mora') !== isMora) B.classList.toggle('mora', isMora);
  if (B.classList.contains('dk') !== isDark) B.classList.toggle('dk', isDark);
  if (isDark || isMora) {
    if (B.dataset.lv !== lv) B.dataset.lv = lv;
  } else if (B.hasAttribute('data-lv')) {
    B.removeAttribute('data-lv');
  }
};

const themeTick = () => {
  const mid = innerHeight * .5;
  let cur = null;
  for (let i = 0; i < _pages.length; i++) {
    const p = _pages[i];
    if (p.getBoundingClientRect().top <= mid) cur = p;
    else break;
  }
  _curSec = cur;
  applyTheme(cur);   // вызываем всегда — applyTheme сам гардит по _themeKey
  if (cur && cur.id) {
    try { localStorage.setItem('amao_pos', cur.id); } catch (e) {}
  }
};

// ============ Прогресс + сцена ============
const bar = document.getElementById('bar');
const tick = () => {
  bar.style.transform = `scaleX(${scrollY / Math.max(1, B.scrollHeight - innerHeight)})`;
  for (let j = 0; j < _kscene.length; j++) {
    const s = _kscene[j];
    const r = s.getBoundingClientRect();
    if (r.top > innerHeight || r.bottom < 0) continue;
    const n = +s.dataset.n, k = +s.dataset.kill;
    const p = cl(-r.top / (r.height - innerHeight), 0, .999);
    const i = Math.floor(p * n);
    const st = s.firstChild;
    st.style.setProperty('--q', cl(p * n / Math.max(1, k), 0, 1));
    const caps = s.querySelectorAll('.cap');
    for (let c = 0; c < caps.length; c++) caps[c].classList.toggle('on', c === i);
    if (i >= k) {
      st.classList.add('done');
      if (!fired) {
        fired = 1;
        B.classList.add('cut');
        setTimeout(themeTick, 700);
        setTimeout(() => B.classList.remove('cut'), 2600);
      }
    }
  }
};

// ============ Скролл ============
let ticking = false, scrollTimer = 0;
addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { tick(); ticking = false; });
    ticking = true;
  }
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(themeTick, 90);
}, { passive: true });
addEventListener('resize', () => setTimeout(themeTick, 100), { passive: true });

tick();
themeTick();

// ============ Прочее ============
$('.secret button').forEach(b => b.onclick = () => b.parentElement.classList.add('open'));

let _puT = 0;
addEventListener('pointermove', e => {
  const now = performance.now();
  if (now - _puT < 30) return;
  _puT = now;
  const x = (e.clientX / innerWidth - .5) * 6, y = (e.clientY / innerHeight - .5) * 6;
  const pus = document.querySelectorAll('.pu');
  for (let i = 0; i < pus.length; i++) pus[i].style.transform = `translate(${x}px,${y}px)`;
}, { passive: true });

// ============ Замок на обложке ============
$('.lock').forEach(b => b.onclick = () => {
  b.classList.add('open');
  setTimeout(() => document.querySelector('.toc')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 650);
});

// ============ Замирание ============
// Читатель остановился (в тёмных главах) — дневник затаивается.
// Стоит пошевелиться — вздрагивает.
(() => {
  let t = 0;
  const hold = () => { if (B.classList.contains('dk')) B.classList.add('still'); };
  const wake = () => {
    if (B.classList.contains('still')) {
      B.classList.remove('still');
      B.classList.add('jolt');
      setTimeout(() => B.classList.remove('jolt'), 450);
    }
    clearTimeout(t);
    t = setTimeout(hold, 5000);
  };
  ['scroll', 'pointermove', 'pointerdown', 'keydown', 'touchstart']
    .forEach(e => addEventListener(e, wake, { passive: true }));
  t = setTimeout(hold, 5000);
})();

// ============ «Продолжить чтение» ============
(() => {
  let saved = null;
  try { saved = localStorage.getItem('amao_pos'); } catch (e) {}
  if (!saved) return;
  const el = document.getElementById(saved);
  if (!el) return;
  const title = el.querySelector('.chead h2')?.textContent
             || el.querySelector('h2')?.textContent
             || 'прошлого места';
  const btn = document.createElement('button');
  btn.id = 'resume';
  btn.innerHTML = '▸ продолжить с «' + title.trim() + '»';
  btn.onclick = () => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    btn.classList.add('gone');
    setTimeout(() => btn.remove(), 600);
  };
  document.body.appendChild(btn);
  setTimeout(() => btn.classList.add('gone'), 20000);
})();