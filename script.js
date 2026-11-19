const isNotebook = new URLSearchParams(location.search).get('book') === 'notes';
const volumeData = isNotebook ? NOTES : DATA;
const volumeKey = isNotebook ? 'amao.notes' : 'amao';
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
function sceneSVG() {
  // Рисуется вручную в SVG. Фигуры остаются раздельными, чтобы шаги
  // существующей сцены управляли движением руки, кроликом и тенью.
  return `<svg class="memory-drawing" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true">
    <defs>
      <linearGradient id="barnWall" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#687b72"/><stop offset=".56" stop-color="#4c6767"/><stop offset="1" stop-color="#293f4b"/></linearGradient>
      <linearGradient id="windowLight" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff2bb"/><stop offset="1" stop-color="#dba870"/></linearGradient>
      <linearGradient id="woodTop" x1="0" x2=".2" y1="0" y2="1"><stop stop-color="#b8946f"/><stop offset="1" stop-color="#87684f"/></linearGradient>
      <linearGradient id="boyShirt" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f5e7d0"/><stop offset="1" stop-color="#b7c8b9"/></linearGradient>
      <linearGradient id="manCoat" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#647373"/><stop offset="1" stop-color="#293c44"/></linearGradient>
      <radialGradient id="memoryGlow"><stop stop-color="#f5dda1" stop-opacity=".44"/><stop offset="1" stop-color="#f5dda1" stop-opacity="0"/></radialGradient>
      <pattern id="barnPlanks" width="87" height="440" patternUnits="userSpaceOnUse"><path d="M84 0V440M12 0V440" fill="none" stroke="#203d42" stroke-width="3" opacity=".22"/><path d="M80 15Q70 118 80 220T76 420M17 31Q25 120 19 190" fill="none" stroke="#f3dba9" stroke-width="1.3" opacity=".08"/></pattern>
    </defs>
    <!-- Тесный сарай: доски, окно, инструменты, свет в пыли. -->
    <rect width="800" height="450" fill="url(#barnWall)"/>
    <rect width="800" height="450" fill="url(#barnPlanks)"/>
    <path d="M0 10L800 8V37L0 45Z" fill="#354d4d" opacity=".8"/>
    <path d="M0 42H800M26 0L45 450M762 0L742 450" stroke="#1f393d" stroke-width="11" opacity=".45"/>
    <path d="M42 55H261V202H42Z" fill="#314d56" stroke="#3b302a" stroke-width="11"/>
    <rect x="50" y="63" width="203" height="130" fill="url(#windowLight)"/>
    <path d="M54 158Q110 120 154 147T249 130V193H54Z" fill="#91a791"/><path d="M54 181Q131 152 184 174T252 158V193H54Z" fill="#607d70"/>
    <path d="M151 61V196M49 119H255" stroke="#564938" stroke-width="10"/>
    <path d="M50 63L180 193H104L49 132Z" fill="#fff0be" opacity=".17"/>
    <path d="M55 193L298 193L568 450H155Z" fill="#ffe8a2" opacity=".09"/>
    <ellipse cx="172" cy="234" rx="300" ry="245" fill="url(#memoryGlow)"/>
    <g fill="none" stroke="#394d4a" stroke-linecap="round">
      <path d="M318 108H560M323 112V124M554 112V126" stroke-width="12"/>
      <path d="M337 119H549" stroke="#b4a17d" stroke-width="8"/>
      <path d="M373 123V187L362 203L379 211L389 197L378 187V123" stroke="#9e9c81" stroke-width="4"/>
      <path d="M422 122V185Q402 198 415 214Q427 220 433 202L443 189V123" stroke="#9d9983" stroke-width="4"/>
      <path d="M475 125L472 191L488 205L496 191L490 125" stroke="#aa9781" stroke-width="3"/>
      <path d="M521 123V158M512 141H530M516 158L507 185M526 158L536 185" stroke="#bda988" stroke-width="3"/>
    </g>
    <g fill="#7b8171" stroke="#485852" stroke-width="2"><path d="M311 83H570L562 111H319Z"/><path d="M330 58H362V82H330Z"/><path d="M392 65H422V82H392Z"/><path d="M486 57H520V82H486Z"/></g>
    <path d="M0 372Q257 354 454 370T800 359V450H0Z" fill="#4d504a"/>
    <path d="M0 389H800M0 421H800" stroke="#d4b98d" stroke-opacity=".1" stroke-width="4"/>
    <!-- Фигуры намеренно без внешности: ничего не навязываем канону. -->
    <g class="boy" stroke-linejoin="round" stroke-linecap="round">
      <path d="M112 276Q77 285 68 318L57 415H222L217 315Q201 282 174 270Z" fill="#788a83" stroke="#3d5658" stroke-width="4"/>
      <path d="M129 274L136 320L167 328L183 278" fill="#4f6969" opacity=".7"/>
      <path d="M107 272L123 252L177 250L190 287Q162 309 126 288Z" fill="#586e6b"/>
      <path d="M109 189Q115 144 148 143Q185 145 197 184L194 235Q183 267 154 272Q114 268 105 232Z" fill="#51696b" stroke="#29474c" stroke-width="4"/>
      <path d="M106 194Q109 165 136 149Q163 142 185 168L185 207Q165 193 142 206Q126 211 106 203Z" fill="#344e55" opacity=".92"/>
      <path d="M106 214Q114 255 146 266" fill="none" stroke="#b9c5a4" stroke-width="3" opacity=".45"/>
      <path d="M85 314Q109 322 116 352L131 369M209 316Q194 326 189 359" fill="none" stroke="#a9bcab" stroke-width="3" opacity=".5"/>
    </g>
    <!-- Взрослый остаётся нечитаемой тёмной фигурой. -->
    <g class="father" stroke-linejoin="round" stroke-linecap="round">
      <path d="M636 221Q661 203 714 214Q766 231 779 276L800 450H593L605 296Z" fill="#293b41" stroke="#182b33" stroke-width="4"/>
      <path d="M666 228Q651 317 691 450M730 239L751 356" stroke="#7a908a" stroke-width="3" opacity=".23" fill="none"/>
      <path d="M674 190L671 238Q697 244 721 223L718 186Z" fill="#30464b"/>
      <path d="M651 132Q661 92 698 93Q743 94 748 147L735 184Q724 213 696 211Q653 202 647 168Z" fill="#273940" stroke="#1c3036" stroke-width="4"/>
      <path d="M657 124Q676 91 709 104M649 160Q646 184 664 199" fill="none" stroke="#778b85" stroke-width="3" opacity=".34"/>
      <path d="M643 222L671 236L640 289L605 283Z" fill="#354b50" stroke="#21343c" stroke-width="3"/>
    </g>
    <!-- Потёртый рабочий стол; предметы не висят в воздухе. -->
    <path d="M156 297L579 286L642 324L123 332Z" fill="url(#woodTop)" stroke="#675140" stroke-width="5"/>
    <path d="M125 330L642 323L641 344L125 353Z" fill="#6b5041" stroke="#513e37" stroke-width="3"/>
    <path d="M179 351L177 450H202L212 350M564 345L581 450H610L601 343" fill="#624b3e" stroke="#4b3b35" stroke-width="3"/>
    <path d="M183 307L533 300M227 320L585 314M145 338L621 335" stroke="#e6c7a0" stroke-opacity=".45" stroke-width="2"/>
    <path d="M257 317L248 327M291 311L287 320M516 305L526 318M546 325L557 327" stroke="#5d4138" stroke-opacity=".6" stroke-width="2"/>
    <g class="knife-rest" stroke-linejoin="round" stroke-linecap="round">
      <path d="M563 302L601 303" stroke="#4d403b" stroke-width="10"/>
      <path d="M563 297L518 304L565 308Z" fill="#c3cec4" stroke="#6b7370" stroke-width="2"/>
      <path d="M556 302L527 304" stroke="#fff7de" stroke-width="1.5"/>
    </g>
    <!-- Кролик: несколько мягких плоскостей цвета вместо палочек. -->
    <g class="kb"><g class="rabbit-breath" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="425" cy="292" rx="83" ry="9" fill="#51453c" opacity=".3"/>
      <path d="M387 250Q403 230 438 237Q476 237 487 264Q490 284 471 293H387Q357 287 362 270Z" fill="#f4ebd9" stroke="#817d76" stroke-width="2.8"/>
      <path d="M420 239Q452 239 466 263" fill="none" stroke="#fffdf0" stroke-width="13" opacity=".7"/>
      <circle cx="480" cy="271" r="14" fill="#e9dfcb"/><circle cx="372" cy="269" r="24" fill="#fff3e0" stroke="#817d76" stroke-width="2.8"/>
      <path d="M358 253Q340 204 348 185Q360 176 371 209L380 250" fill="#f6efdf" stroke="#817d76" stroke-width="2.6"/>
      <path d="M373 250Q378 197 391 193Q403 194 394 221L388 256" fill="#f6efdf" stroke="#817d76" stroke-width="2.6"/>
      <path d="M357 244L350 196Q362 193 371 245M382 240L391 207" fill="#d9b6b1" opacity=".76"/>
      <ellipse cx="366" cy="268" rx="3.5" ry="4.4" fill="#465052"/><circle cx="367" cy="266" r="1.1" fill="#fff"/>
      <path d="M351 277L347 281L353 282M353 281Q360 285 365 282" fill="none" stroke="#b97d7e" stroke-width="1.7"/>
      <path d="M352 281L330 279M352 283L331 286" stroke="#b1a49d" stroke-width="1.5"/>
      <path d="M387 290Q400 295 409 287M447 291Q461 298 471 289" fill="#e9dfcc" stroke="#817d76" stroke-width="2"/>
    </g></g>
    <g class="kd" opacity="0" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="415" cy="295" rx="85" ry="8" fill="#252b30" opacity=".35"/>
      <path d="M373 274Q398 255 433 261Q470 264 481 287Q477 296 457 296H374Q355 291 373 274Z" fill="#d5d2c6" stroke="#848583" stroke-width="2"/>
      <path d="M371 277Q346 264 323 268Q313 275 343 284L364 285" fill="#d3d0c7" stroke="#868786" stroke-width="2"/>
      <path d="M363 275Q343 251 330 247Q318 250 337 272" fill="#d9d6cd" stroke="#868786" stroke-width="2"/>
      <path d="M352 277Q358 273 363 276" fill="none" stroke="#6c7070" stroke-width="2"/>
      <path d="M460 293Q469 301 482 295" fill="none" stroke="#858581" stroke-width="2"/>
    </g>
    <!-- Кровь открывается только на последних шагах воспоминания. -->
    <g class="blood-stain" opacity="0" stroke-linejoin="round" stroke-linecap="round">
      <path d="M339 301Q366 292 381 301Q400 292 424 300Q455 290 470 301Q488 299 505 312Q476 321 450 317Q426 327 410 317Q382 327 365 317Q350 319 339 309Z" fill="#982b3c" stroke="#692333" stroke-width="2"/>
      <path d="M367 318Q378 319 381 327L383 349Q385 361 379 374Q371 365 373 349L370 331Z" fill="#962e3f"/>
      <path d="M444 319Q453 319 458 330L455 367Q453 378 448 372L447 333Z" fill="#9f3041"/>
      <path d="M489 314Q495 322 491 334L493 352Q489 365 484 353L483 329Z" fill="#7d2633"/>
      <ellipse cx="323" cy="307" rx="7" ry="3" fill="#aa3443"/>
      <ellipse cx="520" cy="321" rx="5" ry="3" fill="#9f3041"/>
      <path d="M375 307Q420 299 464 307" fill="none" stroke="#df5662" stroke-opacity=".45" stroke-width="2"/>
    </g>
    <!-- Рука и нож движутся отдельно; сюжетные шаги не переписаны. -->
    <g class="arm" stroke-linejoin="round" stroke-linecap="round">
      <path d="M637 250Q613 272 584 284L554 290" fill="none" stroke="#40585e" stroke-width="36"/>
      <path d="M562 279Q549 279 546 289Q545 301 559 304L584 297L580 286Z" fill="#bc947d" stroke="#614d47" stroke-width="2"/>
      <g class="knife-held">
        <path d="M556 294L518 299" stroke="#5b4539" stroke-width="11"/>
        <path d="M518 294L479 311L520 305Z" fill="#c2d0ca" stroke="#6a7270" stroke-width="2"/>
        <path d="M510 301L492 308" stroke="#f8e8d4" stroke-width="1.8"/>
      </g>
    </g>
    <path d="M32 403Q108 399 163 415M708 396Q749 382 796 391" fill="none" stroke="#e6d0a4" stroke-opacity=".19" stroke-width="4"/>
  </svg>`;
}

