(function(){
const D=window.DATA, $=s=>document.querySelector(s), page=$('#page'), nav=$('#nav');
const icons=['◔','👥','🛡','☁','↗','🏛','🖥','⚖','📋','🔔'];
const e=(h)=>h; const num=n=>n==null?'—':n.toLocaleString('en-US');
D.screens.forEach((s,i)=>{const a=document.createElement('a');a.dataset.id=s.id;a.href='#'+s.id;
 a.innerHTML=`<i>${i+1}</i>${s.nav}${s.id==='alerts'?'<b>25</b>':''}`;nav.appendChild(a)});
function spark(seed){let p=[],y=20,r=seed*9301+49297;for(let i=0;i<=12;i++){r=(r*9301+49297)%233280;y=Math.max(6,Math.min(34,y+(r/233280-.42)*10));p.push([i*10,y])}
 const l=p.map(q=>q.join(',')).join(' ');return `<svg class="spark" viewBox="0 0 120 40" preserveAspectRatio="none"><polygon points="0,40 ${l} 120,40" fill="#2e9b7222"/><polyline points="${l}" fill="none" stroke="#2e9b72" stroke-width="1.5"/></svg>`}
const badge={ok:'✓ On / above target',watch:'⚠ Watch',off:'⚠ Off target',none:'— Target not set'};
function card(k,i){
 let bar='';if(k.progress){const[v,t]=k.progress.split(' / target ').map(Number);bar=`<div class="bar"><b style="width:${Math.min(100,v/t*(t>v?100:68))}%"></b><u style="left:${t>v?100:68}%"></u></div><div class="note">${k.progress.replace(' / ',' · ')}</div>`}
 const tags=k.tags.map(t=>`<span class="${t.includes('ILLUSTRATIVE')?'ILL':t.includes('VERIFIED')?'VER':''}">${t}</span>`).join('');
 return `<div class="card ${k.status}"><div class="t"><span>${k.title}</span><span class="badge">${badge[k.status]}</span></div>
 <div class="v">${k.value}</div>${k.delta?`<div class="d ${k.dir}">${k.delta}</div>`:''}<div class="note">${k.screen!=='cockpit'?'Filtered view · 431 MSMEs represented · 2.3% of portfolio':''}${k.note&&k.screen==='cockpit'?k.note:''}</div>${k.note&&k.screen!=='cockpit'?`<div class="note">${k.note}</div>`:''}${bar}${k.spark?spark(i+3):''}<div class="tg">${tags}</div></div>`}
const panel=(t,s,b,demo=true)=>`<div class="panel"><div class="ph"><div><b>${t}</b><small>${s||''}</small></div>${demo?'<span class="badge">◌ DEMO DATA</span>':''}</div>${b}</div>`;
const fun=(a,k='value')=>{const m=Math.max(...a.map(x=>x[k]));return a.map(x=>`<div class="frow"><div><span>${x.label}</span><b>${num(x[k])}</b></div><div class="tr"><b style="width:${x[k]/m*100}%"></b></div><small>${x.sub||''} ${x.pct?'· '+x.pct:''}</small></div>`).join('')};
const alerts=a=>a.map(x=>`<div class="al"><b>ⓘ ${x.title}</b><p>${x.text}</p><small>Owner <b style="display:inline">${x.owner}</b>${x.due?' · Due '+x.due:''}</small></div>`).join('');
const map=()=>{const max=3785;return '<div class="map">'+D.map.map(m=>`<div class="${m.value>1500?'h':m.value>600?'m':''}">${m.code}<br>${m.value==null?'—':num(m.value)}</div>`).join('')+'</div><p class="note">Hover a state for detail; click to filter every screen by that state. States show gap to plan and ranges — never ranked best to worst.</p>'};
const rows=(a,cols)=>`<table>${a.map(x=>`<tr>${cols.map(c=>`<td>${x[c]}</td>`).join('')}</tr>`).join('')}</table>`;
const extra={
cockpit:()=>`<div class="grid g3" style="margin-top:12px">${panel('Malaysia impact map','Reach and financing, with gap to plan by state','<span class="pill on">MSMEs supported</span><span class="pill">Financing enabled</span><span class="pill">Bumiputera share</span><span class="pill">Women-owned share</span>'+map())}
 ${panel('Financial inclusion & additionality funnel','Assessed → constrained → CGC-supported → financed → additional',fun(D.funnel))}
 ${panel('Executive alerts','Exceptions requiring Board or management attention',alerts(D.alerts)+'<small>25 open alerts</small>',false)}</div>`,
inclusion:()=>`<div class="grid g31" style="margin-top:12px">${panel('Inclusion funnel','',fun(D.funnel))}${panel('Who is being reached','',D.segments.map(s=>`<div class="frow"><div><span>${s.label}</span><b>${s.pct}%</b></div><div class="tr"><b style="width:${s.pct}%"></b></div><small>${s.count}</small></div>`).join(''))}${panel('Graduation pathway','Cohort transitions since support','<p class="note">CGC-guaranteed → Independently bankable: <b>154 MSMEs · 37.3%</b></p><p class="note">Graduation to independent bankability is the clearest evidence that additionality is working: 154 MSMEs obtained unguaranteed commercial financing within 24 months of CGC support.</p>')}</div><div style="margin-top:12px">${panel('Where inclusion is happening','State reach with gap to plan — states are never ranked best to worst',map())}</div>`,
pfi:()=>`<div class="grid g2" style="margin-top:12px">${panel('Allocation and utilisation by PFI','Contract allocation against approved guaranteed financing',D.pfi.map(p=>`<div class="frow"><div><span>${p.name}</span><b>${p.util}%</b></div><div class="tr"><b style="width:${p.target}%;background:#c9d3e0"></b></div><div class="rag"><b style="width:${p.util*3}%;background:var(--amber)"></b></div></div>`).join('')+'<p class="note">Amber bars sit below 85% of target. PFIs are not ranked.</p>')}
 ${panel('Partnership quality, not a league table','Measures switch with the lens; peer ranges shown, never rankings','<table><tr><th>PFI</th><th>UTILISATION</th><th>CONTRACT TARGET</th><th>% OF TARGET</th></tr>'+D.pfi.map(p=>`<tr><td>${p.name}</td><td>${p.util}%</td><td>${p.target}%</td><td>${p.pct}%</td></tr>`).join('')+'<tr><td>Peer range</td><td>0.7% – 15%</td><td>66% – 70%</td><td>1% – 22%</td></tr></table><p class="note">A low claims rate alongside low underserved reach can indicate risk selection rather than strong performance.</p>')}</div>`,
imsme:()=>`<div class="grid g2" style="margin-top:12px">${panel('imSME conversion funnel','Visits through to approved financing',fun(D.imfunnel.map(x=>({...x,sub:''}))))}
 ${panel('Service performance against published benchmarks','Current demo values beside CGC\'s 2024 reported actuals and published targets','<table><tr><th>MEASURE</th><th>CURRENT (DEMO)</th><th>PUBLISHED BENCHMARK</th><th>2024 ACTUAL</th></tr>'+D.benchmarks.map(b=>`<tr><td>${b.measure}</td><td style="color:var(--green)">${b.current}</td><td>${b.benchmark}</td><td>${b.actual}</td></tr>`).join('')+'</table><p class="note">2024 figures are verified historical baselines from CGC reporting and must not be presented as 2026 results.</p>',false)}</div>`,
gov:()=>`<div class="grid g3" style="margin-top:12px">${panel('Financial sustainability & guarantee risk','Capital and claims performance against historical baselines',D.gov.map(g=>`<div class="frow"><div><b>${g.label}</b><b style="color:#a9685a;font-size:16px">${g.value}</b></div><small>${g.note}</small></div>`).join(''))}
 ${panel('Control exceptions','Open items and those past their due date','<table><tr><th>EXCEPTION TYPE</th><th>OPEN</th><th>OVERDUE</th></tr>'+D.exceptions.map(x=>`<tr><td>${x.type}</td><td>${x.open}</td><td class="${x.overdue?'r':''}">${x.overdue}</td></tr>`).join('')+'</table>',false)}
 ${panel('Board attention queue','All open exceptions with owner and due date',alerts(D.alerts),false)}</div>`,
people:()=>`<div class="grid g3" style="margin-top:12px">${panel('NSRF / IFRS S1-S2 disclosure readiness','Readiness by disclosure pillar, with the binding gap named',D.disclosure.map(d=>`<div class="frow"><div><span>${d.pillar}</span><b>${d.pct}%</b></div><div class="rag"><b style="width:${d.pct}%;background:${d.pct>75?'var(--green)':d.pct>50?'#b07a62':'var(--red)'}"></b></div><small>${d.note}</small></div>`).join(''))}
 ${panel('ESG data reliability','The foundation under every other screen','<div style="display:flex;gap:14px;align-items:center"><div class="ring"><span>77%</span></div><div><b>77% data completeness</b><br><small>46 of 198 reportable fields incomplete</small></div></div><table><tr><td>Evidence 0-90 days old</td><td>68%</td></tr><tr><td>Evidence older than 180 days</td><td>11%</td></tr><tr><td>KPIs mapped to a framework</td><td>88%</td></tr></table><p class="note">Assurance covers 24 of 142 KPIs — the constraint on external reporting.</p>',false)}
 ${panel('Own operations footprint','CGC\'s direct environmental data',D.ops.map(o=>`<div class="frow"><div><span>${o.label}</span><b>${o.value}</b></div><small>${o.yoy}</small></div>`).join(''))}</div>`,
alerts:()=>`<div style="margin-top:12px">${panel('Open alerts','25 open alerts',alerts(D.alerts),false)}</div>`};
function render(){
 const id=(location.hash||'#cockpit').slice(1), s=D.screens.find(x=>x.id===id)||D.screens[0];
 nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.dataset.id===s.id));
 const ks=D.kpis.filter(k=>k.screen===s.id), c=s.id==='cockpit';
 page.innerHTML=`<div class="head"><div><div class="crumb">Board Cockpit${c?'':' › '+s.title}</div><h1>${s.title}</h1><p>${s.desc}</p><div class="lens">${s.lens}</div></div>
 <div class="ctl"><div class="period"><small>PERIOD</small>YTD 2026</div><div class="tabs"><span class="on">Performance</span><span>Impact</span><span>Risk</span><span>Data quality</span></div><button class="period">☰ Portfolio filters${s.filter?' <b>1</b>':''}</button></div></div>
 ${s.filter?`<div class="filters">Active filters: <span class="chip">State / region: ${s.filter} ✕</span> <a href="#" id="clr">Clear all</a></div>`:''}
 ${c?'<div class="grid g3" style="margin-top:14px">'+ks.map(card).join('')+'</div>'+extra.cockpit():''}
 ${!c&&extra[s.id]&&s.id!=='ccpt'&&s.id!=='impact'&&s.id!=='esg'?extra[s.id]():''}
 ${!c&&ks.length?`<h6>ALL INDICATORS ON THIS SCREEN</h6><div class="grid g4">${ks.map(card).join('')}</div>`:''}`;
 const clr=$('#clr');if(clr)clr.onclick=ev=>{ev.preventDefault();$('.filters').remove()};
 page.querySelectorAll('.tabs span').forEach(t=>t.onclick=()=>{page.querySelectorAll('.tabs span').forEach(x=>x.classList.remove('on'));t.classList.add('on')});
}
addEventListener('hashchange',render);render();
})();
