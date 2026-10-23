// каракули Амао рисуются «от руки» (stroke-dash) + дрожащий фильтр #rough
const C={y:'#f2b705',r:'#d62839',b:'#3a86ff',g:'#2a9d4f',o:'#f77f00',p:'#ef5da8',n:'#8d5a2b',k:'#555',w:'#ddd5c4',R:'#c1121f',v:'#8e44ad'};
const P=(d,c,f,w)=>`<path d="${d}" stroke="${c}" pathLength="1"${f?` fill="${f}"`:''}${w?` stroke-width="${w}"`:''}/>`;
const O=(x,y,r,c,f,w)=>P(`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`,c,f,w);
const ray=(n,a,b,c)=>Array.from({length:n},(_,i)=>{const t=i*6.283/n,s=Math.sin(t),k=Math.cos(t);return P(`M${50+a*k} ${50+a*s}L${50+b*k} ${50+b*s}`,c)}).join('');
const pu=(x,y,r)=>`<circle class="pu" cx="${x}" cy="${y}" r="${r}" fill="${C.R}" stroke="none"/>`;
const D={
sun:()=>O(50,50,15,C.y)+ray(9,23,36,C.y),
house:()=>P('M20 90V52H80V90Z',C.r)+P('M12 54L50 20L88 54',C.n)+P('M44 90V70H58V90',C.b)+P('M64 60h10v8H64z',C.b),
flower:()=>P('M50 48C48 68 53 78 50 94',C.g)+P('M50 72C60 62 68 66 74 60',C.g)+Array.from({length:5},(_,i)=>O(50+15*Math.cos(i*1.257),32+15*Math.sin(i*1.257),8,C.p)).join('')+O(50,32,6,C.y),
cloud:()=>P('M25 68C8 68 8 46 28 46C30 26 60 26 64 44C84 40 92 66 72 68Z',C.b),
heart:()=>P('M50 85C8 55 25 18 50 42C75 18 92 55 50 85Z',C.r),
star:()=>P('M50 8L61 38L93 38L67 57L77 90L50 70L23 90L33 57L7 38L39 38Z',C.y),
bunny:()=>P('M28 88C16 62 34 48 52 58C74 52 86 80 72 88Z',C.k)+O(40,50,11,C.k)+P('M36 42C28 10 40 6 42 40M46 40C52 8 62 12 50 44',C.k)+P('M36 49h.1',C.k,'',6)+P('M30 52l-10 -2M30 55l-10 3',C.k,'',2),
cow:()=>P('M18 44H72V74H18Z',C.k)+P('M72 40H92V58H72',C.k)+P('M24 74V92M36 74V92M54 74V92M66 74V92',C.k)+O(36,58,6,C.k)+P('M80 48h.1',C.k,'',6)+P('M76 40L74 32M88 40L90 32',C.k),
carrot:()=>P('M30 24L72 34L48 90Z',C.o)+P('M30 24C22 12 28 8 36 20M30 24C16 22 14 14 28 20',C.g),
cookie:()=>O(50,50,30,C.n)+P('M38 40h.1M58 38h.1M46 60h.1M64 56h.1M40 64h.1',C.n,'',6),
granny:()=>O(50,32,13,C.k)+O(50,15,6,'#999')+P('M28 92L38 48H62L72 92Z',C.v)+P('M45 35Q50 40 55 35',C.r)+O(45,30,3,C.k)+O(56,30,3,C.k),
scrib:()=>P('M10 55C25 5 95 15 75 60C55 100 5 75 38 42C62 22 80 52 52 56',C.w,'',2)+P('M8 80L92 20M12 30L88 85M20 90L80 10',C.R,'',3),
eyes:()=>[[30,30],[68,55],[28,76]].map(([x,y])=>P(`M${x-14} ${y}Q${x} ${y-16} ${x+14} ${y}Q${x} ${y+16} ${x-14} ${y}Z`,C.w)+pu(x,y,5)).join(''),
deadbunny:()=>P('M12 72C14 50 58 46 80 62C88 70 82 82 62 82H26C16 82 12 78 12 72Z',C.w)+P('M72 58L94 48M74 66L96 60',C.w)+P('M60 56l7 7M67 56l-7 7',C.R)+P('M20 86C40 98 75 98 92 88',C.R,'',5)+P('M40 94V100M62 96V100',C.R),
blacksun:()=>O(50,50,18,C.w,'#000',3)+ray(12,24,38,C.w)+P('M42 70V94M58 68V86',C.R,'',3),
cowstare:()=>P('M8 50Q50 8 92 50Q50 92 8 50Z',C.w)+O(50,50,16,C.w,'#000')+pu(50,50,7)+P('M20 28L8 8M80 28L92 8',C.w),
bars:()=>P('M22 8V92M42 8V92M62 8V92M82 8V92',C.w,'',3)+O(52,60,9,C.R)+P('M52 69V84M52 74L44 80M52 74L60 80',C.R),
cry:()=>O(50,50,34,C.w)+P('M36 42l8 8M44 42l-8 8M56 42l8 8M64 42l-8 8',C.R)+P('M36 72Q50 58 64 72',C.w)+P('M38 56V88M62 56V94',C.R,'',3),
drips:()=>P('M5 12H95',C.R,'',7)+P('M15 12V50M32 12V80M50 12V35M68 12V92M85 12V60',C.R,'',5),
spiral:()=>{let d='M50 50';for(let i=1;i<90;i++){const a=i*.35,r=i*.5;d+=`L${50+r*Math.cos(a)} ${50+r*Math.sin(a)}`}return P(d,C.w,'',2)}
};
const LT=['sun','flower','house','cloud','heart','bunny','cookie','star','carrot','cow','granny'];
const DK=['scrib','eyes','deadbunny','blacksun','cowstare','bars','cry','drips','spiral'];
const ART={s6:['granny','heart','cookie','flower','sun'],s8:['house','bunny','carrot','cow','bunny','sun','heart']};
const wax=n=>D[n]()+`<g transform="translate(1.2 .9)" opacity=".45" stroke-width="2">${D[n]()}</g>`;
const svg=n=>`<svg viewBox="0 0 100 100" class="d ${DK.includes(n)?'dk':'lt'}" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5">${wax(n)}</svg>`;

