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
        setTimeout(() => {
          targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
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
