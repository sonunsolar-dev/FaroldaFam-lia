/* Versao da loja das paginas abertas pelo app da Google Play (revisao das
 * exigencias da Play, 08/11/2026). O app da loja abre estas paginas com
 * ?loja=1; ai' nada nelas pode levar a compra pelo site:
 *  - some o que tem data-so-site, aparece o que tem data-so-loja;
 *  - links para a pagina inicial e "Meu codigo" deixam de ser links (o texto
 *    fica); os botoes "Site"/"Voltar" somem;
 *  - links para as outras paginas abertas pelo app ganham loja=1.
 * Sem ?loja=1 (quem entra pelo site), nada muda. */
(function () {
  try {
    if (new URLSearchParams(location.search).get('loja') !== '1') return;
  } catch (_) { return; }

  function aplicar() {
    [].slice.call(document.querySelectorAll('[data-so-site]')).forEach(function (el) { el.remove(); });
    [].slice.call(document.querySelectorAll('[data-so-loja]')).forEach(function (el) { el.hidden = false; });

    var SITE = /^(\/|index\.html.*|meu-codigo\.html.*|https?:\/\/(www\.)?sosfarol\.com\.br\/?(index\.html.*|meu-codigo\.html.*|#.*)?)$/i;
    var DO_APP = /^((https?:\/\/(www\.)?sosfarol\.com\.br\/)?(contato|politica-de-privacidade|termos-de-uso|excluir-conta|manual)\.html)([?#].*)?$/i;

    [].slice.call(document.querySelectorAll('a[href]')).forEach(function (a) {
      var h = a.getAttribute('href');
      if (SITE.test(h)) {
        if (a.classList.contains('back')) { a.remove(); return; }
        var s = document.createElement('span');
        s.className = a.className;
        while (a.firstChild) s.appendChild(a.firstChild);
        a.replaceWith(s);
        return;
      }
      var m = h.match(DO_APP);
      if (m && !/[?&]loja=1/.test(h)) {
        var resto = m[5] || '';
        var hash = resto.indexOf('#') >= 0 ? resto.slice(resto.indexOf('#')) : '';
        var busca = resto.replace(hash, '');
        a.setAttribute('href', m[1] + (busca ? busca + '&' : '?') + 'loja=1' + hash);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicar);
  else aplicar();
})();
