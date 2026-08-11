/* Garden Route AgriHub — safe multi-page enhancement layer
   This file is intentionally separate from the main site's script.js.
   It is loaded by the secondary pages only, so the existing index.html
   and its working JavaScript do not need to be replaced.
*/
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Reveal motion
  const reveal = $$('.reveal, .page-reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -30px 0px' });
    reveal.forEach(el => io.observe(el));
  }

  // Back-to-top
  const backTop = $('#backTop');
  const updateBackTop = () => backTop?.classList.toggle('visible', window.scrollY > window.innerHeight * .65);
  window.addEventListener('scroll', updateBackTop, { passive: true });
  updateBackTop();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile navigation
  const menu = $('.menu');
  const nav = $('header nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
      menu.setAttribute('aria-expanded', String(nav.classList.contains('mobile-open')));
    });
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) nav.classList.remove('mobile-open');
    });
  }

  // Financial bar animation
  const bars = $$('.bar-col .bar[data-height]');
  const animateBars = () => bars.forEach(bar => { bar.style.height = `${bar.dataset.height}%`; });
  if (reduceMotion || !('IntersectionObserver' in window)) animateBars();
  else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.height = `${entry.target.dataset.height}%`;
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .25 });
    bars.forEach(bar => io.observe(bar));
  }

  // SVG revenue trajectory
  const lines = $$('.chart-line');
  const revealLine = line => {
    line.classList.add('is-visible');
    line.parentElement?.querySelectorAll('.chart-point').forEach(p => p.classList.add('is-visible'));
  };
  if (reduceMotion || !('IntersectionObserver' in window)) lines.forEach(revealLine);
  else {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { revealLine(entry.target); io.unobserve(entry.target); }
    }), { threshold: .2 });
    lines.forEach(line => io.observe(line));
  }

  // Phase detail panels
  const phaseCards = $$('.phase-card[data-phase-detail]');
  const phaseDetail = $('#phaseDetail');
  const activatePhase = card => {
    phaseCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    if (phaseDetail) phaseDetail.innerHTML = card.dataset.phaseDetail || '';
  };
  phaseCards.forEach(card => card.addEventListener('click', () => activatePhase(card)));
  if (phaseCards[0] && phaseDetail) activatePhase(phaseCards[0]);

  // Investor scenario model
  const capital = $('#scenarioCapital');
  if (capital) {
    const share = $('#scenarioShare');
    const revenue = $('#scenarioRev');
    const ebitda = $('#scenarioEbitda');
    const update = () => {
      const n = Math.max(0, Number(capital.value) || 0);
      const fraction = n / 12500000;
      if (share) share.textContent = `${(fraction * 100).toFixed(2)}%`;
      if (revenue) revenue.textContent = `R${Math.round(36220000 * fraction).toLocaleString('en-ZA')}`;
      if (ebitda) ebitda.textContent = `R${Math.round(15200000 * fraction).toLocaleString('en-ZA')}`;
    };
    capital.addEventListener('input', update);
    update();
  }

  // Investor document search
  const docSearch = $('#pageDocSearch');
  if (docSearch) {
    const docs = $$('.doc-mini');
    docSearch.addEventListener('input', () => {
      const q = docSearch.value.trim().toLowerCase();
      docs.forEach(doc => {
        doc.hidden = !!q && !doc.textContent.toLowerCase().includes(q);
      });
    });
  }

  // Static GitHub Pages forms: prepare a mailto enquiry without a backend.
  const setupForm = (formId, statusId, subject) => {
    const form = $(`#${formId}`);
    const status = $(`#${statusId}`);
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const data = new FormData(form);
      const body = [
        `Name: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Organisation: ${data.get('organisation') || ''}`,
        `Interest: ${data.get('interest') || data.get('purpose') || ''}`,
        `Message: ${data.get('message') || ''}`
      ].join('\n');
      const mailto = `mailto:iambandile@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (status) status.textContent = 'Preparing your email enquiry…';
      window.location.href = mailto;
    });
  };
  setupForm('pageInvestorForm', 'pageFormStatus', 'Garden Route AgriHub — Investor Enquiry');
  setupForm('contactForm', 'contactStatus', 'Garden Route AgriHub — Contact Enquiry');
})();
