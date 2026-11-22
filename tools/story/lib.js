// Zuzazi Stories animation library (SVG, 1080x1920). Scenes call these helpers.
const W=1080,H=1920,P='#8C00FF',PD='#5B2A9E',INK='#2B2140',GOLD='#F5C542';
const UAE={r:'#EF3340',g:'#009739',w:'#FFFFFF',k:'#000000'};
const LOGO=window.LOGO||'', LOGOP=window.LOGOP||'';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
const seg=(t,a,b)=>ease(clamp((t-a)/(b-a)));
const L=(a,b,k)=>a+(b-a)*k;
const pop=(t,a,d=.35)=>{const k=clamp((t-a)/d);return k<=0?0:(k>=1?1:1+Math.sin(k*Math.PI)*.25*(1-k)+ (k<1?k-1:0)*0)+0*k}; // overshoot
const popS=(t,a,d=.35)=>{const k=clamp((t-a)/d);if(k<=0)return 0;return Math.min(1.12,ease(k)*1.12)-(k>.7?(k-.7)/.3*.12:0)};
function rng(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}}
const logoImg=(x,y,w,pur)=>`<image href="${pur?LOGOP:LOGO}" x="${x-w/2}" y="${y-w*105/944}" width="${w}" height="${w*105/472}"/>`;

// ---------- timeline / audio-driven talking ----------
let LINES=[]; // [{id,who,t0,dur,text}]
function talking(who,T){for(const l of LINES){if(l.who===who&&T>=l.t0&&T<=l.t0+l.dur)return Math.sin((T-l.t0)*26)>-.2}return false}
function curLines(T){return LINES.filter(l=>T>=l.t0-.05&&T<=l.t0+l.dur+.35)}

