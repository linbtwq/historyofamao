const $ = (s, r = document) => [...r.querySelectorAll(s)], B = document.body;
const E = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const SX = /(^|[^а-яё])(ненавид[а-яё]*|ненавист[а-яё]*|избива[а-яё]*|избиени[а-яё]*|блева[а-яё]*|рвот[а-яё]*)/gi;
const em = t => E(t).replace(/\{\{(.+?)\}\}/g, '<mark class="hl">$1</mark>').replace(SX, (m, a, w) => a + '<s class="sx">' + w + '</s>');
const MOOD = { s3: 'roots', s4: 'mother', s5: 'father', s6: 'granny', s7: 'fight', s8: 'child', s9: 'teen', s10: 'swing', s11: 'loss' };
const WET = /плак|плач|рыда|рыдал|слез|истерик|плаксив/i;
const wp = t => WET.test(t) ? { c: ' wet', s: ` style="--tx:${(Math.random() * 55 + 15) | 0}%;--ty:${(Math.random() * 60 - 15) | 0}%"` } : { c: '', s: '' };
const LV = { s8: 1, s9: 2, s10: 2, s11: 3, p2: 3, s12: 3, s13: 3 };
const REDUCED = matchMedia('(prefers-reduced-motion:reduce)').matches;
const FLIP_MS = REDUCED ? 40 : 1000;

/* ---------- рисунок-каракуля в начале главы ---------- */
// ВАЖНО: все имена должны существовать в doodles.js (раньше 'mother', 'fist', 'knife'… не существовали → книга падала)
const CH_DOODLE = { s3: 'house', s4: 'needle', s5: 'cleaver', s6: 'granny', s7: 'bolt', s8: 'bunny', s9: 'eyes', s10: 'moon', s11: 'blacksun', s12: 'moon', s13: 'smile' };
function getDoodle(id) {
  if (typeof svg !== 'function') return '';
  const name = CH_DOODLE[id];
  if (!name || typeof D[name] !== 'function') return '';
  return `<figure class="d-w r" style="--r:-4deg">${svg(name)}</figure>`;
}

/* ---------- блоки ---------- */
// рисунок кладём ПЕРЕД <p>: <figure> внутри <p> браузер разваливает на куски
const renderPara = (t, first, chapter) => {
  const w = wp(t);
  return (first ? getDoodle(chapter.id) : '') + `<p class="${first ? 'fp' : ''}${w.c}"${w.s}>${em(t)}</p>`;
};

function renderBlock(block, chapter, first) {
  if (block.k === 'raw') return block.html;
  if (block.k === 'p') return renderPara(block.t, first, chapter);
  if (block.k === 'q') return `<p class="q">${em(block.t)}</p>`;
  if (block.k === 'u') return `<ul>${block.i.map(x => `<li>${em(x)}</li>`).join('')}</ul>`;
  if (block.k === 'mnote') return `<span class="mnote" style="--rot:${(Math.random() * 12 - 6).toFixed(1)}deg">${em(block.t)}</span>`;
  return '';
}

