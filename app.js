'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

function safeURL(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function prettyDate(value) {
  if (!value) return 'Undated';
  if (/^\d{4}$/.test(value)) return value;
  const [year, month, day = 1] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

let content;
const dialog = $('#detail-dialog');

function showDialog(label, html) {
  $('#dialog-label').textContent = label;
  $('#dialog-content').innerHTML = html;
  dialog.showModal();
}

$('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
$('#year').textContent = new Date().getFullYear();

function detail(item, label) {
  const url = safeURL(item.url);
  const tags = item.tags?.length ? `<div class="tags">${item.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>` : '';
  showDialog(label, `<h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.body || item.summary)}</p>${tags}${url ? `<a class="button primary" href="${escapeHTML(url)}" target="_blank" rel="noopener">${label === 'Project' ? 'View project' : 'Read more'} ↗</a>` : ''}`);
}

function renderNews() {
  $('#updates').innerHTML = content.announcements.slice(0, 3).map(item => `
    <article class="news-item">
      <time class="news-date">${escapeHTML(prettyDate(item.date))}</time>
      <div><button class="news-title" data-update="${escapeHTML(item.id)}" aria-label="Read announcement: ${escapeHTML(item.title)}">${escapeHTML(item.title)}</button><span class="news-category ${item.category === 'Award' ? 'award' : ''}">${escapeHTML(item.category)}</span></div>
    </article>`).join('') || '<p class="empty">New announcements will appear here.</p>';
  $$('[data-update]').forEach(button => button.addEventListener('click', () => {
    detail(content.announcements.find(item => item.id === button.dataset.update), 'Announcement');
  }));
}

function renderProjects(category = 'All projects') {
  const projects = content.projects.filter(item => category === 'All projects' || item.category === category);
  $('#projects-grid').innerHTML = projects.map(item => `
    <article class="project-item">
      <div class="project-title-line"><h3>${safeURL(item.url) ? `<a class="project-title" href="${escapeHTML(safeURL(item.url))}" target="_blank" rel="noopener">${escapeHTML(item.title)}</a>` : `<button class="project-title" data-project="${escapeHTML(item.id)}">${escapeHTML(item.title)}</button>`}</h3><span class="project-status">${escapeHTML(item.status)}</span></div>
      <p>${escapeHTML(item.summary)}</p>
      <div class="project-meta"><div class="tags">${(item.tags || []).map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div><button class="project-details" data-project="${escapeHTML(item.id)}" aria-label="Project details: ${escapeHTML(item.title)}">Details →</button></div>
    </article>`).join('') || '<p class="empty">New projects will appear here as I share them.</p>';
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    detail(content.projects.find(item => item.id === button.dataset.project), 'Project');
  }));
}

function renderWriting() {
  $('#writing-list').innerHTML = content.writing.map(item => `
    <a class="writing-row" href="${escapeHTML(safeURL(item.url) || '#writing')}" ${safeURL(item.url) ? 'target="_blank" rel="noopener"' : `data-writing="${escapeHTML(item.id)}"`}>
      <time>${escapeHTML(prettyDate(item.date))}</time><div><h3>${escapeHTML(item.title)} <span aria-hidden="true">↗</span></h3><p>${escapeHTML(item.summary)} <span class="writing-type">${escapeHTML(item.category)}</span></p></div>
    </a>`).join('') || '<p class="empty">New notes and project write-ups will appear here.</p>';
  $$('[data-writing]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    detail(content.writing.find(item => item.id === link.dataset.writing), 'Writing');
  }));
}

function showArchive() {
  const categories = [...new Set(content.announcements.map(item => item.category))];
  showDialog('News & announcements', `<h2>All announcements</h2><div class="archive-controls"><input id="update-search" class="field" type="search" placeholder="Search announcements" aria-label="Search announcements"><select id="update-category" class="field" aria-label="Announcement category"><option>All categories</option>${categories.map(category => `<option>${escapeHTML(category)}</option>`).join('')}</select></div><div id="archive-list" aria-live="polite"></div>`);
  const render = () => {
    const query = $('#update-search').value.toLowerCase();
    const category = $('#update-category').value;
    const items = content.announcements.filter(item => (category === 'All categories' || item.category === category) && `${item.title} ${item.summary} ${item.body || ''}`.toLowerCase().includes(query));
    $('#archive-list').innerHTML = items.map(item => `
      <article class="archive-item"><div class="archive-meta"><time>${escapeHTML(prettyDate(item.date))}</time><span>${escapeHTML(item.category)}</span></div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.body || item.summary)}</p>${safeURL(item.url) ? `<a class="text-link" href="${escapeHTML(safeURL(item.url))}" target="_blank" rel="noopener">Read more ↗</a>` : ''}</article>`).join('') || '<p class="empty">No announcements match this search.</p>';
  };
  $('#update-search').addEventListener('input', render);
  $('#update-category').addEventListener('change', render);
  render();
}

