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
    const S = (d, c = '') => `<path class="s ${c}" pathLength="1" d="${d}"/>`;
    const F = (d, c = 'a') => `<path class="f ${c}" d="${d}"/>`;
    const A = x => `<svg class="art" viewBox="0 0 800 500" aria-hidden="true">${x}</svg>`;
    const C = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    const G = (a, b, y) => S([...Array(Math.floor((b - a) / 26))].map((_, i) => `M${a + i * 26} ${y}l-4 -13M${a + i * 26 + 8} ${y}l3 -17`).join(''));
    const H = (x, y, w, h) => S([...Array(Math.floor(w / 14))].map((_, i) => `M${x + i * 14} ${y + h}l${Math.min(22, h)} -${Math.min(22, h)}`).join(''));
    const star = (x, y) => S(`M${x} ${y}h14M${x + 7} ${y - 7}v14`);
    const SC = {
        archive: A(F('M120 440V160H340L380 120H680V440z') + S('M120 440V160H340L380 120H680V440zM120 200H680M430 230H620V350H430z') + S(C(525, 270, 18) + 'M525 288V330M500 306H550')
            + S('M160 250H370M160 285H350M160 320H365M160 355H320M160 390H355') + S(C(250, 410, 0.1)) + S(C(300, 330, 50) + 'M335 366L380 415', 'r') + S('M600 140V230q0 30 24 20V170') + H(430, 350, 190, 20)),
        cradle: A(F('M150 300Q150 410 260 410H540Q650 410 650 300z') + S('M150 300Q150 410 260 410H540Q650 410 650 300zM180 300Q400 90 620 300M170 440H630M200 410L170 440M600 410L630 440') + S('M400 40V130M330 60V150M470 60V160') + star(322, 150) + S(C(470, 175, 14)) + S(C(400, 140, 12))
            + S('M300 300Q400 250 500 300') + S(C(360, 275, 28) + 'M345 270l6 3M368 270l6 3M352 284Q360 290 368 284') + H(180, 410, 180, 20)),
        tea: A(F('M330 300h140v70Q400 440 330 370z') + S('M330 300h140v70Q400 440 330 370zM470 320Q530 320 500 370Q490 380 465 375M300 440H500M360 270Q340 240 370 220T360 160M420 270Q400 240 430 220T420 160') + S('M150 440V230Q150 170 230 170H290M150 300H250')
            + S(C(610, 390, 44) + 'M580 360Q630 380 650 410M590 350Q650 380 645 420M565 400Q620 420 630 430', 'r') + S('M520 320L710 400M540 345L720 425') + S('M40 440H760')),
        quarrel: A(F('M120 200Q120 120 220 120T320 200V440H120z') + F('M480 200Q480 120 580 120T680 200V440H480z') + S(C(220, 230, 60) + 'M160 440V330Q220 290 280 330V440M268 232l-18 14l20 6') + S(C(580, 230, 60) + 'M520 440V330Q580 290 640 330V440M532 232l18 14l-20 6')
            + S('M310 150L390 100L375 160L455 130L410 195L470 190', 'r') + S('M300 440l30-26l20 26M420 440l24-20l30 20M360 440l8-12l12 12') + S('M40 440H760')),
        moon: A(F('M380 60Q560 -10 700 100T690 330Q560 420 400 330T380 60z') + S('M450 180a110 110 0 1 0 220 0a110 110 0 1 0 -220 0')
            + S('M450 400C430 330 490 290 550 310C610 330 620 400 580 410Z') + S('M545 310C530 270 560 245 585 262C605 278 595 305 580 318')
            + S('M558 262C540 190 555 170 568 182C580 195 576 240 572 258M582 266C595 205 615 190 624 205C630 222 605 255 592 272')
            + S(C(452, 392, 14)) + S(C(592, 283, 3)) + S(C(520, 150, 13)) + S(C(615, 215, 9)) + G(40, 400, 421) + G(640, 770, 421) + S('M60 420Q200 400 340 416T620 412T760 420') + star(120, 90) + star(250, 150) + star(90, 250) + star(300, 60)),
        house: A(F('M200 440Q180 200 400 140T620 440z') + F(C(315, 335, 62) + C(485, 335, 62), 'g') + F('M290 310h50v50h-50zM460 310h50v50h-50z', 'g')
            + S('M260 440V270H540V440M235 275L400 160L565 275M370 440V360H430V440M470 215V175H500V235') + S('M290 310h50v50h-50zM315 310v50M290 335h50M460 310h50v50h-50zM485 310v50M460 335h50')
            + S('M485 160Q470 130 490 110T485 70') + S('M40 440H760M80 440V390M120 440V390M160 440V390M80 400H160') + S(C(650, 90, 30)) + S(C(640, 82, 6)) + G(40, 230, 441) + G(570, 770, 441)),
        needle: A(F('M100 120Q300 40 560 130T720 400Q500 480 250 440T100 120z') + S('M120 440L660 90') + S('M644 78a9 22 38 1 1 16 26a9 22 38 1 1 -16 -26')
            + S('M655 100C560 40 440 250 340 200S170 330 90 420', 'r') + S('M40 450Q200 400 400 450T760 430M40 480Q200 435 400 480T760 465') + S('M220 360l16-6M260 380l16-6M300 395l16-6')),
        hooks: A(S('M60 80H740M60 440H740') + H(60, 400, 680, 40) + [128, 278, 428, 578].map(x => S(`M${x} 80V125q0 28-22 22`) + F(`M${x} 152C${x - 38} 200 ${x - 38} 300 ${x} 340C${x + 38} 300 ${x + 38} 200 ${x} 152z`) + S(`M${x} 152C${x - 38} 200 ${x - 38} 300 ${x} 340C${x + 38} 300 ${x + 38} 200 ${x} 152z`, 'r')).join('')),
        lamp: A(F('M230 250a170 170 0 1 0 340 0a170 170 0 1 0 -340 0', 'g') + S('M340 190L370 100H430L460 190Z') + S('M400 190V400M350 410H450')
            + S('M300 220L240 260M500 220L560 260M400 80V40M330 100L290 70M470 100L510 70') + S('M160 420H640M190 420V480M610 420V480')),
        street: A(F('M350 360h110v30h-110z', 'g') + S('M40 440V200H190V440M190 440V260H320V440M320 440V160H480V440M480 440V240H620V440M620 440V190H760V440M0 440H800')
            + [[70, 250], [120, 300], [220, 320], [250, 370], [350, 200], [420, 260], [520, 290], [570, 340], [660, 240], [700, 300]].map(([x, y]) => S(`M${x} ${y}h20v26h-20z`)).join('')
            + S('M250 440V230q0-20 30-20') + S('M350 360h110v30h-110z') + star(100, 90) + star(560, 70)),
        grave: A(F('M250 440V240Q250 130 400 130T550 240V440z') + S('M250 440V240Q250 130 400 130T550 240V440M400 190V320M345 235H455M40 440H760') + S(C(640, 90, 38)) + G(40, 230, 441) + G(570, 770, 441) + star(120, 80) + star(300, 60)),
        crash: A(F('M120 440L130 250Q400 120 690 260L700 440z') + S('M40 440H760M120 440V320Q130 270 250 255L330 190H520L620 255Q700 270 700 320V440M300 255V190M440 255V190M200 440a45 45 0 0 1 90 0M540 440a45 45 0 0 1 90 0') + S('M20 400L110 380M30 460L120 450M770 380L690 370M760 330L690 340', 'r') + star(150, 80)),
        road: A(F('M330 240L40 480H760L470 240z') + S('M330 240L40 480M470 240L760 480M0 240H800M0 240Q120 190 260 240T520 235T800 225')
            + S('M400 255V275M400 295V330M400 350V400M400 425V470') + S('M220 380V250M200 270H240M600 360V240M580 260H620') + S(C(640, 90, 40)) + S(C(628, 80, 8)) + G(40, 300, 481) + star(150, 80))
    };

    // ===== v3: переработанные сцены =====
    const bird = (x, y) => S(`M${x} ${y}q10 -12 20 0q10 -12 20 0`);
    const wins = (a, c) => a.map(([x, y]) => S(`M${x} ${y}h20v26h-20z`, c || '')).join('');
    SC.needle = A(F('M120 200Q300 120 560 190T700 420H120z') + S('M150 440V385H520V440M160 385V260Q160 205 225 205H475V255H300V385') + S('M475 255V340M470 340h10')
        + S('M205 205V165H265V205M205 185H265') + S('M230 165Q330 90 445 185Q470 235 472 338', 'r pu') + S('M300 410Q400 375 500 410T700 395V440H300M320 428l16-5M380 420l16-5M440 424l16-5')
        + S(C(575, 125, 18) + C(655, 125, 18) + 'M580 142L652 300M650 142L578 300') + S('M60 440H760M600 430l6-18M620 430l4-16M640 432l6-14') + S(C(110, 400, 14) + 'M104 396l3 3M114 396l3 3') + H(150, 410, 360, 30));
    SC.hooks = A(F('M60 150H740V420H60z', 'a') + S('M40 70H760M0 440H800') + [118, 262, 406, 550, 694].map((x, i) => S(`M${x} 70V115q0 28-22 22`) + F(`M${x} 140C${x - 40} 190 ${x - 40} 300 ${x} 345C${x + 40} 300 ${x + 40} 190 ${x} 140z`)
        + S(`M${x} 140C${x - 40} 190 ${x - 40} 300 ${x} 345C${x + 40} 300 ${x + 40} 190 ${x} 140z M${x} 150V340M${x - 22} 195Q${x} 205 ${x + 22} 195M${x - 26} 240Q${x} 250 ${x + 26} 240M${x - 22} 285Q${x} 295 ${x + 22} 285`, 'r sw')).join('')
        + S('M100 440V385H700V440M100 385H700') + S('M300 385L318 335H395L405 385M405 355H470', 'r') + S('M262 350V372M406 355V378M550 350V368', 'r pu') + H(100, 405, 600, 35));
    SC.street = A(F('M300 120L240 440H380z', 'g') + F('M580 300h140v40H580z', 'g') + S('M30 440V190H180V440M180 440V250H300V440M300 440V150H470V440M470 440V230H610V440M610 440V180H770V440M0 440H800')
        + wins([[60, 240], [110, 290], [200, 310], [240, 360], [340, 190], [400, 250], [510, 280], [560, 340], [650, 230], [700, 300]]) + S('M580 300h140v40H580z M600 320h100', 'g')
        + S('M300 440V120q0-18 28-14', '') + S(C(330, 108, 12)) + S('M255 330Q290 300 325 330M262 440L268 390M312 440L306 390') + S(C(290, 305, 16) + 'M270 310Q290 270 312 310M276 330L270 390M304 330L310 390M284 345V395M296 345V395M284 395L276 440M296 395L304 440')
        + S('M400 448Q470 436 540 448', 'pu') + S(C(70, 80, 28) + 'M82 62a22 22 0 1 1 -22 36') + star(450, 70) + star(200, 90) + H(30, 400, 150, 40));
    SC.crash = A(F('M100 440L110 270Q400 140 690 270L700 440z') + F('M120 330L20 290L10 360z', 'g') + S('M40 440H760M0 400H80M720 400H800M140 440H680', '')
        + S('M130 440V330Q140 285 250 270L330 205H520L610 270Q700 285 700 330V440M300 270V205M440 270V205M190 440a42 42 0 0 1 84 0M540 440a42 42 0 0 1 84 0')
        + S('M130 340L98 360L130 380L96 400L130 420', 'r') + S('M122 320L30 285M122 345L14 345', 'g') + S('M640 450V190M640 260L690 220M640 300L585 262', '') + S('M150 300Q130 250 160 215T145 130', 'pu')
        + S('M60 430l-18-10M80 445l-22 4M100 425l-14-16M30 405l16 3', 'r') + bird(560, 90) + bird(620, 130) + star(120, 80));
    SC.grave = A(F('M240 440V240Q240 130 340 130T440 240V440z') + S('M240 440V240Q240 130 340 130T440 240V440M340 175V300M290 225H390') + S('M40 440H760M30 440Q120 400 220 440M440 440Q540 400 640 440')
        + S('M560 440V300M560 340L520 300M560 320L610 280M560 300L600 250') + S('M600 440V400M610 440V392M620 440V404M590 405L585 392M628 405L634 394') + S('M60 440V380H180V440M80 440V380M100 440V380M120 440V380M140 440V380M160 440V380')
        + S('M470 440V400M470 400Q460 380 470 365Q480 380 470 400', 'r') + F('M470 395Q460 380 470 362Q480 380 470 395z', 'g') + bird(600, 90) + bird(670, 130) + bird(540, 60) + S(C(130, 90, 34)) + G(40, 230, 441) + G(450, 760, 441) + H(240, 400, 200, 40));
    SC.road = A(F('M360 250L20 480H780L440 250z') + S('M360 250L20 480M440 250L780 480M0 250H800M0 250Q120 200 260 250T520 245T800 235M0 130Q200 180 400 130T800 140M180 130V260M620 130V250M160 150H200M600 150H640')
        + S('M400 262V280M400 300V325M400 345V385M400 410V460') + S('M580 440V210M540 235H640L660 255L640 275H540zM545 300H625L605 320L625 340H545z') + S(C(400, 330, 8) + 'M400 338V372M400 350L388 366M400 350L412 366M400 372L392 392M400 372L408 392')
        + S(C(110, 80, 40) + 'M100 60a28 28 0 1 1 -22 40', '') + star(250, 70) + star(420, 40) + bird(300, 150) + G(40, 300, 481) + G(540, 770, 481));
    SC.rabbit = A(F('M380 70Q560 -10 700 100T690 330Q560 420 400 330T380 60z') + S(C(560, 180, 110) + 'M520 150a13 13 0 1 0 .1 0') + S(C(520, 150, 13) + C(615, 215, 9))
        + S('M450 400C430 330 490 290 550 310C610 330 620 400 580 410Z') + S('M545 310C530 270 560 245 585 262C605 278 595 305 580 318') + S('M558 262C540 190 555 170 568 182C580 195 576 240 572 258M582 266C595 205 615 190 624 205C630 222 605 255 592 272')
        + S(C(452, 392, 14) + C(592, 283, 3)) + S('M60 420Q200 400 340 416T620 412T760 420')
        + S(C(150, 215, 24) + 'M118 440L128 262H178L190 440M180 280L235 215M235 215L258 150L270 160L246 222', 'r') + S(C(330, 360, 16) + 'M314 440V378H346V440') + F('M100 440L130 262H180L200 440z', 'a') + star(120, 80) + star(300, 60) + star(250, 150) + G(40, 400, 421));
    // двойной контур «рисовали дважды»
    const ghost = root => root.querySelectorAll('.s').forEach(p => { const g = p.cloneNode(); g.classList.add('gh'); p.after(g); });
    body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="cr"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 1.7" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter><filter id="wc"><feTurbulence baseFrequency=".022" numOctaves="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="16"/><feGaussianBlur stdDeviation=".7"/></filter></svg>');
    const order = ['archive', 'cradle', 'needle', 'hooks', 'tea', 'quarrel', null, 'grave', 'street', 'street', 'crash', null, 'moon', 'road'];
    const chapters = [...document.querySelectorAll('.chapter, .rabbit-scene, .reveal-sec')];
    const stages = [];
    chapters.forEach((c, i) => {
        c.style.setProperty('--sbg', c.dataset.bg === '#000' ? '#17142b' : c.dataset.bg);
        c.style.setProperty('--sacc', c.dataset.accent); c.style.setProperty('--sink', c.dataset.ink === '#a49e96' ? '#d8cfbd' : c.dataset.ink);
        if (c.classList.contains('rabbit-scene') || c.classList.contains('reveal-sec')) return;
        const st = document.createElement('div'); st.className = 'stage';
        st.innerHTML = SC[order[i]] || SC.moon; ghost(st);
        const sheet = document.createElement('div'); sheet.className = 'sheet';
        while (c.firstChild) sheet.appendChild(c.firstChild);
        sheet.prepend(st); c.append(sheet); stages.push(st);
    });

    // ===== ЗАРИСОВКИ НА ПОЛЯХ =====
    const D = (...p) => `<svg viewBox="0 0 100 100" aria-hidden="true">${p.map(x => S(...[].concat(x))).join('')}</svg>`;
    const calm = [D('M50 88V48', 'M50 50C28 52 28 22 50 30C72 22 72 52 50 50', 'M50 72C38 74 30 66 26 60'),
        D('M50 82C8 55 22 20 50 40C78 20 92 55 50 82z'), D('M24 66a15 15 0 0 1 5-28a22 22 0 0 1 42 4a14 14 0 0 1 4 24z'),
        D('M50 12l11 26 28 3-21 19 6 28-24-14-24 14 6-28-21-19 28-3z'), D(C(50, 50, 16), 'M50 12v12M50 76v12M12 50h12M76 50h12M24 24l9 9M67 67l9 9M76 24l-9 9M33 67l-9 9'),
        D('M28 84C16 58 44 46 60 56C76 66 72 84 62 84z', 'M56 52C50 30 58 16 65 27C70 36 66 48 63 54', C(30, 78, 6)),
        D('M50 8L78 40L50 92L22 40zM50 8V92M22 40H78', 'M50 92Q30 96 36 80'), D('M50 28V72', 'M50 50C20 18 8 58 50 56M50 50C80 18 92 58 50 56'),
        D('M20 86V50H80V86M10 52L50 16L90 52M42 86V64H58V86'), D('M20 42L28 14L44 30H56L72 14L80 42Q88 80 50 84Q12 80 20 42z', C(38, 52, 3), C(62, 52, 3), 'M44 64Q50 70 56 64'),
        D('M30 40h40v34Q50 92 30 74zM70 48Q86 48 78 66', 'M40 30Q34 20 42 12M54 30Q48 20 56 12')];
    const dark = [D('M18 86L68 28L76 36L26 92z', 'M68 28C82 8 94 18 76 36', ['M60 50L76 66', 'r']),
        D('M24 84C12 58 40 46 58 56C74 66 70 84 60 84z', 'M56 52C50 30 58 16 65 27C70 36 66 48 63 54', 'M42 58l9 9M51 58l-9 9', ['M30 90H78', 'r']),
        D('M10 12H90', ['M22 12V52q0 14 9 0V12M48 12V74q0 16 9 0V12M74 12V40q0 12 8 0V12', 'r']),
        D('M8 50Q50 10 92 50Q50 90 8 50z', C(50, 50, 15), C(50, 50, 5), 'M20 22L30 34M50 8V24M80 22L70 34'),
        D('M20 30Q50 10 80 30L84 60Q50 90 16 60z', C(42, 48, 6), C(60, 48, 6), 'M34 72Q50 80 66 72M20 30L8 10M80 30L92 10'),
        D(['M50 4L40 34L60 50L38 72L52 96', 'r'], 'M40 34L24 40M60 50L78 46'), D('M50 10V90M24 36H76', ['M10 92H90', 'r']),
        D('M8 72H92M18 72V56H38L50 42H72L84 56V72', ['M6 36L22 46M94 34L80 46M14 24L26 34', 'r']),
        D('M30 92V52M30 52L18 22M40 52L38 14M50 52L56 12M60 52L72 22M70 62L90 46', ['M30 92V80', 'r']), D('M50 5V50q0 32 -26 26', ['M22 76l-6 -10', 'r']),
        D('M22 18L30 92H70L78 18z', 'M26 40H74', ['M40 60q4 14 8 0M56 70q3 12 7 0', 'r']), D('M50 86C8 55 22 20 50 40L44 56L58 64L50 86', 'M50 40C78 20 92 55 50 86'),
        D(C(50, 50, 38), 'M50 50V24M50 50L70 60', ['M20 20L80 80', 'r']), D('M24 92V10H64L78 18V92zM64 10V92', C(56, 54, 3)),
        D('M42 92V44H58V92M50 40Q38 24 50 6Q62 24 50 40', ['M30 92H70', 'r'])];
    const doodleIO = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); doodleIO.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    let dn = 0;
    document.querySelectorAll('.sheet').forEach(sh => {
        const pool = (document.getElementById('rabbitScene').compareDocumentPosition(sh) & Node.DOCUMENT_POSITION_FOLLOWING) ? dark : calm;
        sh.querySelectorAll('.text-block').forEach(tb => [...tb.querySelectorAll(':scope>p')].forEach((p, i) => {
            if (i % 2 !== 1) return;
            const d = document.createElement('span'); d.className = 'dd ' + (dn % 2 ? 'lf' : 'rt');
            d.style.setProperty('--r', ((dn * 7) % 13 - 6) + 'deg'); d.style.setProperty('--w', (66 + (dn * 29) % 52) + 'px');
            d.innerHTML = pool[dn++ % pool.length]; ghost(d); p.before(d); doodleIO.observe(d);
        }));
    });

    // ===== СЛЕДЫ НА СТРАНИЦАХ + ПЕРЕВОРОТ =====
    const turnIO = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.remove('pre'); turnIO.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.sheet').forEach((sh, k) => {
        const isDark = !!(document.getElementById('rabbitScene').compareDocumentPosition(sh) & Node.DOCUMENT_POSITION_FOLLOWING);
        const t = 12 + (k * 37) % 60, x = (k * 23) % 22;
        sh.classList.toggle('torn', isDark && k % 2 === 0);
        sh.insertAdjacentHTML('beforeend', isDark
            ? `<i class="dc stain" style="top:${t}%;right:${x}%"></i><svg class="dc claw" viewBox="0 0 60 80" style="top:${(t + 25) % 70 + 8}%;left:${60 - x}%">${S('M10 5L22 75M24 5L36 75M38 5L50 75')}</svg>`
            : `<i class="dc ring" style="top:${t}%;right:${x - 6}%"></i><i class="dc sticker" style="top:${(t + 30) % 75 + 6}%;left:${70 - x}%">${['♥', '★', '✿'][k % 3]}</i>`);
        if (!still) { sh.classList.add('pre'); turnIO.observe(sh); }
    });

    // ===== СЦЕНА С КРОЛИКОМ =====
    const scene = $('rabbitScene'), sticky = $('rabbitSticky'), flash = $('bloodFlash');
    sticky.insertAdjacentHTML('afterbegin', SC.rabbit); ghost(sticky);
    sticky.insertAdjacentHTML('beforeend', `<svg class="scr" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><path pathLength="1" d="M60 90L740 430"/><path pathLength="1" d="M750 80L70 440"/><path pathLength="1" d="M120 30L700 480"/><path pathLength="1" d="M690 40L130 490"/><path pathLength="1" d="M400 20L420 490"/><path pathLength="1" d="M40 260L760 250"/></svg>`);
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
        body.style.setProperty('--dec', (scrollY / h).toFixed(3));
        stages.forEach(st => {
            const q = st.getBoundingClientRect();
            const d = still ? 1 : Math.max(0, Math.min(1, (innerHeight * .92 - q.top) / (innerHeight * .55)));
            st.style.setProperty('--draw', d.toFixed(3));
        });
        const r = scene.getBoundingClientRect();
        body.classList.toggle('dark', r.top + scene.offsetHeight * (knife / layers.length) < 0);
        if (s === scene) {
            const prog = Math.min(1, Math.max(0, -r.top / (scene.offsetHeight - innerHeight)));
            sticky.style.setProperty('--draw', still ? 1 : Math.min(1, prog * 7).toFixed(3));
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