/* ---------- интерактивная сцена с кроликом ---------- */
const sp = (d, a = '') => `<path d="${d}" pathLength="1" ${a}/>`;
function sceneSVG() {
  const BR = '#8d5a2b', RED = '#c1121f', SK = '#e8b894';
  return `<svg viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <g stroke="${BR}" opacity=".85">
    ${sp('M16 272H384')}
    ${sp('M36 74H132')}${sp('M48 74V52H70V74')}${sp('M86 74V44H112V74')}${sp('M118 74V60H130V74')}
    ${sp('M160 20V128')}${sp('M142 128H178')}${sp('M142 128V142M151 128V142M160 128V142M169 128V142M178 128V142')}
  </g>
  <g stroke="${BR}" stroke-width="4">
    ${sp('M84 190H292')}${sp('M84 190V199H292V190')}${sp('M96 199V272')}${sp('M280 199V272')}
  </g>
  <g class="boy">
    <circle cx="50" cy="168" r="14" stroke="currentColor"/>
    <circle cx="45" cy="166" r="3" fill="currentColor" stroke="none"/><circle cx="56" cy="166" r="3" fill="currentColor" stroke="none"/>
    ${sp('M46 176Q50 180 54 176')}
    ${sp('M50 182V236')}${sp('M50 194L38 224')}${sp('M50 194L62 224')}${sp('M50 236L42 272')}${sp('M50 236L58 272')}
  </g>
  <g class="kb">
    ${sp('M168 188C160 164 184 152 214 158C240 154 258 172 250 188Z', 'fill="#8d8d8d22" stroke="#555"')}
    <circle cx="170" cy="168" r="14" stroke="#555"/>
    ${sp('M162 156C154 124 168 118 172 152', 'stroke="#555"')}${sp('M176 152C184 120 198 122 184 156', 'stroke="#555"')}
    <circle cx="166" cy="166" r="2.6" fill="#555" stroke="none"/><circle cx="159" cy="172" r="2" fill="${RED}" stroke="none"/>
    <circle cx="254" cy="176" r="6" stroke="#555"/>
  </g>
  <g class="kd">
    ${sp('M162 190C166 170 236 168 256 190Z', 'fill="#ddd5c455" stroke="#777"')}
    <circle cx="160" cy="184" r="11" stroke="#777"/>
    ${sp('M152 178C132 172 126 180 138 186', 'stroke="#777"')}
    ${sp('M155 179l6 6M161 179l-6 6', `stroke="${RED}"`)}
    ${sp('M236 190L254 202', 'stroke="#777"')}
    ${sp('M140 194C164 210 252 210 276 194', `stroke="${RED}" stroke-width="6"`)}
    ${sp('M268 198V208', `stroke="${RED}" stroke-width="4"`)}
  </g>
  <g class="father">
    ${sp('M302 108Q332 96 360 108L368 272H296Z', 'stroke="#555" fill="#3a86ff22"')}
    ${sp('M332 196V272', 'stroke="#555"')}
    <circle cx="334" cy="64" r="22" stroke="#555"/>
    <circle cx="324" cy="62" r="2.6" fill="#555" stroke="none"/>
    ${sp('M318 76Q326 82 336 76', 'stroke="#555"')}
  </g>
  <g class="arm">
    ${sp('M312 112L280 138', 'stroke="#3a86ff" stroke-width="10"')}
    <circle cx="280" cy="138" r="6.5" fill="${SK}" stroke="#555" stroke-width="2"/>
    ${sp('M280 138L266 148', `stroke="${BR}" stroke-width="7"`)}
    ${sp('M268 144L262 156L240 160Z', 'fill="#e9edf2" stroke="#444" stroke-width="2.4"')}
  </g>
</svg>`;
}

function sceneHTML(b) {
  const caps = b.caps.map((t, i) =>
    `<p class="cap${/\{\{/.test(t) ? ' climax' : ''}" data-i="${i}">${em(t)}</p>`).join('');
  return `<div class="scene-page" data-kill="${b.kill}" data-step="-1" style="--q:.12">
    <div class="scene-img">${sceneSVG()}<div class="scene-kill">нажми, чтобы читать дальше</div></div>
    <div class="scene-caps">${caps}</div>
    <div class="scene-ctl"><button class="scene-next" type="button">дальше ›</button><span class="scene-step"></span></div>
  </div>`;
}

// темп сцены: сколько мс кнопка «дальше» остаётся заблокированной после показа реплики
const holdFor = (i, kill, n) =>
  i === kill - 2 ? 1800 :      // замах
  i === kill - 1 ? 3200 :      // «Он просто замер…» — даём прожить момент
  i === kill ? 2600 :          // удар
  i === n - 1 ? 0 : 900;

