const $ = (selector) => document.querySelector(selector);
const collator = new Intl.Collator('es');
let productions = [];
let favorites = new Set();
let mode = 'all';

const controls = {
  search: $('#search'), theatre: $('#theatre'), month: $('#month'),
  type: $('#type'), priority: $('#priority'), sort: $('#sort'),
};

function option(value) {
  const element = document.createElement('option');
  element.value = value;
  element.textContent = value;
  return element;
}

function fillSelect(element, values) {
  [...new Set(values)].sort(collator.compare).forEach((value) => element.append(option(value)));
}

function addText(parent, tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  parent.append(element);
  return element;
}

function makeCard(item) {
  const card = document.createElement('article');
  card.className = 'play-card';

  const top = document.createElement('div');
  top.className = 'card-topline';
  addText(top, 'span', 'rank', `#${item.rank}`);
  const tags = document.createElement('div');
  tags.className = 'card-tags';
  addText(tags, 'span', 'type', item.type);
  const favorite = addText(tags, 'button', `favorite${favorites.has(item.id) ? ' saved' : ''}`, favorites.has(item.id) ? '♥' : '♡');
  favorite.type = 'button';
  favorite.setAttribute('aria-label', favorites.has(item.id) ? `Quitar ${item.title} de guardadas` : `Guardar ${item.title}`);
  favorite.setAttribute('aria-pressed', String(favorites.has(item.id)));
  favorite.addEventListener('click', () => toggleFavorite(item.id));
  top.append(tags);
  card.append(top);
  addText(card, 'h2', '', item.title);
  addText(card, 'p', 'theatre', item.theatre);

  const details = document.createElement('dl');
  [['Fechas', item.dates], ['Precio', item.price]].forEach(([label, value]) => {
    const row = document.createElement('div');
    addText(row, 'dt', '', label);
    addText(row, 'dd', '', value);
    details.append(row);
  });
  card.append(details);

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const priority = document.createElement('div');
  addText(priority, 'small', '', 'Prioridad');
  const dots = addText(priority, 'span', 'stars', `${'●'.repeat(item.priority)}${'○'.repeat(5 - item.priority)}`);
  dots.setAttribute('aria-label', `Prioridad ${item.priority} de 5`);
  footer.append(priority);

  if (item.ticketUrl) {
    const link = addText(footer, 'a', '', 'Entradas ↗');
    link.href = item.ticketUrl;
    link.target = '_blank';
    link.rel = 'noreferrer';
  } else {
    addText(footer, 'span', 'pending', 'Enlace pendiente');
  }
  card.append(footer);

  const editorial = document.createElement('details');
  editorial.className = 'editorial';
  addText(editorial, 'summary', '', 'Ver ficha editorial');
  const grid = document.createElement('div');
  grid.className = 'editorial-grid';
  [['Casting', item.casting], ['Dirección', item.direction], ['Dramaturgia', item.dramaturgy]].forEach(([label, value]) => {
    if (!value) return;
    const detail = document.createElement('p');
    addText(detail, 'b', '', label);
    detail.append(document.createTextNode(value));
    grid.append(detail);
  });
  editorial.append(grid);
  if (item.why) {
    const why = document.createElement('p');
    why.className = 'why';
    addText(why, 'b', '', 'Por qué mola');
    why.append(document.createTextNode(item.why));
    editorial.append(why);
  }
  card.append(editorial);
  return card;
}

function render() {
  const query = controls.search.value.trim().toLocaleLowerCase('es');
  const results = productions
    .filter((item) => !query || `${item.title} ${item.theatre}`.toLocaleLowerCase('es').includes(query))
    .filter((item) => !controls.theatre.value || item.theatre === controls.theatre.value)
    .filter((item) => !controls.month.value || item.months.includes(controls.month.value))
    .filter((item) => !controls.type.value || item.type === controls.type.value)
    .filter((item) => !controls.priority.value || item.priority === Number(controls.priority.value))
    .filter((item) => mode === 'all' || (mode === 'essential' ? item.priority === 5 : favorites.has(item.id)))
    .sort((a, b) => controls.sort.value === 'rank'
      ? a.rank - b.rank || a.startDate.localeCompare(b.startDate)
      : a.startDate.localeCompare(b.startDate) || a.rank - b.rank);

  $('#result-count').textContent = results.length;
  $('#result-label').textContent = results.length === 1 ? 'obra encontrada' : 'obras encontradas';
  $('#cards').replaceChildren(...results.map(makeCard));
  $('#cards').hidden = !results.length;
  $('#empty').hidden = Boolean(results.length);
  $('#saved-count').textContent = favorites.size;
  document.querySelectorAll('[data-mode]').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  localStorage.setItem('madrid-a-escena-favorites', JSON.stringify([...favorites]));
  render();
}

function reset() {
  Object.values(controls).forEach((control) => { control.value = control === controls.sort ? 'date' : ''; });
  mode = 'all';
  render();
}

async function start() {
  try {
    const [dataResponse, editorialResponse] = await Promise.all([fetch('data.json'), fetch('editorial.json')]);
    if (!dataResponse.ok || !editorialResponse.ok) throw new Error('No se pudieron cargar los datos');
    const data = await dataResponse.json();
    const editorial = await editorialResponse.json();
    productions = data.map((item) => ({ ...item, ...(editorial[item.id] || {}) }));
    try { favorites = new Set(JSON.parse(localStorage.getItem('madrid-a-escena-favorites') || '[]')); } catch { favorites = new Set(); }
    fillSelect(controls.theatre, productions.map((item) => item.theatre));
    fillSelect(controls.type, productions.map((item) => item.type));
    $('#total-count').textContent = productions.length;
    $('#theatre-count').textContent = new Set(productions.map((item) => item.theatre)).size;
    Object.values(controls).forEach((control) => control.addEventListener(control === controls.search ? 'input' : 'change', render));
    $('#reset').addEventListener('click', reset);
    $('#empty-reset').addEventListener('click', reset);
    document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => { mode = button.dataset.mode; render(); }));
    $('#share').addEventListener('click', async () => {
      const label = $('#share span');
      try {
        if (navigator.share) await navigator.share({ title: 'Madrid a escena', text: 'Mi cartelera teatral de Madrid', url: location.href });
        else await navigator.clipboard.writeText(location.href);
        label.textContent = '¡Enlace copiado!';
        window.setTimeout(() => { label.textContent = 'Compartir'; }, 1800);
      } catch { /* sharing was cancelled */ }
    });
    render();
  } catch (error) {
    $('#cards').replaceChildren();
    $('#empty').hidden = false;
    $('#empty h2').textContent = 'No se pudo cargar la cartelera';
    $('#empty p').textContent = 'Comprueba que data.json está junto a index.html.';
    console.error(error);
  }
}

start();