// ---------- people ----------
function person(o){
  const d=Object.assign({x:540,y:1700,s:1,flip:false,skin:'#E8B98F',eyes:1,mouth:'smile',armL:8,elL:0,armR:8,elR:0,legL:0,legR:0,
    tilt:0,bob:0,blush:true,fem:true,outfit:'shirt',top:'#7FB2E5',bottom:'#2B2D5C',head:'hair',hair:'#2a1a12',beard:false,logo:false,hold:null},o);
  const S=d.skin, sd='#0000001f';
  const leg=(a,side)=>`<g transform="translate(${side*32},-250) rotate(${a})"><rect x="-23" y="0" width="46" height="232" rx="20" fill="${d.bottom}"/><ellipse cx="${side*6}" cy="236" rx="34" ry="17" fill="${INK}"/></g>`;
  const sleeve=d.outfit==='kandura'?'#FBFBF7':d.top;
  const arm=(a,el,side)=>`<g transform="translate(${side*76},-452) rotate(${-side*a})"><rect x="-18" y="-6" width="36" height="128" rx="18" fill="${sleeve}"/>
     <g transform="translate(0,118) rotate(${-side*el})"><rect x="-16" y="-6" width="32" height="112" rx="16" fill="${sleeve}"/><circle cx="0" cy="112" r="19" fill="${S}"/></g></g>`;
  let body='',legs='';
  if(d.outfit==='kandura'){
    body=`<path d="M-80,-470 Q0,-492 80,-470 L104,-22 Q0,-6 -104,-22Z" fill="#FBFBF7" stroke="#e6e3da" stroke-width="3"/>
      <path d="M-30,-60 L-20,-440 M30,-60 L20,-440" stroke="#ece9e0" stroke-width="5"/>
      <path d="M0,-470 L0,-380" stroke="#e2ded2" stroke-width="5"/><path d="M0,-380 q-4,40 0,70" stroke="#d8d3c6" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="-38" cy="-8" rx="34" ry="13" fill="#7a5134"/><ellipse cx="38" cy="-8" rx="34" ry="13" fill="#7a5134"/>`;
  } else if(d.outfit==='scrub'){
    legs=leg(d.legL,-1)+leg(d.legR,1);
    body=`<path d="M-80,-470 Q0,-490 80,-470 L74,-240 Q0,-226 -74,-240Z" fill="${d.top}"/><path d="M-26,-478 L0,-430 L26,-478" stroke="${INK}22" stroke-width="5" fill="none"/>`;
  } else if(d.outfit==='abaya'){
    body=`<path d="M-80,-470 Q0,-492 80,-470 L112,-18 Q0,-2 -112,-18Z" fill="${d.top}"/><path d="M0,-470 L0,-30" stroke="#ffffff22" stroke-width="5"/><ellipse cx="-36" cy="-6" rx="30" ry="12" fill="${INK}"/><ellipse cx="36" cy="-6" rx="30" ry="12" fill="${INK}"/>`;
  } else {
    legs=leg(d.legL,-1)+leg(d.legR,1);
    body=`<path d="M-80,-470 Q0,-490 80,-470 L74,-240 Q0,-226 -74,-240Z" fill="${d.top}"/><path d="M-22,-480 L0,-448 L22,-480" fill="#fff"/><path d="M0,-448 L0,-250" stroke="${INK}22" stroke-width="4"/>`;
  }
  if(d.logo) body+=logoImg(d.flip?-40:40,-410,64,d.outfit==='kandura');
  // head
  const ey=-566; let back='',front='';
  if(d.head==='hijab'){
    back=`<path d="M-104,-580 C-108,-720 108,-720 104,-580 L118,-440 Q0,-400 -118,-440Z" fill="${d.hijab}"/>`;
    front=`<path d="M-92,-585 C-92,-705 92,-705 92,-585 L90,-540 C86,-655 -86,-655 -90,-540Z" fill="${d.hijab}"/><path d="M-90,-540 C-92,-480 -40,-462 0,-462 C40,-462 92,-480 90,-540 L104,-500 C80,-430 -80,-430 -104,-500Z" fill="${d.hijab}"/>`;
  } else if(d.head==='ghutra'){
    back=`<path d="M-100,-600 C-104,-712 104,-712 100,-600 L124,-420 L60,-440 L0,-470 L-60,-440 L-124,-420Z" fill="#FFFFFF" stroke="#e5e5e5" stroke-width="3"/>`;
    front=`<path d="M-90,-590 C-90,-700 90,-700 90,-590 L88,-560 C80,-650 -80,-650 -88,-560Z" fill="#FFFFFF" stroke="#e8e8e8" stroke-width="2"/><ellipse cx="0" cy="-655" rx="86" ry="20" fill="none" stroke="#111" stroke-width="11"/><ellipse cx="0" cy="-642" rx="88" ry="18" fill="none" stroke="#111" stroke-width="9"/>`;
  } else if(d.head==='hair'){
    if(d.style==='bun') back=`<circle cx="0" cy="-668" r="40" fill="${d.hair}"/>`;
    if(d.style==='long') back=`<path d="M-86,-600 C-90,-690 90,-690 86,-600 L96,-450 L-96,-450Z" fill="${d.hair}"/>`;
    front=`<path d="M-80,-560 C-92,-680 92,-680 80,-560 C66,-622 20,-630 -10,-612 C-40,-628 -70,-610 -80,-560Z" fill="${d.hair}"/>`;
  }
  const LC=d.fem?'#C9416E':INK;
  const mouths={smile:`<path d="M-20,-528 Q0,-508 20,-528" stroke="${LC}" stroke-width="6.5" fill="none" stroke-linecap="round"/>`,
    open:`<ellipse cx="0" cy="-522" rx="15" ry="13" fill="${LC}"/><ellipse cx="0" cy="-516" rx="8" ry="5" fill="#ff8fa8"/>`,
    big:`<path d="M-26,-532 Q0,-498 26,-532Z" fill="${LC}" stroke="${LC}" stroke-width="5" stroke-linejoin="round"/>`,
    o:`<ellipse cx="0" cy="-522" rx="10" ry="12" fill="${LC}"/>`,
    flat:`<path d="M-14,-524 L14,-524" stroke="${LC}" stroke-width="6" stroke-linecap="round"/>`};
  const eyeH=Math.max(1.5,(d.fem?13:11)*d.eyes);
  let eyes=`<ellipse cx="-27" cy="${ey}" rx="${d.fem?10:8.5}" ry="${eyeH}" fill="${INK}"/><ellipse cx="27" cy="${ey}" rx="${d.fem?10:8.5}" ry="${eyeH}" fill="${INK}"/>`;
  if(d.eyes>.5) eyes+=`<circle cx="-23" cy="${ey-5}" r="3.5" fill="#fff"/><circle cx="31" cy="${ey-5}" r="3.5" fill="#fff"/>`;
  if(d.eyes==='happy'||d.happy) eyes=`<path d="M-39,${ey+3} q12,-14 24,0 M15,${ey+3} q12,-14 24,0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if(d.fem&&!d.happy) eyes+=`<path d="M-38,${ey-8} l-9,-7 M38,${ey-8} l9,-7" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  const brows=`<path d="M-40,${ey-26} q13,-8 26,0 M14,${ey-26} q13,-8 26,0" stroke="${d.head==='hair'?d.hair:INK}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>`;
  const beard=d.beard?`<path d="M-70,-560 C-72,-470 -30,-448 0,-448 C30,-448 72,-470 70,-560 C60,-505 30,-498 0,-498 C-30,-498 -60,-505 -70,-560Z" fill="#1d1612"/><path d="M-26,-540 Q0,-552 26,-540" stroke="#1d1612" stroke-width="9" fill="none" stroke-linecap="round"/>`:'';
  const head=`<g transform="rotate(${d.tilt},0,-500)">${back}<rect x="-20" y="-500" width="40" height="44" fill="${S}"/>
    <ellipse cx="0" cy="-565" rx="74" ry="82" fill="${S}"/><ellipse cx="0" cy="-565" rx="74" ry="82" fill="${sd}" clip-path="none" opacity=".0"/>
    ${d.head==='hair'||d.head==='ghutra'?`<ellipse cx="-74" cy="-562" rx="11" ry="17" fill="${S}"/><ellipse cx="74" cy="-562" rx="11" ry="17" fill="${S}"/>`:''}
    ${beard}${brows}${eyes}
    ${d.blush?`<circle cx="-46" cy="-534" r="12" fill="#ff8fa8" opacity=".45"/><circle cx="46" cy="-534" r="12" fill="#ff8fa8" opacity=".45"/>`:''}
    ${mouths[d.mouth]||mouths.smile}${front}</g>`;
  const held=d.hold?d.hold:'';
  return `<g transform="translate(${d.x},${d.y+d.bob}) scale(${d.flip?-d.s:d.s},${d.s})">
    <ellipse cx="0" cy="6" rx="110" ry="18" fill="#00000018"/>${legs}${arm(d.armL,d.elL,-1)}${body}${arm(d.armR,d.elR,1)}${head}${held}</g>`;
}
// world position of a hand (side -1 = left arm, 1 = right arm, in the character's own frame)
function handAt(o,side){
  const d=Object.assign({x:540,y:1700,s:1,flip:false,armL:8,elL:0,armR:8,elR:0,bob:0},o);
  const a=(side<0?d.armL:d.armR)*Math.PI/180, e=(side<0?d.elL:d.elR)*Math.PI/180;
  const rot=(x,y,th)=>[x*Math.cos(th)-y*Math.sin(th),x*Math.sin(th)+y*Math.cos(th)];
  let [ux,uy]=rot(0,118,-side*a); let [fx,fy]=rot(0,112,-side*(a+e));
  const lx=side*76+ux+fx, ly=-452+uy+fy;
  return [d.x+(d.flip?-1:1)*d.s*lx, d.y+d.bob+d.s*ly];
}
function walk(T,on){const ph=T*9;return on?{legL:Math.sin(ph)*16,legR:-Math.sin(ph)*16,bob:-Math.abs(Math.sin(ph))*7}:{}}
const mouthFor=(who,T,idle='smile')=>talking(who,T)?'open':idle;