function sceneStep(sp_) {
  if (sp_.dataset.lock === '1') return;
  const caps = $('.cap', sp_), n = caps.length, kill = +sp_.dataset.kill;
  let i = +sp_.dataset.step;
  if (i >= n - 1) return;
  i++;
  sp_.dataset.step = i;
  sp_.classList.add('running');
  caps.forEach((c, j) => c.classList.toggle('on', j === i));

  // рука: спокойно → берёт нож → замах
  const q = i < kill - 3 ? .12 : i === kill - 3 ? .2 : 1;
  sp_.style.setProperty('--q', q);
  if (i >= kill - 2 && i < kill) B.classList.add('still');

  if (i === kill) {
    B.classList.remove('still');
    setTimeout(() => {
      sp_.classList.add('kill');
      B.classList.add('jolt', 'cut');
      setTimeout(() => B.classList.remove('jolt', 'cut'), 3000);
      setTimeout(() => sp_.classList.add('done'), 900);
    }, 500);
  }

  const btn = $('.scene-next', sp_)[0], step = $('.scene-step', sp_)[0];
  step.textContent = `${i + 1} / ${n}`;
  if (i >= n - 1) {
    btn.textContent = 'конец сцены';
    btn.disabled = true;
    return;
  }
  const ms = holdFor(i, kill, n);
  if (ms) {
    sp_.dataset.lock = '1'; btn.disabled = true; btn.classList.add('wait');
    setTimeout(() => { sp_.dataset.lock = '0'; btn.disabled = false; btn.classList.remove('wait'); }, ms);
  }
  btn.textContent = 'дальше ›';
}

/* ---------- секрет (спойлер-плашка) ---------- */
const secretHTML = items => `<div class="secret">
  <h3>Секрет Амао</h3>
  <div class="veil">${items.map(b => `<p>${em(b.t)}</p>`).join('')}</div>
  <button type="button">держи, чтобы открыть</button>
</div>`;

/* ---------- темы ---------- */
const themeOf = c => {
  const mora = !!c?.mora, lv = LV[c?.id] || 0;
  return { mora, lv, dk: !mora && (lv === 2 || lv === 3 || (lv === 1 && !!c?.dark)) };
};
const setTheme = t => { B.classList.toggle('mora', !!t.mora); B.classList.toggle('dk', !!t.dk); };

/* ---------- измерение: вкладываем блоки в настоящий лист и смотрим, влезает ли ---------- */
let probe = null;
function makeProbe() {
  const book = document.getElementById('book');
  const sh = document.createElement('div');
  sh.className = 'sheet';
  sh.style.cssText = 'visibility:hidden;pointer-events:none;transition:none';
  sh.innerHTML = '<div class="sheet-inner"><div style="height:100%;overflow:hidden;position:relative"><div class="sheet-content"></div></div></div>';
  book.appendChild(sh);
  probe = sh;
  return sh.querySelector('.sheet-content');
}

