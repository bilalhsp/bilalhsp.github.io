(() => {
  const key = 'bilal-color-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'auto';
  try { const saved = localStorage.getItem(key); if (['light', 'dark'].includes(saved)) preference = saved; } catch {}
  const choices = () => [...document.querySelectorAll('[data-theme-choice]')];
  function apply() {
    const dark = preference === 'dark' || (preference === 'auto' && media.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    const button = document.getElementById('theme-button');
    if (button) {
      const selected = choices().find(choice => choice.dataset.themeChoice === (dark ? 'dark' : 'light'));
      button.innerHTML = selected.querySelector('svg').outerHTML;
      const appearance = dark ? 'Dark' : 'Light';
      const label = preference === 'auto' ? `Theme: ${appearance} (Auto)` : `Theme: ${appearance}`;
      button.setAttribute('aria-label', label);
      button.title = label;
      choices().forEach(choice => choice.setAttribute('aria-checked', String(choice.dataset.themeChoice === preference)));
    }
  }
  apply();
  media.addEventListener('change', () => { if (preference === 'auto') apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : 'auto';
      apply();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    const button = document.getElementById('theme-button');
    const menu = document.getElementById('theme-menu');
    if (!button || !menu) return;
    function close(focusButton = false) {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (focusButton) button.focus();
    }
    function open(index) {
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      const items = choices();
      (items[index] || items.find(item => item.dataset.themeChoice === preference)).focus();
    }
    button.addEventListener('click', () => menu.hidden ? open() : close());
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open(event.key === 'ArrowDown' ? 0 : choices().length - 1);
      }
    });
    choices().forEach(choice => choice.addEventListener('click', () => {
      preference = choice.dataset.themeChoice;
      try { localStorage.setItem(key, preference); } catch {}
      apply();
      close(true);
    }));
    menu.addEventListener('keydown', event => {
      const items = choices();
      const index = items.indexOf(document.activeElement);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next].focus();
      } else if (event.key === 'Escape') { event.preventDefault(); close(true); }
      else if (event.key === 'Tab') close();
    });
    document.addEventListener('pointerdown', event => { if (!event.target.closest('.theme-picker')) close(); });
    document.addEventListener('focusin', event => { if (!event.target.closest('.theme-picker')) close(); });
  });
})();
