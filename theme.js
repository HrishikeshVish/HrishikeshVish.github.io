/* Light/dark theme for every page of the site.
   Loaded in <head> so the theme is set before the page paints: light unless the reader chose dark,
   and the choice is remembered in their browser across pages. Adds a "Dark" switch to the page's nav
   (or beside the "Back to Home" line on project pages). Each stylesheet supplies its own dark palette
   under :root[data-theme="dark"]. */
(function () {
  'use strict';
  var root = document.documentElement, KEY = 'theme', saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable: stay light */ }
  root.setAttribute('data-theme', saved === 'dark' ? 'dark' : 'light');

  var CSS = [
    '.theme-switch{appearance:none;display:inline-flex;align-items:center;gap:8px;padding:0;border:0;background:none;',
    'color:var(--ink);cursor:pointer;font:inherit;letter-spacing:inherit;line-height:1}',
    '.theme-switch__label{font-family:var(--mono);font-size:12.5px;font-weight:400;letter-spacing:0;color:var(--muted)}',
    '.theme-switch__track{position:relative;width:36px;height:20px;border-radius:20px;background:var(--ash);transition:background-color .2s}',
    '.theme-switch__thumb{position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;',
    'background:var(--bg,var(--paper,#fff));box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .2s}',
    '.theme-switch[aria-checked="true"] .theme-switch__track{background:var(--accent,var(--ink))}',
    '.theme-switch[aria-checked="true"] .theme-switch__thumb{transform:translateX(16px)}',
    '.theme-switch:hover .theme-switch__label{color:var(--ink)}',
    '.theme-switch:focus-visible{outline:2px solid var(--accent,var(--ink));outline-offset:4px;border-radius:20px}',
    '.nav__links{align-items:center}',
    '.theme-head{position:relative}',
    '.theme-head .theme-switch{position:absolute;right:0;bottom:5px}',
    '@media (prefers-reduced-motion:reduce){.theme-switch__track,.theme-switch__thumb{transition:none}}'
  ].join('');

  function build() {
    var sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'theme-switch';
    sw.setAttribute('role', 'switch');
    sw.setAttribute('aria-label', 'Dark mode');
    sw.title = 'Dark mode';
    sw.innerHTML = '<span class="theme-switch__label">Dark</span>' +
      '<span class="theme-switch__track" aria-hidden="true"><span class="theme-switch__thumb"></span></span>';
    return sw;
  }

  function mount() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var sw = build(), links = document.querySelector('.nav__links'), home = document.querySelector('a.home');
    if (links) {
      links.appendChild(sw);
    } else if (home) {                       // project pages: beside the "Back to Home" line
      var head = document.createElement('div');
      head.className = 'theme-head';
      home.parentNode.insertBefore(head, home);
      head.appendChild(home);
      head.appendChild(sw);
    } else {
      return;
    }
    var show = function () { sw.setAttribute('aria-checked', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false'); };
    show();
    sw.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* not remembered, still applied */ }
      show();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