const sentences = text => {
  const raw = text.match(/[^.!?…]+(?:[.!?…]+["»)]*|$)\s*/g) || [text];
  const out = [];
  raw.forEach(s => {
    s = s.trim(); if (!s) return;
    const last = out[out.length - 1];
    const open = last && ((last.match(/\{\{/g) || []).length > (last.match(/\}\}/g) || []).length);
    if (open) out[out.length - 1] = last + ' ' + s; else out.push(s);
  });
  return out;
};

function paginateChapter(c) {
  setTheme(themeOf(c));
  const cont = makeProbe();
  const fits = h => { cont.innerHTML = h; return cont.scrollHeight <= cont.clientHeight + 1; };

  const head = `<div class="chapter-head">
      <div class="chapter-num">Глава ${c.num}</div>
      <h2><span>${c.title}</span></h2>
      <div class="chapter-orn">${c.mora ? '● ● ●' : '🍓 🍓 🍓'}</div>
    </div>`;

  const out = [];           // { html, scene? }
  let html = head;
  let first = true;
  const flush = () => { if (html) out.push({ html }); html = ''; };

  const addPara = text => {
    let rest = sentences(text);
    while (rest.length) {
      let k = 0;
      for (let i = 1; i <= rest.length; i++) {
        if (fits(html + renderPara(rest.slice(0, i).join(' '), first, c))) k = i; else break;
      }
      if (k === 0) {
        if (html) { flush(); continue; }
        k = 1; // одно предложение длиннее страницы — кладём как есть
      }
      html += renderPara(rest.slice(0, k).join(' '), first, c);
      first = false;
      rest = rest.slice(k);
      if (rest.length) flush();
    }
  };

  (c.blocks || []).forEach(b => {
    if (b.k === 'kscene') { flush(); out.push({ html: sceneHTML(b), scene: true }); return; }
    if (b.k === 'p') { addPara(b.t); return; }
    const piece = renderBlock(b, c, false);
    if (!piece) return;
    if (fits(html + piece)) { html += piece; return; }
    flush(); html = piece;
  });
  flush();

  if (c.secret && c.secret.length) out.push({ html: secretHTML(c.secret), secret: true });

  probe.remove();
  return out;
}

/* ---------- оглавление и хронология ---------- */
const renderTOC = start => `<div class="chapter-head">
    <div class="chapter-num">Оглавление</div>
    <h2><span>Содержание</span></h2>
    <div class="chapter-orn">✦</div>
  </div>
  <ol style="list-style:none;padding:0;margin-top:6px">
  ${DATA.chapters.map(c => c.part
    ? `<li style="margin:12px 0 4px;font:700 1.05rem 'Caveat',cursive;color:var(--hd);cursor:pointer" data-go="${c.id}">${c.part} · ${c.title}</li>`
    : `<li style="display:flex;align-items:baseline;gap:8px;margin:3px 0;font-size:.9rem;cursor:pointer;padding:4px 0" data-go="${c.id}"><span style="flex:1;border-bottom:1px dotted var(--line)">Глава ${c.num} · ${c.title}</span><b>${start[c.id] + 1}</b></li>`
  ).join('')}
  </ol>`;

const renderTL = () => `<div class="chapter-head">
    <div class="chapter-num">Хронология</div>
    <h2><span>Мои даты</span></h2>
    <div class="chapter-orn">✦</div>
  </div>
  ${DATA.timeline.map(([y, a, c]) => `
    <div style="display:flex;gap:10px;align-items:baseline;padding:6px 0;border-bottom:1px dotted var(--line);font-size:.9rem">
      <b style="font:700 1.2rem 'Caveat',cursive;color:var(--hd);min-width:2.7rem">${y}</b>
      <em style="font-style:italic;flex:1">${E(a)}</em>
      <span style="font:italic .8rem 'EB Garamond',serif;color:var(--ink-soft)">${E(c)}</span>
    </div>`).join('')}`;

const renderPart = c => `<div class="part-page">
    <div>
      <small>${c.part}</small>
      <h2>${c.title}</h2>
      <figure class="d-w" style="--r:0deg">${svg(c.mora ? 'berry' : c.dark ? 'eyes' : 'sun')}</figure>
      <div class="nick">${c.nick || ''}</div>
    </div>
  </div>`;

/* ---------- сборка страниц ---------- */
let pages = [];
let chapterStartPage = {};

function buildPages() {
  const body = [];
  const start = {};
  DATA.chapters.forEach(c => {
    start[c.id] = body.length + 2; // +2: оглавление и хронология
    if (c.part) {
      body.push({ content: renderPart(c), kind: 'part', chapter: c, theme: themeOf(c) });
      return;
    }
    const theme = themeOf(c);
    paginateChapter(c).forEach(ch => {
      body.push({
        content: `<div class="sheet-content${ch.secret ? ' has-secret' : ''}"${MOOD[c.id] ? ` data-mood="${MOOD[c.id]}"` : ''}>${ch.html}</div><div class="num">${c.num}</div>`,
        kind: ch.scene ? 'scene' : 'chapter', chapter: c, theme
      });
    });
  });
  chapterStartPage = start;
  pages = [
    { content: renderTOC(start), kind: 'front', theme: themeOf(null) },
    { content: renderTL(), kind: 'front', theme: themeOf(null) },
    ...body
  ];
}

/* ---------- книга ---------- */
let sheets = [], total = 0, cur = 0, animating = false;

function layoutZ() {
  sheets.forEach((s, i) => {
    s.classList.remove('cur');
    if (i < cur) {
      s.classList.add('flipped'); s.style.visibility = 'hidden'; s.style.zIndex = 50 + i;
    } else if (i === cur) {
      s.classList.remove('flipped'); s.style.visibility = 'visible'; s.style.zIndex = 100;
      // двойной rAF — чтобы рисунки и зачёркивания именно «рисовались» при появлении страницы
      requestAnimationFrame(() => requestAnimationFrame(() => { if (sheets[cur] === s) s.classList.add('cur'); }));
    } else {
      s.classList.remove('flipped'); s.style.visibility = 'hidden'; s.style.zIndex = 100 - i;
    }
  });
  inkSync();
}

function updateUI() {
  if (!sheets[cur]) return;
  $('.book-nav .pos b')[0].textContent = cur + 1;
  $('.book-nav .pos i')[0].textContent = total;
  $('.book-nav .prev')[0].disabled = cur === 0;
  $('.book-nav .next')[0].disabled = cur === total - 1;
  const pg = pages[cur];
  setTheme(pg.theme || themeOf(null));
  if (pg.kind !== 'scene') B.classList.remove('still');
  persistUI();
}

function goto(target) {
  if (animating || target === cur || target < 0 || target >= total) return;
  animating = true;
  const dir = target > cur ? 1 : -1;
  const outgoing = sheets[cur], incoming = sheets[target];
  outgoing.style.visibility = 'visible';
  incoming.style.visibility = 'visible';
  outgoing.classList.remove('cur');

  if (dir > 0) {
    outgoing.style.zIndex = 200; incoming.style.zIndex = 99;
    outgoing.classList.add('flipped');
  } else {
    outgoing.style.zIndex = 99; incoming.style.zIndex = 200;
    incoming.classList.remove('flipped');
  }
  setTheme(pages[target].theme || themeOf(null));

  setTimeout(() => { cur = target; layoutZ(); updateUI(); animating = false; }, FLIP_MS);
}

function initBook(pos) {
  const book = document.getElementById('book');
  book.innerHTML = '';
  buildPages();
  sheets = [];
  pages.forEach((p, i) => {
    const sh = document.createElement('div');
    sh.className = 'sheet';
    sh.dataset.i = i;
    sh.innerHTML = `<div class="sheet-inner"><div style="height:100%;overflow:hidden;position:relative">${p.content}<div class="pn">${i + 1}</div></div><i class="ribbon"></i></div>`;
    book.appendChild(sh);
    sheets.push(sh);
  });
  total = sheets.length;
  cur = resolvePos(pos);
  animating = false;
  layoutZ();
  updateUI();
}

function fit() {
  const stage = $('.book-stage')[0], book = document.getElementById('book');
  if (!stage || !book) return;
  const W = stage.clientWidth - 24, H = stage.clientHeight - 24;
  const bw = book.offsetWidth || 560, bh = book.offsetHeight || 800;
  book.style.setProperty('--s', Math.min(W / bw, H / bh, 1.25).toFixed(4));
}

/* ---------- переход на страницу ---------- */
function openJump() {
  let j = $('.page-jump')[0];
  if (!j) {
    j = document.createElement('div');
    j.className = 'page-jump';
    j.innerHTML = `<div class="page-jump-form"><h3>Перейти на страницу</h3><p></p>
      <input type="number" inputmode="numeric" min="1"><div class="actions">
      <button class="jump-cancel" type="button">отмена</button><button class="jump-bm" type="button">к закладке</button><button class="jump-go" type="button">перейти</button></div></div>`;
    document.body.appendChild(j);
    const close = () => j.classList.remove('open');
    const go = () => { const n = parseInt($('input', j)[0].value, 10); if (n >= 1 && n <= total) { close(); goto(n - 1); } };
    $('.jump-cancel', j)[0].onclick = close;
    $('.jump-go', j)[0].onclick = go;
    $('.jump-bm', j)[0].onclick = () => { close(); const b = bmIdx(); if (b >= 0) goto(b); };
    j.addEventListener('click', e => { if (e.target === j) close(); });
    $('input', j)[0].addEventListener('keydown', e => { if (e.key === 'Enter') go(); if (e.key === 'Escape') close(); });
  }
  $('p', j)[0].textContent = `от 1 до ${total}`;
  $('.jump-bm', j)[0].style.display = bmIdx() >= 0 ? '' : 'none';
  const inp = $('input', j)[0]; inp.max = total; inp.value = cur + 1;
  j.classList.add('open'); setTimeout(() => inp.select(), 50);
}

/* ---------- события ---------- */
$('.book-nav .next')[0].onclick = () => goto(cur + 1);
$('.book-nav .prev')[0].onclick = () => goto(cur - 1);
$('.book-nav .pos')[0].onclick = openJump;

document.addEventListener('click', e => {
  const t = e.target;
  const go = t.closest('[data-go]');
  if (go) { const idx = chapterStartPage[go.dataset.go]; if (idx !== undefined) goto(idx); return; }
  const sc = t.closest('.scene-page');
  if (sc && (t.closest('.scene-kill') || t.closest('.scene-next'))) { sceneStep(sc); return; }
  if (!t.closest('.panel,.tool')) pSet.classList.remove('open');
  const fig = t.closest('.d-w');
  if (fig) redraw(fig);
});

document.addEventListener('keydown', e => {
  if (!B.classList.contains('opened') || e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goto(cur + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') goto(cur - 1);
});

let tx = null;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  if (tx === null) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 60 && !B.classList.contains('pen') && !e.target.closest('.scene-page,.page-jump,.panel')) goto(cur + (dx < 0 ? 1 : -1));
}, { passive: true });

$('.lock')[0].addEventListener('click', function () {
  this.classList.add('open');
  setTimeout(async () => {
    B.classList.add('opened');
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (_) { } }
    applyPrefs();
    fit();
    initBook(store.get('amao.pos', null));
    if (cur > 1) toast('Книга открыта там, где чтение остановилось');
  }, 400);
});

let sig = '', rz;
window.addEventListener('resize', () => {
  fit();
  clearTimeout(rz);
  rz = setTimeout(() => {
    if (!sheets.length) return;
    const book = document.getElementById('book');
    const s = book.offsetWidth + 'x' + book.offsetHeight;
    if (sig && s !== sig) initBook(posOf(cur));
    sig = s;
  }, 400);
});
window.addEventListener('load', () => { fit(); const b = document.getElementById('book'); sig = b.offsetWidth + 'x' + b.offsetHeight; });


/* =====================================================================
   Память (настройки, место, закладка), рисование на полях, секрет «удерживай»
   ===================================================================== */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { } }
};
const FS_STEPS = [.9, 1, 1.15, 1.3];
let prefs = Object.assign({ fs: 1, font: 'hand' }, store.get('amao.prefs', {}));
let bm = store.get('amao.bm', null);
const inkData = store.get('amao.ink', {});
let inkColor = '#c1121f';

