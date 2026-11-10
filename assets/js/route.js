/* Alessandro — own grooming-route tunnel: grains fly past as you scroll; step plates rise out of the light. */
(function () {
  'use strict';
  const sec = document.getElementById('route');
  const stage = document.getElementById('routeStage');
  const cv = document.getElementById('routeCanvas');
  const plateEl = document.getElementById('routePlate');
  if (!sec || !stage || !cv) return;

  const PLATES = [
    ['Chapter I · The booking', 'The booking', 'You call (323) 644-4946 — we answer', 1],
    ['The grooming route', 'Drop-off', 'Melrose Avenue — parking in the back', 6],
    ['Chapter II · Settle & check', 'The consult', 'We talk through the cut before we start', 11],
    ['The grooming route', 'The bath', 'Standard, medicated or flea & tick', 16],
    ['The grooming route', 'Dry & brush', 'Blow-dry, brush out, detangle', 21],
    ['The grooming route', 'The cut', 'Breed-specific or your custom style', 26],
    ['Chapter III · The details', 'Nails & ears', 'Trimmed, filed, gently cleaned', 31],
    ['The grooming route', 'Teeth', 'Brushed — fresh breath, healthy gums', 36],
    ['The grooming route', 'De-shedding', 'Loose fur out, coat healthy', 41],
    ['The grooming route', 'Play & rest', 'Cage-free play space — never crated', 46],
    ['Chapter IV · The finish', 'Final check', 'Coat, nails and ears checked once more', 51],
    ['The grooming route', 'Pick-up', 'A little gift toy goes home too', 56],
    ['Chapter IV · Groomed & home', 'Pampered', 'Clean, calm and feeling new', 61],
  ];
  const SMALL = matchMedia('(max-width: 768px)').matches;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* phone / reduced-motion: the plain list, like the reference's quiet mode */
  if (SMALL || RM) {
    sec.classList.add('route--rm');
    document.getElementById('routeList').innerHTML = PLATES.map(p => `
      <div class="rl__item"><img src="works/step-${String(p[3]).padStart(2, '0')}.webp" alt="">
      <div><b>${p[1]}</b><p>${p[2]}</p></div></div>`).join('');
    return;
  }

  const ctx = cv.getContext('2d');
  const kick = document.getElementById('plateKick');
  const title = document.getElementById('plateTitle');
  const line = document.getElementById('plateLine');
  let W = 0, H = 0, dpr = 1, progress = 0, target = 0, cur = -1;
  const PAL = ['226,164,88', '240,178,126', '232,217,174', '245,201,138'];
  const grains = [];
  for (let i = 0; i < 900; i++) {
    grains.push({ a: Math.random() * 6.283, r: 0.24 + Math.random() * 1.5, z: Math.random(), s: Math.random() * 2 + 0.6, c: PAL[i % PAL.length] });
  }
  const imgs = PLATES.map(p => { const im = new Image(); im.src = `works/step-${String(p[3]).padStart(2, '0')}.webp`; return im; });
  const sky = new Image(); sky.src = 'works-p/skyline-2013-720.webp';

  function size() {
    dpr = Math.min(1.75, devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener('resize', size);

  function onScroll() {
    const r = stage.getBoundingClientRect();
    target = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function draw() {
    progress += (target - progress) * 0.07;
    const p = progress;
    ctx.fillStyle = '#100d09';
    ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, camZ = p * 26;

    /* grain tunnel */
    for (const g of grains) {
      let z = (g.z + camZ % 1) % 1;
      const depth = 1 - z;
      const rad = g.r * (0.55 + depth * 2.6) * Math.min(W, H);
      const x = cx + Math.cos(g.a + camZ * 0.14) * rad;
      const y = cy + Math.sin(g.a + camZ * 0.14) * rad * 0.78;
      const a = 0.12 + z * 0.75;
      ctx.fillStyle = `rgba(${g.c},${a})`;
      const s = g.s * (0.4 + z * 2.1);
      ctx.fillRect(x, y, s, s * 0.62);
    }
    /* centre light */
    const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.4);
    gl.addColorStop(0, 'rgba(255,214,150,.5)');
    gl.addColorStop(0.4, 'rgba(226,164,88,.13)');
    gl.addColorStop(1, 'rgba(226,164,88,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(0, 0, W, H);

    /* photo cards flying by, left and right */
    PLATES.forEach((pl, i) => {
      const zp = (i + 0.5) / PLATES.length * 26;
      let d = zp - camZ;
      if (d < -1.2 || d > 7) return;
      const t = 1 - Math.max(0, d) / 7;               /* 0 far → 1 at camera */
      const side = i % 2 ? 1 : -1;
      const scale = 0.14 + t * t * 1.5;
      const iw = 300 * scale, ih = 200 * scale;
      const x = cx + side * (W * 0.16 + t * W * 0.3) - iw / 2;
      const y = cy - ih / 2 + Math.sin(i * 2.4) * H * 0.06;
      const im = imgs[i];
      if (im.complete && im.naturalWidth) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, t * 2.4) * (d < 0 ? Math.max(0, 1 + d) : 1);
        ctx.drawImage(im, x, y, iw, ih);
        ctx.restore();
      }
    });

    /* skyline at the end of the route */
    if (p > 0.9 && sky.complete && sky.naturalWidth) {
      ctx.save();
      ctx.globalAlpha = (p - 0.9) * 8;
      const w = W * 0.72, h = w * 300 / 720;
      ctx.drawImage(sky, cx - w / 2, cy - h / 2, w, h);
      ctx.restore();
    }

    /* plate text */
    const idx = Math.min(PLATES.length - 1, Math.floor(p * PLATES.length));
    const local = (p * PLATES.length) % 1;
    if (idx !== cur) {
      cur = idx;
      kick.textContent = PLATES[idx][0];
      title.textContent = PLATES[idx][1];
      line.textContent = PLATES[idx][2];
    }
    const vis = Math.sin(Math.min(1, local * 1.15) * Math.PI);
    plateEl.style.opacity = Math.max(0, vis * 1.6 - 0.25);
    plateEl.style.transform = `translate(-50%,-50%) scale(${0.92 + vis * 0.08})`;

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
