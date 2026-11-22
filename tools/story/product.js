// Animated product reel template. Needs SPEC (set before this file):
// {format:'logo_on'|'ab'|'ideas', hook:'...', sub:'optional line under hook',
//  items:[{p:'tshirt',c:'#8C00FF',label:'Team tees'}...], end:{h:'Headline',keyword:'GIFT'},
//  bg:'#F4EEFF' (optional), accent:'#8C00FF' (optional)}
// logo_on: 3-4 items, each gets "YOUR LOGO" stamped on.  ab: exactly 2 items.  ideas: 3 items.
const A=SPEC.accent||P, BG=SPEC.bg||'#F4EEFF';
function bgPlain(T){let g=`<rect width="${W}" height="${H}" fill="${BG}"/>`;
  for(let i=0;i<14;i++){const r=rng(i+3);const x=r()*W,y=r()*H,s=20+r()*40;g+=`<circle cx="${x}" cy="${(y+T*30*(i%3+1))%H}" r="${s}" fill="${A}" opacity=".06"/>`}
  return g}
function hookScene(t,T){const k=popS(t,.05,.35);const lines=wrap(SPEC.hook,16);
  let g=`<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="#4B1F8A"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#hg)"/>`;
  for(let i=0;i<6;i++){const r=rng(i+11);g+=`<g opacity=".18">${product(SPEC.items[i%SPEC.items.length].p,r()*W,(r()*H+T*60)%H,.5,{c:'#fff'},r()*40-20)}</g>`}
  g+=`<g transform="translate(540,${860-lines.length*55}) scale(${k})">`+lines.map((s,i)=>`<text x="0" y="${i*120}" font-family="Poppins" font-weight="800" font-size="104" fill="#fff" text-anchor="middle">${esc(s)}</text>`).join('');
  if(SPEC.sub) g+=`<text x="0" y="${lines.length*120+20}" font-family="Poppins" font-weight="600" font-size="52" fill="${GOLD}" text-anchor="middle">${esc(SPEC.sub)}</text>`;
  return g+`</g>`+logoTagW();}
function logoTagW(){return `<g><rect x="340" y="120" width="400" height="92" rx="46" fill="#fff"/>${logoImg(540,166,300,true)}</g>`}
function labelPill(text,y,k,col=A){if(k<=0)return'';return `<g transform="translate(540,${y}) scale(${k})"><rect x="-${text.length*19+60}" y="-56" width="${text.length*38+120}" height="112" rx="56" fill="${col}"/><text y="22" font-family="Poppins" font-weight="800" font-size="62" fill="#fff" text-anchor="middle">${esc(text)}</text></g>`}
function logoOnScene(it,i){return (t,T)=>{let g=bgPlain(T)+`<circle cx="540" cy="900" r="${380+Math.sin(T*2)*8}" fill="#fff"/>`;
  const inK=popS(t,0,.35), stamp=clamp((t-.75)/.25), sq=t>.75&&t<1.05?1-.06*Math.sin((t-.75)/.3*Math.PI):1;
  g+=`<g transform="translate(540,900) scale(${inK*sq},${inK/sq})">${product(it.p,0,0,1.7,{c:it.c,logo:'yours',k:stamp>0?popS(t,.75,.25):0})}</g>`;
  if(t>.75) g+=`<circle cx="540" cy="880" r="${60+ (t-.75)*900}" fill="none" stroke="${GOLD}" stroke-width="${Math.max(0,14-(t-.75)*40)}"/>`+sparkle(330,640,popS(t,.85))+sparkle(760,700,popS(t,.95)*.8);
  g+=labelPill(it.label,1420,popS(t,.5,.3));
  g+=`<text x="540" y="360" font-family="Poppins" font-weight="800" font-size="56" fill="${A}" text-anchor="middle">${i+1} / ${SPEC.items.length}</text>`;
  return g+logoTag()}}