function sceneHTML(b) {
  const caps = b.caps.map((t, i) =>
    `<p class="cap${/\{\{/.test(t) ? ' climax' : ''}" data-i="${i}">${em(t)}</p>`).join('');
  return `<div class="scene-page" data-kill="${b.kill}" data-step="-1" style="--q:.12">
    <div class="scene-img"><div class="farm-light"></div>${sceneSVG()}<div class="farm-shadow"></div><button class="scene-kill" type="button"><span>нажми, чтобы читать дальше</span></button></div>
    <div class="scene-caps" aria-live="polite" aria-atomic="true">${caps}</div>
    <div class="scene-ctl"><button class="scene-next" type="button">дальше ›</button><span class="scene-step"></span></div>
  </div>`;
}

function sceneStep(container) {
  const captions = $('.cap', container);
  const kill = Number(container.dataset.kill);
  const previous = Number(container.dataset.step);
  const i = previous === captions.length - 1 ? 0 : previous + 1;
  container.dataset.step = i;
  container.classList.add('running');
  container.dataset.phase = i < kill - 3 ? 'light' : i < kill - 1 ? 'shadow' : i === kill - 1 ? 'still' : 'after';
  container.style.setProperty('--q', i < kill - 2 ? '.12' : '1');
  captions.forEach((caption, index) => caption.classList.toggle('on', index === i));
  $('.scene-step', container)[0].textContent = (i + 1) + ' / ' + captions.length;
  $('.scene-next', container)[0].textContent = i === captions.length - 1 ? 'Прочитать ещё раз' : 'Дальше →';
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
      <div class="chapter-orn">${isNotebook ? '✎' : c.mora ? '● ● ●' : '🍓 🍓 🍓'}</div>
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
  ${volumeData.chapters.map(c => c.part
    ? `<li style="margin:12px 0 4px;font:700 1.05rem 'Caveat',cursive;color:var(--hd);cursor:pointer" data-go="${c.id}">${c.part} · ${c.title}</li>`
    : `<li style="display:flex;align-items:baseline;gap:8px;margin:3px 0;font-size:.9rem;cursor:pointer;padding:4px 0" data-go="${c.id}"><span style="flex:1;border-bottom:1px dotted var(--line)">Глава ${c.num} · ${c.title}</span><b>${start[c.id] + 1}</b></li>`
  ).join('')}
  </ol>`;

const renderTL = () => `<div class="chapter-head">
    <div class="chapter-num">Хронология</div>
    <h2><span>Мои даты</span></h2>
    <div class="chapter-orn">✦</div>
  </div>
  ${volumeData.timeline.map(([y, a, c]) => `
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
  volumeData.chapters.forEach(c => {
    start[c.id] = body.length + (volumeData.timeline ? 2 : 1);
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
    ...(volumeData.timeline ? [{ content: renderTL(), kind: 'front', theme: themeOf(null) }] : []),
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
  if (tx === null || !B.classList.contains('opened')) return;
  const dx = e.changedTouches[0].clientX - tx; tx = null;
  if (Math.abs(dx) > 60 && !B.classList.contains('pen') && !e.target.closest('.scene-page,.page-jump,.panel')) goto(cur + (dx < 0 ? 1 : -1));
}, { passive: true });

let sig = '', rz;
window.addEventListener('resize', () => {
  fit();
  clearTimeout(rz);
  rz = setTimeout(() => {
    if (!sheets.length || !B.classList.contains('opened')) return;
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
let bm = store.get(volumeKey + '.bm', null);
const inkData = store.get(volumeKey + '.ink', {});
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
  store.set(volumeKey + '.pos', posOf(cur));
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
  store.set(volumeKey + '.bm', bm); persistUI();
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
    store.set(volumeKey + '.ink', inkData);
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
  store.set(volumeKey + '.ink', inkData);
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