// ---------- props ----------
function flag(x,y,w,wave=0){const h=w*.5,r=w*.25;
  return `<g transform="translate(${x},${y}) skewY(${wave})"><rect x="0" y="0" width="${w}" height="${h/3}" fill="${UAE.g}"/><rect x="0" y="${h/3}" width="${w}" height="${h/3}" fill="${UAE.w}"/><rect x="0" y="${2*h/3}" width="${w}" height="${h/3}" fill="${UAE.k}"/><rect x="0" y="0" width="${r}" height="${h}" fill="${UAE.r}"/></g>`}
function handFlag(x,y,s=1,wave=0){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-4" y="-150" width="8" height="160" rx="4" fill="#8a6a4a"/>${flag(4,-150,110,wave)}</g>`}
function bunting(y,T,x0=-20,x1=1100){let g=`<path d="M${x0},${y} Q540,${y+70} ${x1},${y}" stroke="#555" stroke-width="4" fill="none"/>`;const cols=[UAE.r,UAE.g,UAE.w,UAE.k];
  for(let i=0;i<14;i++){const u=i/13,x=L(x0,x1,u),yy=y+70*4*u*(1-u)*.5+ (Math.sin(T*3+i)*3);g+=`<path d="M${x-26},${yy} L${x+26},${yy} L${x},${yy+56}Z" fill="${cols[i%4]}" stroke="#00000022" stroke-width="2"/>`}return g}
function giftBox(x,y,w,h,lid=0,lidRot=0,logo=true){
  return `<g transform="translate(${x},${y})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="10" fill="${P}"/>
   <rect x="${-w/2}" y="${-h}" width="${w}" height="${h*.16}" fill="#000" opacity=".12"/><rect x="-${w*.06}" y="${-h}" width="${w*.12}" height="${h}" fill="${GOLD}"/>
   ${logo?logoImg(0,-h*.42,w*.62):''}
   <g transform="translate(0,${-h-lid}) rotate(${lidRot})"><rect x="${-w*.55}" y="${-h*.2}" width="${w*1.1}" height="${h*.22}" rx="10" fill="#9B2CFF"/>
     <rect x="-${w*.06}" y="${-h*.2}" width="${w*.12}" height="${h*.22}" fill="${GOLD}"/>
     <path d="M0,${-h*.2} C${-w*.3},${-h*.58} ${-w*.34},${-h*.08} 0,${-h*.2} C${w*.3},${-h*.58} ${w*.34},${-h*.08} 0,${-h*.2}Z" fill="${GOLD}" stroke="#E0A800" stroke-width="4"/></g></g>`}
function tumbler(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-46" y="-250" width="92" height="22" rx="8" fill="#333"/>
  <path d="M-44,-230 L44,-230 L36,0 L-36,0Z" fill="#1E1E24"/><rect x="-43" y="-170" width="86" height="64" fill="#fff"/>
  <rect x="-43" y="-170" width="22" height="64" fill="${UAE.r}"/><rect x="-21" y="-170" width="64" height="21" fill="${UAE.g}"/><rect x="-21" y="-128" width="64" height="22" fill="${UAE.k}"/>
  ${logoImg(0,-62,62)}</g>`}
function scarf(x,y,s=1,sw=0){return `<g transform="translate(${x},${y}) scale(${s}) rotate(${sw})"><path d="M-20,-230 Q0,-240 20,-230 L36,0 L-4,0Z" fill="${UAE.g}"/><path d="M-4,0 L36,0 L34,-20 L-2,-20Z" fill="#fff"/><path d="M-2,-20 L34,-20 L33,-40 L0,-40Z" fill="${UAE.k}"/>
  <path d="M-20,-230 L-56,-10 L-16,0 L10,-226Z" fill="${UAE.r}"/><rect x="-46" y="-130" width="44" height="26" rx="4" fill="${P}" transform="rotate(10,-24,-117)"/>${logoImg(-24,-113,40)}</g>`}
function pin(x,y,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><circle r="46" fill="${GOLD}"/><circle r="38" fill="#fff"/><clipPath id="pc"><circle r="36"/></clipPath><g clip-path="url(#pc)">${flag(-36,-18,72)}</g></g>`}
function notebook(x,y,s=1,rot=0){return `<g transform="translate(${x},${y}) scale(${s}) rotate(${rot})"><rect x="-70" y="-95" width="140" height="190" rx="10" fill="${P}"/><rect x="-70" y="-95" width="16" height="190" fill="${PD}"/>${logoImg(8,-6,100)}<rect x="40" y="-95" width="10" height="190" fill="${GOLD}"/></g>`}
function sparkle(x,y,k){if(k<=0)return'';return `<path transform="translate(${x},${y}) scale(${k})" d="M0,-34 L8,-8 L34,0 L8,8 L0,34 L-8,8 L-34,0 L-8,-8Z" fill="${GOLD}"/>`}
function confetti(T,t0,n=90,seed=7){if(T<t0)return'';const r=rng(seed);let g='';const cols=[UAE.r,UAE.g,'#fff',UAE.k,GOLD,P];
  for(let i=0;i<n;i++){const x=r()*W,sp=260+r()*320,del=r()*1.2,rt=r()*360,c=cols[i%cols.length];const tt=T-t0-del;if(tt<0)continue;const y=-40+tt*sp;if(y>H)continue;
    g+=`<rect x="${x+Math.sin(tt*3+i)*30}" y="${y}" width="16" height="26" fill="${c}" transform="rotate(${rt+tt*200},${x},${y})" stroke="#00000022"/>`}return g}
function firework(x,y,T,t0,col){const k=clamp((T-t0)/1.1);if(k<=0||k>=1)return'';let g='';for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=40+k*150;g+=`<circle cx="${x+Math.cos(a)*r}" cy="${y+Math.sin(a)*r+k*k*40}" r="${9*(1-k)+2}" fill="${col}" opacity="${1-k}"/>`}return g}

