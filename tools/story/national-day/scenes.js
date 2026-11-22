// ---------- Zuzazi Stories: "The Flag on Every Desk" (National Day) ----------
const FATIMA={head:'hijab',hijab:'#8E2C48',outfit:'abaya',top:'#2B2140',skin:'#E9C2A0'};
const OMAR={fem:false,head:'hair',hair:'#1a120c',outfit:'shirt',top:'#7FB2E5',bottom:'#2B2D5C',skin:'#C99068'};
const KHALID={fem:false,head:'ghutra',outfit:'kandura',skin:'#B07A52',beard:true};
const MARIAM={head:'hijab',hijab:'#D98BB5',outfit:'scrub',top:'#7B3FE4',bottom:'#5A2BB0',skin:'#F6D9C4',logo:true};
Object.assign(NAMECOL,{Narrator:'#5B2A9E',Omar:'#2F7BC4',Fatima:'#B0306A',Khalid:'#1F8A4C',Mariam:'#C2569A',Everyone:UAE.r});
const ST=[0,5.0,10.2,13.6,19.4,24.2,27.8];
LINES=[
 {id:'n1',who:'Narrator',t0:0.5,text:"One day before National Day... and the office is getting ready."},
 {id:'o1',who:'Omar',t0:5.4,text:"Flags, balloons, lights... but something's missing."},
 {id:'f1',who:'Fatima',t0:8.4,text:"Hmm... you're right."},
 {id:'k1',who:'Khalid',t0:11.3,text:"Something for everyone, team!"},
 {id:'f2',who:'Fatima',t0:15.4,text:"A tumbler, a scarf... we match the whole country today!"},
 {id:'m1',who:'Mariam',t0:19.8,text:"Wait! Save one for me!"},
 {id:'k2',who:'Khalid',t0:21.6,text:"There's one with your name on it, Mariam!"},
 {id:'a1',who:'Omar',t0:24.5,text:"Happy National Day!"},{id:'a2',who:'Fatima',t0:24.5,text:"Happy National Day!"},
 {id:'a3',who:'Khalid',t0:24.5,text:"Happy National Day!"},{id:'a4',who:'Mariam',t0:24.5,text:"Happy National Day!"},
 {id:'n2',who:'Narrator',t0:28.2,text:"Zuzazi Creations. National Day gifts for your team. DM us NATIONAL for a quote."},
];
const DUR={"n1": 3.58, "o1": 2.73, "f1": 1.15, "k1": 1.88, "f2": 3.24, "m1": 1.47, "k2": 2.26, "a1": 1.3, "a2": 1.26, "a3": 1.6, "a4": 1.32, "n2": 5.44};LINES.forEach(l=>l.dur=DUR[l.id]);
function balloons(T,list){return list.map(([x,y,c],i)=>{const yy=y+Math.sin(T*1.6+i)*12;return `<path d="M${x},${yy+70} q-10,60 6,120 q14,50 -4,110" stroke="#777" stroke-width="3" fill="none"/><ellipse cx="${x}" cy="${yy}" rx="56" ry="70" fill="${c}"/><ellipse cx="${x-18}" cy="${yy-24}" rx="12" ry="20" fill="#fff" opacity=".4"/><path d="M${x-8},${yy+70} l8,-10 l8,10z" fill="${c}"/>`}).join('')}

