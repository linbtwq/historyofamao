const desk = document.getElementById('desk');
const reader = document.getElementById('app');
const bookChoice = new URLSearchParams(location.search).get('book');

if ((bookChoice === 'diary' || isNotebook) && !new URLSearchParams(location.search).has('sheets')) {
  desk.hidden = true;
  startReading();
} else if (bookChoice === 'diary' || isNotebook) {
  desk.hidden = true;
  reader.hidden = false;
  B.classList.add('opened');
  B.classList.toggle('notebook', isNotebook);
  document.title = isNotebook ? 'Материалы игры · Амао' : 'Дневник Амао';
  fit();
  initBook(store.get(volumeKey + '.pos', null));
  // Пересчитываем длину строк, когда загрузится выбранный почерк.
  document.fonts.ready.then(() => {
    if (!animating) initBook(posOf(cur));
  });
}