// сцены-баннеры [рисунок, ширина px, left %, bottom px]
const SC={s3:[['house',150,8,0],['sun',110,70,60],['cloud',100,40,70]],s4:[['cloud',100,15,70],['house',130,60,0],['flower',70,35,0]],s5:[['star',70,12,70],['cloud',110,70,60],['house',120,40,0]],
s6:[['granny',150,12,0],['cookie',70,48,0],['heart',80,68,50],['flower',80,82,0],['sun',90,35,60]],s7:[['cloud',110,20,70],['heart',70,50,40],['house',130,70,0]],
s8:[['sun',100,6,60],['cow',130,60,0],['bunny',90,30,0],['bunny',70,44,0],['carrot',60,20,0],['flower',60,88,0]],
s9:[['bars',110,10,0],['eyes',110,40,50],['spiral',100,70,0]],s10:[['eyes',120,15,40],['scrib',110,48,0],['cry',100,75,0]],s11:[['blacksun',110,8,60],['deadbunny',130,40,0],['drips',120,72,40]],
p1:[],p2:[],s12:[['cowstare',120,10,40],['bars',100,45,0],['spiral',110,75,0]],s13:[['eyes',130,10,40],['drips',130,40,40],['cry',110,72,0],['scrib',90,88,0]]};
const scene=id=>(SC[id]||[]).length?`<div class="scene">${SC[id].map(([n,w,l,b],i)=>`<figure class="d-w" style="width:${w}px;left:${l}%;bottom:${b}px;--r:${(i*7%11-5)}deg">${svg(n)}</figure>`).join('')}<i class="ground"></i></div>`:'';

Object.assign(C,{bl:'#2b2fd6',lb:'#4cc9f0',vi:'#8e5cff'});
const BODY='M50 90C20 70 14 42 22 32C34 24 42 30 50 28C58 30 66 24 78 32C86 42 80 70 50 90Z',LEAF='M50 28L38 14L50 20L62 12L58 28';
Object.assign(D,{
strawb:()=>P(BODY,C.r,'#ff7b8a55')+P(LEAF,C.g)+P('M36 44h.1M50 48h.1M64 44h.1M42 60h.1M58 60h.1M50 74h.1',C.y,'',5),
badberry:()=>P(BODY,C.R)+P(LEAF,C.w)+P('M38 44l6 6M44 44l-6 6M58 52l6 6M64 52l-6 6',C.w)+P('M50 90V100M36 80V96M64 80V98',C.R,'',4),
berry:()=>O(36,58,15,C.bl,'#5b6cff44')+O(64,52,15,C.bl,'#5b6cff44')+O(50,78,15,C.bl,'#5b6cff44')+P('M32 54h.1M60 48h.1M46 74h.1',C.lb,'',4)+P('M50 38C46 22 56 16 62 12',C.g),
moon:()=>P('M70 18A34 34 0 1 0 82 70A28 28 0 1 1 70 18Z',C.lb,'#4cc9f033'),
bolt:()=>P('M58 8L28 54H48L40 92L74 40H54Z',C.y,'#ffd16666'),
smile:()=>O(50,50,34,C.bl)+P('M36 42h.1M64 42h.1',C.bl,'',7)+P('M32 58Q50 80 68 58',C.bl),
spark:()=>P('M50 8V92M8 50H92M22 22L78 78M78 22L22 78',C.vi)});
LT.push('strawb','strawb');DK.push('badberry');
const MO=['berry','moon','star','bolt','smile','spark'];
SC.s12=[['moon',110,8,70],['berry',120,45,0],['bolt',80,78,50]];
SC.s13=[['smile',110,8,0],['star',80,35,70],['berry',120,60,0],['spark',70,88,60]];
/* --- рисунки для глав (раньше их не было, и книга падала с ошибкой) --- */
Object.assign(D,{
needle:()=>P('M26 92L74 14',C.k,'',3)+O(75,17,3,C.k)+P('M76 20C98 34 58 48 78 62C94 74 66 84 58 80',C.r,'',3)+P('M20 70C30 60 40 66 46 56',C.r,'',2),
cleaver:()=>P('M14 34H68L74 66H14Z',C.k)+O(28,48,4,C.k)+P('M68 44H92V54H68',C.n)+P('M20 66V74',C.R,'',3)
});