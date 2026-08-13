
/**
 * Garden Route Integrated AgriHub
 * Garden Route AgriHub — narrative, charts, investor intelligence,
 * document viewer, accessibility and responsive interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const live = $('#liveRegion');

  const announce = (message) => {
    if (!live) return;
    live.textContent = '';
    window.setTimeout(() => { live.textContent = message; }, 20);
  };

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const header = $('#topbar');
  const backTop = $('#backTop');

  function updateScrollUI() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty('--scroll-progress', `${max > 0 ? (y / max) * 100 : 0}%`);
    }
    if (backTop) backTop.classList.toggle('visible', y > window.innerHeight * .65);
  }
  window.addEventListener('scroll', updateScrollUI, { passive:true });
  updateScrollUI();

  backTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  const menu = $('.menu');
  menu?.addEventListener('click', () => {
    header?.classList.toggle('nav-open');
    menu.classList.toggle('open');
    menu.textContent = header?.classList.contains('nav-open') ? 'Close' : 'Menu';
    menu.setAttribute('aria-expanded', String(header?.classList.contains('nav-open')));
  });
  $$('nav a').forEach(a => a.addEventListener('click', () => {
    header?.classList.remove('nav-open');
    menu?.classList.remove('open');
    if (menu) menu.textContent = 'Menu';
  }));

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header?.offsetHeight || 80) + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior:'smooth' });
    });
  });

  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('agrihub-theme');
  if (savedTheme === 'dark') document.body.classList.add('theme-dark');

  function syncThemeButton() {
    if (!themeToggle) return;
    const dark = document.body.classList.contains('theme-dark');
    themeToggle.textContent = dark ? 'L' : 'D';
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  syncThemeButton();
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    localStorage.setItem('agrihub-theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    syncThemeButton();
    announce(document.body.classList.contains('theme-dark') ? 'Dark mode enabled' : 'Light mode enabled');
  });

  function animateValue(el, target, duration=1100, formatter=n => n.toLocaleString()) {
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1-progress, 3);
      el.textContent = formatter(from + (target-from) * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const countEls = $$('.count-up[data-target]');
  if ('IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const decimals = Number(el.dataset.decimals || 0);
        animateValue(el, target, 1200, value => `${prefix}${value.toFixed(decimals)}${suffix}`);
        const line = el.parentElement?.querySelector('.metric-line i');
        if (line) line.style.width = '100%';
        observer.unobserve(el);
      });
    }, {threshold:.45});
    countEls.forEach(el => countObs.observe(el));
  }

  $$('.chart-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.chart-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected','false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      $$('.chart-view').forEach(v => v.classList.add('is-hidden'));
      $(`.${tab.dataset.view}-view`)?.classList.remove('is-hidden');
      announce(`${tab.textContent.trim()} dashboard selected`);
    });
  });

  $('#exportDashboard')?.addEventListener('click', () => {
    const rows = [
      ['Metric','Year 1','Year 5'],
      ['Revenue (ZAR)','3,074,000','36,220,000'],
      ['EBITDA margin','29.1%','42.0%'],
      ['Vegetables (tonnes)','15','100+'],
      ['Water distribution (L)','100,000','5,000,000'],
      ['Solar capacity (kW)','5','75'],
      ['Direct jobs','5','20–30'],
      ['Households served','30','300+']
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'garden-route-agrihub-dashboard.csv'; a.click();
    URL.revokeObjectURL(url);
    announce('Dashboard CSV exported');
  });

  $('#printDashboard')?.addEventListener('click', () => window.print());

  const scenarioInvestment = $('#scenarioInvestment');
  function updateScenario() {
    if (!scenarioInvestment) return;
    const amount = Number(scenarioInvestment.value);
    const share = amount / 12500000;
    const revenue = amount / 12500000 * 36220000;
    const ebitda = revenue * .42;
    const money = n => `R${Math.round(n).toLocaleString('en-ZA')}`;
    $('#scenarioAmount').textContent = money(amount);
    $('#scenarioShare').textContent = `${(share*100).toFixed(1)}%`;
    $('#scenarioRevenue').textContent = money(revenue);
    $('#scenarioEbitda').textContent = money(ebitda);
  }
  scenarioInvestment?.addEventListener('input', updateScenario);
  updateScenario();

  const docCards = $$('.doc-card');
  const docSearch = $('#docSearch');
  const docFilters = $$('.doc-filter');

  function filterDocuments() {
    const active = $('.doc-filter.active')?.dataset.filter || 'all';
    const q = (docSearch?.value || '').trim().toLowerCase();
    docCards.forEach(card => {
      const categoryOk = active === 'all' || card.dataset.category === active;
      const searchText = `${card.dataset.title || ''} ${card.textContent}`.toLowerCase();
      const searchOk = !q || searchText.includes(q);
      card.classList.toggle('hidden', !(categoryOk && searchOk));
    });
  }
  docFilters.forEach(btn => btn.addEventListener('click', () => {
    docFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterDocuments();
  }));
  docSearch?.addEventListener('input', filterDocuments);

  const docModal = $('#docModal');
  const docRender = $('#docRender');
  const docTitle = $('#docTitle');
  const docOpen = $('#docOpen');

  function githubRawUrl(path) {
    return `https://raw.githubusercontent.com/Qamataomkhulu/Garden-Route/main/${path}`;
  }
  function githubBlobUrl(path) {
    return `https://github.com/Qamataomkhulu/Garden-Route/blob/main/${path}`;
  }
  function simpleMarkdown(md) {
    return md
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/^### (.*)$/gm,'<h3>$1</h3>')
      .replace(/^## (.*)$/gm,'<h2>$1</h2>')
      .replace(/^# (.*)$/gm,'<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/^\s*[-*]\s+(.*)$/gm,'<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs,'<ul>$1</ul>')
      .replace(/\n{2,}/g,'</p><p>')
      .replace(/^(?!<h|<ul|<p|<\/p>)/gm,'<p>')
      .replace(/(?<!>)$/gm,'</p>');
  }
  async function openDocument(card) {
    const path = card.dataset.doc;
    const label = card.dataset.label || card.querySelector('strong')?.textContent || 'Project Document';
    if (!path || !docModal) return;
    docModal.classList.add('open');
    docModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    docTitle.textContent = label;
    docRender.innerHTML = '<div class="doc-loading">Loading document…</div>';
    docOpen.href = githubBlobUrl(path);
    announce(`Opening ${label}`);
    try {
      const response = await fetch(githubRawUrl(path), {cache:'no-store'});
      if (!response.ok) throw new Error(`Document returned ${response.status}`);
      const md = await response.text();
      if (window.marked?.parse) {
        docRender.innerHTML = window.marked.parse(md);
      } else {
        docRender.innerHTML = simpleMarkdown(md);
      }
    } catch (err) {
      docRender.innerHTML = `<div class="doc-loading"><strong>Document preview unavailable.</strong><p>${err.message}</p><p>The original source is still available through the GitHub button below.</p></div>`;
    }
  }
  docCards.forEach(card => card.addEventListener('click', () => openDocument(card)));

  function closeDoc() {
    docModal?.classList.remove('open');
    docModal?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  $('#closeDoc')?.addEventListener('click', closeDoc);
  $('#docClose2')?.addEventListener('click', closeDoc);

  const stageData = {
    seed:{title:'Seed & Nursery',intro:'Propagation creates a reliable starting point for AgriHub production and partner growers.',scope:['Seed selection and traceability','Propagation and germination','Hardening and nursery scheduling','Dispatch and grower coordination'],sop:'Nursery hygiene → propagation → irrigation → hardening → quality check → dispatch',git:'10%20Technical%20Documentation/Technical%20Documentation.md'},
    land:{title:'Land & Soil',intro:'The productive footprint establishes the physical base for open-field production, protected agriculture and future expansion.',scope:['Land assessment and zoning','Soil testing and fertility planning','Drainage and access','Irrigation layout and production zoning'],sop:'Site assessment → soil test → preparation → zoning → planting plan → monitoring',git:'10%20Technical%20Documentation/Technical%20Documentation.md'},
    water:{title:'Water Security',intro:'Water resilience protects production continuity while creating the basis for future purification and distribution services.',scope:['Rainwater harvesting','Storage and tank management','Purification and treatment','Distribution and quality monitoring'],sop:'Source → capture → store → treat → test → distribute',git:'10%20Technical%20Documentation/Technical%20Documentation.md'},
    energy:{title:'Solar Energy',intro:'Solar-supported infrastructure is intended to power pumping, irrigation and critical operating loads.',scope:['Solar generation','Pump integration','Irrigation controls','Energy monitoring and maintenance'],sop:'Generate → condition → pump → irrigate → monitor → maintain',git:'10%20Technical%20Documentation/Technical%20Documentation.md'},
    greenhouse:{title:'Protected Agriculture',intro:'Protected cultivation provides a more controlled production environment and supports yield stability.',scope:['Tunnel/greenhouse preparation','Climate and irrigation control','Crop scheduling','Pest and quality monitoring'],sop:'Prepare → plant → irrigate → monitor → harvest → sanitation',git:'11%20SOPs/SOP%20Register.md'},
    harvest:{title:'Harvest',intro:'Post-harvest handling protects quality, reduces losses and creates traceability before products enter distribution.',scope:['Harvest scheduling','Grading and quality control','Traceability','Cold-chain handoff'],sop:'Harvest → inspect → grade → record → stage → dispatch',git:'11%20SOPs/SOP%20Register.md'},
    packhouse:{title:'Packhouse',intro:'The packhouse converts harvested production into consistent market-ready units.',scope:['Sorting and packing','Inventory control','Cold-chain preparation','Dispatch documentation'],sop:'Receive → sort → pack → label → chill → dispatch',git:'11%20SOPs/SOP%20Register.md'},
    shelf:{title:'Distribution & Shelf',intro:'The final layer connects AgriHub production with households, institutions, hospitality and retail channels.',scope:['Route planning','Customer order management','Delivery scheduling','Market feedback and reconciliation'],sop:'Order → allocate → pick → route → deliver → reconcile',git:'BUSINESS_MODEL.md'}
  };
  const stageModal = $('#stageModal');
  $$('.stage').forEach(stage => stage.addEventListener('click', () => {
    const d = stageData[stage.dataset.stage];
    if (!d || !stageModal) return;
    $('#modalTitle').textContent = d.title;
    $('#modalIntro').textContent = d.intro;
    $('#modalScope').innerHTML = d.scope.map(x => `<li>${x}</li>`).join('');
    $('#modalSop').textContent = d.sop;
    $('#modalGit').href = githubBlobUrl(d.git);
    stageModal.classList.add('open');
    stageModal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    announce(`${d.title} technical scope opened`);
  }));
  function closeStage(){ stageModal?.classList.remove('open'); stageModal?.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  $('#closeModal')?.addEventListener('click',closeStage);
  $('#closeModal2')?.addEventListener('click',closeStage);

  const roadmapData = {
    2026:['2026 · PHASE 1','Infrastructure, solar, water and proof of concept.','Establish the productive operating base, secure water resilience, deploy Phase 1 solar and validate commercial demand.'],
    2027:['2027 · COMMERCIAL PRODUCTION','Production ramp-up and market validation.','Increase production, activate household subscriptions and institutional sales while strengthening operating procedures.'],
    2028:['2028 · EXPANSION','Capacity and infrastructure expansion.','Expand protected agriculture, water infrastructure, solar capacity and post-harvest capability.'],
    2029:['2029 · REGIONAL DISTRIBUTION','Regional routes to market.','Build institutional contracts, cold-chain capability, bulk water services and regional market access.'],
    2030:['2030 · EASTERN CAPE REPLICATION','Replicate the operating model.','Extend the AgriHub architecture through agricultural partnerships, youth development and additional regional hubs.']
  };
  $$('.roadmap-node').forEach(node => node.addEventListener('click', () => {
    $$('.roadmap-node').forEach(n => {n.classList.remove('active');n.setAttribute('aria-selected','false')});
    node.classList.add('active'); node.setAttribute('aria-selected','true');
    const d=roadmapData[node.dataset.year];
    const panel=$('#roadmapDetail');
    if (panel && d) panel.innerHTML=`<span class="eyebrow">${d[0]}</span><h4>${d[1]}</h4><p>${d[2]}</p>`;
  }));

  const capitalData = {
    phase1:['PHASE 1 · FOUNDATION','Establish the operating base.','Land preparation, 1,000m² tunnels, Phase 1 water purification, 5kW solar, logistics and working capital.',['R4.85M|Capital','5 kW|Solar','10,000 L/day|Water','15 t/year|Production']],
    phase2:['PHASE 2 · SCALE-UP','Convert proof of concept into commercial capacity.','Production expansion, water and solar capacity, distribution capability and working capital to support commercial scale.',['R4.50M|Capital','25 kW|Solar target','1M L/year|Water target','55 t/year|Production target']],
    phase3:['PHASE 3 · REGIONAL HUB','Build regional market access and replication capability.','Regional market access, logistics, replication planning and infrastructure that supports the Eastern Cape expansion thesis.',['R3.15M|Capital','75 kW|Solar target','5M L/year|Water target','100+ t/year|Production target']]
  };
  $$('.capital-phase').forEach(btn => btn.addEventListener('click', () => {
    $$('.capital-phase').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const d=capitalData[btn.dataset.capital], panel=$('#capitalDetail');
    if (!d || !panel) return;
    panel.innerHTML=`<span class="eyebrow">${d[0]}</span><h4>${d[1]}</h4><p>${d[2]}</p><div class="capital-detail-grid">${d[3].map(x=>{const [a,b]=x.split('|');return `<span><b>${a}</b>${b}</span>`}).join('')}</div>`;
    announce(`${d[0]} capital deployment selected`);
  }));

  const decisions = {
    opportunity:['01 · OPPORTUNITY','One ecosystem. Multiple resilience layers.','Food production, water, energy and market access are designed as connected commercial layers rather than isolated projects.',['Food security','Water resilience','Energy resilience','Economic opportunity'],'5','resilience layers','food · water · energy · market · community'],
    money:['02 · MONEY','Build revenue through diversification.','Multiple operating streams are intended to reduce dependence on a single crop, customer or service layer.',['Vegetables','Water services','Wholesale produce','Greenhouses'],'8','revenue streams','diversified commercial model'],
    capital:['03 · CAPITAL','Deploy capital against milestones.','The R12.50M model is structured across Foundation, Scale-up and Regional Hub phases so infrastructure expands alongside validated demand.',['Foundation','Scale-up','Regional Hub'],'3','capital phases','R4.85M · R4.50M · R3.15M'],
    future:['04 · FUTURE','Design for replication.','The five-year roadmap moves from proof of concept to commercial production, regional distribution and Eastern Cape replication.',['2026 foundation','2028 expansion','2030 replication'],'5','development years','2026 → 2030'],
    verify:['05 · VERIFY','Make the evidence inspectable.','The public site presents the story while source-linked documentation provides the underlying model, technical scope, SOP and governance layers.',['Financial model','Technical documentation','SOP library','ESG & governance'],'85%','presentation readiness','independent diligence remains essential']
  };
  $$('.decision-card').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.decision-card').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const d=decisions[btn.dataset.decision]; if(!d)return;
    $('#decisionEyebrow').textContent=d[0];$('#decisionTitle').textContent=d[1];$('#decisionText').textContent=d[2];
    $('#decisionPoints').innerHTML=d[3].map(x=>`<span>${x}</span>`).join('');
    $('#decisionMetric').innerHTML=`<strong>${d[4]}</strong><span>${d[5]}</span><em>${d[6]}</em>`;
  }));

  const scenarios = {
    base:{revenue:36.22,ebitda:15.20,margin:'42.0%',years:[3.074,6.70,14.09,22.70,36.22],note:'Current model'},
    conservative:{revenue:28.40,ebitda:10.80,margin:'38.0%',years:[3.074,5.80,10.80,18.20,28.40],note:'Illustrative downside planning view'},
    growth:{revenue:45.80,ebitda:20.60,margin:'45.0%',years:[3.074,7.80,17.60,29.80,45.80],note:'Illustrative upside planning view'}
  };
  function renderScenario(key){
    const d=scenarios[key]||scenarios.base;
    $('#fiRevenue').textContent=`R${d.revenue.toFixed(2)}M`;
    $('#fiEbitda').textContent=`R${d.ebitda.toFixed(2)}M`;
    $('#fiEbitdaDelta').textContent=`${d.margin} margin`;
    $('#fiRevenueDelta').textContent=d.note;
    const wrap=$('#fiChartBars');
    if(!wrap)return;
    wrap.innerHTML=d.years.map((v,i)=>`<div class="fi-bar" style="height:${Math.max(5,(v/40)*100)}%" data-label="Y${i+1} · R${v.toFixed(2)}M" title="Y${i+1} · R${v.toFixed(2)}M"></div>`).join('');
  }
  $$('.scenario-tab').forEach(tab=>tab.addEventListener('click',()=>{
    $$('.scenario-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');renderScenario(tab.dataset.scenario);
  }));
  renderScenario('base');

  const mapText = {
    hub:'Core operating hub connecting land, water, energy, production and distribution.',
    water:'Water layer: capture, storage, treatment and distribution supporting production resilience.',
    market:'Market layer: households, institutions, hospitality, retail and future regional routes.',
    expansion:'Expansion layer: additional production capacity and future Eastern Cape replication.'
  };
  $$('.map-layer').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.map-layer').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false')});
    btn.classList.add('active');btn.setAttribute('aria-selected','true');
    if($('#mapLayerText'))$('#mapLayerText').textContent=mapText[btn.dataset.layer]||'';
  }));

  const twin = {
    land:['LAND','Site preparation, production zoning and expansion capacity.','→ Operations + Technical Documentation'],
    water:['WATER','Storage, purification, irrigation resilience and future distribution services.','→ Technical Documentation + SOP Library'],
    energy:['SOLAR','Solar-supported pumping, irrigation and critical operating loads.','→ Technical Documentation + SOP Library'],
    grow:['GROW','Protected and open-field cultivation with crop planning and monitoring.','→ Operations + SOP Library'],
    harvest:['HARVEST','Quality control, grading, traceability and cold-chain handoff.','→ SOP Library'],
    market:['MARKET','Routes to households, institutions, hospitality, retail and regional buyers.','→ Business Model + Market Research'],
    community:['COMMUNITY','Jobs, youth training, food access and local economic pathways.','→ ESG & Impact']
  };
  $$('.dt-node').forEach(btn=>btn.addEventListener('click',()=>{
    $$('.dt-node').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const d=twin[btn.dataset.node]; if(!d)return;
    $('#dtReadout').innerHTML=`<strong>${d[0]}</strong><span>${d[1]}</span><em>${d[2]}</em>`;
  }));

  const overlay=$('#investorModeOverlay');
  $('#investorModeBtn')?.addEventListener('click',()=>{
    overlay?.classList.add('open');overlay?.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  });
  function closeInvestorMode(){overlay?.classList.remove('open');overlay?.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  $('#closeInvestorMode')?.addEventListener('click',closeInvestorMode);
  $('#shareViewBtn')?.addEventListener('click',async()=>{
    const url=`${location.origin}${location.pathname}#level3`;
    try{await navigator.clipboard.writeText(url);announce('Investor view link copied');}
    catch{window.prompt('Copy investor view link:',url);}
  });

  $('#investorForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const form=e.currentTarget;
    const status=$('#formStatus');
    const data=new FormData(form);
    const name=String(data.get('name')||'').trim();
    const email=String(data.get('email')||'').trim();
    if(!name || !email || !email.includes('@')){
      if(status)status.textContent='Please provide a name and valid email address.';
      announce('Please complete the required fields');
      return;
    }
    const subject=encodeURIComponent(`Garden Route AgriHub enquiry — ${data.get('interest')}`);
    const body=encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nOrganisation: ${data.get('organisation')||''}\nInterest: ${data.get('interest')||''}\n\n${data.get('message')||''}`
    );
    window.location.href=`mailto:iambandile@icloud.com?subject=${subject}&body=${body}`;
    if(status)status.textContent='Your email client should open with the enquiry prepared.';
  });

  document.addEventListener('keydown',e=>{
    if(e.key !== 'Escape') return;
    closeDoc(); closeStage(); closeInvestorMode();
  });
  [docModal,stageModal].forEach(modal=>{
    modal?.addEventListener('click',e=>{if(e.target===modal){modal===docModal?closeDoc():closeStage();}});
  });

  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const heroBg=$('.hero-bg');
    let ticking=false;
    window.addEventListener('scroll',()=>{
      if(ticking)return;
      requestAnimationFrame(()=>{
        if(heroBg)heroBg.style.transform=`translateY(${window.scrollY*.08}px) scale(1.04)`;
        ticking=false;
      });
      ticking=true;
    },{passive:true});
  }

  $$('.decision-card,.roadmap-node,.map-layer,.chart-tab').forEach(el=>{
    if(el.tagName==='BUTTON' && !el.hasAttribute('aria-label')) el.setAttribute('aria-label',el.textContent.trim());
  });

  window.__agrihub = {
    version:'2.0-review-build',
    openDocument,
    renderScenario,
    closeInvestorMode
  };
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Garden-Route/sw.js', { scope: '/Garden-Route/' }).catch(() => {});
  });
}
