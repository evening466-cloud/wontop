// 할로윈 임시 테마 — index.html 의 HALLOWEEN 블록(2줄)만 지우면 원상복구됩니다
(function () {
  var layer = document.createElement('div');
  layer.id = 'hw-layer';
  var bats = [
    { top: '14%', dur: 16, delay: 0 },
    { top: '34%', dur: 21, delay: 6 },
    { top: '58%', dur: 18, delay: 11 }
  ];
  bats.forEach(function (b) {
    var el = document.createElement('span');
    el.className = 'hw-bat';
    el.textContent = '🦇';
    el.style.top = b.top;
    el.style.animationDuration = b.dur + 's';
    el.style.animationDelay = b.delay + 's';
    layer.appendChild(el);
  });
  document.body.appendChild(layer);

  var hero = document.querySelector('.hero');
  if (hero) {
    [
      { e: '🎃', left: '3%', bottom: '120px', delay: '0s' },
      { e: '👻', right: '4%', top: '120px', delay: '1.2s' },
      { e: '🎃', right: '8%', bottom: '130px', delay: '2.2s' }
    ].forEach(function (f) {
      var el = document.createElement('span');
      el.className = 'hw-float';
      el.textContent = f.e;
      ['left', 'right', 'top', 'bottom'].forEach(function (k) { if (f[k]) el.style[k] = f[k]; });
      el.style.animationDelay = f.delay;
      hero.appendChild(el);
    });
  }

  var spots = [
    { e: '🎃', pos: { top: '10px', left: '4%' } },
    { e: '👻', pos: { top: '14px', right: '5%' } },
    { e: '🎃', pos: { bottom: '8px', right: '6%' } },
    { e: '👻', pos: { bottom: '10px', left: '5%' } }
  ];
  document.querySelectorAll('section.section, .contact-section, footer').forEach(function (sec, i) {
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    [spots[i % 4], spots[(i + 2) % 4]].forEach(function (s, j) {
      var el = document.createElement('span');
      el.className = 'hw-float hw-small';
      el.textContent = s.e;
      Object.keys(s.pos).forEach(function (k) { el.style[k] = s.pos[k]; });
      el.style.animationDelay = ((i * 0.7 + j * 1.3) % 4) + 's';
      sec.appendChild(el);
    });
  });

  // 제목·메뉴 글자를 한 글자씩 아래로 길게 늘어뜨려 녹아내리는 느낌
  var stretch = [1.0, 1.55, 1.2, 1.85, 1.1, 1.65, 1.35];
  var n = 0;
  function melt(node) {
    var text = node.nodeValue;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++, n++) {
      var span = document.createElement('span');
      span.className = 'hw-ch';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--s', stretch[(n * 3) % stretch.length]);
      span.style.setProperty('--d', (-(n % 7) * 0.6) + 's');
      span.textContent = text[i];
      frag.appendChild(span);
    }
    node.parentNode.replaceChild(frag, node);
  }
  document.querySelectorAll('.logo, .nav-desktop a').forEach(function (el) {
    el.setAttribute('aria-label', el.textContent.trim());
    Array.prototype.slice.call(el.childNodes).forEach(function (c) {
      if (c.nodeType === 3 && c.nodeValue.trim()) melt(c);
    });
  });

  document.querySelectorAll('.nav-badge,.hero-badge').forEach(function (el) {
    el.textContent = el.textContent.replace('🍃', '🎃');
  });
})();
