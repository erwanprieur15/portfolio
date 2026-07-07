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

  // ---------- Dot navigation (right side progress) ----------
  const sections = ['hero', 'about', 'parcours', 'skills', 'projects', 'certifications', 'contact'];
  const dotLinks = document.querySelectorAll('.dot-nav a');
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

  // ---------- Certifications accordion ----------
  const certToggles = document.querySelectorAll('.cert-toggle');
  certToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const platform = toggle.closest('.cert-platform');
      const cards = platform.querySelector('.cert-cards');
      const isOpen = platform.classList.contains('cert-platform--open');
      // Close all
      document.querySelectorAll('.cert-platform').forEach(p => {
        p.classList.remove('cert-platform--open');
        p.querySelector('.cert-cards').classList.add('cert-cards--collapsed');
      });
      // Open clicked if it was closed
      if (!isOpen) {
        platform.classList.add('cert-platform--open');
        cards.classList.remove('cert-cards--collapsed');
      }
    });
    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
    });
  });

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
