function startReading() {
  const view = document.getElementById('reading');
  const title = isNotebook ? 'Материалы игры' : 'Дневник Амао';
  document.title = title;
  view.hidden = false;
  view.classList.toggle('manuscript', isNotebook);
  const key = volumeKey + '.reading';
  // Оглавление строится только из исходных заголовков. Порядок и тексты не меняются.
  const tocGroups = [];
  let activeGroup = null;
  volumeData.chapters.forEach(c => {
    if (c.part) {
      activeGroup = { title: c.part + ' · ' + c.title, items: [] };
      tocGroups.push(activeGroup);
    } else {
      if (!activeGroup) {
        activeGroup = { title: isNotebook ? 'Рабочая тетрадь' : 'Дневник', items: [] };
        tocGroups.push(activeGroup);
      }
      activeGroup.items.push(c);
    }
  });
  const totalChapters = tocGroups.reduce((sum, group) => sum + group.items.length, 0);
  const links = tocGroups.map(group =>
    '<section class="toc-group"><div class="toc-group-heading"><span>' + E(group.title) +
    '</span><small>' + String(group.items.length).padStart(2, '0') + '</small></div>' +
    '<nav aria-label="' + E(group.title) + '">' + group.items.map(c =>
      '<a href="#' + c.id + '" data-title="' + E(c.title) + '">' +
      '<small>' + c.num.padStart(2,'0') + '</small><span>' + E(c.title) + '</span><i aria-hidden="true"></i></a>'
    ).join('') + '</nav></section>'
  ).join('');

  function entry(c) {
    if (c.part) return '<header class="part-intro"><span>' + E(c.part) + '</span><h2>' + E(c.title) + '</h2><i>' + svg(c.mora ? 'berry' : 'strawb') + '</i></header>' + (c.mora ? '' : paperIndex(false));
    let hasOpening = false;
    const blocks = c.blocks.map((b, i) => {
      if (c.id === 'note8' && i === 27) return berryChoices(c.blocks);
      if (c.id === 'note8' && i > 27 && i <= 34) return '';
      if (b.k === 'kscene') return '<div id="farm-memory">' + sceneHTML(b) + '</div>';
      if (b.k === 'p') {
        if (isNotebook && b.format) {
          const text = E(b.t);
          if (b.format === 'heading') return '<h4>' + text + '</h4>';
          if (b.format === 'year') return '<p class="year">' + text.replace(/(\d{4})/, '<b>$1</b>') + '</p>';
          if (b.format === 'speech') return '<blockquote>«' + text.replace(/^\[|\]$/g, '') + '»</blockquote>';
          if (b.format === 'choice') return '<p class="choice">' + text.replace(/^\[?(\d+)\.\s*/, '<b>$1</b> ').replace(/\]$/, '') + '</p>';
          return '<p class="' + b.format + '">' + text + '</p>';
        }
        const anchor = c.id === 'note6' && b.t.startsWith('Откуда бы') ? 'kitchen-milk' : c.id === 'note8' && b.t.startsWith('Потрясши') ? 'box-key' : null;
        // Литературная иерархия создаётся классами; исходные слова не меняются.
        const opening = !hasOpening;
        hasOpening = true;
        const proseClass = 'prose' + (opening ? (b.t.trim().length > 105 ? ' prose--opening' : ' prose--lead') : '');
        return '<p class="' + proseClass + '"' + (anchor ? ' id="' + anchor + '"' : '') + '>' + em(b.t) + '</p>';
      }
      return renderBlock(b, c, false);
    }).join('');
    return '<section class="entry ' + (isNotebook ? 'entry--material entry--' + c.id : 'entry--diary') + '" id="' + c.id + '"><header><i class="entry-mark" aria-hidden="true">' + svg((isNotebook ? ['house','strawb','moon','eyes','bolt','star','sun','bunny','cow'] : ['house','flower','bolt','cookie','cloud','bunny','moon','berry','blacksun','star','berry'])[Number(c.num)-1] || 'star') + '</i><span>' + (isNotebook ? 'Раздел ' : 'Глава ') + c.num +
      '</span><h3>' + E(c.title) + '</h3></header>' + blocks + (c.secret ? secretHTML(c.secret) : '') + '</section>';
  }

  view.innerHTML = '<header class="reader-bar"><a href="?">← На стол</a><b>' + title + '</b><button class="type-size" aria-label="Изменить размер текста">Аа</button></header>' +
    albumTabs(isNotebook) + '<div class="reading-layout"><aside class="reader-index">' +
    '<div class="index-ident"><span>ТЕТРАДИ АМАО / УКАЗАТЕЛЬ</span><strong>' + title + '</strong></div>' +
    '<details class="contents"><summary>Оглавление <small>' + totalChapters + ' разделов</small></summary>' +
    '<label class="toc-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Найти главу..." aria-label="Поиск по названиям глав"></label>' +
    '<div class="toc-groups">' + links + '</div><p class="toc-empty" hidden>Таких глав нет</p></details>' +
    '<div class="toc-current"><span>Сейчас открыто</span><strong class="toc-current-title"></strong>' +
    '<div class="toc-meter" aria-hidden="true"><i></i></div><small class="toc-count">01 / ' + totalChapters + '</small></div>' +
    '<a class="sheets-link" href="?book=' + bookChoice + '&amp;sheets=1">Листы и рисунки ↗</a></aside>' +
    '<article><div class="binding" aria-hidden="true"><i></i><i></i><i></i></div>' + (isNotebook ? '<header class="part-intro"><span>Рабочая тетрадь</span><h2>Материалы игры</h2></header>' + paperIndex(true) : '') +
    volumeData.chapters.map(entry).join('') + (volumeData.timeline ? '<section class="dates">' + renderTL() + '</section>' : '') + '</article></div>';
  const contents = view.querySelector('.contents');
  const wide = matchMedia('(min-width: 800px)');
  contents.open = wide.matches;
  wide.addEventListener('change', () => { contents.open = wide.matches; });
  const sizes = [18, 21, 24, 27];
  let size = store.get('amao.readingSize', 1);
  function applySize() { view.style.setProperty('--reading-size', sizes[size] + 'px'); }
  applySize();
  view.querySelector('.type-size').onclick = () => {
    size = (size + 1) % sizes.length;
    store.set('amao.readingSize',size);
    applySize();
  };
  const entries = Array.from(view.querySelectorAll('.entry'));
  const tocLinks = Array.from(contents.querySelectorAll('a'));
  const tocInput = contents.querySelector('input[type="search"]');
  const tocEmpty = contents.querySelector('.toc-empty');
  tocInput.addEventListener('input', () => {
    const term = tocInput.value.toLocaleLowerCase('ru').trim();
    let visible = 0;
    tocLinks.forEach(link => {
      const match = link.dataset.title.toLocaleLowerCase('ru').includes(term);
      link.hidden = !match;
      if (match) visible++;
    });
    contents.querySelectorAll('.toc-group').forEach(group => {
      group.hidden = !Array.from(group.querySelectorAll('a')).some(link => !link.hidden);
    });
    tocEmpty.hidden = visible > 0;
  });
  tocInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      tocInput.value = '';
      tocInput.dispatchEvent(new Event('input'));
      tocInput.blur();
    }
  });
  const jump = id => {
    const node = entries.find(el => el.id === id);
    if (node) node.scrollIntoView({block:'start'});
  };
  contents.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    if (!wide.matches) contents.open = false;
    jump(link.hash.slice(1));
  });
  function position() {
    const edge = view.querySelector('.reader-bar').offsetHeight + (wide.matches ? 14 : 65);
    let index = 0;
    while (index + 1 < entries.length && entries[index+1].getBoundingClientRect().top <= edge) index++;
    const node = entries[index], rect = node.getBoundingClientRect();
    tocLinks.forEach((a, i) => i === index ? a.setAttribute('aria-current','location') : a.removeAttribute('aria-current'));
    view.querySelector('.toc-current-title').textContent = node.querySelector('h3')?.textContent || title;
    view.querySelector('.toc-count').textContent = String(index+1).padStart(2,'0') + ' / ' + String(totalChapters).padStart(2,'0');
    view.querySelector('.toc-meter i').style.width = ((index+1)/Math.max(1,totalChapters)*100) + '%';
    return view.scrollTop > 2 ? {ch:node.id, fraction:Math.max(0,(edge-rect.top)/node.offsetHeight)} : null;
  }
  const saved = store.get(key, undefined);
  const previous = store.get(volumeKey + '.pos', null);
  const from = saved === undefined && previous?.ch ? {ch:previous.ch,fraction:0} : saved;
  const initial = entries.find(el => el.id === from?.ch);
  view.querySelector('.album-tabs').addEventListener('click', e => {
    const tab = e.target.closest('[data-section]');
    if (tab) jump(tab.dataset.section);
  });
  if (initial) {
    jump(initial.id);
    view.scrollTop += Math.min(1, from.fraction || 0) * initial.offsetHeight;
  }
  position();
  let pending;
  const save = () => {
    store.set(key, position());
  };
  view.addEventListener('scroll', () => { clearTimeout(pending); pending = setTimeout(save,100); },{passive:true});
  window.addEventListener('pagehide',save);
}
