// ---------- Zuzazi Stories: "2027 Starts Here" (New Year diaries) ----------
const FATIMA={head:'hijab',hijab:'#8E2C48',outfit:'abaya',top:'#2B2140',skin:'#E9C2A0'};
const OMAR={fem:false,head:'hair',hair:'#1a120c',outfit:'shirt',top:'#7FB2E5',bottom:'#2B2D5C',skin:'#C99068'};
const MARIAM={head:'hijab',hijab:'#D98BB5',outfit:'scrub',top:'#7B3FE4',bottom:'#5A2BB0',skin:'#F6D9C4',logo:true};
Object.assign(NAMECOL,{Narrator:'#5B2A9E',Omar:'#2F7BC4',Fatima:'#B0306A',Mariam:'#C2569A'});
const ST=[0,5.0,11.4,15.0,19.4,22.8,26.4];
LINES=[
 {id:'n1',who:'Narrator',t0:0.4,text:"December 31st. Omar's old notebook has seen better days."},
 {id:'o1',who:'Omar',t0:5.3,text:"Where did I write that meeting? Somewhere... in here?"},
 {id:'f1',who:'Fatima',t0:8.3,text:"Don't worry, Omar. Tomorrow is a fresh start."},
 {id:'o2',who:'Omar',t0:12.4,text:"Whoa! A new diary on every desk!"},
 {id:'f2',who:'Fatima',t0:15.6,text:"With our logo... and your name on it."},
 {id:'m1',who:'Mariam',t0:19.8,text:"New year, new pages!"},
 {id:'o3',who:'Omar',t0:23.2,text:"Goal number one... keep this one tidy!"},
 {id:'n2',who:'Narrator',t0:26.7,text:"Zuzazi Creations. Corporate diaries and planners for 2027. DM us DIARY for a quote."},
];
const DUR={"n1": 4.03, "o1": 2.5, "f1": 2.69, "o2": 1.81, "f2": 2.07, "m1": 1.34, "o3": 2.15, "n2": 6.7};LINES.forEach(l=>l.dur=DUR[l.id]);

function cal2(x,y,mon,day,col){return `<g transform="translate(${x},${y})"><rect x="-80" y="-90" width="160" height="180" rx="14" fill="#fff" stroke="#ddd" stroke-width="4"/><rect x="-80" y="-90" width="160" height="54" rx="14" fill="${col}"/><rect x="-80" y="-50" width="160" height="14" fill="${col}"/>
  <text x="0" y="-52" font-family="Poppins" font-weight="700" font-size="30" fill="#fff" text-anchor="middle">${mon}</text><text x="0" y="50" font-family="Poppins" font-weight="800" font-size="84" fill="${INK}" text-anchor="middle">${day}</text></g>`}
const evening=()=>`<rect x="80" y="380" width="920" height="560" rx="18" fill="#FF8A3D" opacity=".35"/>`;
function oldBook(x,y,s,rot,flip){return `<g transform="translate(${x},${y}) scale(${s}) rotate(${rot})"><rect x="-20" y="-150" width="120" height="40" fill="#fff" transform="rotate(-12)"/><rect x="40" y="-140" width="110" height="36" fill="#FFF7C2" transform="rotate(14)"/>
  <rect x="-120" y="-130" width="240" height="260" rx="10" fill="#9C7A55"/><rect x="-120" y="-130" width="240" height="260" rx="10" fill="none" stroke="#6b5136" stroke-width="6" stroke-dasharray="20 10"/>
  <path d="M-100,-60 l60,10 M-90,0 l80,-14 M-60,50 l90,20" stroke="#6b5136" stroke-width="6"/><rect x="60" y="${-80+Math.sin(flip*8)*20}" width="70" height="50" fill="#fff" transform="rotate(${flip*30})"/></g>`}
function papers(T,t0,x,y){if(T<t0)return'';let g='';const r=rng(5);for(let i=0;i<7;i++){const tt=T-t0-i*.25;if(tt<0)continue;const px=x+(r()-.5)*300+tt*(r()-.5)*200,py=y-120+tt*380+Math.sin(tt*5+i)*20;if(py>1700)continue;
  g+=`<rect x="${px}" y="${py}" width="70" height="90" fill="${i%2?'#fff':'#FFF7C2'}" stroke="#ccc" stroke-width="2" transform="rotate(${tt*140+i*30},${px},${py})"/>`}return g}