$('#all-updates').addEventListener('click', () => { if (content) showArchive(); });
$$('[data-citation]').forEach(button => button.addEventListener('click', () => {
  showDialog('BibTeX citation', '<h2>Restart Posterior Sampling</h2><pre>@article{ahmed2025reps,\n  title={Solving Diffusion Inverse Problems with Restart Posterior Sampling},\n  author={Ahmed, Bilal and Makin, Joseph G.},\n  journal={arXiv preprint arXiv:2511.20705},\n  year={2025}\n}</pre>');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) $$('.top-nav a[href^="#"]').forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-110px 0px -50% 0px' });
$$('main section[id]').forEach(section => observer.observe(section));

async function init() {
  try {
    const response = await fetch('content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Content could not be loaded.');
    content = await response.json();
    if (new URLSearchParams(location.search).get('preview') === '1') {
      try {
        const draft = JSON.parse(localStorage.getItem('bilal-site-draft-v1'));
        if (draft?.announcements && draft?.projects && draft?.writing) {
          content = draft;
          const banner = document.createElement('div');
          banner.className = 'preview-banner';
          banner.innerHTML = 'Local draft preview · Visible only in this browser · <a href="studio.html">Back to editor</a>';
          document.body.prepend(banner);
        }
      } catch { /* Published content remains available if local drafts cannot be read. */ }
    }
    content.announcements.sort((a, b) => b.date.localeCompare(a.date));
    renderNews();
    const categories = ['All projects', ...new Set(content.projects.map(item => item.category))];
    $('#project-filters').innerHTML = categories.map((category, index) => `<button class="filter ${index ? '' : 'active'}" aria-pressed="${!index}">${escapeHTML(category)}</button>`).join('');
    $$('#project-filters button').forEach(button => button.addEventListener('click', () => {
      $$('#project-filters button').forEach(other => {
        other.classList.toggle('active', other === button);
        other.setAttribute('aria-pressed', String(other === button));
      });
      renderProjects(button.textContent);
    }));
    renderProjects();
    renderWriting();
  } catch {
    $('#updates').innerHTML = '<p class="loading-error">News could not be loaded. Please reload this page.</p>';
    $('#projects-grid').innerHTML = '<p class="empty">Projects are available on <a href="https://github.com/bilalhsp">GitHub</a>.</p>';
  }
}

const searchDialog = $('#site-search');
const searchInput = $('#site-query');
const normalizeSearch = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function searchRecords() {
  const records = [];
  const addElement = (element, category, title) => {
    if (element) records.push({ title, category, text: element.innerText, element });
  };
  addElement($('#about'), 'About', 'Biography & interests');
  $$('#research .publication').forEach(element => addElement(element, 'Publication', $('h3', element).textContent));
  $$('#teaching .experience-row').forEach(element => addElement(element, 'Teaching & mentorship', $('h3', element).textContent));
  addElement($('.learning-note'), 'Projects', 'Planned explorations in AI systems & LLM training');
  addElement($('.personal-note'), 'About', 'Beyond research');
  if (content) {
    for (const [collection, category, label] of [['announcements', 'News', 'Announcement'], ['projects', 'Project', 'Project'], ['writing', 'Writing', 'Writing']]) {
      for (const item of content[collection]) records.push({ title: item.title, category, text: [item.title, item.summary, item.body, item.category, item.date, ...(item.tags || [])].join(' '), item, label });
    }
  }
  return records;
}

function renderSiteSearch() {
  const query = normalizeSearch(searchInput.value.trim());
  const results = $('#search-results');
  if (!query) {
    $('#search-status').textContent = 'Search biography, publications, all announcements, projects, writing, and teaching.';
    results.innerHTML = '';
    return;
  }
  const words = query.split(/\s+/);
  const matches = searchRecords().map(record => {
    const haystack = normalizeSearch(`${record.category} ${record.title} ${record.text}`);
    const title = normalizeSearch(record.title);
    const score = words.reduce((sum, word) => sum + (title.includes(word) ? 3 : 0), 0) + (title.includes(query) ? 5 : 0);
    return { ...record, score, matches: words.every(word => haystack.includes(word)) };
  }).filter(record => record.matches).sort((a, b) => b.score - a.score);
  $('#search-status').textContent = matches.length ? `${matches.length} result${matches.length === 1 ? '' : 's'}` : 'No results. Try a different word or a shorter query.';
  results.innerHTML = matches.map((record, index) => {
    const text = record.text.replace(/\s+/g, ' ').trim();
    const matchPosition = normalizeSearch(text).indexOf(words[0]);
    const start = Math.max(0, matchPosition - 55);
    const snippet = `${start ? '…' : ''}${text.slice(start, start + 175)}${text.length > start + 175 ? '…' : ''}`;
    return `<button class="search-result" data-search-result="${index}"><span class="search-category">${escapeHTML(record.category)}</span><strong>${escapeHTML(record.title)}</strong><span class="search-snippet">${escapeHTML(snippet)}</span></button>`;
  }).join('');
  $$('[data-search-result]', results).forEach(button => button.addEventListener('click', () => {
    const record = matches[Number(button.dataset.searchResult)];
    searchDialog.close();
    if (record.item) detail(record.item, record.label);
    else {
      record.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      record.element.setAttribute('tabindex', '-1');
      record.element.focus({ preventScroll: true });
    }
  }));
}

function openSiteSearch() {
  if (dialog.open) dialog.close();
  if (!searchDialog.open) searchDialog.showModal();
  renderSiteSearch();
  searchInput.focus();
}
$('#open-search').addEventListener('click', openSiteSearch);
$('#close-search').addEventListener('click', () => searchDialog.close());
searchInput.addEventListener('input', renderSiteSearch);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && searchDialog.open) {
    event.preventDefault();
    searchDialog.close();
    return;
  }
  const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
  if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !editing && !event.ctrlKey && !event.metaKey && !event.altKey)) {
    event.preventDefault();
    openSiteSearch();
  }
});
init().then(() => { if (searchDialog.open) renderSiteSearch(); });
