/* Alessandro — own site logic v2: smooth scroll, mask reveals, sticky-cover parallax,
   hover previews, counters — all hand-written. */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH = matchMedia('(hover: none)').matches;

  const SERVICES = [
    ['doggroom', 'Dog grooming', 'Dogs', 'Haircuts, nail trimming, ear cleaning and styling: breed-specific cuts and custom styles, finished calm.'],
    ['catgroom', 'Cat grooming', 'Cats', 'Haircuts, detangling, nails and ears — gentle handling for even the most finicky felines, lion cuts included.'],
    ['dogbath', 'Dog bathing', 'Bath', 'Standard, medicated and flea & tick baths with gentle techniques — a clean, relaxed dog.'],
    ['catbath', 'Cat bathing', 'Bath', 'Standard, medicated and flea & tick baths, handled with care for a stress-free wash.'],
    ['nails', 'Nails & filing', 'Nails', 'Trimming and filing that prevents overgrowth and keeps feet healthy and comfortable.'],
    ['ears', 'Ear cleaning', 'Ears', 'Thorough inspection and gentle cleaning to prevent infection, mites and irritation.'],
    ['teeth', 'Teeth & dental', 'Teeth', 'Brushing and dental care that prevents disease, freshens breath and keeps gums healthy.'],
    ['deshed', 'De-shedding', 'Coat', 'Treatments that lift loose fur out — less shedding at home, a healthier coat.'],
  ];
  const PLACES = ['dogs', 'cats', 'puppies', 'kittens', 'poodles', 'longhair', 'nervous', 'rescues', 'showdogs', 'seniors', 'doodles', 'persians', 'spaniels', 'terriers', 'shepherds', 'pugs'];
  const CAPS = [
    ['Flea & tick treatments', 'bath, treatment and prevention'], ['Puppy grooming', 'a gentle first introduction'],
    ['Kitten grooming', 'slow, positive first visits'], ['Lion cuts', 'long-haired cats, 3.5–4 hours of detail'],
    ['Medicated baths', 'for skin conditions and sensitive skin'], ['Breed-specific cuts', 'poodles to spaniels, done right'],
    ['Custom styling', 'the cut you ask for'], ['Detangling', 'mats worked out gently'],
    ['Daycare — half day', '$30, brush out & nail trim included'], ['Daycare — full day', '$55, one outdoor walk included'],
    ['Overnight stay', '$85, settled in cage-free'], ['Brush out', 'between full grooms'],
    ['Outdoor walks', 'one per day, every stay'], ['Cage-free play space', 'no crating while they wait'],
    ['Nervous-pet handling', 'slow, patient, trust first'], ['Show-dog grooming', 'ring-ready finish'],
    ['Rescue dogs', 'calm first grooms'], ['Senior pets', 'gentle, unhurried care'],
    ['Gift toy', 'a little gift after the groom'], ['Bath & tidy', 'between full cuts'],
  ];
  const WALL = [
    ['For the bath', ['Gentle shampoos', 'Medicated baths', 'Flea & tick care', 'Warm towels', 'Blow dryers', 'Soft brushes']],
    ['For the cut', ['Clippers', 'Scissors', 'Combs', 'Detangling spray', 'Thinning shears', 'Styling tools']],
    ['Nails & ears', ['Nail clippers', 'Nail file', 'Ear cleaner', 'Cotton pads', 'Gentle wipes', 'Powder']],
    ['Teeth & coat', ['Pet toothbrush', 'Dental paste', 'De-shedding tool', 'Undercoat rake', 'Slicker brush', 'Conditioner']],
    ['For cats', ['Fine combs', 'Cat-safe shampoo', 'Quiet dryers', 'Soft towels', 'Lion-cut clippers', 'Patience']],
    ['For little ones', ['Soft brushes', 'Low-noise dryers', 'Short sessions', 'Play breaks', 'First-visit treats', 'Gift toy']],
    ['Daycare', ['Play space', 'Leashes', 'Water bowls', 'Rest beds', 'Outdoor walk', 'Brush out']],
    ['Finishing', ['Bandanas', 'Gift toy', 'Final brush', 'Coat check', 'Pick-up call', 'Clean finish']],
  ];
  const STEPS = [
    ['Book', 'Call (323) 644-4946 or send the booking sheet.'],
    ['Drop-off', 'Melrose Avenue — parking in the back.'],
    ['Consult', 'We talk through the cut before we start.'],
    ['Bath', 'Standard, medicated or flea & tick.'],
    ['Groom', 'Cut, nails, ears and teeth, gently.'],
    ['Rest', 'Cage-free play space while they wait.'],
    ['Check', 'Coat, nails and ears checked once more.'],
    ['Pick-up', 'Clean, calm — and a little gift toy.'],
  ];

  /* ---------- build sections ---------- */
  $('#stamps').innerHTML = SERVICES.map(s => `<span class="stamp">${s[1]}</span>`).join('');
  $('#covers').innerHTML = SERVICES.map((s, i) => `
    <article class="cover">
      <div class="cover-media"><img src="assets/img/work/${s[0]}/still.webp" srcset="assets/img/work/${s[0]}/still-s.webp 1280w, assets/img/work/${s[0]}/still.webp 1920w, assets/img/work/${s[0]}/still-xl.webp 2560w" sizes="100vw" alt="${s[1]}" loading="${i < 1 ? 'eager' : 'lazy'}"></div>
      <div class="cover-top"><span class="no">№ ${i + 1} / 8</span><span class="stamp">${s[2]}</span></div>
      <div class="cover-bot"><h3>${s[1]}</h3>
        <div class="cover-row"><p>${s[3]}</p><a href="#book" data-goto>Book this groom →</a></div>
      </div>
    </article>`).join('');
  const half = PLACES.map(p => `<img src="assets/img/clients/${p}.webp" alt="" loading="lazy">`).join('');
  $('#marqueeIn').innerHTML = half + half;
  $('#rows').innerHTML = SERVICES.slice(0, 7).map((s, i) => `
    <div class="row reveal" data-slug="${s[0]}"><span class="row__n">0${i + 1}</span><span class="row__t">${s[1]}</span><span class="row__d">${s[3]}</span><span class="row__a">→</span></div>`).join('');
  $('#capsList').innerHTML = CAPS.map(c => `<li class="reveal">${c[0]}<span>${c[1]}</span></li>`).join('');
  $('#wall').innerHTML = WALL.map(g => `
    <div class="wall__g reveal"><b>${g[0]}</b>${g[1].map(t => `<span class="tag">${t}</span>`).join('')}</div>`).join('');
  $('#steps').innerHTML = STEPS.map(s => `
    <li class="step reveal"><h4>${s[0]}</h4><p>${s[1]}</p></li>`).join('');

  /* ---------- word-mask splitting ---------- */
  function splitMask(el) {
    let d = 0;
    const wrap = (node) => {
      const w = document.createElement('span'); w.className = 'w';
      const i = document.createElement('i'); i.style.setProperty('--d', (d++ * 0.028) + 's');
      i.appendChild(node); w.appendChild(i); return w;
    };
    [...el.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(' ') : wrap(document.createTextNode(part)));
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        el.replaceChild(wrap(node.cloneNode(true)), node);
      }
    });
  }
  $$('.mask').forEach(splitMask);

  /* ---------- reveals + counters ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .mask').forEach(el => io.observe(el));
  /* safety net: nothing already on screen may stay hidden */
  setTimeout(() => $$('.reveal:not(.in), .mask:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 1.05 && r.bottom > -80) el.classList.add('in');
  }), 1400);
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 950), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * ease);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    cio.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- smooth scroll: Lenis (MIT) first; own wheel-lerp as fallback ---------- */
  let lenis = null;
  if (!RM && !TOUCH && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    const rafL = t => { lenis.raf(t); requestAnimationFrame(rafL); };
    requestAnimationFrame(rafL);
  }
  window.__lenis = lenis;
  const smooth = !RM && !TOUCH && !lenis;
  let target = scrollY, lastY = scrollY, wheelAt = 0;
  if (smooth) {
    addEventListener('wheel', e => {
      if (document.body.classList.contains('menu-open') || e.ctrlKey) return;
      e.preventDefault();
      wheelAt = performance.now();
      target += (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
      target = Math.max(0, Math.min(target, document.body.scrollHeight - innerHeight));
    }, { passive: false });
    (function loop() {
      const diff = target - scrollY;
      if (Math.abs(diff) > 0.4) scrollTo(0, scrollY + diff * 0.115);
      else if (performance.now() - wheelAt > 220 && Math.abs(scrollY - target) > 320) { target = scrollY; }
      requestAnimationFrame(loop);
    })();
  }
  addEventListener('scroll', () => {
    if (!smooth) target = scrollY;
    const y = scrollY, hdr = $('.hdr');
    if (y > lastY + 5 && y > 340 && !document.body.classList.contains('menu-open')) hdr.classList.add('hide');
    else if (y < lastY - 4) hdr.classList.remove('hide');
    lastY = y;
    /* cover parallax */
    $$('.cover-media img').forEach(img => {
      const r = img.closest('.cover').getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      img.style.transform = `translateY(${(-r.top * 0.07).toFixed(1)}px)`;
    });
  }, { passive: true });

  /* ---------- anchors via the same engine ---------- */
  function goto(sel) {
    if (lenis) { lenis.scrollTo(el); return; }
    const el = sel === '#top' ? document.body : $(sel);
    if (!el) return;
    document.body.classList.remove('menu-open');
    const y = sel === '#top' ? 0 : el.getBoundingClientRect().top + scrollY - 6;
    if (smooth) { target = y; }
    else {
      const start = scrollY, dist = y - start, t0 = performance.now(), dur = Math.min(1300, 450 + Math.abs(dist) * 0.32);
      (function step(t) {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        scrollTo(0, start + dist * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
  }
  $$('[data-goto]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) { e.preventDefault(); goto(href); }
  }));

  /* ---------- menu ---------- */
  $('#menuBtn').addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    $('#menu').setAttribute('aria-hidden', String(!open));
  });

  /* ---------- now rotator ---------- */
  const names = SERVICES.map(s => s[1]);
  let ni = 0;
  const rot = $('#nowRot');
  setInterval(() => {
    rot.style.opacity = 0;
    setTimeout(() => { ni = (ni + 1) % names.length; rot.textContent = names[ni]; rot.style.opacity = 1; }, 260);
  }, 2600);

  /* ---------- paper row hover preview ---------- */
  const prev = $('#rowPreview'), pimg = prev.querySelector('img');
  let px = 0, py = 0, tx2 = 0, ty2 = 0;
  $$('.row').forEach(r => r.addEventListener('mouseenter', () => {
    pimg.src = `assets/img/services/${r.dataset.slug}.webp`;
    prev.classList.add('on');
  }));
  $('.paper').addEventListener('mousemove', e => { tx2 = e.clientX + 26; ty2 = e.clientY - 100; });
  $('.paper').addEventListener('mouseleave', () => prev.classList.remove('on'));
  (function follow() {
    px += (tx2 - px) * 0.16; py += (ty2 - py) * 0.16;
    prev.style.left = px + 'px'; prev.style.top = py + 'px';
    requestAnimationFrame(follow);
  })();

  /* ---------- snake: side-scrolling plane (own engine) ---------- */
  const snakeSec = $('#snake'), plane = $('#snakePlane'), cam = $('#snakeCam'), map = $('#snakeMap');
  if (snakeSec && plane && !RM && !matchMedia('(max-width: 820px)').matches) {
    const path = map.querySelector('path'), dot = $('#snakeDot');
    const pathLen = path.getTotalLength();
    let travel = 0;
    function measure() {
      travel = Math.max(0, plane.scrollWidth - innerWidth);
      snakeSec.style.height = (travel + innerHeight) + 'px';
    }
    measure();
    addEventListener('resize', measure);
    addEventListener('scroll', () => {
      const r = snakeSec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (travel || 1)));
      plane.style.transform = `translateX(${(-travel * p).toFixed(1)}px)`;
      cam.style.transform = `scale(${(0.965 + 0.035 * Math.sin(p * Math.PI)).toFixed(4)}) rotate(${(-1 + 2 * p).toFixed(3)}deg)`;
      const pt = path.getPointAtLength(p * pathLen);
      dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      map.classList.toggle('is-on', r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.5);
    }, { passive: true });
  }

  /* ---------- preloader ---------- */
  const pre = $('#preloader'), bar = $('#preBar'), pct = $('#prePct');
  let lp = 0;
  const iv = setInterval(() => {
    lp = Math.min(100, lp + 4 + Math.random() * 9);
    bar.style.width = lp + '%'; pct.textContent = Math.floor(lp) + '%';
    if (lp >= 100) {
      clearInterval(iv);
      setTimeout(() => { pre.classList.add('done'); setTimeout(() => pre.remove(), 1100); }, 180);
    }
  }, 66);

  /* ---------- booking sheet form ---------- */
  const form = $('#bookForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim();
    const contact = (fd.get('contact') || '').trim();
    const job = (fd.get('job') || '').trim();
    const size = fd.get('size') || 'Dog';
    const err = $('#formErr');
    if (!name || !contact || !job) {
      const missing = [!name && 'your name', !contact && 'a number to call back', !job && 'what your pet needs'].filter(Boolean);
      err.textContent = 'Missing: ' + missing.join(', ') + '.';
      err.hidden = false;
      return;
    }
    err.hidden = true;
    $('#doneText').textContent = `Thanks, ${name.split(' ')[0]} — we will call you back on ${contact}.`;
    $('#doneSum').innerHTML =
      `<dt>Pet & groom</dt><dd>${job.replace(/</g, '&lt;')}</dd>` +
      `<dt>Booking for</dt><dd>${size}</dd>` +
      `<dt>Callback</dt><dd>${contact.replace(/</g, '&lt;')}</dd>`;
    form.hidden = true;
    const done = $('#sheetDone');
    done.hidden = false;
    requestAnimationFrame(() => done.querySelector('.stamp-big').classList.add('on'));
    done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  $('#againBtn').addEventListener('click', () => {
    $('#sheetDone').hidden = true;
    $('#sheetDone').querySelector('.stamp-big').classList.remove('on');
    form.reset();
    form.hidden = false;
  });
})();
