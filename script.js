// ============================================================
// PORTFOLIO ERWAN PRIEUR — Script principal
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ---------- Timeline progressive dots ----------
  const tlDots = document.querySelectorAll('.tl-dot');
  function updateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.6;
    tlDots.forEach(dot => {
      const dotRect = dot.getBoundingClientRect();
      dot.classList.toggle('lit', dotRect.top < viewportCenter);
    });
  }
  window.addEventListener('scroll', updateTimeline);
  updateTimeline();

  // ---------- Dot navigation + nav active link ----------
  const sections = ['hero', 'about', 'parcours', 'skills', 'projects', 'certifications', 'contact'];
  const dotLinks = document.querySelectorAll('.dot-nav a');
  const navMenuLinks = document.querySelectorAll('.nav-links a');
  function updateDotNav() {
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
        current = id;
      }
    });
    dotLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
    navMenuLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateDotNav);
  updateDotNav();

  // ---------- Inject "back to carousel" CTA in every project block ----------
  document.querySelectorAll('.project-block').forEach(block => {
    if (block.querySelector('.proj-back-cta')) return;
    const cta = document.createElement('div');
    cta.className = 'proj-back-cta';
    cta.innerHTML = `
      <button class="proj-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="18 15 12 9 6 15"/></svg>
        Voir d'autres projets
      </button>`;
    cta.querySelector('.proj-back-btn').addEventListener('click', () => {
      const carousel = document.querySelector('.proj-carousel');
      if (!carousel) return;
      const navHeight = document.querySelector('.nav')?.offsetHeight || 64;
      const top = carousel.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
    block.appendChild(cta);
  });

  // ---------- Carousel thumbnails ----------
  const thumbs = document.querySelectorAll('.proj-thumb');
  const projectBlocks = document.querySelectorAll('.project-block');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const targetId = thumb.dataset.target;
      const targetBlock = document.getElementById(targetId);
      const isAlreadyOpen = targetBlock && targetBlock.classList.contains('project-block--open');

      projectBlocks.forEach(b => b.classList.remove('project-block--open'));
      thumbs.forEach(t => t.classList.remove('active'));

      if (!isAlreadyOpen && targetBlock) {
        targetBlock.classList.add('project-block--open');
        thumb.classList.add('active');
        // Wait for CSS transition (max-height 0.6s) before scrolling,
        // and offset by sticky nav height so the block top isn't hidden.
        setTimeout(() => {
          const navHeight = document.querySelector('.nav')?.offsetHeight || 64;
          const top = targetBlock.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 650);
      }
    });
  });

  // ---------- Project filters (carousel) ----------
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      // Close any open project block
      projectBlocks.forEach(b => b.classList.remove('project-block--open'));
      thumbs.forEach(t => t.classList.remove('active'));

      // Show/hide thumbnails
      thumbs.forEach(thumb => {
        const cats = thumb.dataset.cat || '';
        const hide = cat !== 'all' && !cats.includes(cat);
        thumb.classList.toggle('proj-thumb--hidden', hide);
      });
    });
  });

  // ---------- Certifications fan gallery ----------
  const certFan = document.getElementById('cert-fan');

  // Trigger spread animation when the fan scrolls into view
  if (certFan) {
    const spreadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => certFan.classList.add('cert-fan--spread'), 150);
          spreadObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });
    spreadObserver.observe(certFan);
  }

  // Platform metadata for the panel header
  const certMeta = {
    google:         { label: 'Google',          bg: '#f1f3f4', count: '10 certifications' },
    hubspot:        { label: 'HubSpot Academy', bg: '#fff3f0', count: '6 certifications'  },
    semrush:        { label: 'SEMrush Academy', bg: '#fff5e6', count: '1 certification'   },
    openclassrooms: { label: 'OpenClassrooms',  bg: '#f0ebff', count: '17 certifications' },
    sololearn:      { label: 'SoloLearn',       bg: '#e8f4fe', count: '4 certifications'  },
    toeic:          { label: 'TOEIC — ETS',     bg: '#e8f5e9', count: '1 certification'   },
    nextu:          { label: 'NEXT-U — MBA',    bg: '#f5f5f7', count: '1 certification'   },
  };

  const certStore     = document.getElementById('cert-store');
  const certPanel     = document.getElementById('cert-panel');
  const certPanelCards = document.getElementById('cert-panel-cards');
  const certPanelTitle = document.getElementById('cert-panel-title');
  const certPanelSub   = document.getElementById('cert-panel-sub');
  const certPanelIcon  = document.getElementById('cert-panel-icon');
  const certPanelClose = document.getElementById('cert-panel-close');

  document.querySelectorAll('.cert-fan-card').forEach(card => {
    card.addEventListener('click', () => {
      const platform = card.dataset.platform;
      const isActive = card.classList.contains('cert-fan-card--active');

      // Deselect all
      document.querySelectorAll('.cert-fan-card').forEach(c => c.classList.remove('cert-fan-card--active'));

      if (isActive) {
        // Clicking the active card closes the panel
        certPanel.classList.remove('cert-panel--open');
        return;
      }

      // Select clicked card
      card.classList.add('cert-fan-card--active');

      // Update panel header
      const meta = certMeta[platform] || {};
      if (certPanelTitle) certPanelTitle.textContent = meta.label || platform;
      if (certPanelSub)   certPanelSub.textContent   = meta.count  || '';
      if (certPanelIcon) {
        const logoEl = card.querySelector('.cert-fan-logo');
        if (logoEl) {
          certPanelIcon.innerHTML = logoEl.innerHTML;
          certPanelIcon.style.background = meta.bg || '#f5f5f7';
        }
      }

      // Inject cert cards from hidden store
      const dataEl = certStore ? certStore.querySelector(`[data-platform="${platform}"]`) : null;
      if (certPanelCards && dataEl) {
        certPanelCards.innerHTML = dataEl.innerHTML;
      }

      // Open panel
      certPanel.classList.add('cert-panel--open');

      // Smooth scroll to panel
      setTimeout(() => {
        const navH = document.querySelector('.nav')?.offsetHeight || 64;
        const top  = certPanel.getBoundingClientRect().top + window.pageYOffset - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 350);
    });
  });

  if (certPanelClose) {
    certPanelClose.addEventListener('click', () => {
      certPanel.classList.remove('cert-panel--open');
      document.querySelectorAll('.cert-fan-card').forEach(c => c.classList.remove('cert-fan-card--active'));
    });
  }

  // ---------- Hero canvas background ----------
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx   = heroCanvas.getContext('2d');
    const SPEED    = 0.28;
    const MAX_DIST = 140;
    const DOT_R    = 1.6;
    let W, H, particles, raf;

    function particleCount() {
      return window.innerWidth < 600 ? 28 : window.innerWidth < 1024 ? 45 : 65;
    }

    function resize() {
      W = heroCanvas.width  = heroCanvas.offsetWidth;
      H = heroCanvas.height = heroCanvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: particleCount() }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(12,68,124,' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(12,68,124,0.22)';
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    init();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf);
        init();
        draw();
      }, 200);
    });

    // Pause when hero scrolls out of view (perf)
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          if (!raf) { raf = requestAnimationFrame(draw); }
        } else {
          cancelAnimationFrame(raf);
          raf = null;
        }
      }, { threshold: 0 }).observe(heroEl);
    }
  }

  // ---------- Certifications mobile wheel (infinie, 5 logos visibles) ----------
  (function () {
    const wheelMobile = document.getElementById('cert-wheel-mobile');
    const track       = document.getElementById('cert-wheel-track');
    if (!wheelMobile || !track) return;

    const platforms = ['google','hubspot','semrush','openclassrooms','sololearn','toeic','nextu'];
    const positions = [
      { x: '-240px', y: '20px',  rot: '-3.5deg', z: 20 },
      { x: '-160px', y: '35px',  rot: '-2deg',   z: 30 },
      { x: '-80px',  y: '10px',  rot: '-1deg',   z: 40 },
      { x: '0px',    y: '28px',  rot: '0deg',    z: 50 },
      { x: '80px',   y: '8px',   rot: '1deg',    z: 40 },
      { x: '160px',  y: '38px',  rot: '2deg',    z: 30 },
      { x: '240px',  y: '16px',  rot: '3.5deg',  z: 20 },
    ];

    const n        = platforms.length;  // 7
    const BUFFER   = 2;                 // clones de chaque côté
    const DOT_W    = 38;
    const DOT_GAP  = 10;
    const DOT_STEP = DOT_W + DOT_GAP;  // 48px

    // Tableau étendu : [5,6, 0,1,2,3,4,5,6, 0,1]  (11 éléments)
    const extList = [
      ...platforms.slice(-BUFFER),
      ...platforms,
      ...platforms.slice(0, BUFFER),
    ];

    let currentIdx   = 3;              // openclassrooms au centre au départ
    let extSlot      = BUFFER + currentIdx; // slot étendu = 5
    let trackOffset  = 0;
    let dragStartX   = 0;
    let dragStartOff = 0;
    let dragging     = false;
    let snapping     = false;

    // Construction des dots
    extList.forEach((platform, i) => {
      const fc = document.querySelector(`.cert-fan-card[data-platform="${platform}"]`);
      if (!fc) return;
      const dot = document.createElement('div');
      dot.className = 'cert-wheel-dot' + (i === extSlot ? ' active' : '');
      const logoEl = fc.querySelector('.cert-fan-logo');
      if (logoEl) dot.appendChild(logoEl.cloneNode(true));
      dot.addEventListener('click', () => { if (!dragging) snapTo(i, true); });
      track.appendChild(dot);
    });

    function halfWrap() {
      const wrap = wheelMobile.querySelector('.cert-wheel-wrap');
      return (wrap ? wrap.offsetWidth : 230) / 2;
    }

    function offsetFor(slot) {
      return halfWrap() - slot * DOT_STEP - DOT_W / 2;
    }

    function applyTrack(x, animate) {
      track.style.transition = animate ? 'transform 0.32s cubic-bezier(.22,1,.36,1)' : 'none';
      track.style.transform  = 'translateX(' + x + 'px)';
      trackOffset = x;
    }

    function updateActive() {
      track.querySelectorAll('.cert-wheel-dot').forEach((d, i) => d.classList.toggle('active', i === extSlot));
    }

    function rotateFan(idx) {
      const certFan = document.getElementById('cert-fan');
      if (!certFan) return;
      certFan.classList.add('cert-fan--rotating');
      document.querySelectorAll('.cert-fan-card').forEach(card => {
        const pi = platforms.indexOf(card.dataset.platform);
        if (pi === -1) return;
        const posIdx = ((pi - idx + 3 + n) % n);
        const pos    = positions[posIdx];
        card.style.setProperty('--fan-x',   pos.x);
        card.style.setProperty('--fan-y',   pos.y);
        card.style.setProperty('--fan-rot', pos.rot);
        card.style.setProperty('--fan-z',   pos.z);
        card.classList.toggle('cert-fan-card--centered', posIdx === 3);
      });
      setTimeout(() => certFan.classList.remove('cert-fan--rotating'), 700);
    }

    function snapTo(targetSlot, animate) {
      if (snapping) return;
      extSlot    = targetSlot;
      currentIdx = ((extSlot - BUFFER) % n + n) % n;
      applyTrack(offsetFor(extSlot), animate);
      updateActive();
      rotateFan(currentIdx);

      // Saut silencieux si on atteint un clone
      if (animate) {
        snapping = true;
        setTimeout(() => {
          snapping = false;
          if (extSlot < BUFFER) {
            extSlot += n;
            applyTrack(offsetFor(extSlot), false);
            updateActive();
          } else if (extSlot >= BUFFER + n) {
            extSlot -= n;
            applyTrack(offsetFor(extSlot), false);
            updateActive();
          }
        }, 350);
      }
    }

    // Déterminer le slot cible après un drag
    function nearestSlot(rawX) {
      const half  = halfWrap();
      const slot  = Math.round((half - DOT_W / 2 - rawX) / DOT_STEP);
      return Math.max(0, Math.min(extList.length - 1, slot));
    }

    // Touch
    track.addEventListener('touchstart', e => {
      if (snapping) return;
      dragging     = true;
      dragStartX   = e.touches[0].clientX;
      dragStartOff = trackOffset;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!dragging) return;
      const x = dragStartOff + (e.touches[0].clientX - dragStartX);
      track.style.transform = 'translateX(' + x + 'px)';
    }, { passive: true });

    track.addEventListener('touchend', e => {
      if (!dragging) return;
      dragging = false;
      const dx    = e.changedTouches[0].clientX - dragStartX;
      const rawX  = dragStartOff + dx;
      if (Math.abs(dx) > 8) {
        snapTo(nearestSlot(rawX), true);
      } else {
        applyTrack(offsetFor(extSlot), true);
      }
    });

    // Mouse
    track.addEventListener('mousedown', e => {
      if (snapping) return;
      dragging     = true;
      dragStartX   = e.clientX;
      dragStartOff = trackOffset;
      track.style.transition = 'none';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      track.style.transform = 'translateX(' + (dragStartOff + e.clientX - dragStartX) + 'px)';
    });
    window.addEventListener('mouseup', e => {
      if (!dragging) return;
      dragging = false;
      const dx   = e.clientX - dragStartX;
      const rawX = dragStartOff + dx;
      if (Math.abs(dx) > 8) {
        snapTo(nearestSlot(rawX), true);
      } else {
        applyTrack(offsetFor(extSlot), true);
      }
    });

    // Init
    requestAnimationFrame(() => {
      applyTrack(offsetFor(extSlot), false);
      updateActive();
    });
  })();

  // ---------- Hero avatar — zoom au scroll ----------
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const avatar  = document.querySelector('.hero-avatar');
    const heroSec = document.getElementById('hero');

    if (avatar && heroSec) {
      function updateAvatarZoom() {
        const scrollY  = window.pageYOffset;
        const heroH    = heroSec.offsetHeight;
        const progress = Math.min(scrollY / (heroH * 0.72), 1);

        if (progress <= 0) {
          avatar.style.transform = '';
          avatar.style.opacity   = '';
          return;
        }

        const scale    = 1 + progress * 4;
        const moveUp   = progress * 320;
        const opacity  = Math.max(0, 1 - progress * 1.6);

        avatar.style.transform = `translateY(-${moveUp}px) scale(${scale})`;
        avatar.style.opacity   = opacity;
      }

      window.addEventListener('scroll', updateAvatarZoom, { passive: true });
      updateAvatarZoom();
    }
  }

  // ---------- Mobile nav toggle ----------
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

});
