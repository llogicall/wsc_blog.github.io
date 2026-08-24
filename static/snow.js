/**
 * Snow Dynamic Background
 * - 3-layer snowflakes (far/mid/near for depth)
 * - Drift and wind motion
 * - Top fog + middle mist
 * - Ground snow accumulation
 */
(function () {
  var c = document.createElement('canvas');
  c.id = 'snow-bg-canvas';
  document.body.insertBefore(c, document.body.firstChild);

  var ctx = c.getContext('2d');
  var W, H;

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ===== 3 Layers =====
  var layers = [
    { count: 80, minR: 1,   maxR: 2.5, minSpd: 0.4, maxSpd: 0.9, col: '255,255,255', alpha: 0.5  },  // Far
    { count: 50, minR: 2,   maxR: 4,   minSpd: 0.8, maxSpd: 1.6, col: '210,230,248', alpha: 0.65 },  // Mid
    { count: 25, minR: 3.5, maxR: 6,   minSpd: 1.4, maxSpd: 2.5, col: '180,215,245', alpha: 0.75 },  // Near
  ];

  var flakes = [];

  function mkFlake(L, rnd) {
    var r = L.minR + Math.random() * (L.maxR - L.minR);
    return {
      x: Math.random() * (W + 40) - 20,
      y: rnd ? Math.random() * H : -r * 2,
      r: r,
      spd: L.minSpd + Math.random() * (L.maxSpd - L.minSpd),
      wind: (Math.random() - 0.5) * 0.3,
      sw: Math.random() * Math.PI * 2,
      sws: 0.01 + Math.random() * 0.02,
      swa: 0.3 + Math.random() * 0.6,
      a: L.alpha * (0.6 + Math.random() * 0.4),
      col: L.col,
      li: layers.indexOf(L),
    };
  }

  function initFlakes() {
    flakes = [];
    for (var l = 0; l < layers.length; l++) {
      for (var i = 0; i < layers[l].count; i++) {
        flakes.push(mkFlake(layers[l], true));
      }
    }
  }
  initFlakes();

  // ===== Background =====
  function drawBg() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#070e1e');
    g.addColorStop(0.3, '#0b1628');
    g.addColorStop(0.7, '#0f1e38');
    g.addColorStop(1, '#132544');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // ===== Fog =====
  var fogT = 0;
  function drawFog() {
    fogT += 0.15;
    // Top dark fog
    var g1 = ctx.createLinearGradient(0, 0, 0, H * 0.3);
    g1.addColorStop(0, 'rgba(15, 25, 50, 0.4)');
    g1.addColorStop(1, 'rgba(15, 25, 50, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H * 0.3);
    // Drifting middle mist
    var fy = H * 0.5 + Math.sin(fogT * 0.01) * 30;
    var g2 = ctx.createLinearGradient(0, fy - 40, 0, fy + 40);
    g2.addColorStop(0, 'rgba(150, 185, 220, 0)');
    g2.addColorStop(0.5, 'rgba(150, 185, 220, 0.02)');
    g2.addColorStop(1, 'rgba(150, 185, 220, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, fy - 40, W, 80);
  }

  // ===== Ground =====
  function drawGround() {
    var g = ctx.createLinearGradient(0, H - 60, 0, H);
    g.addColorStop(0, 'rgba(200, 225, 245, 0)');
    g.addColorStop(0.4, 'rgba(200, 225, 245, 0.03)');
    g.addColorStop(1, 'rgba(200, 225, 245, 0.08)');
    ctx.fillStyle = g;
    ctx.fillRect(0, H - 60, W, 60);
  }

  // ===== Main Loop =====
  function animate() {
    drawBg();
    drawFog();

    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.sw += f.sws;
      var so = Math.sin(f.sw) * f.swa;
      f.x += f.wind + so * 0.2;
      f.y += f.spd;

      if (f.y > H + f.r * 2 || f.x < -20 || f.x > W + 20) {
        flakes[i] = mkFlake(layers[f.li], false);
        flakes[i].x = Math.random() * (W + 40) - 20;
        continue;
      }

      // Flake
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + f.col + ',' + f.a + ')';
      ctx.fill();

      // Glow
      if (f.r > 2) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + f.col + ',' + (f.a * 0.15) + ')';
        ctx.fill();
      }
    }

    drawGround();
    requestAnimationFrame(animate);
  }

  animate();
})();
