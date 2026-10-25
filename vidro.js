/* SOS Farol · prototipo "Foto + Vidro" · comportamentos da pagina
   (base: kit de estilo; sem WhatsApp, Formspree, reCAPTCHA, Analytics nem redirecionamentos) */
(function () {
  document.documentElement.classList.add('js');

  // ---------- topo: vidro ao rolar + menu mobile ----------
  var topo = document.querySelector('.topo');
  if (topo) {
    var aoRolar = function () { topo.classList.toggle('rolou', window.scrollY > 30); };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    var botao = topo.querySelector('.abre-menu');
    var fecharMenu = function () {
      topo.classList.remove('aberto');
      if (botao) { botao.setAttribute('aria-expanded', 'false'); botao.setAttribute('aria-label', 'Abrir menu'); }
    };
    if (botao) {
      botao.addEventListener('click', function () {
        var aberto = topo.classList.toggle('aberto');
        botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      });
    }
    // no celular, tocar num link de ancora fecha o menu
    topo.querySelectorAll('.menu a[href^="#"]').forEach(function (a) { a.addEventListener('click', fecharMenu); });
    // fecha o submenu "Area do Cliente" ao clicar fora (desktop)
    document.addEventListener('click', function (e) {
      topo.querySelectorAll('details[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
    });
  }

  // ---------- botao flutuante "voltar ao topo" (celular; 2026-10-12) ----------
  var aoTopo = document.createElement('button');
  aoTopo.type = 'button';
  aoTopo.className = 'ao-topo';
  aoTopo.setAttribute('aria-label', 'Voltar ao início');
  aoTopo.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(aoTopo);
  var mostrarAoTopo = function () { aoTopo.classList.toggle('visivel', window.scrollY > 600); };
  mostrarAoTopo();
  window.addEventListener('scroll', mostrarAoTopo, { passive: true });
  aoTopo.addEventListener('click', function () {
    var suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' });
  });

  // ---------- revelacao suave ao rolar ----------
  var revelar = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (itens) {
      itens.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add('visivel'); io.unobserve(i.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revelar.forEach(function (el) { io.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('visivel'); });
  }

  // ---------- videos (mp4 do site, abre numa janela por cima) ----------
  var modal = document.getElementById('vidModal');
  var player = document.getElementById('vidPlayer');
  if (modal && player) {
    var fechar = function () { player.pause(); player.removeAttribute('src'); player.load(); modal.classList.remove('open'); };
    document.querySelectorAll('.vid-btn').forEach(function (b) {
      b.addEventListener('click', function () { player.src = b.getAttribute('data-video'); modal.classList.add('open'); player.play();
        if (typeof gtag === 'function') gtag('event', 'play_video', { video: b.getAttribute('data-video') }); });
    });
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.vid-fechar')) fechar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) fechar(); });
  }

  // ---------- botao de assinatura (Kiwify) ----------
  var comprar = document.getElementById('comprarBtn');
  if (comprar) comprar.href = 'https://pay.kiwify.com.br/eUBIZVh';
  // So' maiores de 18 anos (24/10/2026): a compra so' abre com a declaracao
  // marcada. A declaracao e' registrada de novo, no servidor, ao ativar o app.
  var maior = document.getElementById('maioridadeCheck');
  var maiorMsg = document.getElementById('maioridadeMsg');
  if (comprar && maior) {
    maior.addEventListener('change', function () { if (maior.checked && maiorMsg) maiorMsg.textContent = ''; });
    comprar.addEventListener('click', function (e) {
      if (!maior.checked) {
        e.preventDefault();
        if (maiorMsg) maiorMsg.textContent = 'Para comprar é preciso ter 18 anos ou mais e marcar a declaração acima.';
        maior.focus();
        return;
      }
      if (typeof gtag === 'function') gtag('event', 'click_assinar');
    });
  }
})();
