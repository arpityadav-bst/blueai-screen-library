/* Refs owned by the foundation slice. Format: guide/refs/README.md. */
window.V2Refs = (window.V2Refs || []).concat([
  {
    id: 'foundation.react-tags.react',
    file: 'index.html',
    line: 21,
    needle: 'https://unpkg.com/react@18.3.1/umd/react.development.js',
    value: 'React 18.3.1 UMD (development build), copied verbatim into the guide page',
  },
  {
    id: 'foundation.react-tags.react-dom',
    file: 'index.html',
    line: 22,
    needle: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
    value: 'ReactDOM 18.3.1 UMD (development build), copied verbatim into the guide page',
  },
  {
    id: 'foundation.react-tags.babel',
    file: 'index.html',
    line: 23,
    needle: 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
    value: '@babel/standalone 7.29.0, copied verbatim into the guide page',
  },
  {
    id: 'foundation.font-stack',
    file: 'index.html',
    line: 34,
    needle: "font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Helvetica Neue', sans-serif;",
    value: "-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Helvetica Neue', sans-serif (Mac shows SF, Windows shows Plus Jakarta Sans); the system replaces it with --v2-font-ui, Inter first",
  },
  {
    id: 'foundation.tailwind',
    file: 'index.html',
    line: 24,
    needle: '<script src="https://cdn.tailwindcss.com"></script>',
    value: 'Tailwind Play CDN at runtime; the system page does not load it (P2: drop the Tailwind CDN)',
  },
]);