function diary2(x,y,s,name,open=0){return `<g transform="translate(${x},${y}) scale(${s})">${product('diary',0,0,1,{c:'#2B2140',logo:'zuzazi',year:'2027'})}${name?`<text x="10" y="128" font-family="Poppins" font-weight="700" font-size="34" fill="${GOLD}" text-anchor="middle" letter-spacing="4">${name}</text>`:''}</g>`}

function s1(t,T){ // 31 Dec, messy notebook
  let g=office(T)+evening()+cal2(900,1100,'DEC','31',UAE.r);
  const fl=Math.sin(T*5);
  const O=Object.assign({},OMAR,{x:360,y:1700,s:1.15,armL:20,elL:-60,armR:55+fl*12,elR:-90,mouth:'flat',tilt:4,eyes:.8});
  g+=person(O)+desk(1350,120,860)+oldBook(600,1330,.72,-8,fl)+papers(T,1.2,600,1300);
  return g+logoTag()+caption('31 December',T,.3,4.7,330,UAE.r);
}
function s2(t,T){ // where is it? Fatima reassures
  let g=office(T)+evening();
  const fl=Math.sin(T*7), worried=t<3.0;
  const O=Object.assign({},OMAR,{x:700,y:1780,s:1.5,flip:true,armL:40,elL:-95,armR:45+fl*14,elR:-95,mouth:mouthFor('Omar',T,worried?'flat':'smile'),tilt:worried?fl*4:-3,eyes:1});
  g+=person(O)+oldBook(640,1350,.9,6,fl)+papers(T,ST[1]+.4,640,1300);
  const fx=L(-200,250,seg(t,2.4,3.2));
  g+=person(Object.assign({},FATIMA,{x:fx,y:1780,s:1.5,armR:L(10,70,seg(t,3.3,3.7)),elR:-30,mouth:mouthFor('Fatima',T,'smile')},walk(T,t>2.4&&t<3.2)));
  return g+logoTag();
}
function s3(t,T){ // 1 Jan, diaries everywhere
  let g=office(T)+cal2(900,1100,'JAN','1',P);
  g+=desk(1350,60,1020);
  [200,420,640].forEach((x,i)=>{g+=diary2(x,1240,.55*popS(t,.1+i*.15,.35)+.001,'');});
  g+=sparkle(300,1060,popS(t,.6)*.7)+sparkle(560,1040,popS(t,.8)*.7);
  const ox=L(1150,820,seg(t,0,.8));
  const O=Object.assign({},OMAR,{x:ox,y:1700,s:1.15,flip:true,eyes:t>.9?1.25:1,mouth:mouthFor('Omar',T,t>.9?'o':'smile'),armL:t>.9?150:8,elL:-20,armR:t>.9?150:8,elR:-20},walk(T,t<.8));
  g+=person(O);
  return g+logoTag()+caption('1 January',T,ST[2]+.2,ST[2]+3.4,330,P);
}
function s4(t,T){ // close-up diary with name
  let g=`<rect width="${W}" height="${H}" fill="#F4EEFF"/><circle cx="540" cy="900" r="${520+Math.sin(T*2)*10}" fill="#EBDDFF"/>`+desk(1350,0,1080);
  const k=popS(t,.1,.4);
  g+=`<g transform="translate(540,960) rotate(${L(-8,0,seg(t,.1,.6))})">${diary2(0,0,1.9*k+.001,t>1.0?'OMAR':'')}</g>`;
  if(t>1.0) g+=sparkle(300,700,popS(t,1.0))+sparkle(800,760,popS(t,1.15))+sparkle(560,1240,popS(t,1.3)*.7);
  g+=`<g transform="translate(${L(1300,860,seg(t,1.6,2.2))},1180) rotate(-30) scale(.8)">${product('pen',0,0,1,{c:P,logo:'zuzazi'})}</g>`;
  return g+logoTag()+caption('Your logo + their name',T,ST[3]+.6,ST[3]+4.4,420,P);
}
function s5(t,T){ // Mariam cameo
  let g=office(T)+door(900,1)+desk(1350,60,700);
  g+=diary2(240,1240,.5,'')+diary2(520,1240,.5,'');
  const mx=L(1150,860,seg(t,0,.7));
  const M=Object.assign({},MARIAM,{x:mx,y:1700,s:1.1,flip:true,armR:40,elR:-95,armL:L(10,150,seg(t,.8,1.1)),elL:-10,mouth:mouthFor('Mariam',T,'big')},walk(T,t<.7));
  g+=person(M);const [hx,hy]=handAt(M,1);g+=diary2(hx,hy+20,.38,'');
  g+=person(Object.assign({},FATIMA,{x:200,y:1700,s:1.05,armR:L(10,150,seg(t,1.4,1.7)),elR:-20,mouth:'big'}));
  g+=person(Object.assign({},OMAR,{x:420,y:1700,s:1.05,armR:L(10,150,seg(t,1.5,1.8)),elR:-20,mouth:'big'}));
  g+=desk(1350,60,700);
  return g+logoTag();
}
function s6(t,T){ // writing goals
  let g=office(T)+cal2(900,1100,'JAN','1',P);
  const wr=Math.sin(T*14);
  g+=person(Object.assign({},OMAR,{x:430,y:1700,s:1.15,armL:30,elL:-90,armR:35+wr*4,elR:-100,mouth:mouthFor('Omar',T,'big'),happy:t>2.6}));
  g+=desk(1350,120,860);
  g+=`<g transform="translate(450,1290) rotate(-4)"><rect x="-230" y="-70" width="460" height="140" rx="10" fill="#fff" stroke="#ddd" stroke-width="4"/><rect x="-6" y="-70" width="12" height="140" fill="#ddd"/>
    <text x="-115" y="-12" font-family="Poppins" font-weight="800" font-size="30" fill="${P}" text-anchor="middle">2027 GOALS</text><path d="M-200,${20} l${Math.min(170,seg(t,.3,2.5)*170)},0 M-200,48 l${Math.min(130,seg(t,1.5,3)*130)},0" stroke="${INK}" stroke-width="5"/>
    ${logoImg(115,0,150,true)}</g>`;
  if(t>2.6) g+=sparkle(250,900,popS(t,2.6))+sparkle(640,880,popS(t,2.75));
  return g+logoTag();
}
function s7(t,T){ // end card
  let g=`<defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8C00FF"/><stop offset="1" stop-color="#4B1F8A"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#eg)"/>`;
  g+=`<g transform="translate(540,470) scale(${popS(t,.1,.4)})">${logoImg(0,0,760)}</g>`;
  g+=`<g transform="translate(540,690) scale(${popS(t,.6,.4)})"><text y="0" font-family="Poppins" font-weight="800" font-size="74" fill="#fff" text-anchor="middle">2027 diaries &amp; planners</text><text y="88" font-family="Poppins" font-weight="800" font-size="74" fill="#fff" text-anchor="middle">for your team</text></g>`;
  const k=seg(t,.8,1.4);
  g+=`<g opacity="${k}" transform="translate(0,${(1-k)*40})">${diary2(330,1060,.65,'')}${product('notebook',560,1060,.6,{c:P,logo:'zuzazi'})}<g transform="translate(780,1060) rotate(-20) scale(.6)">${product('pen',0,0,1,{c:GOLD,logo:'zuzazi'})}</g></g>`;
  g+=`<g transform="translate(540,1250) scale(${popS(t,1.6,.4)})"><rect x="-300" y="-62" width="600" height="124" rx="62" fill="${GOLD}"/><text y="22" font-family="Poppins" font-weight="800" font-size="62" fill="${INK}" text-anchor="middle">DM us DIARY</text></g>`;
  return g;
}
SCENES=[{d:5.0,f:s1},{d:6.4,f:s2},{d:3.6,f:s3},{d:4.4,f:s4},{d:3.4,f:s5},{d:3.6,f:s6},{d:7.6,f:s7}];