function s1(t,T){ // decorating
  let g=office(T)+calendar(930,1100,'1');
  g+=bunting(L(-120,300,seg(t,.2,1.2)),T);
  const w=Math.sin(T*7);
  g+=person(Object.assign({},FATIMA,{x:320,y:1700,s:1.15,armL:150+w*10,elL:10,armR:150-w*10,elR:-10,mouth:'smile',tilt:w*2}));
  const O=Object.assign({},OMAR,{x:690,y:1700,s:1.15,flip:true,armR:140,elR:-20,armL:10,mouth:'big'});
  const [hx,hy]=handAt(O,1); g+=person(O)+handFlag(hx,hy+10,1,Math.sin(T*6)*6);
  return g+logoTag()+caption('One day to National Day',T,.3,4.7,330,UAE.g);
}
function s2(t,T){ // something's missing
  let g=office(T)+bunting(300,T)+balloons(T,[[170,560,UAE.r],[290,520,UAE.g],[860,540,UAE.r],[950,600,'#fff']]);
  const look=Math.sin(t*2.4)*9, shrug=seg(t,2.2,2.6)*(1-seg(t,3.2,3.6));
  const O=Object.assign({},OMAR,{x:690,y:1760,s:1.5,flip:true,tilt:look,armR:L(20,60,shrug),elR:L(0,-90,shrug),armL:L(10,60,shrug),elL:L(0,-90,shrug),mouth:mouthFor('Omar',T,'flat'),eyes:1});
  const [hx,hy]=handAt(O,1); g+=person(O)+(shrug<.5?handFlag(hx,hy+10,1.2,Math.sin(T*5)*5):'');
  const nod=talking('Fatima',T)?Math.sin(t*10)*4:0;
  g+=person(Object.assign({},FATIMA,{x:260,y:1760,s:1.5,tilt:6+nod,armL:20,elL:-100,armR:30,elR:-110,mouth:mouthFor('Fatima',T,t>3.2?'o':'smile')}));
  return g+logoTag();
}
function s3(t,T){ // manager arrives with gifts
  let g=office(T)+bunting(300,T)+door(820,seg(t,0,.5));
  const wx=L(820,580,seg(t,.4,1.4)), wk=t>.4&&t<1.4;
  const K=Object.assign({},KHALID,{x:wx,y:1700,s:1.2,flip:true,armL:22,elL:-48,armR:22,elR:-48,mouth:mouthFor('Khalid',T,'big')},walk(T,wk));
  g+=person(Object.assign({},FATIMA,{x:150,y:1700,s:1.05,eyes:L(1,1.2,seg(t,1,1.3)),mouth:t>1.4?'o':'smile'}));
  g+=person(Object.assign({},OMAR,{x:330,y:1700,s:1.05,mouth:t>1.4?'big':'smile',armR:L(8,150,seg(t,1.6,2)),elR:-30}));
  g+=person(K);
  const [ax,ay]=handAt(K,-1),[bx,by]=handAt(K,1);const cx=(ax+bx)/2,cy=(ay+by)/2+30;
  g+=giftBox(cx,cy+20,180,110,0,0)+giftBox(cx,cy-115,150,92,0,0);
  return g+logoTag();
}
function s4(t,T){ // unboxing close-up
  let g=`<rect width="${W}" height="${H}" fill="#F4EEFF"/><circle cx="540" cy="900" r="${520+Math.sin(T*2)*10}" fill="#EBDDFF"/>`+bunting(240,T)+desk(1300,0,1080);
  const lid=seg(t,.4,.9);
  const rise=seg(t,.7,1.6);
  g+=tumbler(370,L(1290,1040,rise),1.1*rise+.01)+scarf(560,L(1290,1010,seg(t,.85,1.75)),1.2*seg(t,.85,1.75)+.01,-6)+pin(740,L(1250,900,seg(t,1,1.9)),1.1*seg(t,1,1.9)+.01);
  g+=giftBox(540,1300,520,300,lid*360,-lid*28);
  if(t>1.6) g+=sparkle(250,820,popS(t,1.6))+sparkle(840,760,popS(t,1.8))+sparkle(560,700,popS(t,2.0)*.7);
  return g+logoTag()+caption('Branded gifts for your team',T,ST[3]+2.0,ST[3]+5.6,420,P);
}
function s5(t,T){ // Mariam peeks in
  let g=office(T)+bunting(300,T)+door(900,1);
  const px=L(1100,880,seg(t,0,.5));
  const give=seg(t,2.6,3.4);
  const M=Object.assign({},MARIAM,{x:px,y:1700,s:1.1,flip:true,armR:L(150,40,give),elR:L(10,-60,give),armL:10,mouth:mouthFor('Mariam',T,t>3.4?'big':'smile'),eyes:1});
  const K=Object.assign({},KHALID,{x:560,y:1700,s:1.15,flip:t<1.8?true:false,armR:L(20,70,give),elR:L(0,-30,give),armL:10,mouth:mouthFor('Khalid',T,'big')});
  K.flip=t<1.6; // looks at team, then turns to Mariam
  K.flip=false;
  g+=person(Object.assign({},FATIMA,{x:150,y:1700,s:1.05,armR:40,elR:-80,mouth:'smile'}));
  const [fx,fy]=handAt(Object.assign({},FATIMA,{x:150,y:1700,s:1.05,armR:40,elR:-80}),1); g+=tumbler(fx,fy+40,.55);
  g+=person(Object.assign({},OMAR,{x:330,y:1700,s:1.05,armR:40,elR:-80,mouth:'big'}));
  const [ox,oy]=handAt(Object.assign({},OMAR,{x:330,y:1700,s:1.05,armR:40,elR:-80}),1); g+=tumbler(ox,oy+40,.55);
  g+=person(M)+person(K);
  const [kx,ky]=handAt(K,1),[mx,my]=handAt(M,1);
  const bx=give<1?L(kx,mx,give):mx, by=give<1?L(ky,my,give)+30:my+30;
  g+=giftBox(bx,by,130,90,0,0);
  if(t>3.4) g+=sparkle(px-60,1000,popS(t,3.4)*.8);
  return g+logoTag();
}
function s6(t,T){ // celebration
  let g=office(T)+bunting(300,T)+firework(300,560,T,ST[5]+.3,UAE.r)+firework(760,500,T,ST[5]+.8,UAE.g)+firework(540,620,T,ST[5]+1.4,GOLD)+firework(860,640,T,ST[5]+2.0,'#fff');
  const up=seg(t,.1,.4), j=-Math.abs(Math.sin(t*6))*14*up;
  const ppl=[[FATIMA,170],[OMAR,410],[KHALID,660],[MARIAM,900]];
  ppl.forEach(([c,x],i)=>{const o=Object.assign({},c,{x,y:1700,s:1.0,bob:j*(i%2?1:.7),armR:L(10,160,up),elR:0,armL:L(10,40,up),elL:-20,happy:t>.3,mouth:talking(c===FATIMA?'Fatima':c===OMAR?'Omar':c===KHALID?'Khalid':'Mariam',T)?'open':'big'});
    g+=person(o);const [hx,hy]=handAt(o,1);g+=tumbler(hx,hy+20,.5);});
  g+=confetti(T,ST[5]+.3,110);
  const k=popS(t,.3,.4);
  g+=`<g transform="translate(540,330) scale(${k})"><text x="0" y="0" font-family="Poppins" font-weight="800" font-size="96" fill="${UAE.g}" text-anchor="middle" stroke="#fff" stroke-width="10" paint-order="stroke">Happy</text><text x="0" y="110" font-family="Poppins" font-weight="800" font-size="96" fill="${UAE.r}" text-anchor="middle" stroke="#fff" stroke-width="10" paint-order="stroke">National Day!</text></g>`;
  return g;
}
function s7(t,T){ // end card
  let g=`<defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8C00FF"/><stop offset="1" stop-color="#4B1F8A"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#eg)"/>`;
  g+=`<g opacity=".25">${bunting(150,T)}</g>`;
  g+=`<g transform="translate(540,470) scale(${popS(t,.1,.4)})">${logoImg(0,0,760)}</g>`;
  const k=seg(t,.5,1.1);
  g+=`<g opacity="${k}" transform="translate(0,${(1-k)*40})">${tumbler(270,1080,1)}${giftBox(540,1080,240,170)}${scarf(790,1080,1.1,-6)}</g>`;
  const k2=popS(t,1.1,.4);
  g+=`<g transform="translate(540,690) scale(${k2})"><text y="0" font-family="Poppins" font-weight="800" font-size="74" fill="#fff" text-anchor="middle">National Day gifts</text><text y="88" font-family="Poppins" font-weight="800" font-size="74" fill="#fff" text-anchor="middle">for your team</text></g>`;
  const k3=popS(t,1.6,.4);
  g+=`<g transform="translate(540,1220) scale(${k3})"><rect x="-330" y="-62" width="660" height="124" rx="62" fill="${GOLD}"/><text y="22" font-family="Poppins" font-weight="800" font-size="62" fill="${INK}" text-anchor="middle">DM us NATIONAL</text></g>`;
  return g;
}
SCENES=[{d:5.0,f:s1},{d:5.2,f:s2},{d:3.4,f:s3},{d:5.8,f:s4},{d:4.8,f:s5},{d:3.6,f:s6},{d:6.2,f:s7}];
