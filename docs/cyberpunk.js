/**
 * Cyberpunk Dynamic Background
 * - Matrix rain (katakana characters)
 * - Neon grid lines
 * - Purple particles with connections
 * - Cyan scan line
 */
(function () {
  var c = document.createElement('canvas');
  c.id = 'cyber-bg-canvas';
  document.body.insertBefore(c, document.body.firstChild);

  var ctx = c.getContext('2d');
  var W, H;

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ===== Matrix Rain =====
  var fs = 14;
  var cols = Math.floor(W / fs);
  var drops = new Array(cols).fill(1);
  var chars =
    '\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3' +
    '\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c4\u30c6\u30c8' +
    '\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db' +
    '\u30de\u30df\u30e0\u30e1\u30e2\u30e4\u30e6\u30e8\u30e9\u30ea' +
    '\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3' +
    '0123456789ABCDEF';

  // ===== Particles =====
  var pts = [];
  function initPts() {
    pts = [];
    for (var i = 0; i < 35; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        s: Math.random() * 2 + 1,
        a: Math.random() * 0.4 + 0.1,
      });
    }
  }
  initPts();

  // ===== Scan Line =====
  var scanY = 0;

  // ===== Main Loop =====
  function draw() {
    // Matrix rain
    ctx.fillStyle = 'rgba(10, 10, 20, 0.06)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.12)';
    ctx.font = fs + 'px monospace';
    for (var i = 0; i < drops.length; i++) {
      ctx.fillText(
        chars[Math.floor(Math.random() * chars.length)],
        i * fs,
        drops[i] * fs
      );
      if (drops[i] * fs > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }

    // Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (var x = 0; x < W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (var y = 0; y < H; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Particles
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 0, 255, ' + p.a + ')';
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 0, 255, ' + p.a * 0.15 + ')';
      ctx.fill();
    }

    // Particle connections
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle =
            'rgba(255, 0, 255, ' + 0.08 * (1 - d / 130) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Scan line
    if (H > 0) {
      scanY = (scanY + 1.2) % H;
      var y1 = Math.max(0, scanY - 25);
      var y2 = Math.min(H, scanY + 25);
      if (y2 > y1) {
        var g = ctx.createLinearGradient(0, y1, 0, y2);
        g.addColorStop(0, 'rgba(0, 255, 255, 0)');
        g.addColorStop(0.5, 'rgba(0, 255, 255, 0.025)');
        g.addColorStop(1, 'rgba(0, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, y1, W, y2 - y1);
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
