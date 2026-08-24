(function () {
  'use strict';

  var BOBRO_PREVIEW_SUFFIXES = ['.bobr0.site', '.bobro.loc'];

  function isBobroPreviewHost(hostname) {
    var host = String(hostname || '').toLowerCase();
    for (var i = 0; i < BOBRO_PREVIEW_SUFFIXES.length; i += 1) {
      var suffix = BOBRO_PREVIEW_SUFFIXES[i];
      if (host === suffix.slice(1) || host.endsWith(suffix)) {
        return true;
      }
    }
    return false;
  }

  function isGrantPreviewHost(hostname) {
    var host = String(hostname || '').toLowerCase();
    var dot = host.indexOf('.');
    if (dot < 0) {
      return false;
    }
    var label = host.slice(0, dot);
    return /--g[a-z2-7]+$/.test(label);
  }

  if (!isBobroPreviewHost(window.location.hostname)) {
    return;
  }

  if (isGrantPreviewHost(window.location.hostname)) {
    return;
  }

  if (document.getElementById('sitegin-preview-made-with-badge')) {
    return;
  }

  var style = document.createElement('style');
  style.id = 'sitegin-preview-made-with-badge-style';
  style.textContent =
    '.bobro-badge{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:8px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);box-shadow:0 2px 8px rgba(0,0,0,0.4);text-decoration:none;transition:transform .2s ease,box-shadow .2s ease;cursor:pointer;user-select:none;-webkit-user-select:none}' +
    '.bobro-badge:hover{transform:scale(1.05);box-shadow:0 4px 12px rgba(0,0,0,0.3)}' +
    '.bobro-badge:active{transform:scale(1.01)}' +
    '.bobro-badge-text{font-size:11px;font-weight:500;color:#e0e0e0;white-space:nowrap}' +
    '.bobro-badge-logo{height:16px;width:auto}' +
    '@media (max-width:640px){.bobro-badge{right:12px;bottom:12px;padding:5px 8px;gap:3px}.bobro-badge-text{font-size:10px}.bobro-badge-logo{height:14px}}';

  var link = document.createElement('a');
  link.id = 'sitegin-preview-made-with-badge';
  link.className = 'bobro-badge';
  link.href = 'https://bobro.site';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Перейти на Bobro.site');
  link.title = 'Создано на Bobro.site';

  var text = document.createElement('span');
  text.className = 'bobro-badge-text';
  text.textContent = 'Сделано в';

  var logo = document.createElement('img');
  logo.className = 'bobro-badge-logo';
  logo.src = '/_common/bobro-badge-logo.webp';
  logo.alt = 'Bobro.site';

  link.appendChild(text);
  link.appendChild(logo);

  document.head.appendChild(style);
  document.body.appendChild(link);
})();
