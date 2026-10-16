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
    // 16/10/2026: no formato do aviso do site da SONUN (cartão compacto no canto,
    // botões em pílula), pedido do dono: o anterior era grande demais.
    s.textContent =
      '#farolCookies{position:fixed;z-index:9999;left:20px;bottom:20px;max-width:420px;border-radius:18px;' +
      'padding:16px 18px;display:grid;gap:12px;background:rgba(11,26,44,.92);color:#fff;' +
      'box-shadow:0 12px 32px rgba(0,0,0,.28);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);' +
      'font-family:inherit}' +
      '#farolCookies p{margin:0;font-size:14.5px;line-height:1.5;color:rgba(255,255,255,.78)}' +
      '#farolCookies a{color:#ffb48a}' +
      '#farolCookies .ck-acoes{display:flex;gap:10px;align-items:center;flex-wrap:wrap}' +
      '#farolCookies button{border-radius:999px;padding:10px 18px;font:inherit;font-size:15px;font-weight:600;cursor:pointer;min-height:40px}' +
      '#farolCookies .ck-sim{background:#ff7a3c;color:#fff;border:0;box-shadow:0 12px 28px -10px rgba(255,122,60,.8)}' +
      '#farolCookies .ck-nao{background:none;color:#fff;border:1px solid rgba(255,255,255,.22);font-weight:500}' +
      '#farolCookies .ck-nao:hover{border-color:rgba(255,255,255,.78)}' +
      '#farolCookies button:focus-visible{outline:2px solid #ffb48a;outline-offset:2px}' +
      '@media (max-width:760px){#farolCookies{left:14px;right:80px;bottom:14px;max-width:none}}' +
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
    p.appendChild(document.createTextNode('Usamos cookies para medir as visitas e melhorar o site. Você pode recusar. '));
    var a = document.createElement('a'); a.href = raiz + 'politica-de-privacidade.html#cookies'; a.textContent = 'Política de privacidade';
    p.appendChild(a);
    var acoes = document.createElement('div'); acoes.className = 'ck-acoes';
    var sim = document.createElement('button'); sim.type = 'button'; sim.className = 'ck-sim'; sim.textContent = 'Aceitar';
    var nao = document.createElement('button'); nao.type = 'button'; nao.className = 'ck-nao'; nao.textContent = 'Recusar';
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
