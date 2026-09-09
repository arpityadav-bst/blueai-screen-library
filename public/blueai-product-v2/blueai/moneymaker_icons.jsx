// BlueAI — MoneyMaker welcome screen's designer-supplied full-color step icons (used in place of
// the plain numeral for each step, see moneymaker.jsx's StepRow). Split out of moneymaker.jsx
// (2026-08-14) when that file crossed the workspace's 300-line rule — these are two large,
// self-contained SVG assets with nothing else in common with the rest of the welcome screen, so
// they split cleanly. Exposes window.MoneyMakerIcons = { IcoProfile, IcoCodeFolder }.
(function () {
  /* Designer-supplied full-color icon for step 1's numeral slot. Kept as its own embedded
     defs/gradients rather than trying to recolor it via a `color` prop like the flat icons
     elsewhere in this product — it's a self-contained multi-tone asset, not a tintable glyph.
     Gradient ids renamed from the source's bare a/b/c to mmProf-prefixed ones, since the welcome
     screen already embeds several other inline <svg> elements and short generic ids are exactly
     what collides across them. */
  function IcoProfile({ size = 34 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 512 512">
        <defs>
          <linearGradient id="mmProfA" x1="335.8" x2="176.21" y1="441.25" y2="281.66" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1eb4eb" />
            <stop offset=".54" stopColor="#1eb4eb" />
            <stop offset="1" stopColor="#92f4fe" />
          </linearGradient>
          <linearGradient xlinkHref="#mmProfA" id="mmProfC" x1="309.93" x2="202.08" y1="215.94" y2="108.1" />
          <radialGradient id="mmProfB" cx="256.01" cy="-1172.26" r="200.83" gradientTransform="matrix(1 0 0 .45 0 942.02)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1eb4eb" stopOpacity=".6" />
            <stop offset="1" stopColor="#1eb4eb" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path fill="#dff8ff" d="M496.53,129.86C483.09,80.39,431.64,28.93,382.16,15.49,351.82,7.93,311.18.14,256,0,200.84.14,160.2,7.93,129.86,15.49,80.39,28.93,28.93,80.38,15.49,129.86,7.93,160.19.14,200.84,0,256c.13,55.17,7.92,95.81,15.48,126.15,13.44,49.48,64.9,100.93,114.37,114.37,30.34,7.56,71,15.35,126.15,15.48,55.16-.13,95.81-7.92,126.15-15.48,49.48-13.44,100.93-64.89,114.37-114.37,7.56-30.34,15.35-71,15.49-126.15C511.88,200.84,504.09,160.2,496.53,129.86Z" />
        <path fill="url(#mmProfB)" d="M444.69,366.22c-10.54-17.58-50.91-35.87-89.72-40.64a860.73,860.73,0,0,0-99-5.5,860.78,860.78,0,0,0-99,5.5c-38.81,4.78-79.18,23.06-89.72,40.64-5.93,10.78-12,25.22-12.15,44.83.11,19.6,6.22,34,12.15,44.82,10.54,17.58,50.91,35.87,89.72,40.64a860.78,860.78,0,0,0,99,5.5,860.73,860.73,0,0,0,99-5.5c38.81-4.77,79.18-23.06,89.72-40.64,5.93-10.78,12-25.22,12.15-44.82C456.73,391.44,450.62,377,444.69,366.22Z" />
        <path fill="url(#mmProfA)" d="M122.88,347c-11.95,24.56,8,61.13,37.9,68.68a434.93,434.93,0,0,0,190.45,0c29.93-7.56,49.85-44.11,37.9-68.68C366.81,300.6,315.45,259.84,256,259.45h0C196.56,259.84,145.2,300.6,122.88,347Z" />
        <circle cx="256.01" cy="162.02" r="76.26" fill="url(#mmProfC)" />
      </svg>);
  }

  /* Same deal as IcoProfile above — designer-supplied full-color icon for step 2's numeral slot,
     kept as its own embedded defs rather than tinted, gradient ids renamed from the source's bare
     a/b/c/d to mmCode-prefixed ones for the same collision reason. */
  function IcoCodeFolder({ size = 34 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 512 512">
        <defs>
          <linearGradient id="mmCodeB" x1="382.35" x2="107.2" y1="387.31" y2="112.16" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0e95e0" />
            <stop offset="1" stopColor="#2fbdee" />
          </linearGradient>
          <linearGradient id="mmCodeC" x1="379.02" x2="133.02" y1="423.91" y2="177.91" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1eb4eb" />
            <stop offset=".54" stopColor="#1eb4eb" />
            <stop offset="1" stopColor="#92f4fe" />
          </linearGradient>
          <linearGradient id="mmCodeD" x1="302.47" x2="210.01" y1="348.11" y2="255.65" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#bce4ed" />
            <stop offset=".57" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <radialGradient id="mmCodeA" cx="256" cy="9401.85" r="200.83" gradientTransform="matrix(1 0 0 .45 0 -3847.57)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1eb4eb" stopOpacity=".6" />
            <stop offset="1" stopColor="#1eb4eb" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path fill="#dff8ff" d="M496.53,129.86C483.09,80.38,431.64,28.92,382.16,15.49,351.82,7.92,311.18.13,256,0,200.84.14,160.2,7.92,129.86,15.49,80.39,28.93,28.93,80.38,15.49,129.86,7.93,160.19.14,200.84,0,256c.14,55.17,7.93,95.82,15.49,126.15,13.44,49.48,64.9,100.93,114.37,114.37,30.34,7.57,71,15.35,126.15,15.49,55.16-.14,95.81-7.92,126.15-15.49,49.48-13.44,100.93-64.89,114.37-114.37,7.56-30.33,15.35-71,15.48-126.15C511.88,200.84,504.09,160.19,496.53,129.86Z" />
        <path fill="url(#mmCodeA)" d="M444.69,366.22c-10.54-17.59-50.91-35.87-89.72-40.64a862.65,862.65,0,0,0-99-5.51,862.59,862.59,0,0,0-99,5.51c-38.81,4.77-79.18,23.05-89.72,40.64C61.39,377,55.28,391.44,55.17,411c.11,19.6,6.21,34,12.15,44.83,10.54,17.58,50.91,35.86,89.72,40.64a865.35,865.35,0,0,0,99,5.5,865.41,865.41,0,0,0,99-5.5c38.81-4.78,79.18-23.06,89.72-40.64,5.93-10.78,12-25.23,12.15-44.83C456.73,391.44,450.62,377,444.69,366.22Z" />
        <path fill="url(#mmCodeB)" d="M377.57,377.72a1330.22,1330.22,0,0,1-243.1,0c-20.52-2-40.23-20.9-42.84-41.47a821.69,821.69,0,0,1,0-195.5c2.61-20.56,22.31-39.44,42.84-41.45q26.73-2.46,53.5-3.83a20.79,20.79,0,0,1,17.37,7.71c10.49,12.81,21.47,25.86,32.76,39a15.27,15.27,0,0,0,11.63,5.33q66.56-.18,133.06,3.44c21.49,1.29,40.88,19.41,42.14,40a821.2,821.2,0,0,1-4.49,145.25C417.8,356.81,398.09,375.69,377.57,377.72Z" />
        <path fill="url(#mmCodeC)" d="M256,194.13q-63.4,0-126.74,3.43c-21.49,1.29-40.88,19.41-42.14,40-2.78,48.41-1.32,83.61,4.48,131.95C94.24,390.09,114,409,134.47,411q60.67,5.56,121.55,5.57T377.56,411c20.53-2,40.23-20.9,42.85-41.46,5.8-48.34,7.26-83.54,4.48-131.95-1.26-20.61-20.64-38.73-42.14-40Q319.44,194.1,256,194.13Z" />
        <path fill="url(#mmCodeD)" d="M239.83,374.7a9.33,9.33,0,0,1-9-11.68l33.29-126.56a9.31,9.31,0,0,1,18,4.74L248.83,367.75A9.32,9.32,0,0,1,239.83,374.7Zm-20.3-29.78a9.31,9.31,0,0,0,0-13.17l-29.64-29.64,29.64-29.64a9.31,9.31,0,1,0-13.16-13.17l-32.14,32.13a15.1,15.1,0,0,0,0,21.35l32.14,32.14a9.32,9.32,0,0,0,13.16,0Zm86.13,0,32.14-32.14a15.1,15.1,0,0,0,0-21.35L305.66,259.3a9.31,9.31,0,0,0-13.16,13.17l29.64,29.64L292.5,331.75a9.31,9.31,0,0,0,13.16,13.17Z" />
      </svg>);
  }

  window.MoneyMakerIcons = { IcoProfile, IcoCodeFolder };
})();