const tSet = $('.t-set')[0], tPen = $('.t-pen')[0], tBm = $('.t-bm')[0];

/* положение в книге в виде «глава + доля», чтобы переживать смену размера шрифта */
function posOf(i) {
  const p = pages[i];
  if (!p || !p.chapter) return { f: i };
  const idx = []; pages.forEach((q, j) => { if (q.chapter && q.chapter.id === p.chapter.id) idx.push(j); });
  return { ch: p.chapter.id, k: idx.indexOf(i), n: idx.length };
}
function resolvePos(pos) {
  if (!pos) return 0;
  if (pos.f !== undefined) return Math.max(0, Math.min(pos.f, pages.length - 1));
  const st = chapterStartPage[pos.ch];
  if (st === undefined) return 0;
  const m = pages.filter(q => q.chapter && q.chapter.id === pos.ch).length;
  return Math.min(pages.length - 1, st + (pos.n > 1 ? Math.round(pos.k / (pos.n - 1) * (m - 1)) : 0));
}
const bmIdx = () => (bm && pages.length ? resolvePos(bm) : -1);

function persistUI() {
  store.set('amao.pos', posOf(cur));
  const bi = bmIdx();
  sheets.forEach((s, i) => s.classList.toggle('bm', i === bi));
  tBm.classList.toggle('on', bi === cur);
}

