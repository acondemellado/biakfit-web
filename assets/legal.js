/* Páginas legales: mismo selector de idioma que la portada (se recuerda en el dispositivo). */
(function () {
  'use strict';
  var L = {
    es: { privacy: 'Privacidad', notice: 'Aviso legal', back: 'Volver a BiakFit', lema: 'Entrenamos juntos.', tPrivacy: 'Política de privacidad', tNotice: 'Aviso legal' },
    eu: { privacy: 'Pribatutasuna', notice: 'Lege-oharra', back: 'Itzuli BiakFitera', lema: 'Elkarrekin entrenatzen dugu.', tPrivacy: 'Pribatutasun-politika', tNotice: 'Lege-oharra' },
    en: { privacy: 'Privacy', notice: 'Legal notice', back: 'Back to BiakFit', lema: 'Training together.', tPrivacy: 'Privacy policy', tNotice: 'Legal notice' }
  };
  var lang = '';
  try { lang = localStorage.getItem('bk.lang') || ''; } catch (e) { lang = ''; }
  if (!L[lang]) { var n = (navigator.language || 'es').toLowerCase().slice(0, 2); lang = L[n] ? n : 'es'; }
  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-doc-lang]').forEach(function (a) { a.hidden = a.getAttribute('data-doc-lang') !== lang; });
    document.querySelectorAll('[data-l]').forEach(function (el) { el.textContent = L[lang][el.getAttribute('data-l')]; });
    document.querySelectorAll('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    var page = document.body.getAttribute('data-page');
    document.title = L[lang][page === 'privacy' ? 'tPrivacy' : 'tNotice'] + ' · BiakFit';
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem('bk.lang', lang); } catch (e) { /* sin almacenamiento */ }
      apply();
    });
  });
  apply();
})();
