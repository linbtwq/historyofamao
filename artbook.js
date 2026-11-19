function sticker(name) {
  return '<img class="diecut" src="art/stickers/' + name + '.svg" alt="">';
}

function paperIndex(notes) {
  const items = notes ? [['milk','На кухне','kitchen-milk'],['strawberry','Угощение Моры','berry-choice'],['key','Двойное дно','box-key']]
                      : [['cookie','Бабушка','s6'],['rabbit','На ферме','farm-memory'],['moon','Ночной магазин','s9']];
  return '<nav class="keepsakes" aria-label="Предметы истории">' + items.map(([icon,title,id]) =>
    '<a href="#' + id + '">' + sticker(icon) + '<span>' + title + '</span></a>').join('') + '</nav>';
}

function albumTabs(notes) {
  const items = notes ? [['Мир','note0'],['Замысел','note1'],['Даты','note2'],['Акты','note6']]
                      : [['Корни','s3'],['Семья','s6'],['Детство','s8'],['Мора','s10']];
  return '<nav class="album-tabs" aria-label="Закладки книги">' + items.map(([name,id]) =>
    '<button data-section="' + id + '">' + name + '</button>').join('') + '</nav>';
}

function berryChoices(blocks) {
  const responses = [[32],[33],[32],[33,34]];
  return '<div class="berry-branches" id="berry-choice"><header>' + sticker('strawberry') +
    '<h4>Клубника от Моры</h4></header><p>' + E(blocks[27].t.replace(/^\[/,'')) +
    '</p>' + responses.map((indices,i) => '<details><summary>' +
    E(blocks[28+i].t.replace(/\]$/,'')) + '</summary>' + indices.map(index =>
      '<p>' + E(blocks[index].t) + '</p>').join('') + '</details>').join('') + '</div>';
}
