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

  document.querySelectorAll('.nav-badge,.hero-badge').forEach(function (el) {
    el.textContent = el.textContent.replace('🍃', '🎃');
  });
})();