let toastT;
function toast(msg) {
  let t = $('.toast')[0];
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- панели ---------- */
const mkPanel = (cls, html) => { const d = document.createElement('div'); d.className = 'panel ' + cls; d.innerHTML = html; document.body.appendChild(d); return d; };
const pSet = mkPanel('p-set', `
  <div class="row"><button data-a="fs-" aria-label="меньше">A−</button><span class="fsl"></span><button data-a="fs+" aria-label="больше">A+</button></div>
  <div class="row"><button data-a="hand">рукописный</button><button data-a="print">печатный</button></div>`);
const pPen = mkPanel('p-pen', `
  <div class="row">
    <button class="sw on" data-c="#c1121f" style="--c:#c1121f" aria-label="красный"></button>
    <button class="sw" data-c="#3a5bd9" style="--c:#3a5bd9" aria-label="синий"></button>
    <button class="sw" data-c="#e8dcc0" style="--c:#e8dcc0" aria-label="мел"></button>
    <button data-a="undo" aria-label="отменить штрих">↶</button>
    <button data-a="clear">стереть</button>
  </div>`);

function applyPrefs() {
  B.style.setProperty('--fs', FS_STEPS[prefs.fs]);
  B.classList.toggle('print', prefs.font === 'print');
  $('.fsl', pSet)[0].textContent = `размер ${prefs.fs + 1} / ${FS_STEPS.length}`;
  $('[data-a=hand]', pSet)[0].classList.toggle('on', prefs.font !== 'print');
  $('[data-a=print]', pSet)[0].classList.toggle('on', prefs.font === 'print');
}
applyPrefs();

tSet.onclick = () => { pSet.classList.toggle('open'); };
pSet.addEventListener('click', e => {
  const a = e.target.closest('button')?.dataset.a; if (!a) return;
  if (a === 'fs-') prefs.fs = Math.max(0, prefs.fs - 1);
  if (a === 'fs+') prefs.fs = Math.min(FS_STEPS.length - 1, prefs.fs + 1);
  if (a === 'hand') prefs.font = 'hand';
  if (a === 'print') prefs.font = 'print';
  store.set('amao.prefs', prefs); applyPrefs();
  if (sheets.length && !animating) initBook(posOf(cur));   // текст перерезается под новый размер
});

/* ---------- закладка ---------- */
tBm.onclick = () => {
  if (bm && bmIdx() === cur) { bm = null; toast('Закладка убрана'); }
  else { bm = posOf(cur); toast(`Закладка на странице ${cur + 1}`); }
  store.set('amao.bm', bm); persistUI();
};

/* ---------- рисование на полях ---------- */
const pageKey = i => {
  const el = sheets[i].querySelector('.sheet-content,.part-page') || sheets[i];
  const t = el.textContent.replace(/\s+/g, ' ').slice(0, 160);
  let h = 5381; for (let k = 0; k < t.length; k++) h = ((h << 5) + h + t.charCodeAt(k)) | 0;
  return 'p' + h;
};
const inkLW = cv => cv.width / (document.getElementById('book').offsetWidth || 560) * 2.6;
function inkLine(ctx, cv, c, a, b) {
  ctx.strokeStyle = c; ctx.lineWidth = inkLW(cv); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(a[0] * cv.width, a[1] * cv.height); ctx.lineTo(b[0] * cv.width + .01, b[1] * cv.height); ctx.stroke();
}
function inkRedraw(cv, i) {
  const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
  (inkData[pageKey(i)] || []).forEach(s => s.p.forEach((pt, j) => inkLine(ctx, cv, s.c, s.p[Math.max(0, j - 1)], pt)));
}
function attachInk(cv, i) {
  const ctx = cv.getContext('2d'); let st = null;
  const pt = e => { const r = cv.getBoundingClientRect(); return [+((e.clientX - r.left) / r.width).toFixed(4), +((e.clientY - r.top) / r.height).toFixed(4)]; };
  cv.addEventListener('pointerdown', e => {
    if (!B.classList.contains('pen')) return;
    cv.setPointerCapture(e.pointerId); st = { c: inkColor, p: [pt(e)] };
    inkLine(ctx, cv, st.c, st.p[0], st.p[0]); e.preventDefault();
  });
  cv.addEventListener('pointermove', e => {
    if (!st) return;
    const p = pt(e); inkLine(ctx, cv, st.c, st.p[st.p.length - 1], p); st.p.push(p);
  });
  const end = () => {
    if (!st) return;
    const k = pageKey(i); (inkData[k] = inkData[k] || []).push(st); st = null;
    store.set('amao.ink', inkData);
  };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
}
function ensureCanvas(i) {
  const sh = sheets[i]; if (!sh) return;
  let cv = sh.querySelector('canvas.ink'); if (cv) return cv;
  const book = document.getElementById('book');
  const k = Math.min(3, (window.devicePixelRatio || 1) * (parseFloat(book.style.getPropertyValue('--s')) || 1));
  cv = document.createElement('canvas'); cv.className = 'ink';
  cv.width = Math.round(book.offsetWidth * k); cv.height = Math.round(book.offsetHeight * k);
  sh.querySelector('.sheet-inner').appendChild(cv);
  attachInk(cv, i); inkRedraw(cv, i);
  return cv;
}
function inkSync() {
  sheets.forEach((s, i) => { if (i !== cur) { const c = s.querySelector('canvas.ink'); if (c) c.remove(); } });
  if (!sheets[cur]) return;
  if (B.classList.contains('pen') || (inkData[pageKey(cur)] || []).length) ensureCanvas(cur);
}
tPen.onclick = () => {
  const on = B.classList.toggle('pen');
  tPen.classList.toggle('on', on); pPen.classList.toggle('open', on); pSet.classList.remove('open');
  if (on) { inkSync(); toast('Рисуй пальцем или мышкой — прямо на странице'); }
};
pPen.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.c) { inkColor = b.dataset.c; $('.sw', pPen).forEach(x => x.classList.toggle('on', x === b)); return; }
  const k = pageKey(cur);
  if (b.dataset.a === 'undo' && inkData[k]) inkData[k].pop();
  if (b.dataset.a === 'clear') inkData[k] = [];
  store.set('amao.ink', inkData);
  const cv = sheets[cur].querySelector('canvas.ink'); if (cv) inkRedraw(cv, cur);
});

