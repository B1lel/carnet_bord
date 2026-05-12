/* =============================================================
   admin/preview.js — Templates de prévisualisation Decap CMS
   Injecte le CSS du site + KaTeX + highlight.js dans l'iframe
   de preview, et définit un rendu fidèle pour chaque section.
   ============================================================= */

/* ── CSS du site dans chaque iframe de preview ── */
CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
CMS.registerPreviewStyle('/assets/css/style.css');
CMS.registerPreviewStyle('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
CMS.registerPreviewStyle('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');

/* ── Injecte un <script> dans le document de l'iframe si besoin ── */
function injectScript(doc, src) {
  return new Promise(function (resolve) {
    if (doc.querySelector('script[src="' + src + '"]')) { resolve(); return; }
    var s = doc.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve;
    doc.head.appendChild(s);
  });
}

/* ── Après chaque render : KaTeX + highlight.js sur le nœud racine ── */
function enhance(el) {
  if (!el) return;
  var doc = el.ownerDocument;
  var win = doc.defaultView;

  /* KaTeX */
  injectScript(doc, 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js')
    .then(function () {
      return injectScript(doc, 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js');
    })
    .then(function () {
      if (win.renderMathInElement) {
        win.renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true  },
            { left: '$',  right: '$',  display: false },
          ],
          throwOnError: false,
        });
      }
    });

  /* highlight.js */
  injectScript(doc, 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js')
    .then(function () {
      return injectScript(doc, 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js');
    })
    .then(function () {
      if (win.hljs) {
        el.querySelectorAll('pre code').forEach(function (block) {
          win.hljs.highlightElement(block);
        });
      }
    });
}

/* =============================================================
   JOURNAL DE BORD
   ============================================================= */
var JournalPreview = createClass({
  componentDidMount:  function () { enhance(this._root); },
  componentDidUpdate: function () { enhance(this._root); },

  render: function () {
    var self    = this;
    var entries = this.props.widgetsFor('entries');

    return h('main', { ref: function (el) { self._root = el; } },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Journal de bord'),
        h('p', {}, 'Suivi chronologique de ma progression.')
      ),
      entries.map(function (e) {
        var date   = (e.getIn(['data', 'date']) || '').toString().split('T')[0];
        var title  = e.getIn(['data', 'title'])   || '(sans titre)';
        var body   = e.getIn(['widgets', 'body']);
        var images = e.getIn(['data', 'images']);

        var imgNodes = null;
        if (images && images.size > 0) {
          imgNodes = h('div', { className: 'img-grid' },
            images.map(function (img, i) {
              return h('div', { className: 'img-card', key: i },
                h('img', { src: img.get('src') || '', alt: img.get('caption') || '' }),
                img.get('caption')
                  ? h('div', { className: 'img-caption' }, img.get('caption'))
                  : null
              );
            }).toArray()
          );
        }

        return h('article', { className: 'card', key: date + title },
          h('div', { className: 'card-date' }, date),
          h('h2', {}, title),
          h('div', { className: 'entry-body' }, body),
          imgNodes
        );
      }).toArray()
    );
  }
});

CMS.registerPreviewTemplate('journal', JournalPreview);

/* =============================================================
   PHYSIQUE
   ============================================================= */
var PhysiquePreview = createClass({
  componentDidMount:  function () { enhance(this._root); },
  componentDidUpdate: function () { enhance(this._root); },

  render: function () {
    var self    = this;
    var entries = this.props.widgetsFor('entries');

    return h('main', { ref: function (el) { self._root = el; } },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Physique'),
        h('p', {}, 'Lois physiques utilisées dans le modèle.')
      ),
      entries.map(function (e) {
        var title    = e.getIn(['data', 'title'])    || '';
        var equation = e.getIn(['data', 'equation']) || '';
        var body     = e.getIn(['widgets', 'body']);

        return h('article', { className: 'card', key: title },
          h('h2', {}, title),
          equation
            ? h('div', { className: 'math-block' }, '$$' + equation + '$$')
            : null,
          h('div', { className: 'entry-body' }, body)
        );
      }).toArray()
    );
  }
});

CMS.registerPreviewTemplate('physique', PhysiquePreview);

/* =============================================================
   CODE PYTHON
   ============================================================= */
var CodePreview = createClass({
  componentDidMount:  function () { enhance(this._root); },
  componentDidUpdate: function () { enhance(this._root); },

  render: function () {
    var self    = this;
    var entries = this.props.widgetsFor('entries');

    return h('main', { ref: function (el) { self._root = el; } },
      h('div', { className: 'page-header' },
        h('h1', {}, 'Code Python'),
        h('p', {}, 'Extraits commentés du programme.')
      ),
      entries.map(function (e) {
        var title = e.getIn(['data', 'title'])       || '';
        var desc  = e.getIn(['data', 'description']) || '';
        var code  = e.getIn(['widgets', 'code']);

        return h('article', { className: 'card', key: title },
          h('h2', {}, title),
          desc ? h('p', {}, desc) : null,
          h('div', {}, code)
        );
      }).toArray()
    );
  }
});

CMS.registerPreviewTemplate('code', CodePreview);

/* =============================================================
   RÉSULTATS
   ============================================================= */
var ResultatsPreview = createClass({
  render: function () {
    var entries = this.props.widgetsFor('entries');

    return h('main', {},
      h('div', { className: 'page-header' },
        h('h1', {}, 'Résultats'),
        h('p', {}, 'Graphiques et simulations.')
      ),
      entries.map(function (e) {
        var title = e.getIn(['data', 'title'])       || '';
        var src   = e.getIn(['data', 'src'])         || '';
        var desc  = e.getIn(['data', 'description']) || '';

        return h('article', { className: 'card', key: title },
          h('h2', {}, title),
          src
            ? h('img', {
                src: src,
                alt: title,
                style: { maxWidth: '100%', borderRadius: '6px', margin: '0.75rem 0', display: 'block' }
              })
            : null,
          desc ? h('p', {}, desc) : null
        );
      }).toArray()
    );
  }
});

CMS.registerPreviewTemplate('resultats', ResultatsPreview);

/* =============================================================
   BIBLIOGRAPHIE
   ============================================================= */
var BiblioPreview = createClass({
  render: function () {
    var entries = this.props.widgetsFor('entries');

    return h('main', {},
      h('div', { className: 'page-header' },
        h('h1', {}, 'Bibliographie'),
        h('p', {}, 'Sources et références consultées.')
      ),
      entries.map(function (e) {
        var title   = e.getIn(['data', 'title'])   || '';
        var authors = e.getIn(['data', 'authors']) || '';
        var year    = e.getIn(['data', 'year'])    || '';
        var url     = e.getIn(['data', 'url'])     || '';
        var notes   = e.getIn(['data', 'notes'])   || '';
        var meta    = [authors, year].filter(Boolean).join(' — ');

        return h('article', { className: 'card', key: title },
          h('h2', {}, title),
          meta
            ? h('p', { style: { fontStyle: 'italic', marginBottom: '0.5rem' } }, meta)
            : null,
          url
            ? h('p', {},
                h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, url)
              )
            : null,
          notes ? h('p', {}, notes) : null
        );
      }).toArray()
    );
  }
});

CMS.registerPreviewTemplate('biblio', BiblioPreview);
