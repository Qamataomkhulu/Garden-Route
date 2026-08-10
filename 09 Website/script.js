/* Garden Route Integrated AgriHub — site interactivity
   Vanilla JS only. No frameworks. */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('header nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- Header scroll shadow + progress bar ---------- */
  var header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 12;
    header.classList.toggle('scrolled', scrolled);
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    header.style.setProperty('--scroll', pct + '%');
    header.style.setProperty('--progress-width', pct + '%');
    if (header.style) { header.style.setProperty('--w', pct + '%'); }
    document.documentElement.style.setProperty('--scroll-pct', pct + '%');
  }, { passive: true });
  // header::after width driven via inline style fallback
  var styleTag = document.createElement('style');
  styleTag.textContent = 'header::after{width:var(--scroll-pct,0%);}';
  document.head.appendChild(styleTag);

  /* ---------- Scroll-triggered fade-up ---------- */
  var fadeEls = document.querySelectorAll('.fade-up');
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(function (el) { fadeObserver.observe(el); });

  /* ---------- Animated count-up numbers ---------- */
  var counters = document.querySelectorAll('.count-up b[data-count]');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-count'));
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(function (el) { countObserver.observe(el); });

  /* ---------- Animated bar / KPI fills on viewport entry ---------- */
  var growEls = document.querySelectorAll('.bars i, .kpi-bar i');
  var growObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = el.style.height;
      el.style.height = '0%';
      requestAnimationFrame(function () {
        setTimeout(function () { el.style.height = target; }, 60);
      });
      growObserver.unobserve(el);
    });
  }, { threshold: 0.3 });
  growEls.forEach(function (el) { growObserver.observe(el); });

  /* ---------- Seed-to-Shelf clickable stages ---------- */
  var steps = document.querySelectorAll('.step-item');
  var panel = document.getElementById('step-panel');
  var panelBody = document.getElementById('step-panel-body');

  var STAGE_DATA = {
    land: {
      title: '01 · Land',
      purpose: 'Establish a productive, resilient site footprint before any planting begins.',
      infrastructure: ['Land assessment & topographic survey', 'Fencing & site security', 'Access roads', 'Drainage works', 'Irrigation layout planning'],
      process: ['Soil testing & classification', 'Site clearing', 'Access & security installation', 'Expansion zoning for future phases'],
      inputs: ['Site survey data', 'Soil test results', 'Capital for site works'],
      outputs: ['Development-ready land parcels', 'Approved site plan'],
      risks: ['Soil suitability variance', 'Access/servitude delays', 'Zoning or land-use approvals'],
      kpis: ['Hectares site-ready', 'Site works completed on schedule'],
      doc: '10 Technical Documentation/Technical Documentation.md'
    },
    water: {
      title: '02 · Water',
      purpose: 'Secure a diversified, climate-resilient water supply for production and community distribution.',
      infrastructure: ['Rainwater harvesting', 'Bulk storage tanks', 'Purification system', 'Future borehole (subject to feasibility & licensing)'],
      process: ['Water use licensing', 'Storage & purification installation', 'Water quality testing (SANS 241)', 'Distribution scheduling'],
      inputs: ['Rainfall & catchment data', 'Water use authorisation', 'Purification consumables'],
      outputs: ['Potable water for irrigation, operations & community sale'],
      risks: ['Licensing timelines', 'Drought / catchment variability', 'Water quality compliance'],
      kpis: ['Litres stored', 'Litres distributed', 'Compliance test pass rate'],
      doc: '10 Technical Documentation/Technical Documentation.md'
    },
    energy: {
      title: '03 · Energy',
      purpose: 'Remove dependence on grid load shedding through solar-powered core infrastructure.',
      infrastructure: ['Solar array', 'Battery backup', 'Solar-powered pumping', 'Future cold-storage power'],
      process: ['Solar capacity planning by phase', 'Installation & commissioning', 'Load monitoring'],
      inputs: ['Solar capex', 'Site irradiance data'],
      outputs: ['kW of installed generation capacity', 'Uninterrupted irrigation & purification power'],
      risks: ['Equipment lead times', 'Capacity under-sizing at scale'],
      kpis: ['kW installed vs. target (5kW Y1 → 75kW Y5)', 'Grid-independence uptime'],
      doc: '10 Technical Documentation/Technical Documentation.md'
    },
    grow: {
      title: '04 · Grow',
      purpose: 'Produce vegetables, herbs and seedlings using climate-smart, water-efficient methods.',
      infrastructure: ['Open-field plots', 'Protected tunnels / greenhouses', 'Seedling nursery', 'Drip irrigation'],
      process: ['Crop planning & rotation', 'Planting & cultivation', 'Pest & disease management', 'Yield monitoring'],
      inputs: ['Seedlings', 'Water', 'Nutrients', 'Labour'],
      outputs: ['Vegetables & herbs (15t Y1 → 100+t Y5)'],
      risks: ['Weather volatility', 'Pest/disease outbreaks', 'Labour availability'],
      kpis: ['Tonnes produced', 'Yield per hectare', 'Crop loss rate'],
      doc: '11 SOPs/SOP Register.md'
    },
    harvest: {
      title: '05 · Harvest',
      purpose: 'Bring produce off the land at peak quality with minimal post-harvest loss.',
      infrastructure: ['Harvest crews & equipment', 'Sorting & grading area'],
      process: ['Scheduled harvesting by crop maturity', 'Sorting, grading & quality control'],
      inputs: ['Mature crop', 'Labour', 'Harvest containers'],
      outputs: ['Graded, market-ready produce'],
      risks: ['Timing misalignment with demand', 'Post-harvest handling loss'],
      kpis: ['Post-harvest loss %', 'Grade-out rate'],
      doc: '11 SOPs/SOP Register.md'
    },
    deliver: {
      title: '06 · Deliver',
      purpose: 'Move produce and water from the AgriHub to households, institutions and retail partners.',
      infrastructure: ['Packhouse', 'Cold storage', 'Delivery fleet', 'Water delivery logistics'],
      process: ['Order aggregation', 'Pack & chill', 'Route planning & delivery'],
      inputs: ['Graded produce', 'Purified water', 'Packaging'],
      outputs: ['Delivered subscription boxes', 'Institutional supply orders', 'Bulk water delivery'],
      risks: ['Cold-chain breaks', 'Logistics cost inflation', 'Route inefficiency'],
      kpis: ['On-time delivery rate', 'Cost per delivery', 'Subscriber retention'],
      doc: '11 SOPs/SOP Register.md'
    },
    shelf: {
      title: '07 · Shelf',
      purpose: 'Reach the end customer — household, school, restaurant or retailer — as fresh, trusted local produce.',
      infrastructure: ['Household subscriptions', 'Institutional supply agreements', 'Retail partnerships'],
      process: ['Customer onboarding', 'Recurring fulfilment', 'Feedback & quality loop'],
      inputs: ['Delivered produce & water', 'Customer relationships'],
      outputs: ['Recurring revenue', 'Household food & water access'],
      risks: ['Customer churn', 'Price competitiveness', 'Institutional contract renewal risk'],
      kpis: ['Households served (30 Y1 → 300+ Y5)', 'Institutional accounts', 'Revenue per customer'],
      doc: '05 Financial Model/Financial Model.md'
    }
  };

  function renderStagePanel(key) {
    var d = STAGE_DATA[key];
    if (!d || !panelBody) return;
    panelBody.innerHTML =
      '<h4>' + d.title + '</h4>' +
      '<p style="color:rgba(244,240,229,0.85);max-width:640px;">' + d.purpose + '</p>' +
      '<div class="panel-grid">' +
        '<div class="panel-block"><h5>Infrastructure</h5><ul>' + d.infrastructure.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
        '<div class="panel-block"><h5>Operational Process</h5><ul>' + d.process.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
        '<div class="panel-block"><h5>Inputs</h5><ul>' + d.inputs.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
        '<div class="panel-block"><h5>Outputs</h5><ul>' + d.outputs.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
        '<div class="panel-block"><h5>Risks</h5><ul>' + d.risks.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
        '<div class="panel-block"><h5>KPIs</h5><ul>' + d.kpis.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>' +
      '</div>' +
      '<a class="doc-link" target="_blank" rel="noopener" href="https://github.com/Qamataomkhulu/Garden-Route/blob/main/' + encodeURI(d.doc) + '">View related documentation →</a>';
  }

  steps.forEach(function (step) {
    step.addEventListener('click', function () {
      var key = step.getAttribute('data-stage');
      var alreadyActive = step.classList.contains('active');
      steps.forEach(function (s) { s.classList.remove('active'); });
      if (alreadyActive) {
        panel.classList.remove('open');
        return;
      }
      step.classList.add('active');
      renderStagePanel(key);
      panel.classList.add('open');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  /* ---------- Investment phase detail panels ---------- */
  var phaseCards = document.querySelectorAll('.phase-card');
  phaseCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var detail = card.nextElementSibling;
      if (!detail || !detail.classList.contains('phase-detail')) return;
      var isOpen = detail.classList.contains('open');
      document.querySelectorAll('.phase-detail.open').forEach(function (d) { d.classList.remove('open'); });
      if (!isOpen) detail.classList.add('open');
    });
  });

  /* ---------- Roadmap timeline reveal ---------- */
  var tlItems = document.querySelectorAll('.tl-item');
  var tlObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  tlItems.forEach(function (el) { tlObserver.observe(el); });

});