/* ---------- рисунки перерисовываются по тапу ---------- */
function redraw(fig) {
  const ps = $('path', fig);
  ps.forEach(p => { p.style.transition = 'none'; p.style.strokeDashoffset = 1; });
  fig.getBoundingClientRect();
  requestAnimationFrame(() => ps.forEach((p, i) => { p.style.transition = `stroke-dashoffset 1.6s ease-out ${i * .12}s`; p.style.strokeDashoffset = 0; }));
}

/* ---------- секрет: удерживай, чтобы приоткрыть ---------- */
let hold = null;
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.secret button'); if (!b) return;
  const s = b.closest('.secret'); if (s.classList.contains('open')) return;
  hold = { s, t0: performance.now(), raf: 0 };
  const tick = () => {
    if (!hold) return;
    const p = Math.min(1, (performance.now() - hold.t0) / 1800);
    hold.s.style.setProperty('--p', p);
    if (p >= 1) { hold.s.classList.add('open'); hold = null; return; }
    hold.raf = requestAnimationFrame(tick);
  };
  tick();
});
const releaseHold = () => {
  if (!hold) return;
  cancelAnimationFrame(hold.raf); const s = hold.s; hold = null;
  let p = +s.style.getPropertyValue('--p') || 0;
  const back = () => { p = Math.max(0, p - .04); s.style.setProperty('--p', p); if (p > 0) requestAnimationFrame(back); };
  back();
};
document.addEventListener('pointerup', releaseHold);
document.addEventListener('pointercancel', releaseHold);
document.addEventListener('keydown', e => {
  const b = e.target.closest?.('.secret button');
  if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.closest('.secret').classList.add('open'); }
});