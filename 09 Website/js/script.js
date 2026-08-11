document.addEventListener('DOMContentLoaded',()=>{
 const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
 const header=q('#topbar');
 const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('scrolled',scrollY>30);header.style.setProperty('--progress',h?`${scrollY/h*100}%`:'0%')};
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});qa('.reveal').forEach(x=>observer.observe(x));
 const chartObserver=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('chart-animated');if(e.target.classList.contains('kpi'))e.target.classList.add('metric-animated');if(e.target.classList.contains('funding-mix'))e.target.classList.add('mix-animated');}),{threshold:.28});
 qa('.chart-card,.kpi,.funding-mix').forEach(x=>chartObserver.observe(x));

 // Premium count-up animation for executive dashboard numbers.
 const countObserver=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting||e.target.dataset.counted)return;e.target.dataset.counted='true';const el=e.target,target=Number(el.dataset.target||0),dec=Number(el.dataset.decimals||0),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'',duration=1200,start=performance.now();const tick=now=>{const progress=Math.min((now-start)/duration,1),ease=1-Math.pow(1-progress,3),value=target*ease;el.textContent=prefix+value.toFixed(dec)+suffix;if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}),{threshold:.7});
 qa('.count-up').forEach(x=>countObserver.observe(x));
 qa('.columns i').forEach(x=>x.style.setProperty('--v',x.dataset.v));
 const stageData={
 seed:{title:'Seed & Nursery',intro:'Propagation establishes the biological starting point for reliable production and partner-grower supply.',scope:['Seed sourcing and varietal selection','Propagation environment and germination controls','Watering, nutrition and hardening','Seedling quality inspection and dispatch','Nursery inventory and batch traceability'],sop:'Receive seed → batch register → propagate → monitor germination → harden → inspect → dispatch.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs'},
 land:{title:'Land & Soil',intro:'The production footprint is prepared around crop suitability, water access, soil condition and expansion capacity.',scope:['Site preparation and access','Soil testing and amendment plan','Bed and field layout','Drainage and erosion controls','Crop rotation and land-use planning'],sop:'Survey → soil assessment → prepare → amend → establish beds → record field condition.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/10%20Technical%20Documentation'},
 water:{title:'Water Security',intro:'Water resilience combines harvesting, storage, purification and controlled distribution, with borehole development subject to feasibility and approvals.',scope:['Rainwater harvesting','Bulk storage and tank management','RO purification and quality controls','Pump and filtration maintenance','Water testing, logging and distribution'],sop:'Source → inspect → treat → test → store → distribute → record quality and volume.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs'},
 energy:{title:'Solar Energy',intro:'Solar generation supports pumping, irrigation, purification, cold-chain and critical operations while reducing grid exposure.',scope:['PV array and inverter systems','Battery and critical-load management','Solar water pumping','Irrigation power scheduling','Preventive inspection and servicing'],sop:'Inspect → isolate → monitor generation → prioritise critical loads → maintain → report.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/10%20Technical%20Documentation'},
 greenhouse:{title:'Protected Agriculture',intro:'Greenhouses and tunnels provide greater control over microclimate, production cycles and yield stability.',scope:['Tunnel/greenhouse layout','Irrigation and fertigation','Ventilation and environmental monitoring','Pest and disease controls','Crop scheduling and yield tracking'],sop:'Prepare → plant → irrigate/fertilise → monitor climate → scout → harvest → clean down.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs'},
 harvest:{title:'Harvest',intro:'Harvest operations convert production into saleable inventory while protecting quality and traceability.',scope:['Harvest maturity standards','Hygienic harvesting','Field crates and handling','Grading and rejection controls','Batch and traceability records'],sop:'Assess maturity → harvest → field-sort → crate → weigh → batch → move to packhouse.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs'},
 packhouse:{title:'Packhouse & Cold Chain',intro:'The packhouse protects product quality through controlled sorting, packing, storage and dispatch.',scope:['Receiving and intake checks','Sorting, grading and packing','Cold-room operation','Inventory rotation','Dispatch documentation'],sop:'Receive → inspect → grade → pack → chill/store → pick → dispatch.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/10%20Technical%20Documentation'},
 shelf:{title:'Distribution & Shelf',intro:'The final layer connects the AgriHub with households, schools, hospitality, retailers and institutional buyers.',scope:['Order capture and forecasting','Route planning','Vehicle and delivery controls','Customer confirmation','Returns and service-level tracking'],sop:'Order → consolidate → route → load → deliver → confirm → reconcile.',git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/11%20SOPs'}
 };
 const modal=q('#stageModal');
 qa('.stage').forEach(btn=>btn.addEventListener('click',()=>{const d=stageData[btn.dataset.stage];q('#modalTitle').textContent=d.title;q('#modalIntro').textContent=d.intro;q('#modalScope').innerHTML=d.scope.map(x=>`<li>${x}</li>`).join('');q('#modalSop').textContent=d.sop;q('#modalGit').href=d.git;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}));
 const closeStage=()=>{if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''};q('#closeModal')?.addEventListener('click',closeStage);q('#closeModal2')?.addEventListener('click',closeStage);modal?.addEventListener('click',e=>{if(e.target===modal)closeStage()});
 const phaseData={
  1:{title:'Phase 1 · Foundation & Proof-of-Concept',intro:'Establish the productive operating base and prove the integrated food, water and energy model.',amount:'R4.85M',scope:['Land preparation, fencing and soil establishment','1,000m² multi-span tunnels with micro-drip irrigation','10,000 L/day RO purification, rainwater catchment and storage','5 kW hybrid solar array for pumping and primary irrigation','Delivery vehicle, cold room and initial logistics','6–8 month working-capital and operating reserve'],outputs:'Establish production capacity → secure water → stabilise energy → launch market access → reach operational breakeven target.',stats:[['Solar','5 kW'],['Water','10,000 L/day'],['Production','15 t/year']],git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/05%20Financial%20Model'},
  2:{title:'Phase 2 · Commercial Scale-Up',intro:'Move from pilot operations into a larger commercial production and distribution platform using retained earnings and matched growth finance.',amount:'R4.50M',scope:['Additional 2,000m² shade cloth and tunnel structures','RO upgrade to 25,000 L/day with 50kL bulk storage','25 kW PV array and lithium storage for critical loads','Dedicated packhouse and two distribution vehicles','Working capital for inventory, packaging and personnel'],outputs:'Increase production volume → strengthen cold chain → expand institutional sales → improve unit economics → build regional distribution capability.',stats:[['Solar','25 kW'],['Water','25,000 L/day'],['Expansion','2,000m²']],git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/05%20Financial%20Model'},
  3:{title:'Phase 3 · Regional Hub Maturity',intro:'Build the AgriHub into a regional platform capable of higher-value production, bulk distribution and replication across the Eastern Cape.',amount:'R3.15M',scope:['Controlled-environment hydroponic systems for high-value herbs','75 kW total solar capacity for deeper energy self-sufficiency','Bulk water tanker trailer and institutional supply lines','Commercial seedling nursery expansion','Post-harvest and regional distribution capability'],outputs:'Reach institutional scale → diversify high-value production → expand water services → supply partner growers → prepare replication model.',stats:[['Solar','75 kW'],['Water','Regional'],['Nursery','Commercial']],git:'https://github.com/Qamataomkhulu/Garden-Route/tree/main/05%20Financial%20Model'}
 };
 const phaseModal=q('#phaseModal');
 const openPhase=id=>{const d=phaseData[id];if(!d)return;q('#phaseTitle').textContent=d.title;q('#phaseIntro').textContent=d.intro;q('#phaseAmount').textContent=d.amount;q('#phaseScope').innerHTML=d.scope.map(x=>`<li>${x}</li>`).join('');q('#phaseOutputs').textContent=d.outputs;q('#phaseStats').innerHTML=d.stats.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');q('#phaseGit').href=d.git;phaseModal.classList.add('open');phaseModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
 qa('.phase-button').forEach(btn=>{const open=()=>openPhase(btn.dataset.phase);btn.addEventListener('click',open);btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
 const closePhase=()=>{if(!phaseModal)return;phaseModal.classList.remove('open');phaseModal.setAttribute('aria-hidden','true');document.body.style.overflow=''};q('#closePhase')?.addEventListener('click',closePhase);q('#closePhase2')?.addEventListener('click',closePhase);phaseModal?.addEventListener('click',e=>{if(e.target===phaseModal)closePhase()});

 // Investor Portal cards are intentionally direct GitHub links. This avoids broken iframe
 // behaviour caused by GitHub's frame/security headers while keeping the website as the
 // presentation layer and GitHub as the transparent source-documentation layer.
 qa('.doc-card').forEach(card=>{
   card.addEventListener('click',()=>card.classList.add('visited'));
 });

 const docModal=q('#docModal'), frame=q('#docFrame'), docOpen=q('#docOpen');
 const closeDoc=()=>{
   if(!docModal)return;
   docModal.classList.remove('open');
   docModal.setAttribute('aria-hidden','true');
   if(frame)frame.src='about:blank';
   document.body.style.overflow='';
 };
 if(docModal){
   q('#closeDoc')?.addEventListener('click',closeDoc);
   q('#docClose2')?.addEventListener('click',closeDoc);
   docModal.addEventListener('click',e=>{if(e.target===docModal)closeDoc()});
 }
 addEventListener('keydown',e=>{if(e.key==='Escape'){closeStage();closePhase();closeDoc()}});
 const menu=q('.menu');menu?.addEventListener('click',()=>{const n=q('nav');n.style.display=n.style.display==='flex'?'none':'flex';n.style.position='absolute';n.style.top='78px';n.style.left='0';n.style.right='0';n.style.padding='20px';n.style.background='var(--paper)';n.style.flexDirection='column';n.style.boxShadow='0 20px 40px rgba(0,0,0,.1)'});
});
