/**
 * Garden Route Integrated AgriHub — Interactive Investor Website
 * Preserves the existing website and includes: dark mode, scroll progress,
 * animated KPIs/charts, dashboard views/export, document search/filter,
 * in-site Markdown rendering, accessible modals, mobile navigation and
 * restrained premium motion.
 */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const body = document.body;
  const header = $('#topbar');
  const liveRegion = $('#liveRegion');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const announce = (message) => {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    window.setTimeout(() => { liveRegion.textContent = message; }, 20);
  };

  // ------------------------------------------------------------
  // Scroll progress + header + back to top
  // ------------------------------------------------------------
  const backTop = $('#backTop');
  let ticking = false;
  const updateScrollUI = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    header?.style.setProperty('--progress', `${progress}%`);
    header?.classList.toggle('scrolled', window.scrollY > 40);
    backTop?.classList.toggle('visible', window.scrollY > window.innerHeight * 0.65);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ------------------------------------------------------------
  // Reveal animation
  // ------------------------------------------------------------
  const revealItems = $$('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  }

  // ------------------------------------------------------------
  // Dark / light mode — preference persists locally
  // ------------------------------------------------------------
  const themeToggle = $('#themeToggle');
  const storedTheme = localStorage.getItem('agrihub-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && systemDark)) body.classList.add('presentation-dark');

  const syncThemeButton = () => {
    const dark = body.classList.contains('presentation-dark');
    if (themeToggle) {
      themeToggle.textContent = dark ? 'L' : 'D';
      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  };
  syncThemeButton();
  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('presentation-dark');
    const dark = body.classList.contains('presentation-dark');
    localStorage.setItem('agrihub-theme', dark ? 'dark' : 'light');
    syncThemeButton();
    announce(dark ? 'Dark mode enabled' : 'Light mode enabled');
  });

  // ------------------------------------------------------------
  // Smooth navigation + mobile menu
  // ------------------------------------------------------------
  const mobileMenu = $('.menu');
  const nav = $('nav');
  const closeMobileMenu = () => {
    nav?.classList.remove('mobile-open');
    mobileMenu?.setAttribute('aria-expanded', 'false');
  };
  mobileMenu?.setAttribute('aria-expanded', 'false');
  mobileMenu?.addEventListener('click', () => {
    nav?.classList.toggle('mobile-open');
    mobileMenu.setAttribute('aria-expanded', String(nav?.classList.contains('mobile-open')));
  });

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = id && $(id);
      if (!target) return;
      event.preventDefault();
      const offset = (header?.offsetHeight || 78) + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  // ------------------------------------------------------------
  // Hero parallax — deliberately restrained
  // ------------------------------------------------------------
  const heroBg = $('.hero-bg');
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `scale(1.04) translateY(${Math.min(35, window.scrollY * 0.08)}px)`;
    }, { passive: true });
  }

  // ------------------------------------------------------------
  // KPI counters
  // ------------------------------------------------------------
  const counters = $$('.count-up');
  const animateCounter = el => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    const target = Number(el.dataset.target || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      return;
    }
    const start = performance.now();
    const duration = 1350;
    const frame = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          const kpi = entry.target.closest('.kpi');
          kpi?.classList.add('metric-animated');
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else counters.forEach(animateCounter);

  // ------------------------------------------------------------
  // Dashboard views
  // ------------------------------------------------------------
  const tabs = $$('.chart-tab');
  const views = $$('.chart-view');
  const status = $('#dashboardStatus');
  const viewNames = { growth: 'Growth view', capacity: 'Capacity view', capex: 'Capital view' };
  const activateView = view => {
    tabs.forEach(tab => {
      const active = tab.dataset.view === view;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    views.forEach(panel => panel.classList.toggle('is-hidden', !panel.classList.contains(`${view}-view`)));
    const activePanel = $(`.${view}-view`);
    activePanel?.classList.add('chart-animated');
    if (status) status.textContent = viewNames[view] || 'Institutional model view';
    announce(`${viewNames[view] || 'Dashboard view'} selected`);
  };
  tabs.forEach(tab => tab.addEventListener('click', () => activateView(tab.dataset.view)));

  // Animate bars/lines once the dashboard is visible.
  const dashboard = $('#dashboard');
  if (dashboard) {
    if (prefersReducedMotion) dashboard.classList.add('chart-ready');
    else {
      const dashboardObserver = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting) {
          dashboard.classList.add('chart-ready');
          $$('.growth-view', dashboard).forEach(el => el.classList.add('chart-animated'));
          dashboardObserver.disconnect();
        }
      }, { threshold: 0.2 });
      dashboardObserver.observe(dashboard);
    }
  }

  // Lightweight chart tooltip behavior.
  $$('.columns i[data-tooltip]').forEach(bar => {
    bar.addEventListener('mouseenter', () => bar.classList.add('show-tip'));
    bar.addEventListener('mouseleave', () => bar.classList.remove('show-tip'));
    bar.addEventListener('focus', () => bar.classList.add('show-tip'));
    bar.addEventListener('blur', () => bar.classList.remove('show-tip'));
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', bar.dataset.tooltip);
  });

  // Revenue chart — derive bar heights from the actual model values.
  // The previous draft used visual placeholders; this version keeps the chart
  // proportional to the R3.074M → R36.22M trajectory.
  const revenueBars = $$('.columns i[data-revenue]');
  const revenueMax = 36.22;
  const setRevenueBars = () => {
    revenueBars.forEach(bar => {
      const value = Number(bar.dataset.revenue || 0);
      const pct = revenueMax ? (value / revenueMax) * 100 : 0;
      bar.style.setProperty('--v', pct.toFixed(2));
      bar.style.setProperty('--target-height', `${pct.toFixed(2)}%`);
      if (prefersReducedMotion) bar.classList.add('revenue-ready');
    });
  };
  setRevenueBars();
  if (!prefersReducedMotion && revenueBars.length) {
    const revenueChart = $('.columns');
    const animateRevenue = () => {
      revenueBars.forEach((bar, index) => {
        window.setTimeout(() => bar.classList.add('revenue-ready'), index * 90);
      });
    };
    if ('IntersectionObserver' in window && revenueChart) {
      const revenueObserver = new IntersectionObserver(entries => {
        if (entries[0]?.isIntersecting) {
          animateRevenue();
          revenueObserver.disconnect();
        }
      }, { threshold: 0.25 });
      revenueObserver.observe(revenueChart);
    } else animateRevenue();
  }

  // ------------------------------------------------------------
  // Dashboard CSV export
  // ------------------------------------------------------------
  $('#exportDashboard')?.addEventListener('click', () => {
    const rows = [
      ['Metric','Year 1','Year 2','Year 3','Year 4','Year 5'],
      ['Revenue (ZAR M)',3.074,6.70,14.09,22.70,36.22],
      ['EBITDA Margin (%)',29.1,34.9,34.3,37.4,42.0],
      ['Vegetables (tonnes)',15,55,100,180,300],
      ['Clean Water (L)',100000,300000,1000000,2500000,5000000],
      ['Solar Capacity (kW)',5,10,25,50,75],
      ['Direct Jobs',5,10,20,25,30],
      ['Households Served',30,75,150,225,300]
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'garden-route-agrihub-dashboard.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    announce('Dashboard CSV exported');
  });

  // ------------------------------------------------------------
  // Seed-to-shelf technical modal
  // ------------------------------------------------------------
  const stageData = {
    seed: { title:'Seed & Nursery', intro:'Propagation and nursery operations establish healthy planting material before field or protected-crop deployment.', scope:['Seed sourcing and intake controls','Propagation media and tray preparation','Germination, irrigation and environmental monitoring','Hardening and quality inspection','Dispatch planning and traceability'], sop:'Input → propagate → monitor → harden → inspect → dispatch.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs' },
    land: { title:'Land & Soil', intro:'Prepare productive land with soil, drainage, access and irrigation considerations built into the production footprint.', scope:['Land assessment and zoning','Soil testing and fertility planning','Fencing, access and site preparation','Drainage and erosion controls','Irrigation layout and expansion planning'], sop:'Assess → test → prepare → install → verify → release for production.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/10%20Technical%20Documentation' },
    water: { title:'Water Security', intro:'Create a resilient water layer supporting irrigation, purification, storage and future distribution services.', scope:['Rainwater harvesting and catchment','Storage and bulk tanks','Purification and treatment controls','Water quality monitoring','Distribution and maintenance'], sop:'Capture → store → treat → test → distribute → maintain.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/10%20Technical%20Documentation' },
    energy: { title:'Solar Energy', intro:'Use renewable generation to support pumping, irrigation, purification and critical operating loads.', scope:['PV array and inverter architecture','Battery and critical-load planning','Pump and irrigation integration','Energy monitoring and maintenance','Expansion capacity toward 75 kW'], sop:'Generate → store → prioritise loads → monitor → maintain.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/10%20Technical%20Documentation' },
    greenhouse: { title:'Protected Agriculture', intro:'Protected growing environments improve production consistency and create a controlled platform for commercial scale-up.', scope:['Tunnel and greenhouse preparation','Micro-drip irrigation','Crop environment monitoring','Pest and disease controls','Yield and input tracking'], sop:'Prepare → plant → irrigate → monitor → protect → harvest.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs' },
    harvest: { title:'Harvest', intro:'Harvest operations protect crop quality and establish traceability before produce enters the packhouse.', scope:['Harvest readiness checks','Crop handling and field hygiene','Grading and quality inspection','Batch identification and traceability','Transfer to packhouse'], sop:'Assess → harvest → grade → record → transfer.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs' },
    packhouse: { title:'Packhouse', intro:'Post-harvest handling converts harvested produce into market-ready units while protecting quality and shelf life.', scope:['Sorting and grading','Packing specifications','Cold-chain controls','Inventory and dispatch records','Waste and returns management'], sop:'Receive → sort → grade → pack → chill → dispatch.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs' },
    shelf: { title:'Distribution & Shelf', intro:'Distribution connects production to households, institutions, hospitality and local market channels.', scope:['Order capture and forecasting','Route planning and vehicle controls','Customer confirmation','Delivery records and service levels','Returns and reconciliation'], sop:'Order → consolidate → route → load → deliver → confirm → reconcile.', git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs' }
  };

  const stageModal = $('#stageModal');
  const openStage = key => {
    const data = stageData[key];
    if (!data || !stageModal) return;
    $('#modalTitle').textContent = data.title;
    $('#modalIntro').textContent = data.intro;
    $('#modalScope').innerHTML = data.scope.map(item => `<li>${item}</li>`).join('');
    $('#modalSop').textContent = data.sop;
    $('#modalGit').href = data.git;
    stageModal.classList.add('open');
    stageModal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    $('#closeModal')?.focus();
    announce(`${data.title} technical scope opened`);
  };
  const closeStage = () => {
    stageModal?.classList.remove('open');
    stageModal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  };
  $$('.stage').forEach(stage => stage.addEventListener('click', () => openStage(stage.dataset.stage)));
  $('#closeModal')?.addEventListener('click', closeStage);
  $('#closeModal2')?.addEventListener('click', closeStage);
  stageModal?.addEventListener('click', event => { if (event.target === stageModal) closeStage(); });

  // ------------------------------------------------------------
  // Investor portal search + filter + Markdown viewer
  // ------------------------------------------------------------
  const docCards = $$('.doc-card');
  let activeFilter = 'all';
  const docSearch = $('#docSearch');
  const applyDocumentFilter = () => {
    const query = (docSearch?.value || '').trim().toLowerCase();
    let visible = 0;
    docCards.forEach(card => {
      const haystack = `${card.dataset.title || ''} ${card.textContent}`.toLowerCase();
      const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !query || haystack.includes(query);
      const show = matchesCategory && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    announce(`${visible} investor documents shown`);
  };
  docSearch?.addEventListener('input', applyDocumentFilter);
  $$('.doc-filter').forEach(filterButton => filterButton.addEventListener('click', () => {
    $$('.doc-filter').forEach(btn => btn.classList.remove('active'));
    filterButton.classList.add('active');
    activeFilter = filterButton.dataset.filter;
    applyDocumentFilter();
  }));

  const docModal = $('#docModal');
  const docRender = $('#docRender');
  const docOpen = $('#docOpen');
  const githubRaw = 'https://raw.githubusercontent.com/Qamataomkhulu/Garden-Route/main/';
  const githubBlob = 'https://github.com/Qamataomkhulu/Garden-Route/blob/main/';

  const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const openDocument = async card => {
    const path = card.dataset.doc;
    const label = card.dataset.label || 'Project Document';
    if (!path || !docModal || !docRender) return;
    $('#docTitle').textContent = label;
    docOpen.href = githubBlob + path;
    docRender.innerHTML = '<div class="doc-loading"><span class="loader"></span><span>Loading document…</span></div>';
    docModal.classList.add('open');
    docModal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    $('#closeDoc')?.focus();
    announce(`${label} loading`);
    try {
      const response = await fetch(githubRaw + path, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markdown = await response.text();
      if (window.marked) {
        window.marked.setOptions({ breaks: false, gfm: true });
        docRender.innerHTML = window.marked.parse(markdown);
      } else {
        docRender.innerHTML = `<pre>${escapeHtml(markdown)}</pre>`;
      }
      announce(`${label} loaded`);
      docRender.scrollTop = 0;
    } catch (error) {
      docRender.innerHTML = `<div class="doc-error"><span class="eyebrow">SOURCE FALLBACK</span><h2>Document preview unavailable</h2><p>The source could not be rendered inside the website. The original GitHub file remains available through the verification button.</p><p class="doc-error-code">${escapeHtml(error.message)}</p></div>`;
      announce(`${label} preview unavailable; source link available`);
    }
  };
  docCards.forEach(card => card.addEventListener('click', event => { event.preventDefault(); openDocument(card); }));
  const closeDocument = () => {
    docModal?.classList.remove('open');
    docModal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    if (docRender) docRender.innerHTML = '';
  };
  $('#closeDoc')?.addEventListener('click', closeDocument);
  $('#docClose2')?.addEventListener('click', closeDocument);
  docModal?.addEventListener('click', event => { if (event.target === docModal) closeDocument(); });

  // ------------------------------------------------------------
  // Global keyboard handling
  // ------------------------------------------------------------
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeStage();
    closeDocument();
    closeMobileMenu();
  });

  // ------------------------------------------------------------
  // Accessibility / focus states
  // ------------------------------------------------------------
  $$('button, a, input').forEach(el => {
    el.addEventListener('focus', () => el.classList.add('keyboard-focus'));
    el.addEventListener('blur', () => el.classList.remove('keyboard-focus'));
  });

  window.__agrihub = {
    version: 'level-1-investor-polish',
    activateDashboardView: activateView,
    openDocument,
    openStage
  };

  //  — INVESTOR INTELLIGENCE
  const money = value => `R${Number(value).toLocaleString('en-ZA', {maximumFractionDigits:0})}`;
  const scenarioSlider = $('#scenarioInvestment');
  const updateScenario = () => {
    if (!scenarioSlider) return;
    const investment = Number(scenarioSlider.value), share = investment / 12500000;
    $('#scenarioAmount').textContent = money(investment);
    $('#scenarioShare').textContent = `${(share * 100).toFixed(1)}%`;
    $('#scenarioRevenue').textContent = money(36220000 * share);
    $('#scenarioEbitda').textContent = money(36220000 * 0.42 * share);
  };
  scenarioSlider?.addEventListener('input', updateScenario); updateScenario();

  const mixBars = $$('.level2-mix i');
  if (mixBars.length) {
    if (prefersReducedMotion) mixBars.forEach(b => b.style.width = b.style.getPropertyValue('--w'));
    else { const ob = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){mixBars.forEach((b,i)=>setTimeout(()=>b.style.width=b.style.getPropertyValue('--w'),i*70));ob.disconnect();}}),{threshold:.25}); const mix=$('.level2-mix'); if(mix) ob.observe(mix); }
  }

  const mapLayerText = $('#mapLayerText');
  const mapText={hub:'Core operating hub connecting land, water, energy, production and distribution.',water:'Water resilience layer: harvesting, storage, purification, testing and distribution support the productive system.',market:'Market layer: households, hospitality, schools, retailers and institutional buyers provide multiple routes to market.',expansion:'Expansion layer: regional distribution and future Eastern Cape replication extend the platform beyond the initial hub.'};
  $$('.map-layer').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.map-layer').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});btn.classList.add('active');btn.setAttribute('aria-selected','true');
    if(mapLayerText)mapLayerText.textContent=mapText[btn.dataset.layer]||'';
    $$('.map-node').forEach(n=>n.classList.remove('highlight'));
    const sel={hub:'.node-hub',water:'.node-water',market:'.node-market',expansion:'.node-expansion'}[btn.dataset.layer]; if(sel)$(sel)?.classList.add('highlight');
    announce(`${btn.textContent} operating layer selected`);
  }));

  const roadmapDetails={
    '2026':['2026 · PHASE 1','Infrastructure, solar, water and proof of concept.','Establish the productive operating base, secure water resilience, deploy Phase 1 solar and validate commercial demand.'],
    '2027':['2027 · COMMERCIAL PRODUCTION','Production ramp-up and market activation.','Scale production, activate household subscriptions and institutional sales, and strengthen operating discipline.'],
    '2028':['2028 · EXPANSION','Protected agriculture and infrastructure scale-up.','Expand greenhouse capacity, water infrastructure, solar capacity and packhouse capability.'],
    '2029':['2029 · REGIONAL DISTRIBUTION','Move beyond the first hub.','Develop institutional contracts, cold-chain capability, bulk water services and regional market access.'],
    '2030':['2030 · EASTERN CAPE REPLICATION','Replicable regional operating model.','Develop additional AgriHubs, agricultural partnerships, youth development pathways and regional expansion.']
  };
  $$('.roadmap-node').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.roadmap-node').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});btn.classList.add('active');btn.setAttribute('aria-selected','true');
    const d=roadmapDetails[btn.dataset.year]; if(d){$('#roadmapDetail').innerHTML=`<span class="eyebrow">${d[0]}</span><h4>${d[1]}</h4><p>${d[2]}</p>`;$('#roadmapDetail').classList.remove('detail-pulse');void $('#roadmapDetail').offsetWidth;$('#roadmapDetail').classList.add('detail-pulse');announce(`${btn.dataset.year} milestone selected`)}
  }));

  $('#investorForm')?.addEventListener('submit',event=>{
    event.preventDefault(); const form=event.currentTarget; if(!form.checkValidity()){form.reportValidity();return;}
    const d=new FormData(form), name=d.get('name'), email=d.get('email'), org=d.get('organisation')||'Not specified', interest=d.get('interest'), message=d.get('message')||'No additional message.';
    const subject=encodeURIComponent(`Garden Route AgriHub enquiry — ${interest}`), bodyText=encodeURIComponent(`Name: ${name}
Email: ${email}
Organisation: ${org}
Interest: ${interest}

${message}`);
    $('#formStatus').textContent='Your email client will open with the enquiry prepared.'; localStorage.setItem('agrihub-last-interest',JSON.stringify({name,email,organisation:org,interest})); announce('Investor enquiry prepared'); window.location.href=`mailto:iambandile@icloud.com?subject=${subject}&body=${bodyText}`;
  });

  $('#printDashboard')?.addEventListener('click',()=>{document.body.classList.add('print-mode');setTimeout(()=>window.print(),40);setTimeout(()=>document.body.classList.remove('print-mode'),1000)});

  docCards.forEach(card=>card.addEventListener('click',()=>{
    const key=card.dataset.doc||card.dataset.label||'document', counts=JSON.parse(localStorage.getItem('agrihub-doc-counts')||'{}'); counts[key]=(counts[key]||0)+1; localStorage.setItem('agrihub-doc-counts',JSON.stringify(counts)); card.dataset.views=counts[key];
  },{capture:true}));

  const cookieNotice=$('#cookieNotice');
  if(localStorage.getItem('agrihub-notice')==='1')cookieNotice?.classList.add('accepted');
  $('#cookieAccept')?.addEventListener('click',()=>{localStorage.setItem('agrihub-notice','1');cookieNotice?.classList.add('accepted')});
  $$('.mobile-bottom-nav a').forEach(link=>link.addEventListener('click',()=>announce(`${link.textContent} section selected`)));

  const trackLocal=(eventName,detail='')=>{const key='agrihub-events',events=JSON.parse(localStorage.getItem(key)||'[]');events.push({event:eventName,detail,at:new Date().toISOString()});if(events.length>100)events.splice(0,events.length-100);localStorage.setItem(key,JSON.stringify(events));};
  $$('.stage').forEach(el=>el.addEventListener('click',()=>trackLocal('journey_open',el.dataset.stage)));
  $$('.doc-card').forEach(el=>el.addEventListener('click',()=>trackLocal('document_open',el.dataset.label||'')));
  $$('.hero-actions a,.header-actions a').forEach(el=>el.addEventListener('click',()=>trackLocal('primary_cta',el.textContent.trim())));


  // ============================================================
  //  — INSTITUTIONAL DECISION PLATFORM
  // ============================================================
  const decisionData = {
    opportunity:{ey:'01 · OPPORTUNITY',title:'One ecosystem. Multiple resilience layers.',text:'Food production, water, energy and market access are designed as connected commercial layers rather than isolated projects.',points:['Food security','Water resilience','Energy resilience','Economic opportunity'],metric:['5','resilience layers','food · water · energy · market · community']},
    money:{ey:'02 · MONEY',title:'Diversified revenue with operating leverage.',text:'The current model targets R36.22M Year 5 revenue and R15.20M modeled EBITDA, with multiple operating streams reducing reliance on one product line.',points:['R36.22M Y5 revenue','42.0% Y5 EBITDA margin','6+ revenue streams','100+ tonnes'],metric:['42%','Y5 EBITDA margin','R15.20M modeled EBITDA']},
    capital:{ey:'03 · CAPITAL',title:'Milestone-led deployment.',text:'R12.50M is structured across Foundation, Scale-up and Regional Hub phases so infrastructure and operating capability grow with validated demand.',points:['R4.85M Phase 1','R4.50M Phase 2','R3.15M Phase 3','6–8 month buffer'],metric:['R12.50M','cumulative capital','3 milestone-led phases']},
    future:{ey:'04 · FUTURE',title:'A hub designed for replication.',text:'The five-year roadmap moves from infrastructure and commercial production to regional distribution and Eastern Cape replication.',points:['2026 Foundation','2027 Production','2028 Expansion','2030 Replication'],metric:['2030','replication target','Eastern Cape regional model']},
    verify:{ey:'05 · VERIFY',title:'Transparent by design.',text:'The public website is the presentation layer; the GitHub repository remains the supporting documentation source for independent review and diligence.',points:['Market research','Financial model','Technical docs','SOPs · ESG · Legal'],metric:['85%','presentation readiness','supporting documentation layer']}
  };
  $$('.decision-card').forEach(card=>card.addEventListener('click',()=>{
    $$('.decision-card').forEach(c=>c.classList.remove('active')); card.classList.add('active');
    const d=decisionData[card.dataset.decision]; if(!d)return;
    $('#decisionEyebrow').textContent=d.ey; $('#decisionTitle').textContent=d.title; $('#decisionText').textContent=d.text;
    $('#decisionPoints').innerHTML=d.points.map(x=>`<span>${x}</span>`).join(''); $('#decisionMetric').innerHTML=`<strong>${d.metric[0]}</strong><span>${d.metric[1]}</span><em>${d.metric[2]}</em>`;
    announce(`${d.ey} decision layer selected`); trackLocal('decision_layer',card.dataset.decision);
  }));

  const scenarios={
    base:{revenue:[3.074,6.70,14.09,22.70,36.22],margin:42,label:'Current model'},
    conservative:{revenue:[2.61,5.36,10.57,16.35,25.35],margin:34,label:'Illustrative downside case'},
    growth:{revenue:[3.38,7.71,17.61,29.53,45.28],margin:46,label:'Illustrative upside case'}
  };
  const renderScenario=(key)=>{const d=scenarios[key], bars=$('#fiChartBars'); if(!bars)return; const max=48; bars.innerHTML=d.revenue.map((v,i)=>`<div class="fi-bar-wrap" title="${2026+i}: R${v.toFixed(2)}M"><strong class="fi-bar-value">R${v.toFixed(2)}M</strong><i class="fi-bar" style="--h:${(v/max)*100}%"></i><span class="fi-bar-label">Y${i+1}</span></div>`).join(''); const y5=d.revenue[4]*1e6, e=y5*d.margin/100; $('#fiRevenue').textContent=money(y5); $('#fiRevenueDelta').textContent=d.label; $('#fiEbitda').textContent=money(e); $('#fiEbitdaDelta').textContent=`${d.margin.toFixed(1)}% margin`; };
  $$('.scenario-tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.scenario-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderScenario(btn.dataset.scenario);trackLocal('financial_scenario',btn.dataset.scenario)})); renderScenario('base');

  const capitalData={
    phase1:['PHASE 1 · FOUNDATION','Establish the operating base.','Land preparation, 1,000m² tunnels, Phase 1 water purification, 5kW solar, logistics and working capital.',['R4.85M|Capital','5 kW|Solar','10,000 L/day|Water','15 t/year|Production']],
    phase2:['PHASE 2 · SCALE-UP','Move from proof to commercial scale.','Expand production, water infrastructure, solar capacity, packhouse capability, logistics and market access.',['R4.50M|Capital','Scale|Production','Expanded|Water','Expanded|Solar']],
    phase3:['PHASE 3 · REGIONAL HUB','Build a replicable regional platform.','Develop regional distribution, institutional contracts, expanded infrastructure and the foundation for Eastern Cape replication.',['R3.15M|Capital','Regional|Distribution','2030|Replication','Multi-hub|Potential']]
  };
  const renderCapitalDecision = key => {
    const d=capitalData[key], detail=$('#capitalDetail');
    if(!d || !detail) return;
    $$('.capital-phase').forEach(btn=>{
      const active=btn.dataset.capital===key;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
    });
    detail.classList.remove('capital-detail-refresh');
    detail.innerHTML=`<span class="eyebrow">${d[0]}</span><h4>${d[1]}</h4><p>${d[2]}</p><div class="capital-detail-grid">${d[3].map(x=>{const [a,b]=x.split('|');return `<span><b>${a}</b>${b}</span>`}).join('')}</div>`;
    requestAnimationFrame(()=>detail.classList.add('capital-detail-refresh'));
    trackLocal('capital_phase',key); announce(`${d[0]} selected`);
  };
  $$('.capital-phase').forEach(btn=>{
    btn.setAttribute('role','tab'); btn.setAttribute('aria-selected',btn.classList.contains('active')?'true':'false');
    btn.addEventListener('click',()=>renderCapitalDecision(btn.dataset.capital));
    btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();renderCapitalDecision(btn.dataset.capital);}});
  });
  renderCapitalDecision('phase1');

  const twinData={land:['LAND','Site preparation, production zoning and expansion capacity.','→ Operations + Technical Documentation'],water:['WATER','Storage, purification, rainwater harvesting and irrigation resilience.','→ Water SOPs + Technical Documentation'],energy:['SOLAR','Solar generation supporting pumping, purification and critical operations.','→ Energy scope + ESG'],grow:['GROW','Protected agriculture, open field production, herbs and seedlings.','→ Agriculture SOPs + Production scope'],harvest:['HARVEST','Harvest, packhouse handling, quality control and cold-chain preparation.','→ Harvest SOPs + Distribution'],market:['MARKET','Households, hospitality, schools, retailers and institutional buyers.','→ Market Research + Business Model'],community:['COMMUNITY','Jobs, youth training, food access and regional economic pathways.','→ ESG & Impact']};
  $$('.dt-node').forEach(btn=>btn.addEventListener('click',()=>{ $$('.dt-node').forEach(b=>b.classList.remove('active'));btn.classList.add('active'); const d=twinData[btn.dataset.node]; if(!d)return; $('#dtReadout').innerHTML=`<strong>${d[0]}</strong><span>${d[1]}</span><em>${d[2]}</em>`; announce(`${d[0]} operating layer selected`);trackLocal('digital_twin_node',btn.dataset.node); }));

  // Global website/data-room search. The links are source-backed GitHub destinations.
  const searchIndex=[
    ['Financial Model','financial','Five-year revenue, CAPEX, EBITDA, cash flow and assumptions.','#dataroom'],['Funding Strategy','financial','Phased capital requirements and DFI / investor approach.','#dataroom'],['Market Research','market','Eastern Cape agriculture, climate, competitors, segments and value chain.','#dataroom'],['Technical Documentation','technical','Land, water, solar, production and infrastructure scope.','#dataroom'],['SOP Library','technical','Farm, water, harvest, pack, distribution and operating procedures.','#dataroom'],['ESG & Impact','ESG','Environmental, social, governance and impact measurement.','#dataroom'],['Governance & Legal','legal','Company governance, compliance and regulatory considerations.','#dataroom'],['Business Model','foundation','Revenue architecture, divisions and community distribution.','#dataroom'],['Seed to Shelf','operations','Land, water, energy, grow, harvest, delivery and shelf.','#journey'],['Five-Year Roadmap','strategy','2026 foundation through 2030 Eastern Cape replication.','#roadmap']
  ];
  const searchInput=$('#platformSearch'), results=$('#platformSearchResults');
  const renderSearch=(q='')=>{if(!results)return;const term=q.trim().toLowerCase();const rows=searchIndex.filter(x=>!term||x.join(' ').toLowerCase().includes(term)).slice(0,9);results.innerHTML=rows.length?rows.map(x=>`<a class="search-result" href="${x[3]}"><span>${x[1]}</span><b>${x[0]}</b><small>${x[2]}</small></a>`).join(''):`<div class="search-result"><b>No matching layer</b><small>Try financial, water, solar, ESG, SOPs, market or roadmap.</small></div>`};
  searchInput?.addEventListener('input',e=>renderSearch(e.target.value)); renderSearch();

  // Investor presentation mode
  const modeOverlay=$('#investorModeOverlay');
  $('#investorModeBtn')?.addEventListener('click',()=>{modeOverlay?.classList.add('open');modeOverlay?.setAttribute('aria-hidden','false');document.body.classList.add('presentation-dark');document.body.style.overflow='hidden';trackLocal('investor_mode_open');});
  const closeInvestorMode=()=>{modeOverlay?.classList.remove('open');modeOverlay?.setAttribute('aria-hidden','true');document.body.classList.remove('presentation-dark');document.body.style.overflow='';};
  $('#closeInvestorMode')?.addEventListener('click',closeInvestorMode);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modeOverlay?.classList.contains('open'))closeInvestorMode();});

  // Shareable deep views. GitHub Pages can serve these without server-side routing.
  $('#shareViewBtn')?.addEventListener('click',async()=>{const url=`${location.origin}${location.pathname}?view=investor-intelligence#level3`;try{await navigator.clipboard.writeText(url);announce('Investor intelligence link copied');$('#shareViewBtn').textContent='Link Copied';setTimeout(()=>$('#shareViewBtn').textContent='Share Investor View',1800);}catch(e){window.prompt('Copy this investor view link:',url)}});
  const view=new URLSearchParams(location.search).get('view'); if(view==='investor-intelligence')setTimeout(()=>$('#level3')?.scrollIntoView({behavior:prefersReducedMotion?'auto':'smooth'}),300);

})();

