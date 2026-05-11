(function () {
  function getNavLinks() {
    // Pega apenas links do menu principal: header > nav > ul > li > a
    return document.querySelectorAll('header nav ul li a');
  }

  function normalizePath(p) {
    if (!p) return '';
    // remove query/hash
    const clean = String(p).split('#')[0].split('?')[0];
    // pega só o nome do arquivo
    const parts = clean.split('/');
    return parts[parts.length - 1] || '';
  }

  function setActiveNavLink() {
    const currentFile = normalizePath(window.location.pathname);
    const links = getNavLinks();

    links.forEach((a) => {
      // remove active do anchor e do li (dependendo de como está no HTML)
      a.classList.remove('active');
      if (a.parentElement) a.parentElement.classList.remove('active');
    });

    // se o menu tiver links com href="termos.html" (relativo), comparamos pelo arquivo
    links.forEach((a) => {
      const href = normalizePath(a.getAttribute('href'));
      if (!href) return;

      // Considera index.html como "" também (às vezes pathname pode vir vazio em alguns casos)
      const isMatch = href === currentFile || (href === 'index.html' && (currentFile === '' || currentFile === 'index.html'));

      if (isMatch) {
        a.classList.add('active');
        if (a.parentElement) a.parentElement.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setActiveNavLink);
})();