// ---------- backgrounds ----------
function office(T){return `<rect width="${W}" height="${H}" fill="#F4EEFF"/>
  <rect x="80" y="380" width="920" height="560" rx="18" fill="#BFE3FF"/><rect x="80" y="380" width="920" height="560" rx="18" fill="none" stroke="#fff" stroke-width="16"/>
  <g fill="#9CC4E8"><rect x="120" y="700" width="90" height="240"/><rect x="230" y="620" width="70" height="320"/><rect x="330" y="560" width="60" height="380"/><path d="M520,940 L532,470 L548,940Z"/><rect x="600" y="660" width="110" height="280"/><rect x="740" y="600" width="80" height="340"/><rect x="850" y="690" width="110" height="250"/></g>
  <path d="M540,380 L540,940 M80,660 L1000,660" stroke="#fff" stroke-width="10"/>
  <rect x="0" y="1300" width="${W}" height="620" fill="#E3D6F7"/><rect x="0" y="1300" width="${W}" height="10" fill="#cdbbe9"/>
  <g transform="translate(990,1300)"><rect x="-40" y="-120" width="80" height="120" rx="10" fill="#C88B5A"/><circle cx="-20" cy="-170" r="50" fill="#3FA66B"/><circle cx="24" cy="-200" r="56" fill="#4CBB7A"/><circle cx="0" cy="-150" r="44" fill="#2E8B57"/></g>`}
