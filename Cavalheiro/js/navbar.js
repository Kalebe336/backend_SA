(function () {
  function getNavLinks() {
    // Busca apenas os links do menu principal no header.
    // Estrutura atual: header > nav > ul > li > a
    return document.querySelectorAll('header nav ul li a');
  }

  function normalizePath(p) {
    if (!p) return '';
    const clean = String(p).split('#')[0].split('?')[0];
    const parts = clean.split('/');
    return parts[parts.length - 1] || '';
  }

  function setActiveNavLink() {
    const currentFile = normalizePath(window.location.pathname);
    const links = getNavLinks();

    links.forEach((a) => {
      a.classList.remove('active');
      if (a.parentElement) a.parentElement.classList.remove('active');
    });

    links.forEach((a) => {
      const href = normalizePath(a.getAttribute('href'));
      if (!href) return;

      const isMatch = href === currentFile || (href === 'index.html' && (currentFile === '' || currentFile === 'index.html'));
      if (!isMatch) return;

      a.classList.add('active');
      if (a.parentElement) a.parentElement.classList.add('active');
    });
  }

  async function updateNavAccountFromBackend() {
    const accountLi = document.getElementById('nav-account');
    if (!accountLi) return;

    try {
      const resp = await fetch('/auth/me', { method: 'GET', credentials: 'include' });
      if (!resp.ok) throw new Error('auth/me failed');

      const data = await resp.json();
      const loggedIn = !!data.loggedIn;
      accountLi.innerHTML = loggedIn ? '<a href="conta.html">Conta</a>' : '<a href="login.html">Entrar</a>';
    } catch (e) {
      // fallback: sem backend rodando, não quebra a tela
      const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      accountLi.innerHTML = loggedIn ? '<a href="conta.html">Conta</a>' : '<a href="login.html">Entrar</a>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    updateNavAccountFromBackend();
  });
})();

