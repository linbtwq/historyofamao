document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);
    const body = document.body;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

    body.classList.add('locked');
    $('startBtn').addEventListener('click', () => {
        $('intro-screen').classList.add('hidden');
        body.classList.remove('locked');
    });

    // ===== БУМАЖНЫЕ СЦЕНЫ: слои (d — глубина параллакса) =====
    const hills = (y, c, d) => ly(d, `<path class="${c}" d="M0 500V${y}Q120 ${y - 70} 260 ${y - 10}T540 ${y - 30}T800 ${y - 60}V500z"/>`);
    const ly = (d, inner) => `<svg class="ly" style="--d:${d}" viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg>`;
    const stars = ly(10, [...Array(26)].map((_, i) => `<circle class="pale" cx="${(i * 197) % 800}" cy="${(i * 83) % 260 + 20}" r="${1 + i % 3}"/>`).join(''));
    const SC = {
        moon: stars + ly(30, `<circle class="pale" cx="520" cy="190" r="125"/><circle fill="#d9cfb6" cx="480" cy="150" r="22"/><circle fill="#d9cfb6" cx="570" cy="230" r="30"/>`)
            + ly(70, `<g class="dk"><ellipse cx="520" cy="215" rx="40" ry="32"/><circle cx="545" cy="170" r="20"/><path d="M538 158C528 105 540 100 548 110C556 125 552 150 552 158zM555 158C562 110 576 108 578 120C578 135 566 152 562 160z"/></g>`)
            + hills(380, 'a', 110) + hills(430, 'b', 190) + hills(480, 'c', 280),
        house: stars + ly(40, `<circle class="pale" cx="640" cy="110" r="46"/>`) + hills(360, 'a', 100)
            + ly(170, `<path class="b" d="M250 470V300h300v170zM225 305L400 190 575 305z"/><rect class="glow" x="300" y="340" width="55" height="65"/><rect class="glow" x="440" y="340" width="55" height="65"/><path class="c" d="M370 470V380h60v90z"/>`)
            + ly(280, `<path class="c" d="M0 500V430h60v-20h40v20h60v-20h40v20h60V500zM800 500V420h-60v-20h-40v20h-60V500z"/>`),
        needle: ly(30, `<path class="a" d="M0 500V120Q200 170 400 110T800 150V500z"/>`)
            + ly(110, `<path class="b" d="M0 500V300Q200 250 400 320T800 280V500z"/>`)
            + ly(220, `<path class="pale" d="M120 470L640 90l6 8L128 478z"/><ellipse class="dk" cx="632" cy="96" rx="5" ry="14" transform="rotate(38 632 96)"/><path class="ln" style="stroke:#c0392b;stroke-width:4" d="M632 96C560 40 420 260 330 200S160 330 80 420"/>`)
            + ly(300, `<path class="c" d="M0 500V400Q200 370 400 420T800 390V500z"/>`),
        hooks: ly(30, `<path class="a" d="M0 500V0h800v500z"/>`)
            + ly(120, `<path class="c" d="M0 80H800V100H0z"/><g class="ln" stroke-width="7">${[130, 270, 410, 550, 690].map(x => `<path d="M${x} 100v50q0 30 -24 22"/>`).join('')}</g>`)
            + ly(210, [150, 290, 430, 570, 710].map((x, i) => `<ellipse class="b sw" cx="${x - 20}" cy="${230 + i % 2 * 30}" rx="${34 + i % 3 * 5}" ry="80"/>`).join(''))
            + ly(300, `<path class="c" d="M0 500V430H800V500z"/>`),
        lamp: ly(30, `<path class="a" d="M0 500V0h800v500z"/><path class="b" d="M0 0h130q-30 250 0 500H0zM800 0H670q30 250 0 500h130z"/>`)
            + ly(110, `<circle class="br" fill="#ffd98a" opacity=".35" cx="400" cy="230" r="230"/>`)
            + ly(200, `<path class="dk" d="M395 150h10v250h-10z"/><path class="glow" d="M340 150L370 70h60l30 80z"/><path class="dk" d="M330 400H470V415H330z"/>`)
            + ly(290, `<path class="c" d="M0 500V430H800V500z"/>`),
        street: stars + ly(60, `<path class="a" d="M0 500V220h120V160h110v90h90V190h120v70h110V150h130v110h120V500z"/>`)
            + ly(150, `<path class="b" d="M0 500V260h160v-60h130v90h110V230h140v60h110V210h150V500z"/><g class="glow">${[60, 200, 330, 470, 600, 700].map((x, i) => `<rect x="${x}" y="${300 + i % 2 * 40}" width="26" height="34"/>`).join('')}</g><rect fill="#7ff0c8" x="470" y="330" width="90" height="26"/>`)
            + ly(250, `<path class="dk" d="M150 500V250h8V500zM150 250q40-10 50 8"/><circle class="glow" cx="200" cy="262" r="12"/><path class="c" d="M0 500V450H800V500z"/>`),
        road: stars + hills(330, 'a', 70) + hills(390, 'b', 140)
            + ly(200, `<path class="dk" d="M330 330H470L800 500H0z"/><path fill="#d9cfb6" d="M396 335h8l16 165h-40z" opacity=".8"/>`)
            + ly(300, `<path class="c" d="M120 500V300h8V500zM700 500V280h8V500z"/>`)
    };
    const order = ['moon', 'house', 'needle', 'hooks', 'lamp', 'house', null, 'lamp', 'street', 'street', 'road', 'moon', 'moon', 'road'];
    const chapters = [...document.querySelectorAll('.chapter, .rabbit-scene, .reveal-sec')];
    const stages = [];
    chapters.forEach((c, i) => {
        c.style.setProperty('--sbg', c.dataset.bg === '#000' ? '#17142b' : c.dataset.bg);
        c.style.setProperty('--sacc', c.dataset.accent);
        if (c.classList.contains('rabbit-scene') || c.classList.contains('reveal-sec')) return;
        const st = document.createElement('div'); st.className = 'stage';
        st.innerHTML = SC[order[i]] || SC.moon;
        const sheet = document.createElement('div'); sheet.className = 'sheet';
        while (c.firstChild) sheet.appendChild(c.firstChild);
        c.append(st, sheet); stages.push(st);
    });

    // ===== СЦЕНА С КРОЛИКОМ =====
    const scene = $('rabbitScene'), sticky = $('rabbitSticky'), flash = $('bloodFlash');
    sticky.insertAdjacentHTML('afterbegin', SC.moon);
    sticky.insertAdjacentHTML('beforeend', `<svg class="bl" viewBox="0 0 800 500" preserveAspectRatio="none"><path fill="#8a1c1c" opacity=".92" d="M0 0H800V120q-20 60-40 0t-60 40-50-30-50 90-40-60-60 20-50-100-60 70-50-40-60 110-40-80-60 30-40-50-50 20z"/></svg>`);
    const layers = [...document.querySelectorAll('.rabbit-text-container')];
    const knife = layers.findIndex(l => l.id === 'knife-moment');
    const AGES = [0, 0, 3, 4, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    const counter = document.createElement('div'); counter.className = 'scene-count'; sticky.appendChild(counter);
    let fired = false, lastIdx = -1;
    const strike = () => {
        fired = true;
        sticky.classList.add('shake-effect');
        setTimeout(() => sticky.classList.remove('shake-effect'), 700);
    };

    // ===== РАЗВЯЗКА =====
    const reveal = document.querySelector('.reveal-sec');
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) reveal.classList.add('in'); }), { threshold: 0.25 }).observe(reveal);
    document.querySelectorAll('.reveal-sec .node, .reveal-sec .arr').forEach((n, i) => {
        n.style.cssText = `opacity:0;transform:translateY(16px);transition:all .9s ${.4 + i * .45}s`;
        new MutationObserver(() => { if (reveal.classList.contains('in')) { n.style.opacity = 1; n.style.transform = ''; } })
            .observe(reveal, { attributes: true });
    });

    // ===== СКРОЛЛ =====
    const thread = $('thread'), hud = $('hud');
    let ticking = false;
    const onScroll = () => {
        const h = document.documentElement.scrollHeight - innerHeight;
        thread.style.height = (scrollY / h * 100) + '%';
        const mid = innerHeight * .5;
        const s = chapters.find(x => { const r = x.getBoundingClientRect(); return r.top < mid && r.bottom > mid; });
        if (s && s !== scene) hud.textContent = s.dataset.hud;
        if (!still) stages.forEach(st => {
            const r = st.parentElement.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)));
            st.style.setProperty('--p', (p * 2 - 1).toFixed(3));
        });
        const r = scene.getBoundingClientRect();
        if (s === scene) {
            const prog = Math.min(1, Math.max(0, -r.top / (scene.offsetHeight - innerHeight)));
            if (!still) sticky.style.setProperty('--p', (prog * 2 - 1).toFixed(3));
            const idx = Math.min(layers.length - 1, Math.floor(prog * layers.length));
            if (idx !== lastIdx) {
                layers.forEach((l, i) => l.classList.toggle('active', i === idx));
                counter.textContent = String(idx + 1).padStart(2, '0') + ' / ' + layers.length;
                const a = AGES[idx] ?? 7;
                hud.textContent = a + ' ' + (a === 0 || a >= 5 ? 'ЛЕТ' : 'ГОДА');
                lastIdx = idx;
            }
            sticky.classList.toggle('after', idx >= knife);
            if (idx === knife && !fired) strike();
            if (idx < knife - 1 && fired) fired = false;
        } else if (r.top > 0) lastIdx = -1;
        ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
});