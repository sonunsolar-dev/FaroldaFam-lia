/* Aviso de cookies do SOS Farol (15/10/2026 — revisão LGPD/ANPD).
   O Google Analytics SÓ é carregado depois de a pessoa clicar em "Aceitar".
   "Recusar" tem o mesmo destaque (Guia orientativo de cookies da ANPD).
   A escolha fica no navegador (localStorage 'farol_cookies' = aceito|recusado);
   o link "Preferências de cookies" no rodapé reabre o aviso.
   Antes da escolha, os gtag('event', ...) da página só ficam na fila
   window.dataLayer (nada sai do navegador); se aceitar, a fila é enviada. */
(function () {
  var CHAVE = 'farol_cookies';
  var GA = 'https://www.googletagmanager.com/gtag/js?id=G-Z89YGFG8XW';

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  var carregou = false;
  function carregaGA() {
    if (carregou) return; carregou = true;
    var g = document.createElement('script'); g.async = true; g.src = GA;
    document.head.appendChild(g);
  }
  // Com consentimento: carrega na 1a interação ou depois de 8 s (página rápida).
  function agendaGA() {
    var evs = ['scroll', 'pointerdown', 'touchstart', 'keydown'];
    function vai() {
      evs.forEach(function (e) { window.removeEventListener(e, vai, { passive: true }); });
      carregaGA();
    }
    evs.forEach(function (e) { window.addEventListener(e, vai, { passive: true }); });
    setTimeout(vai, 8000);
  }

  function estilo() {
    if (document.getElementById('farolCookiesCss')) return;
    var s = document.createElement('style'); s.id = 'farolCookiesCss';
    s.textContent =
      '#farolCookies{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:640px;margin:0 auto;' +
      'background:#fff;color:#10262B;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.25);padding:16px 18px;' +
      'font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}' +
      '#farolCookies p{margin:0 0 12px}' +
      '#farolCookies a{color:#0E6E66;font-weight:600}' +
      '#farolCookies .acoes{display:flex;gap:10px;flex-wrap:wrap}' +
      '#farolCookies button{flex:1 1 140px;min-height:44px;border:0;border-radius:10px;background:#0E6E66;color:#fff;' +
      'font:600 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}' +
      '#farolCookies button:focus-visible{outline:3px solid #F2A65A;outline-offset:2px}' +
      '.farol-cookies-link{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}';
    document.head.appendChild(s);
  }

  function fechar() { var b = document.getElementById('farolCookies'); if (b) b.remove(); }

  function mostrar() {
    if (document.getElementById('farolCookies')) return;
    estilo();
    var raiz = /\/conteudos\//.test(location.pathname) ? '../' : '';
    var b = document.createElement('div');
    b.id = 'farolCookies'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('Usamos cookies do Google Analytics para contar as visitas e melhorar o site. Eles só são usados se você aceitar. '));
    var a = document.createElement('a'); a.href = raiz + 'politica-de-privacidade.html#cookies'; a.textContent = 'Saiba mais';
    p.appendChild(a); p.appendChild(document.createTextNode('.'));
    var acoes = document.createElement('div'); acoes.className = 'acoes';
    var sim = document.createElement('button'); sim.type = 'button'; sim.textContent = 'Aceitar';
    var nao = document.createElement('button'); nao.type = 'button'; nao.textContent = 'Recusar';
    sim.onclick = function () { gravar('aceito'); fechar(); carregaGA(); };
    // Se o GA já tinha carregado (a pessoa aceitou e depois mudou), para de coletar na hora.
    nao.onclick = function () { gravar('recusado'); window['ga-disable-G-Z89YGFG8XW'] = true; fechar(); };
    acoes.appendChild(sim); acoes.appendChild(nao);
    b.appendChild(p); b.appendChild(acoes);
    document.body.appendChild(b);
  }

  // Link para mudar a escolha, no rodapé (se a página tiver um).
  function linkRodape() {
    var f = document.querySelector('footer');
    if (!f || f.querySelector('.farol-cookies-link')) return;
    estilo();
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'farol-cookies-link';
    btn.textContent = 'Preferências de cookies';
    btn.onclick = function () {
      // Retirar o consentimento: apaga os cookies do GA deste domínio.
      if (ler() === 'aceito') {
        document.cookie.split(';').forEach(function (c) {
          var n = c.split('=')[0].trim();
          if (/^_ga/.test(n)) {
            document.cookie = n + '=; Max-Age=0; path=/';
            document.cookie = n + '=; Max-Age=0; path=/; domain=.' + location.hostname.replace(/^www\./, '');
          }
        });
      }
      try { localStorage.removeItem(CHAVE); } catch (e) {}
      mostrar();
    };
    // Na lista "Legal" do rodapé, junto da Política (mesmo visual dos outros links).
    var pol = f.querySelector('a[href*="politica-de-privacidade"]');
    var li = pol && pol.closest('li');
    if (li) {
      var novo = document.createElement('li');
      btn.className += ' ' + (pol.className || '');
      btn.style.textDecoration = 'none';
      novo.appendChild(btn);
      li.parentNode.appendChild(novo);
      return;
    }
    var p = document.createElement('p'); p.style.margin = '12px 0 0'; p.style.fontSize = '14px';
    p.appendChild(btn);
    (f.querySelector('.wrap') || f).appendChild(p);
  }

  window.farolCookies = { abrir: mostrar };

  function iniciar() {
    linkRodape();
    var v = ler();
    if (v === 'aceito') agendaGA();
    else if (v !== 'recusado') mostrar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