function abScene(t,T){let g=bgPlain(T);const [a,b]=SPEC.items;
  g+=`<text x="540" y="380" font-family="Poppins" font-weight="800" font-size="78" fill="${INK}" text-anchor="middle">${esc(SPEC.q||'Which one would you pick?')}</text>`;
  [[a,280,'A',.1],[b,800,'B',.45]].forEach(([it,x,L2,d])=>{const k=popS(t,d,.35),bob=Math.sin(T*3+x)*10;
    g+=`<g transform="translate(${x},${880+bob}) scale(${k})"><circle r="230" fill="#fff"/>${product(it.p,0,0,1.15,{c:it.c,logo:it.logo||'zuzazi'})}</g>`;
    g+=`<g transform="translate(${x},600) scale(${k})"><circle r="62" fill="${A}"/><text y="26" font-family="Poppins" font-weight="800" font-size="72" fill="#fff" text-anchor="middle">${L2}</text></g>`;
    g+=`<g transform="translate(${x},1190) scale(${popS(t,d+.3,.3)})"><text font-family="Poppins" font-weight="700" font-size="50" fill="${INK}" text-anchor="middle">${esc(it.label)}</text></g>`});
  g+=`<g transform="translate(540,880) scale(${popS(t,.8,.3)})"><circle r="70" fill="${GOLD}"/><text y="22" font-family="Poppins" font-weight="800" font-size="56" fill="${INK}" text-anchor="middle">VS</text></g>`;
  const pulse=1+Math.sin(T*6)*.04*(t>1.6);
  g+=`<g transform="translate(540,1420) scale(${popS(t,1.4,.35)*pulse})"><rect x="-380" y="-62" width="760" height="124" rx="62" fill="${A}"/><text y="22" font-family="Poppins" font-weight="800" font-size="60" fill="#fff" text-anchor="middle">Comment A or B</text></g>`;
  return g+logoTag()}
function ideasScene(t,T){let g=bgPlain(T);const its=SPEC.items.slice(0,3);
  g+=`<text x="540" y="360" font-family="Poppins" font-weight="800" font-size="72" fill="${INK}" text-anchor="middle">${esc(SPEC.title||SPEC.hook)}</text>`;
  its.forEach((it,i)=>{const y=620+i*330,d=.2+i*1.1,k=popS(t,d,.35);
    g+=`<g transform="translate(0,0)" opacity="${clamp(k)}"><rect x="${L(-900,90,ease(clamp((t-d)/.4)))}" y="${y-140}" width="900" height="280" rx="40" fill="#fff"/>`;
    g+=`<g transform="translate(${L(-700,290,ease(clamp((t-d)/.4)))},${y}) scale(.72)">${product(it.p,0,0,1,{c:it.c,logo:'zuzazi'})}</g>`;
    g+=`<circle cx="${L(-900,140,ease(clamp((t-d)/.4)))}" cy="${y-110}" r="44" fill="${A}"/><text x="${L(-900,140,ease(clamp((t-d)/.4)))}" y="${y-94}" font-family="Poppins" font-weight="800" font-size="48" fill="#fff" text-anchor="middle">${i+1}</text>`;
    g+=`<text x="${L(-400,480,ease(clamp((t-d)/.4)))}" y="${y+20}" font-family="Poppins" font-weight="800" font-size="58" fill="${INK}">${esc(it.label)}</text></g>`});
  return g+logoTag()}
function endScene(t,T){let g=`<defs><linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="#4B1F8A"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#eg2)"/>`;
  g+=`<g transform="translate(540,520) scale(${popS(t,.05,.35)})">${logoImg(0,0,700)}</g>`;
  const lines=wrap(SPEC.end.h,18);
  g+=`<g transform="translate(540,760) scale(${popS(t,.3,.35)})">`+lines.map((s,i)=>`<text y="${i*92}" font-family="Poppins" font-weight="800" font-size="78" fill="#fff" text-anchor="middle">${esc(s)}</text>`).join('')+`</g>`;
  const its=SPEC.items.slice(0,3);its.forEach((it,i)=>{g+=`<g opacity="${seg(t,.5+i*.1,.9+i*.1)}">${product(it.p,[270,540,810][i],1130,.6,{c:it.c,logo:'zuzazi'})}</g>`});
  g+=`<g transform="translate(540,1420) scale(${popS(t,.8,.35)})"><rect x="-340" y="-62" width="680" height="124" rx="62" fill="${GOLD}"/><text y="22" font-family="Poppins" font-weight="800" font-size="60" fill="${INK}" text-anchor="middle">DM us ${esc(SPEC.end.keyword)}</text></g>`;
  return g}
SCENES=[{d:2.2,f:hookScene}];
if(SPEC.format==='logo_on') SPEC.items.forEach((it,i)=>SCENES.push({d:2.3,f:logoOnScene(it,i)}));
else if(SPEC.format==='ab') SCENES.push({d:5.5,f:abScene});
else SCENES.push({d:4.2,f:ideasScene});
SCENES.push({d:3.2,f:endScene});
LINES=[];
