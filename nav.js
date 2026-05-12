/* nav.js — injecte la barre de navigation commune + lightbox sur toutes les pages */
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

    /* ── Lightbox ── */
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<button id="lightbox-close" aria-label="Fermer">&#215;</button><img id="lightbox-img" src="" alt="" />';
    document.body.appendChild(lb);

    var lbImg = document.getElementById('lightbox-img');

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lb.classList.remove('open');
      lbImg.src = '';
      document.body.style.overflow = '';
    }

    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

    /* Délégation : toute image cliquable dans main ouvre la lightbox */
    document.addEventListener('click', function (e) {
      var img = e.target.closest('img');
      if (!img) return;
      if (img.id === 'lightbox-img') return;
      if (!img.src || img.src === window.location.href) return;
      e.preventDefault();
      openLightbox(img.src, img.alt);
    });
  };
})();
