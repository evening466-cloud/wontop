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

// 호러 배경음악 — 음원 파일 없이 브라우저가 직접 합성(저작권 문제 없음).
// 브라우저 정책상 첫 클릭/터치 때 시작되고, 우측 하단 버튼으로 끄고 켤 수 있습니다.
(function () {
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;

  var btn = document.createElement('button');
  btn.id = 'hw-music';
  btn.type = 'button';
  btn.setAttribute('aria-label', '호러 배경음악 켜기/끄기');
  document.body.appendChild(btn);

  var pref = null;
  try { pref = localStorage.getItem('hw-music'); } catch (e) {}
  var ctx = null, master = null, dry = null, wet = null, send = null, timers = [], playing = false, nodes = [];

  function render() {
    btn.className = playing ? 'on' : 'off';
    btn.innerHTML = '<span>' + (playing ? '🔊' : '🔇') + '</span><b>' + (playing ? '음악 끄기' : '🎃 음악 켜기') + '</b>';
  }

  function impulse(seconds) {
    var len = ctx.sampleRate * seconds, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  function osc(type, freq, dest, gain) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gain;
    o.connect(g); g.connect(dest); o.start();
    nodes.push(o);
    return { o: o, g: g };
  }

  function build() {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    dry = ctx.createGain(); dry.gain.value = 0.75; dry.connect(master);
    var verb = ctx.createConvolver(); verb.buffer = impulse(3.5);
    wet = ctx.createGain(); wet.gain.value = 0.7; verb.connect(wet); wet.connect(master);
    send = ctx.createGain(); send.gain.value = 1; send.connect(verb);

    // 낮은 드론: 약간 어긋난 톱니파 둘 + 서브 베이스, 느리게 출렁이는 필터
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 200; lp.Q.value = 3;
    lp.connect(dry); lp.connect(send);
    osc('sawtooth', 55, lp, 0.1); osc('sawtooth', 58.3, lp, 0.1); osc('sine', 27.5, lp, 0.25);
    var lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 0.07; lfoG.gain.value = 110; lfo.connect(lfoG); lfoG.connect(lp.frequency); lfo.start();
    nodes.push(lfo);

    // 반음으로 부딪히는 불안한 패드
    var pad = ctx.createGain(); pad.gain.value = 0.05; pad.connect(dry); pad.connect(send);
    osc('sine', 220, pad, 1); osc('sine', 233.08, pad, 1);
    var trem = ctx.createOscillator(), tremG = ctx.createGain();
    trem.frequency.value = 0.13; tremG.gain.value = 0.04; trem.connect(tremG); tremG.connect(pad.gain); trem.start();
    nodes.push(trem);
  }

  var scale = [220, 233.08, 261.63, 311.13, 329.63, 349.23, 440, 466.16, 659.25];

  function bell(freq, dur, vol) {
    var t = ctx.currentTime, g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    var a = ctx.createOscillator(), b = ctx.createOscillator(), bg = ctx.createGain();
    a.type = 'triangle'; a.frequency.value = freq;
    b.type = 'sine'; b.frequency.value = freq * 2.76; bg.gain.value = 0.25;
    a.connect(g); b.connect(bg); bg.connect(g);
    g.connect(dry); g.connect(send);
    a.start(t); b.start(t); a.stop(t + dur + 0.1); b.stop(t + dur + 0.1);
  }

  function thump() {
    var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.25);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.5);
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  function melody() {
    if (!playing) return;
    var f = scale[Math.floor(Math.random() * scale.length)];
    bell(f, 3.2, 0.07);
    if (Math.random() < 0.3) later(function () { if (playing) bell(f * 1.0595, 2.6, 0.04); }, 350);
    if (Math.random() < 0.15) bell(110, 5, 0.12);
    later(melody, 1500 + Math.random() * 2600);
  }

  function beat() {
    if (!playing) return;
    thump(); later(thump, 330);
    later(beat, 6500 + Math.random() * 4000);
  }

  function start() {
    if (playing) return;
    if (!ctx) { build(); }
    ctx.resume();
    playing = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0.5, ctx.currentTime, 1.5);
    later(melody, 800); later(beat, 4000);
    try { localStorage.setItem('hw-music', 'on'); } catch (e) {}
    render();
  }

  function stop() {
    if (!playing) return;
    playing = false;
    timers.forEach(clearTimeout); timers = [];
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    setTimeout(function () { if (!playing && ctx) ctx.suspend(); }, 1800);
    try { localStorage.setItem('hw-music', 'off'); } catch (e) {}
    render();
  }

  btn.addEventListener('click', function () { playing ? stop() : start(); });
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (playing) ctx.resume();
  });

  render();
  if (pref !== 'off') {
    var first = function (e) {
      document.removeEventListener('pointerdown', first, true);
      document.removeEventListener('keydown', first, true);
      if (!btn.contains(e.target)) start();
    };
    document.addEventListener('pointerdown', first, true);
    document.addEventListener('keydown', first, true);
  }
})();
