/* nav.js — injecte la barre de navigation commune sur toutes les pages */
(function () {
  var links = [
    { id: 'index',     href: 'index.html',     icon: '🏠', label: 'Accueil' },
    { id: 'journal',   href: 'journal.html',   icon: '📅', label: 'Journal' },
    { id: 'physique',  href: 'physique.html',  icon: '⚛️',  label: 'Physique' },
    { id: 'code',      href: 'code.html',      icon: '🐍', label: 'Code Python' },
    { id: 'resultats', href: 'resultats.html', icon: '📊', label: 'Résultats' },
    { id: 'biblio',    href: 'biblio.html',    icon: '📚', label: 'Bibliographie' },
  ];

  window.injectNav = function (activePage) {
    var nav = document.createElement('nav');
    nav.id = 'sidebar';

    var title = document.createElement('div');
    title.className = 'site-title';
    title.textContent = 'Carnet de bord';
    nav.appendChild(title);

    links.forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.href;
      a.innerHTML =
        '<span class="nav-icon">' + link.icon + '</span>' + link.label;
      if (link.id === activePage) a.classList.add('active');
      nav.appendChild(a);
    });

    /* Lien admin en bas */
    var footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    var adminLink = document.createElement('a');
    adminLink.href = 'admin/index.html';
    adminLink.innerHTML = '<span class="nav-icon">⚙️</span>Admin';
    footer.appendChild(adminLink);
    nav.appendChild(footer);

    document.body.insertBefore(nav, document.body.firstChild);
  };
})();