function calendar(x,y,txt){return `<g transform="translate(${x},${y})"><rect x="-80" y="-90" width="160" height="180" rx="14" fill="#fff" stroke="#ddd" stroke-width="4"/><rect x="-80" y="-90" width="160" height="54" rx="14" fill="${UAE.r}"/><rect x="-80" y="-50" width="160" height="14" fill="${UAE.r}"/>
  <text x="0" y="-52" font-family="Poppins" font-weight="700" font-size="30" fill="#fff" text-anchor="middle">DEC</text><text x="0" y="50" font-family="Poppins" font-weight="800" font-size="84" fill="${INK}" text-anchor="middle">${txt}</text></g>`}
function desk(y,x0=60,x1=1020){return `<rect x="${x0}" y="${y}" width="${x1-x0}" height="34" rx="8" fill="#B07A4F"/><rect x="${x0+30}" y="${y+34}" width="26" height="${1700-y}" fill="#8E5E3A"/><rect x="${x1-56}" y="${y+34}" width="26" height="${1700-y}" fill="#8E5E3A"/>`}
function door(x,open){return `<g transform="translate(${x},1300)"><rect x="-130" y="-640" width="260" height="640" fill="#5a4a7a"/><rect x="-118" y="-628" width="236" height="628" fill="#2f2545"/>
  <g transform="translate(-118,0) scale(${1-open*.85},1)"><rect x="0" y="-628" width="236" height="628" fill="#C9A27A"/><rect x="24" y="-600" width="188" height="250" rx="8" fill="#BFE3FF" opacity=".8"/><circle cx="206" cy="-310" r="13" fill="${GOLD}"/></g></g>`}

