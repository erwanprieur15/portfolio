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
  const sections = ['hero', 'about', 'parcours', 'skills', 'projects', 'contact'];
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

  // ---------- Project filters ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectBlocks = document.querySelectorAll('.project-block');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      projectBlocks.forEach(block => {
        const cats = block.dataset.cat || '';
        block.classList.toggle('hidden', cat !== 'all' && !cats.includes(cat));
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