/* ================================================================
    — FINAL PLATFORM LAYER
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const level4 = document.getElementById('level4');
  if (level4) level4.classList.add('is-ready');
});

/* ============================================================
   FINAL INTERACTION HARDENING
   Ensures the Institutional Decision Platform controls remain
   functional as the site evolves.
   ============================================================ */
(() => {
  'use strict';

  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const replaceButtons = selector => qa(selector).map(el => {
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    return clone;
  });

  const announceFinal = msg => {
    const live = q('#liveRegion');
    if (live) {
      live.textContent = '';
      setTimeout(() => { live.textContent = msg; }, 20);
    }
  };

  /* Decision surface */
  const decisionDataFinal = {
    opportunity:{
      ey:'01 · OPPORTUNITY',
      title:'One ecosystem. Multiple resilience layers.',
      text:'Food production, water, energy and market access are designed as connected commercial layers rather than isolated projects.',
      points:['Food security','Water resilience','Energy resilience','Economic opportunity'],
      metric:['5','resilience layers','food · water · energy · market · community']
    },
    money:{
      ey:'02 · MONEY',
      title:'Diversified revenue with operating leverage.',
      text:'The current model targets R36.22M Year 5 revenue and R15.20M modeled EBITDA, with multiple operating streams reducing reliance on one product line.',
      points:['R36.22M Y5 revenue','42.0% Y5 EBITDA margin','6+ revenue streams','100+ tonnes'],
      metric:['42%','Y5 EBITDA margin','R15.20M modeled EBITDA']
    },
    capital:{
      ey:'03 · CAPITAL',
      title:'Milestone-led deployment.',
      text:'R12.50M is structured across Foundation, Scale-up and Regional Hub phases so infrastructure and operating capability grow with validated demand.',
      points:['R4.85M Phase 1','R4.50M Phase 2','R3.15M Phase 3','6–8 month buffer'],
      metric:['R12.50M','cumulative capital','3 milestone-led phases']
    },
    future:{
      ey:'04 · FUTURE',
      title:'A hub designed for replication.',
      text:'The five-year roadmap moves from infrastructure and commercial production to regional distribution and Eastern Cape replication.',
      points:['2026 Foundation','2027 Production','2028 Expansion','2030 Replication'],
      metric:['2030','replication target','Eastern Cape regional model']
    },
    verify:{
      ey:'05 · VERIFY',
      title:'Transparent by design.',
      text:'The public website is the presentation layer; the GitHub repository remains the supporting documentation source for independent review and diligence.',
      points:['Market research','Financial model','Technical docs','SOPs · ESG · Legal'],
      metric:['85%','presentation readiness','supporting documentation layer']
    }
  };

  const decisionButtons = replaceButtons('.decision-card');
  decisionButtons.forEach(btn => btn.addEventListener('click', () => {
    const d = decisionDataFinal[btn.dataset.decision];
    if (!d) return;
    decisionButtons.forEach(b => b.classList.toggle('active', b === btn));
    const ey=q('#decisionEyebrow'), title=q('#decisionTitle'), text=q('#decisionText');
    const points=q('#decisionPoints'), metric=q('#decisionMetric');
    if(ey) ey.textContent=d.ey;
    if(title) title.textContent=d.title;
    if(text) text.textContent=d.text;
    if(points) points.innerHTML=d.points.map(x=>`<span>${x}</span>`).join('');
    if(metric) metric.innerHTML=`<strong>${d.metric[0]}</strong><span>${d.metric[1]}</span><em>${d.metric[2]}</em>`;
    announceFinal(`${d.ey} selected`);
  }));

  /* Financial scenarios */
  const scenarioDataFinal = {
    base:{revenue:[3.074,6.70,14.09,22.70,36.22],margin:42,label:'Current model'},
    conservative:{revenue:[2.61,5.36,10.57,16.35,25.35],margin:34,label:'Illustrative downside case'},
    growth:{revenue:[3.38,7.71,17.61,29.53,45.28],margin:46,label:'Illustrative upside case'}
  };
  const moneyFinal = n => `R${(n/1e6).toFixed(2)}M`;
  const scenarioButtons = replaceButtons('.scenario-tab');
  const renderScenarioFinal = key => {
    const d=scenarioDataFinal[key], bars=q('#fiChartBars');
    if(!d || !bars) return;
    bars.innerHTML=d.revenue.map((v,i)=>`<div class="fi-bar-wrap" title="${2026+i}: R${v.toFixed(2)}M"><strong class="fi-bar-value">R${v.toFixed(2)}M</strong><i class="fi-bar" style="--h:${(v/48)*100}%"></i><span class="fi-bar-label">Y${i+1}</span></div>`).join('');
    const y5=d.revenue[4]*1e6;
    const ebitda=y5*d.margin/100;
    if(q('#fiRevenue')) q('#fiRevenue').textContent=moneyFinal(y5);
    if(q('#fiRevenueDelta')) q('#fiRevenueDelta').textContent=d.label;
    if(q('#fiEbitda')) q('#fiEbitda').textContent=moneyFinal(ebitda);
    if(q('#fiEbitdaDelta')) q('#fiEbitdaDelta').textContent=`${d.margin.toFixed(1)}% margin`;
  };
  scenarioButtons.forEach(btn=>btn.addEventListener('click',()=>{
    scenarioButtons.forEach(b=>b.classList.toggle('active',b===btn));
    renderScenarioFinal(btn.dataset.scenario);
    announceFinal(`${btn.textContent.trim()} financial scenario selected`);
  }));
  renderScenarioFinal('base');

  /* Capital deployment */
  const capitalDataFinal={
    phase1:['PHASE 1 · FOUNDATION','Establish the operating base.','Land preparation, 1,000m² tunnels, Phase 1 water purification, 5kW solar, logistics and working capital.',['R4.85M|Capital','5 kW|Solar','10,000 L/day|Water','15 t/year|Production']],
    phase2:['PHASE 2 · SCALE-UP','Move from proof to commercial scale.','Expand production, water infrastructure, solar capacity, packhouse capability, logistics and market access.',['R4.50M|Capital','Scale|Production','Expanded|Water','Expanded|Solar']],
    phase3:['PHASE 3 · REGIONAL HUB','Build a replicable regional platform.','Develop regional distribution, institutional contracts, expanded infrastructure and the foundation for Eastern Cape replication.',['R3.15M|Capital','Regional|Distribution','2030|Replication','Multi-hub|Potential']]
  };
  const capitalButtons=replaceButtons('.capital-phase');
  const renderCapitalFinal=key=>{
    const d=capitalDataFinal[key], detail=q('#capitalDetail');
    if(!d || !detail)return;
    capitalButtons.forEach(b=>b.classList.toggle('active',b.dataset.capital===key));
    detail.innerHTML=`<span class="eyebrow">${d[0]}</span><h4>${d[1]}</h4><p>${d[2]}</p><div class="capital-detail-grid">${d[3].map(x=>{const [a,b]=x.split('|');return `<span><b>${a}</b>${b}</span>`}).join('')}</div>`;
    detail.classList.remove('capital-detail-refresh');
    requestAnimationFrame(()=>detail.classList.add('capital-detail-refresh'));
    announceFinal(`${d[0]} selected`);
  };
  capitalButtons.forEach(btn=>btn.addEventListener('click',()=>renderCapitalFinal(btn.dataset.capital)));
  renderCapitalFinal('phase1');

  /* Digital twin */
  const twinDataFinal={
    land:['LAND','Site preparation, production zoning and expansion capacity.','→ Operations + Technical Documentation'],
    water:['WATER','Storage, purification, rainwater harvesting and irrigation resilience.','→ Water SOPs + Technical Documentation'],
    energy:['SOLAR','Solar generation supporting pumping, purification and critical operations.','→ Energy scope + ESG'],
    grow:['GROW','Protected agriculture, open field production, herbs and seedlings.','→ Agriculture SOPs + Production scope'],
    harvest:['HARVEST','Harvest, packhouse handling, quality control and cold-chain preparation.','→ Harvest SOPs + Distribution'],
    market:['MARKET','Households, hospitality, schools, retailers and institutional buyers.','→ Market Research + Business Model'],
    community:['COMMUNITY','Jobs, youth training, food access and regional economic pathways.','→ ESG & Impact']
  };
  const twinButtons=replaceButtons('.dt-node');
  twinButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const d=twinDataFinal[btn.dataset.node];
    if(!d)return;
    twinButtons.forEach(b=>b.classList.toggle('active',b===btn));
    const r=q('#dtReadout');
    if(r)r.innerHTML=`<strong>${d[0]}</strong><span>${d[1]}</span><em>${d[2]}</em>`;
    announceFinal(`${d[0]} operating layer selected`);
  }));

  /* Roadmap */
  const roadmapDataFinal={
    2026:['2026 · PHASE 1','Infrastructure, solar, water and proof of concept.','Establish the productive operating base, secure water resilience, deploy Phase 1 solar and validate commercial demand.'],
    2027:['2027 · COMMERCIAL PRODUCTION','Commercial production and market validation.','Ramp production, develop household subscriptions and institutional sales while strengthening operating controls.'],
    2028:['2028 · EXPANSION','Scale the productive system.','Expand greenhouse capacity, water infrastructure, solar generation and packhouse capability.'],
    2029:['2029 · REGIONAL DISTRIBUTION','Open regional routes to market.','Develop institutional contracts, cold-chain capability, bulk water services and regional market access.'],
    2030:['2030 · EASTERN CAPE REPLICATION','Build the regional hub model.','Develop additional AgriHubs, agricultural partnerships, youth development pathways and regional expansion.']
  };
  const roadmapButtons=replaceButtons('.roadmap-node');
  roadmapButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const d=roadmapDataFinal[btn.dataset.year];
    if(!d)return;
    roadmapButtons.forEach(b=>b.classList.toggle('active',b===btn));
    roadmapButtons.forEach(b=>b.setAttribute('aria-selected',String(b===btn)));
    const r=q('#roadmapDetail');
    if(r)r.innerHTML=`<span class="eyebrow">${d[0]}</span><h4>${d[1]}</h4><p>${d[2]}</p>`;
    announceFinal(`${btn.dataset.year} roadmap milestone selected`);
  }));

  /* Investor presentation mode */
  const overlay=q('#investorModeOverlay');
  const openMode=()=>{
    if(!overlay)return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('presentation-dark');
    document.body.style.overflow='hidden';
    announceFinal('Investor presentation mode opened');
  };
  const closeMode=()=>{
    if(!overlay)return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('presentation-dark');
    document.body.style.overflow='';
    announceFinal('Investor presentation mode closed');
  };
  const modeBtn=q('#investorModeBtn');
  if(modeBtn){const c=modeBtn.cloneNode(true);modeBtn.replaceWith(c);c.addEventListener('click',openMode);}
  const closeBtn=q('#closeInvestorMode');
  if(closeBtn){const c=closeBtn.cloneNode(true);closeBtn.replaceWith(c);c.addEventListener('click',closeMode);}
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && overlay?.classList.contains('open'))closeMode();});

  /* Share view — works even when Clipboard API is unavailable */
  const shareBtn=q('#shareViewBtn');
  if(shareBtn){
    const c=shareBtn.cloneNode(true);shareBtn.replaceWith(c);
    c.addEventListener('click',async()=>{
      const url=`${location.origin}${location.pathname}?view=investor-intelligence#level3`;
      try{
        if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
        else {
          const ta=document.createElement('textarea'); ta.value=url; ta.style.position='fixed'; ta.style.opacity='0';
          document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        }
        c.textContent='Link Copied';
        announceFinal('Investor intelligence link copied');
        setTimeout(()=>{c.textContent='Share Investor View';},2200);
      }catch(err){
        window.prompt('Copy this investor view link:',url);
      }
    });
  }
})();