// ---------- text overlays ----------
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function wrap(text,max){const w=text.split(' ');const out=[];let cur='';for(const x of w){if((cur+' '+x).trim().length>max){out.push(cur.trim());cur=x}else cur+=' '+x}if(cur.trim())out.push(cur.trim());return out}
const NAMECOL={};
function subtitles(T){const ls=curLines(T);if(!ls.length)return'';
  // group simultaneous lines with same text
  const l=ls[ls.length-1]; const group=ls.filter(x=>x.text===l.text);
  const who=group.length>1?'Everyone':l.who; const lines=wrap(l.text,26); const k=popS(T,l.t0,.25);
  const h=90+lines.length*70, y=1440;
  let g=`<g transform="translate(540,${y}) scale(${k})"><rect x="-470" y="0" width="940" height="${h}" rx="34" fill="#1B1230" opacity=".86"/>
    <rect x="-150" y="-30" width="300" height="60" rx="30" fill="${NAMECOL[who]||P}"/><text x="0" y="12" font-family="Poppins" font-weight="700" font-size="32" fill="#fff" text-anchor="middle">${esc(who)}</text>`;
  lines.forEach((s,i)=>{g+=`<text x="0" y="${92+i*70}" font-family="Poppins" font-weight="700" font-size="54" fill="#fff" text-anchor="middle">${esc(s)}</text>`});
  return g+'</g>'}
function logoTag(){return `<g><rect x="340" y="120" width="400" height="92" rx="46" fill="${P}"/>${logoImg(540,166,300)}</g>`}
function caption(text,T,t0,t1,y=300,col=P){if(T<t0||T>t1)return'';const k=popS(T,t0,.3)*(T>t1-.3?clamp((t1-T)/.3):1);const lines=wrap(text,26);
  let g=`<g transform="translate(540,${y}) scale(${k})" opacity="${k>1?1:k}"><rect x="-460" y="-70" width="920" height="${lines.length*78+60}" rx="30" fill="#fff" stroke="${col}" stroke-width="6"/>`;
  lines.forEach((s,i)=>g+=`<text x="0" y="${i*78+14}" font-family="Poppins" font-weight="800" font-size="60" fill="${col}" text-anchor="middle">${esc(s)}</text>`);return g+'</g>'}
function fade(T,t0,t1,dur=.3){const a=Math.max(clamp(1-(T-t0)/dur),clamp(1-(t1-T)/dur));return a>0?`<rect width="${W}" height="${H}" fill="#fff" opacity="${a}"/>`:''}

// ---------- driver ----------
let SCENES=[]; // [{d, f(t,T)}]
function draw(T){let acc=0;let g='';for(let i=0;i<SCENES.length;i++){const s=SCENES[i];if(T<acc+s.d||i===SCENES.length-1){g=s.f(T-acc,T)+(s.noFade?'':fade(T-acc,0,s.d,.22));break}acc+=s.d}
  g+=subtitles(T);document.getElementById('v').innerHTML=g}
function total(){return SCENES.reduce((a,s)=>a+s.d,0)}
