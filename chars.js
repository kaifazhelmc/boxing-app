/* 拳擊跟練：職業角色繪圖
 * charSVG(cls, tier, {anim}) → SVG 字串（4 職業 × 5 階）
 * 有 img/chars/{cls}-1.png（SpriteCook 生成）時：tier 1 原圖、tier 0 轉灰、tier 2–4 疊動態特效；沒有則用下方程式繪製的原創 SVG（charSVGRaw）
 */
(function(){
const PAL = {
  striker:{main:"#e8442a", dark:"#a12a17", light:"#ff8a63", hair:"#3a2420", aura:"#ff6a3c"},
  swift:  {main:"#2f8cff", dark:"#1b56a8", light:"#8fd0ff", hair:"#1f2a44", aura:"#4fb6ff"},
  guard:  {main:"#2fb37a", dark:"#1b7550", light:"#8fe3bb", hair:"#2b2b2b", aura:"#3ccf8e"},
  monk:   {main:"#8a5cf0", dark:"#55339e", light:"#c9b2ff", hair:"#2a2030", aura:"#b07cff"}
};
const SKIN="#f6c9a2", SKIN_D="#e3a982", INK="#1d1a22", GOLD="#ffc53d", GOLD_D="#c98a12", WHITE="#fffaf0";
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
let uid=0;

function glove(x,y,color,shine,big){
  const r = big?19:17;
  return `<g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="0" rx="${r}" ry="${r-1}" fill="${color}" ${S}/>
    <path d="M${-r+3} ${-2} q-7 -2 -6 -10 q2 -6 9 -3" fill="${color}" ${S}/>
    <rect x="${-r+5}" y="${r-6}" width="${2*r-10}" height="9" rx="3" fill="${WHITE}" ${S}/>
    <ellipse cx="${-r/3}" cy="${-r/2.4}" rx="${r/3.2}" ry="${r/5}" fill="#fff" opacity="${shine}"/>
  </g>`;
}

function eyes(cls,tier){
  const glow = tier>=4 ? (cls==="monk"?GOLD:"#fff") : null;
  let e = `
    <path d="M78 62 l14 4" ${S} fill="none"/><path d="M122 62 l-14 4" ${S} fill="none"/>
    <ellipse cx="86" cy="76" rx="6.5" ry="8" fill="${WHITE}" ${S}/>
    <ellipse cx="114" cy="76" rx="6.5" ry="8" fill="${WHITE}" ${S}/>
    <circle cx="87.5" cy="77.5" r="3.6" fill="${INK}"/><circle cx="112.5" cy="77.5" r="3.6" fill="${INK}"/>
    <circle cx="88.6" cy="76" r="1.2" fill="#fff"/><circle cx="113.6" cy="76" r="1.2" fill="#fff"/>`;
  if(cls==="monk" && tier>=1 && tier<4) e = `
    <path d="M78 64 l13 3" ${S} fill="none"/><path d="M122 64 l-13 3" ${S} fill="none"/>
    <path d="M80 77 q6 4 12 0" ${S} fill="none"/><path d="M108 77 q6 4 12 0" ${S} fill="none"/>`;
  if(glow) e += `<circle cx="87.5" cy="77.5" r="3" fill="${glow}"/><circle cx="112.5" cy="77.5" r="3" fill="${glow}"/>`;
  return e;
}

function hair(cls,tier,p){
  if(cls==="striker"){
    if(tier===0) return `<path d="M64 62 q2 -30 36 -32 q34 2 36 32 q-10 -12 -20 -10 q-8 -10 -16 -4 q-10 -8 -18 2 q-10 -2 -18 12z" fill="${p.hair}" ${S}/>`;
    return `<path d="M62 64 l-4 -22 l14 8 l2 -20 l14 12 l10 -20 l8 20 l16 -12 l-2 20 l16 -6 l-8 20 q-10 -10 -22 -8 q-8 -8 -18 -2 q-12 -6 -26 10z" fill="${p.hair}" ${S}/>`;
  }
  if(cls==="swift") return `<path d="M64 64 q-4 -34 38 -34 q34 0 38 26 q-20 -8 -34 -4 q-12 -4 -22 4 q-10 0 -20 8z" fill="${p.hair}" ${S}/>
    <path d="M136 52 l18 -8 l-10 14 z" fill="${p.hair}" ${S}/>`;
  if(cls==="guard") return `<path d="M64 60 q4 -26 36 -27 q32 1 36 27 q-34 -8 -72 0z" fill="${p.hair}" ${S}/>`;
  if(cls==="monk"){
    if(tier===0) return `<path d="M66 56 q8 -22 34 -22 q26 0 34 22 q-34 -10 -68 0z" fill="${p.hair}" ${S}/>`;
    return `<circle cx="100" cy="30" r="10" fill="${p.hair}" ${S}/><path d="M92 36 h16" ${S}/>`;  // 光頭＋頂髻
  }
  return "";
}

function headgear(cls,tier,p){
  let g="";
  if(cls==="striker" && tier>=1 && tier<4){
    g += `<path d="M64 60 q36 -14 72 0 l0 8 q-36 -12 -72 0z" fill="${p.main}" ${S}/>`;
  }
  if(cls==="swift" && tier>=1){
    const c = tier>=4?GOLD:p.main;
    g += `<path d="M63 58 q37 -12 74 0 l0 9 q-37 -11 -74 0z" fill="${c}" ${S}/>
      <path d="M136 60 q20 -2 32 10 q-14 -2 -22 4 q14 4 20 16 q-16 -8 -30 -16z" fill="${c}" ${S}>
        <animateTransform attributeName="transform" type="rotate" values="0 136 62;-8 136 62;0 136 62" dur="0.9s" repeatCount="indefinite"/></path>`;
  }
  if(cls==="guard" && tier>=1){
    const c = tier>=4?GOLD:p.main, d = tier>=4?GOLD_D:p.dark;
    g += `<path d="M60 74 q-4 -46 40 -46 q44 0 40 46 l-10 2 q2 -30 -30 -32 q-32 2 -30 32z" fill="${c}" ${S}/>
      <path d="M70 52 q30 -16 60 0" fill="none" stroke="${d}" stroke-width="5" stroke-linecap="round"/>
      <rect x="58" y="72" width="14" height="24" rx="6" fill="${c}" ${S}/><rect x="128" y="72" width="14" height="24" rx="6" fill="${c}" ${S}/>`;
  }
  if(cls==="striker" && tier>=4){
    g += `<path d="M70 44 l6 -24 l12 14 l12 -20 l12 20 l12 -14 l6 24z" fill="${GOLD}" ${S}/>
      <circle cx="100" cy="30" r="4" fill="#ff3b3b" ${S}/>`;
  }
  return g;
}

function body(cls,tier,p){
  const gold = tier>=4;
  let b = "";
  // 腿
  if(cls==="monk"){
    b += `<path d="M66 176 q34 22 68 0 l4 18 q-38 12 -76 0z" fill="${p.dark}" ${S}/>`;
  } else {
    b += `<rect x="78" y="166" width="16" height="30" rx="6" fill="${SKIN}" ${S}/>
      <rect x="106" y="166" width="16" height="30" rx="6" fill="${SKIN}" ${S}/>
      <path d="M74 196 q12 -6 22 0 v8 h-24z" fill="${gold?GOLD:p.dark}" ${S}/>
      <path d="M104 196 q12 -6 22 0 v8 h-24z" fill="${gold?GOLD:p.dark}" ${S}/>`;
  }
  // 身體
  if(cls==="monk"){
    b += `<path d="M70 118 q30 -12 60 0 l8 62 q-38 10 -76 0z" fill="${tier>=1?p.main:"#d9d2c4"}" ${S}/>
      <path d="M86 116 l14 40 l14 -40" fill="none" stroke="${tier>=1?p.dark:"#a89f8e"}" stroke-width="4"/>
      <rect x="70" y="150" width="60" height="9" rx="4" fill="${tier>=4?GOLD:(tier>=1?p.dark:"#a89f8e")}" ${S}/>`;
    if(tier>=2){
      let beads=""; for(let i=0;i<9;i++){ const a=Math.PI*(0.15+0.7*i/8); beads+=`<circle cx="${100-30*Math.cos(a)}" cy="${112+22*Math.sin(a)}" r="${tier>=3?5:4}" fill="${tier>=4?GOLD:"#7a4a2a"}" ${S} stroke-width="2"/>`; }
      b += beads;
    }
  } else {
    const shirt = cls==="striker" ? SKIN : (cls==="guard"&&tier>=2 ? (gold?GOLD:p.dark) : (tier===0?"#d6d9e0":p.main));
    b += `<path d="M72 120 q28 -10 56 0 l4 46 q-32 8 -64 0z" fill="${shirt}" ${S}/>`;
    if(cls==="striker") b += `<path d="M90 132 q-6 8 0 14 M110 132 q6 8 0 14" fill="none" stroke="${SKIN_D}" stroke-width="3" stroke-linecap="round"/>`;
    if(cls==="swift" && tier>=1) b += `<path d="M100 120 v44" stroke="${p.light}" stroke-width="4"/>`;
    if(cls==="guard" && tier>=2) b += `<path d="M82 126 h36 l-4 26 q-14 6 -28 0z" fill="${gold?"#ffe08a":p.main}" ${S}/>`;
    // 短褲
    const shorts = gold ? GOLD : (tier===0 ? "#5a6070" : p.main);
    b += `<path d="M68 158 h64 l2 18 h-28 l-6 -6 l-6 6 h-28z" fill="${shorts}" ${S}/>
      <path d="M68 162 h64" stroke="${gold?GOLD_D:p.light}" stroke-width="4"/>`;
    // 冠軍腰帶
    if(cls==="striker" && tier>=3) b += `<rect x="64" y="150" width="72" height="14" rx="5" fill="${GOLD}" ${S}/>
      <ellipse cx="100" cy="157" rx="14" ry="11" fill="#ffe08a" ${S}/><path d="M100 150 l3 6 h6 l-5 4 l2 6 l-6 -4 l-6 4 l2 -6 l-5 -4 h6z" fill="${GOLD_D}"/>`;
  }
  // 圍巾（疾風 3+）
  if(cls==="swift" && tier>=3){
    const c = gold?GOLD:p.light;
    b += `<path d="M78 116 q22 10 44 0 l2 10 q-24 10 -48 0z" fill="${c}" ${S}/>
      <path d="M120 120 q30 4 48 -6 q-6 14 -20 18 q14 2 24 -2 q-14 14 -46 4z" fill="${c}" ${S}>
      <animateTransform attributeName="transform" type="rotate" values="0 120 122;6 120 122;0 120 122" dur="0.8s" repeatCount="indefinite"/></path>`;
  }
  // 肩甲（鐵壁 3+）
  if(cls==="guard" && tier>=3){
    const c = gold?GOLD:p.main;
    b += `<path d="M58 118 q14 -14 30 -2 l-6 14 q-14 -6 -26 2z" fill="${c}" ${S}/><path d="M142 118 q-14 -14 -30 -2 l6 14 q14 -6 26 2z" fill="${c}" ${S}/>`;
  }
  return b;
}

function arms(cls,tier,p,anim){
  const gloveColor = tier>=4 ? GOLD : (tier===0 ? "#8a909e" : (cls==="monk"? WHITE : p.main));
  const armSkin = cls==="monk"&&tier>=1 ? p.main : SKIN;
  const big = cls==="guard";
  // 左手護臉、右手出拳（anim 時）
  const jab = anim ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 0;18 -6;0 0;0 0" keyTimes="0;0.55;0.65;0.8;1" dur="2.4s" repeatCount="indefinite"/>` : "";
  let a = `
    <path d="M76 126 q-18 4 -16 -14" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/>
    <path d="M76 126 q-18 4 -16 -14" fill="none" stroke="${armSkin}" stroke-width="9" stroke-linecap="round"/>
    <g>${jab}
      <path d="M124 126 q18 2 18 -18" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/>
      <path d="M124 126 q18 2 18 -18" fill="none" stroke="${armSkin}" stroke-width="9" stroke-linecap="round"/>
      ${glove(142,104,gloveColor,.55,big)}
      ${cls==="striker"&&tier>=4 ? flame(142,88,.8) : ""}
    </g>
    ${glove(60,110,gloveColor,.55,big)}
    ${cls==="striker"&&tier>=4 ? flame(60,94,.8) : ""}`;
  // 鐵壁的盾（3+）
  if(cls==="guard" && tier>=3){
    const c = tier>=4?GOLD:p.main, d = tier>=4?GOLD_D:p.dark;
    a += `<path d="M40 112 q12 -10 26 -6 q4 26 -12 40 q-18 -12 -14 -34z" fill="${c}" ${S}/>
      <path d="M50 116 l2 18" stroke="${d}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return a;
}

function flame(x,y,s){
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 6 q-12 -8 -4 -22 q2 8 6 8 q-2 -10 6 -18 q0 12 6 16 q6 10 -2 16 q-6 4 -12 0z" fill="#ff9a2e" opacity=".9">
      <animate attributeName="opacity" values=".9;.5;.9" dur=".5s" repeatCount="indefinite"/></path>
    <path d="M2 4 q-6 -6 0 -14 q2 6 6 6 q2 8 -6 8z" fill="#ffe36b"/></g>`;
}

function aura(cls,tier,p,id){
  if(tier<2) return "";
  const c = tier>=4 ? GOLD : p.aura;
  let a = `<defs><radialGradient id="au${id}" cx="50%" cy="55%" r="50%">
      <stop offset="0" stop-color="${c}" stop-opacity="${tier>=4?.75:.5}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="100" cy="118" rx="${tier>=3?96:84}" ry="${tier>=3?104:92}" fill="url(#au${id})">
      <animate attributeName="opacity" values="1;.6;1" dur="2s" repeatCount="indefinite"/></ellipse>`;
  if(tier>=3){
    for(let i=0;i<6;i++){
      const x=30+i*28, d=(1.2+i*.3).toFixed(1);
      a += `<circle cx="${x}" cy="200" r="3" fill="${c}"><animate attributeName="cy" values="200;40" dur="${d}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0" dur="${d}s" repeatCount="indefinite"/></circle>`;
    }
  }
  return a;
}

function backFx(cls,tier,p){
  let f="";
  if(cls==="swift" && tier>=2){
    f += `<g stroke="${tier>=4?GOLD:p.light}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".85">
      <path d="M18 92 h30"><animate attributeName="opacity" values="1;.2;1" dur=".7s" repeatCount="indefinite"/></path>
      <path d="M10 118 h36"><animate attributeName="opacity" values=".2;1;.2" dur=".7s" repeatCount="indefinite"/></path>
      <path d="M20 144 h26"/></g>`;
  }
  if(cls==="swift" && tier>=4){
    f += `<g opacity=".95"><path d="M82 130 l-62 -52 l16 28 l-32 -8 l28 24 l-26 6 l34 10 z" fill="${GOLD}" ${S}/>
      <path d="M118 130 l62 -52 l-16 28 l32 -8 l-28 24 l26 6 l-34 10 z" fill="${GOLD}" ${S}/>
      <path d="M70 120 l-34 -26 M130 120 l34 -26" stroke="#fff3c4" stroke-width="3" stroke-linecap="round"/></g>`;
  }
  if(cls==="monk" && tier>=4){
    f += `<circle cx="100" cy="66" r="52" fill="none" stroke="${GOLD}" stroke-width="6" opacity=".9"/>
      <circle cx="100" cy="66" r="44" fill="none" stroke="#fff3c4" stroke-width="2" opacity=".8"/>`;
  }
  if(cls==="striker" && tier>=2){
    f += `<g opacity="${tier>=4?1:.85}">${flame(46,190,1.4)}${flame(150,190,1.4)}${tier>=3?flame(100,196,1.7):""}</g>`;
  }
  if(cls==="guard" && tier>=4){
    f += `<path d="M100 8 l8 18 h20 l-16 12 l6 20 l-18 -12 l-18 12 l6 -20 l-16 -12 h20z" fill="${GOLD}" ${S}/>`;
  }
  return f;
}

function head(cls,tier,p){
  return `${cls==="guard"&&tier>=1 ? "" : `<ellipse cx="62" cy="80" rx="7" ry="9" fill="${SKIN}" ${S}/><ellipse cx="138" cy="80" rx="7" ry="9" fill="${SKIN}" ${S}/>`}
    <ellipse cx="100" cy="74" rx="38" ry="36" fill="${SKIN}" ${S}/>
    <ellipse cx="78" cy="90" rx="6" ry="3.5" fill="#ff8f8f" opacity=".45"/><ellipse cx="122" cy="90" rx="6" ry="3.5" fill="#ff8f8f" opacity=".45"/>
    ${eyes(cls,tier)}
    <path d="M92 96 q8 ${cls==="monk"?4:6} 16 0" fill="none" ${S}/>
    ${cls==="striker"&&tier>=1 ? `<g transform="rotate(-35 128 66)"><rect x="121" y="62" width="14" height="7" rx="3" fill="#ffe2c4" stroke="${INK}" stroke-width="1.8"/><rect x="125.5" y="62" width="5" height="7" fill="#f2c9a0"/></g>` : ""}`;
}

/* ===== SpriteCook 角色圖＋特效 =====
 * img/chars/{cls}-1.png 是 SpriteCook 生成的基準造型。
 * tier 1 直接用原圖；tier 0 轉灰（見習）；tier 2–4 在原圖前後疊上動態特效。
 * 之後若有 SpriteCook 生成的 {cls}-{tier}.png，加進 PNG_TIERS 就會改用那張原圖。
 */
const PNG_TIERS = {};   // 例：{ striker:[2] } → 用 img/chars/striker-2.png 整張原圖
// 每張原圖的尺寸與特徵點（0–1 的相對座標）：頭頂、雙拳、腰、雙眼
const BASE = {
  striker:{w:507,h:512, top:[.50,.06], gl:[.40,.47], gr:[.63,.47], waist:[.49,.625,.34], eyes:[[.43,.405],[.58,.405]]},
  swift:  {w:494,h:512, top:[.55,.06], gl:[.33,.47], gr:[.53,.46], waist:[.52,.66,.30], eyes:[[.50,.36],[.62,.36]]},
  guard:  {w:508,h:512, top:[.50,.04], gl:[.42,.43], gr:[.63,.43], waist:[.52,.62,.36], eyes:[[.47,.33],[.58,.33]]},
  monk:   {w:469,h:512, top:[.49,.07], gl:[.36,.50], gr:[.63,.50], waist:[.52,.66,.34], eyes:[[.41,.365],[.57,.365]]}
};
const BOX = {x:12, y:26, w:176, h:182};           // 原圖在 200×215 畫布中的位置
function place(cls){
  const b = BASE[cls], s = Math.min(BOX.w/b.w, BOX.h/b.h), dw = b.w*s, dh = b.h*s;
  const x0 = BOX.x + (BOX.w-dw)/2, y0 = BOX.y + BOX.h - dh;
  return {x0, y0, dw, dh, P:(u,v)=>[+(x0+u*dw).toFixed(1), +(y0+v*dh).toFixed(1)]};
}
const r = (a,b)=> (a+Math.random()*(b-a)).toFixed(2);

// —— 特效零件 ——
const STAR = "M0,-7 L1.6,-1.6 7,0 1.6,1.6 0,7 -1.6,1.6 -7,0 -1.6,-1.6Z";
function sparkles(n, x1, y1, x2, y2, color, size=1){
  let s=""; for(let i=0;i<n;i++){ const d=r(1.2,2.4), b=r(0,2);
    s+=`<g transform="translate(${r(x1,x2)} ${r(y1,y2)})"><path d="${STAR}" fill="${color}" opacity="0" transform="scale(${(size*r(.6,1.2)).toFixed(2)})">
      <animate attributeName="opacity" values="0;1;0" dur="${d}s" begin="${b}s" repeatCount="indefinite"/></path></g>`; }
  return s;
}
function embers(n, cx, w, yTop, yBot, colors){
  let s=""; for(let i=0;i<n;i++){ const d=r(1.4,2.6), b=r(0,2.5), x=r(cx-w/2,cx+w/2), c=colors[i%colors.length];
    s+=`<circle cx="${x}" cy="${yBot}" r="${r(1.2,2.8)}" fill="${c}" opacity="0">
      <animate attributeName="cy" values="${yBot};${yTop}" dur="${d}s" begin="${b}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="${d}s" begin="${b}s" repeatCount="indefinite"/></circle>`; }
  return s;
}
const FLAME = "M0,0 C-11,-4 -12,-18 -5,-27 C-4,-20 -1,-19 0,-34 C3,-22 8,-21 7,-28 C13,-18 11,-4 0,0Z";
function flames(cx, y, w, n, k, id, front){
  let s=""; for(let i=0;i<n;i++){ const x=(cx-w/2+w*(n===1?.5:i/(n-1))).toFixed(1), sc=(k*r(.75,1.15)).toFixed(2), d=r(.35,.6);
    s+=`<g transform="translate(${x} ${y}) scale(${sc})"><path d="${FLAME}" fill="url(#fl${id})" opacity="${front?.85:.95}">
      <animateTransform attributeName="transform" type="scale" values="1 1;1.08 1.22;.94 .9;1 1" dur="${d}s" repeatCount="indefinite"/></path></g>`; }
  return s;
}
function aura(cx, cy, rx, ry, id, dur=2){
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#au${id})">
    <animate attributeName="opacity" values=".55;1;.55" dur="${dur}s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="${rx};${rx*1.06};${rx}" dur="${dur}s" repeatCount="indefinite"/></ellipse>`;
}
function rays(cx, cy, n, len, color, id, dur=14){
  let s=""; for(let i=0;i<n;i++){ const a=360/n*i; s+=`<path d="M0,0 L${(len*0.09).toFixed(1)},-${len} L-${(len*0.09).toFixed(1)},-${len}Z" fill="url(#ry${id})" transform="rotate(${a})"/>`; }
  return `<g transform="translate(${cx} ${cy})" opacity=".55"><g>${s}<animateTransform attributeName="transform" type="rotate" values="0;360" dur="${dur}s" repeatCount="indefinite"/></g></g>`;
}
function groundRing(cx, y, color){
  return [0,1].map(i=>`<ellipse cx="${cx}" cy="${y}" rx="30" ry="6" fill="none" stroke="${color}" stroke-width="2.5" opacity="0">
    <animate attributeName="rx" values="30;72" dur="1.8s" begin="${i*.9}s" repeatCount="indefinite"/>
    <animate attributeName="ry" values="6;14" dur="1.8s" begin="${i*.9}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values=".9;0" dur="1.8s" begin="${i*.9}s" repeatCount="indefinite"/></ellipse>`).join("");
}
function speedLines(x1, x2, y1, y2, n, color){
  let s=""; for(let i=0;i<n;i++){ const y=r(y1,y2), l=+r(18,40), d=r(.5,.9), b=r(0,.9);
    s+=`<line x1="${x2}" y1="${y}" x2="${x2+l}" y2="${y}" stroke="${color}" stroke-width="${r(1.5,3)}" stroke-linecap="round" opacity="0">
      <animate attributeName="opacity" values="0;.9;0" dur="${d}s" begin="${b}s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="translate" values="0 0;${x1-x2} 0" dur="${d}s" begin="${b}s" repeatCount="indefinite"/></line>`; }
  return s;
}
const BOLT = "M2,-16 L-6,1 L0,1 L-3,16 L7,-3 L1,-3 Z";
function bolts(pts, color, k=1){
  return pts.map(([x,y],i)=>`<path d="${BOLT}" fill="${color}" stroke="#fff" stroke-width=".8" transform="translate(${x} ${y}) scale(${k}) rotate(${i%2?18:-14})" opacity="0" filter="url(#gw)">
    <animate attributeName="opacity" values="0;1;0;0;1;0" dur="${r(1,1.8)}s" begin="${r(0,1)}s" repeatCount="indefinite"/></path>`).join("");
}
function wings(cx, cy, id){
  const w = side => `<g transform="scale(${side} 1)"><g>
      <path d="M6,6 L40,-34 L33,-17 L60,-46 L50,-20 L74,-36 L58,-6 L76,-12 L52,14 L60,12 L30,28 Z" fill="url(#wg${id})" stroke="#fff6c8" stroke-width="1.5" stroke-linejoin="round" filter="url(#gw)"/>
      <animateTransform attributeName="transform" type="rotate" values="0;-7;0" dur="1.4s" repeatCount="indefinite"/></g></g>`;
  return `<g transform="translate(${cx} ${cy}) scale(1.45)">${w(1)}${w(-1)}</g>`;
}
function hexDome(cx, cy, rx, ry, id, color, full){
  return `<g opacity="${full?.9:.8}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#hg${id})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#hp${id})" mask="url(#mk${id})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="2.5"${full?"":` stroke-dasharray="6 5"`}>
      <animate attributeName="opacity" values=".45;1;.45" dur="2.2s" repeatCount="indefinite"/></ellipse>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="16 ${(rx*6).toFixed(0)}" opacity=".9">
      <animate attributeName="stroke-dashoffset" values="0;-${(rx*6.3).toFixed(0)}" dur="2.4s" repeatCount="indefinite"/></ellipse></g>`;
}
function beadRing(cx, cy, R, n, big, color){
  let s=`<circle r="${R}" fill="none" stroke="#e8c48a" stroke-width="${(big*.45).toFixed(1)}" opacity=".9"/>`; for(let i=0;i<n;i++){ const a=2*Math.PI*i/n; s+=`<circle cx="${(R*Math.cos(a)).toFixed(1)}" cy="${(R*Math.sin(a)).toFixed(1)}" r="${i===0?big*1.7:big}" fill="${i===0?GOLD:color}" stroke="${INK}" stroke-width="1.5"/>`; }
  return `<g transform="translate(${cx} ${cy}) scale(1 .3)"><g>${s}<animateTransform attributeName="transform" type="rotate" values="0;360" dur="5s" repeatCount="indefinite"/></g></g>`;
}
function crown(x, y, k){
  return `<g transform="translate(${x} ${y}) scale(${k})" filter="url(#gw)">
    <path d="M-20,8 L-22,-12 L-11,-2 L0,-18 L11,-2 L22,-12 L20,8 Z" fill="${GOLD}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="-21" y="5" width="42" height="7" rx="2" fill="${GOLD_D}" stroke="${INK}" stroke-width="2"/>
    <circle cx="0" cy="-3" r="3.4" fill="#ff3b3b" stroke="${INK}" stroke-width="1.2"/><circle cx="-12" cy="8.5" r="2" fill="#4fb6ff"/><circle cx="12" cy="8.5" r="2" fill="#3ccf8e"/>
    <circle cx="-22" cy="-12" r="2.2" fill="#fff6c8"/><circle cx="0" cy="-18" r="2.2" fill="#fff6c8"/><circle cx="22" cy="-12" r="2.2" fill="#fff6c8"/></g>`;
}
function belt(x, y, w){
  return `<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-5" width="${w}" height="10" rx="3" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="0" cy="0" rx="15" ry="11" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#ff5a2a" stroke="${GOLD_D}" stroke-width="2"/>
    <path d="M-4,-1 L0,-4 L4,-1 L2,3 L-2,3Z" fill="#fff6c8"/>
    <path d="M${-w/2+4},-2 h${w/2-20} M${w/2-4},-2 h${-(w/2-20)}" stroke="#fff6c8" stroke-width="1.5" opacity=".8"/></g>`;
}
function armShield(x, y){
  return `<g transform="translate(${x} ${y}) rotate(-8)" filter="url(#gw)"><path d="M0,-24 L19,-16 L17,6 C14,17 6,22 0,25 C-6,22 -14,17 -17,6 L-19,-16 Z" fill="#2fb37a" stroke="${INK}" stroke-width="2.5"/>
    <path d="M0,-17 L12,-12 L11,4 C9,11 4,15 0,17 C-4,15 -9,11 -11,4 L-12,-12 Z" fill="#8fe3bb" stroke="#1b7550" stroke-width="1.5"/>
    <path d="M0,-11 L0,11 M-8,-1 L8,-1" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/></g>`;
}
function bigStar(x, y){
  return `<g transform="translate(${x} ${y})"><g filter="url(#gw)"><path d="M0,-16 L3.5,-3.5 16,0 3.5,3.5 0,16 -3.5,3.5 -16,0 -3.5,-3.5Z" fill="#fff6c8" stroke="${GOLD}" stroke-width="1.5"/>
    <animateTransform attributeName="transform" type="rotate" values="0;90" dur="3s" repeatCount="indefinite"/></g>
    <circle r="22" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".7"><animate attributeName="r" values="10;26" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="1.6s" repeatCount="indefinite"/></circle></g>`;
}
function halo(x, y){
  return `<g transform="translate(${x} ${y})" filter="url(#gw)"><ellipse rx="40" ry="40" fill="none" stroke="${GOLD}" stroke-width="5"/>
    <ellipse rx="47" ry="47" fill="none" stroke="#fff3b0" stroke-width="1.5" stroke-dasharray="3 7"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="10s" repeatCount="indefinite"/></ellipse>
    <animate attributeName="opacity" values=".75;1;.75" dur="2s" repeatCount="indefinite"/></g>`;
}
function glowEyes(pts){
  return pts.map(([x,y])=>`<g transform="translate(${x} ${y})"><ellipse rx="9" ry="4.5" fill="#fff3b0" filter="url(#gw)" opacity=".85"><animate attributeName="opacity" values=".6;1;.6" dur="1.4s" repeatCount="indefinite"/></ellipse>
    <ellipse rx="5" ry="2" fill="#fff"/></g>`).join("");
}

// —— 每個職業每一階要疊什麼 ——
const FXCOL = {
  striker:{a:"#ff6a3c", a2:"#ffb03c"}, swift:{a:"#4fb6ff", a2:"#bfe6ff"},
  guard:{a:"#3ccf8e", a2:"#b8ffd9"},   monk:{a:"#b07cff", a2:"#e2d0ff"}
};
function fxLayers(cls, t, id, L){
  const b = BASE[cls], P = L.P, c = FXCOL[cls];
  const [hx,hy] = P(...b.top), [lx,ly] = P(...b.gl), [rx_,ry_] = P(...b.gr), [wx,wy] = P(b.waist[0], b.waist[1]);
  const foot = L.y0 + L.dh*.98, mid = L.x0 + L.dw/2, cy = L.y0 + L.dh*.52;
  let back = "", front = "", imgFx = "", afterimg = "", float = false;
  if (t >= 4) { imgFx = cls==="guard" ? "gd" : "gl"; }
  const gold = "#ffd23f";
  if (cls==="striker"){
    back += aura(mid, cy, 78+t*4, 92+t*4, id, 1.4);
    if (t>=4) back += rays(mid, cy, 14, 125, gold, id);
    back += flames(mid, foot+4, t>=3?150:110, t>=3?9:6, t>=4?1.9:t>=3?1.6:1.05, id);
    front += embers(t>=3?16:8, mid, 150, L.y0+20, foot, ["#ffd23f","#ff6a3c","#fff1a8"]);
    if (t>=2) front += flames(mid, foot+8, 120, 4, t>=3?.85:.55, id, true);
    if (t>=3) front += belt(wx, wy, L.dw*b.waist[2]);
    if (t>=4) front += flames(lx-14, ly+14, 6, 2, .6, id, true) + flames(rx_+14, ry_+14, 6, 2, .6, id, true)
                    + crown(hx, hy-6, 1.15) + sparkles(10, L.x0, L.y0, L.x0+L.dw, foot, "#fff3b0", 1.1);
  }
  if (cls==="swift"){
    back += aura(mid, cy, 76+t*4, 90+t*4, id, 1.2);
    if (t>=4) back += rays(mid, cy-20, 12, 120, gold, id, 10) + wings(mid, L.y0+L.dh*.36, id);
    back += speedLines(L.x0-20, L.x0+L.dw+30, L.y0+20, foot, t>=3?16:10, c.a2);
    if (t>=3) afterimg = [[-26,.35,"0s"],[-50,.18,".2s"]].map(([dx,o,bg])=>`<use href="#im${id}" filter="url(#tb${id})" opacity="${o}" transform="translate(${dx} 0)">
        <animate attributeName="opacity" values="${o};${o*.4};${o}" dur=".8s" begin="${bg}" repeatCount="indefinite"/></use>`).join("");
    front += bolts(t>=4?[[L.x0+8,L.y0+40],[L.x0+L.dw-6,L.y0+60],[L.x0+14,foot-40],[L.x0+L.dw-12,foot-20]]:[[L.x0+10,L.y0+50],[L.x0+L.dw-8,foot-34]], t>=4?gold:"#8fd0ff", t>=3?1.3:1);
    front += groundRing(mid, foot, c.a);
    if (t>=4) front += sparkles(10, L.x0, L.y0, L.x0+L.dw, foot, "#fff3b0", 1.1);
  }
  if (cls==="guard"){
    back += aura(mid, cy, 78+t*4, 92+t*4, id, 2.4);
    if (t>=4) back += rays(mid, cy, 16, 125, gold, id, 18);
    const dome = hexDome(mid, cy+4, L.dw*.52+t*4, L.dh*.56+t*3, id, t>=4?gold:c.a, t>=3);
    if (t>=3) front += dome; else back += dome;
    front += groundRing(mid, foot, t>=4?gold:c.a);
    if (t>=3) front += armShield(lx-14, ly+30);
    if (t>=4) front += bigStar(hx, hy-14) + sparkles(10, L.x0, L.y0, L.x0+L.dw, foot, "#fff3b0", 1.1);
    else front += sparkles(5, L.x0, L.y0+30, L.x0+L.dw, foot, c.a2, .8);
  }
  if (cls==="monk"){
    float = t>=3;
    back += aura(mid, cy, 74+t*4, 92+t*4, id, 2.6);
    if (t>=4) back += rays(mid, cy, 18, 125, gold, id, 20) + halo(hx, hy+L.dh*.2);
    if (t>=3) back += flames(mid, foot+2, 120, 7, 1.15, id);
    const ring = beadRing(mid, wy-4, L.dw*(t>=3?.5:.42), t>=3?20:16, t>=3?6.5:5, "#b8743a");
    back += ring;
    front += `<clipPath id="cl${id}"><rect x="-100" y="${wy}" width="400" height="300"/></clipPath><g clip-path="url(#cl${id})">${ring}</g>`;
    front += embers(t>=3?14:8, mid, 130, L.y0+10, foot, ["#e2d0ff","#b07cff","#fff3b0"]);
    if (t>=4) front += glowEyes(b.eyes.map(e=>P(...e))) + sparkles(10, L.x0, L.y0, L.x0+L.dw, foot, "#fff3b0", 1.1);
    else { const [ex,ey] = P(b.top[0], b.eyes[0][1]-.1); front += `<circle cx="${ex}" cy="${ey}" r="3" fill="#fff3b0" filter="url(#gw)"><animate attributeName="r" values="2;3.6;2" dur="1.6s" repeatCount="indefinite"/></circle>`; }
  }
  return {back, front, imgFx, afterimg, float};
}

function charComposite(cls, t, opt){
  const id = ++uid, L = place(cls), c = FXCOL[cls];
  const src = `img/chars/${cls}-1.png`;
  const fx = t<=1 ? {back:"",front:"",imgFx:t===0?"gy":"",afterimg:"",float:false} : fxLayers(cls, t, id, L);
  const fl = t>=4 ? ["#fff6c8","#ffd23f","#ff7a1a"] : cls==="monk" ? ["#f3e8ff","#b07cff","#6a3fd0"] : ["#fff1a8","#ff9a2a","#e8442a"];
  const defs = `<defs>
    <image id="im${id}" href="${src}" x="${L.x0.toFixed(1)}" y="${L.y0.toFixed(1)}" width="${L.dw.toFixed(1)}" height="${L.dh.toFixed(1)}" preserveAspectRatio="xMidYMax meet"/>
    <radialGradient id="au${id}"><stop offset="0" stop-color="${t>=4?"#ffe38a":c.a}" stop-opacity=".75"/><stop offset=".55" stop-color="${c.a}" stop-opacity=".28"/><stop offset="1" stop-color="${c.a}" stop-opacity="0"/></radialGradient>
    <linearGradient id="fl${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${fl[0]}"/><stop offset=".45" stop-color="${fl[1]}"/><stop offset="1" stop-color="${fl[2]}" stop-opacity=".2"/></linearGradient>
    <linearGradient id="ry${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffe38a" stop-opacity=".9"/><stop offset="1" stop-color="#ffe38a" stop-opacity="0"/></linearGradient>
    <linearGradient id="wg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff9a1a"/></linearGradient>
    <pattern id="hp${id}" width="16" height="27.7" patternUnits="userSpaceOnUse"><path d="M8,0 L16,4.6 L16,13.9 L8,18.5 L0,13.9 L0,4.6Z M8,18.5 L8,27.7" fill="none" stroke="${t>=4?"#ffe38a":"#b8ffd9"}" stroke-width=".9" opacity=".32"/></pattern>
    <radialGradient id="hg${id}"><stop offset=".7" stop-color="${t>=4?"#ffd23f":"#3ccf8e"}" stop-opacity="0"/><stop offset="1" stop-color="${t>=4?"#ffd23f":"#3ccf8e"}" stop-opacity=".4"/></radialGradient>
    <radialGradient id="hm${id}"><stop offset=".55" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></radialGradient>
    <mask id="mk${id}"><rect x="-50" y="-50" width="300" height="320" fill="url(#hm${id})"/></mask>
    <filter id="tb${id}"><feColorMatrix type="matrix" values="0 0 0 0 .3  0 0 0 0 .7  0 0 0 0 1  0 0 0 1 0"/></filter>
    <filter id="gy" x="0" y="0"><feColorMatrix type="saturate" values=".08"/><feComponentTransfer><feFuncR type="linear" slope=".82"/><feFuncG type="linear" slope=".82"/><feFuncB type="linear" slope=".86"/></feComponentTransfer></filter>
    <filter id="gl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feFlood flood-color="#ffd23f"/><feComposite operator="in" in2="SourceAlpha"/><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="gd" x="-20%" y="-20%" width="140%" height="140%"><feColorMatrix in="SourceGraphic" type="matrix" values=".55 .75 .15 0 .26  .42 .6 .1 0 .13  .1 .14 .04 0 0  0 0 0 1 0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="arithmetic" k2=".95" k3=".18" result="m"/><feFlood flood-color="#ffd23f"/><feComposite operator="in" in2="SourceAlpha"/><feGaussianBlur stdDeviation="4"/><feMerge><feMergeNode/><feMergeNode in="m"/></feMerge></filter>
    <filter id="gw" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
  const sh = `<ellipse cx="${(L.x0+L.dw/2).toFixed(1)}" cy="${(L.y0+L.dh*.985).toFixed(1)}" rx="${fx.float?34:50}" ry="7" fill="#000" opacity=".3"/>`;
  const move = fx.float ? `<animateTransform attributeName="transform" type="translate" values="0 -6;0 -13;0 -6" dur="2.4s" repeatCount="indefinite"/>`
             : opt.anim ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.2s" repeatCount="indefinite"/>` : "";
  const body = `${fx.afterimg}<use href="#im${id}"${fx.imgFx?` filter="url(#${fx.imgFx})"`:""}${t===0?` transform="translate(${(L.x0+L.dw/2).toFixed(1)} ${(L.y0+L.dh).toFixed(1)}) scale(.92) translate(${(-(L.x0+L.dw/2)).toFixed(1)} ${(-(L.y0+L.dh)).toFixed(1)})"`:""}/>`;
  return `<svg viewBox="0 0 200 215" xmlns="http://www.w3.org/2000/svg" class="char" style="overflow:visible" aria-label="${cls} ${t}">
    ${defs}${fx.back}${sh}<g>${move}${body}${fx.front}</g></svg>`.replace(/(url\(#|id=")(gw|gl|gd|gy)\b/g, `$1$2${id}`);
}

window.charSVG = function(cls, tier, opt={}){
  const t = Math.max(0, Math.min(4, tier|0));
  if ((PNG_TIERS[cls]||[]).includes(t)) {
    return `<img src="img/chars/${cls}-${t}.png" class="char charimg${opt.anim?" bob":""}" alt="${cls} ${t}" draggable="false" onerror="this.outerHTML=window.charSVGRaw('${cls}',${t},{anim:${!!opt.anim}})">`;
  }
  if (BASE[cls]) return charComposite(cls, t, opt);
  return window.charSVGRaw(cls, t, opt);
};
window.charSVGRaw = function(cls, tier, opt={}){
  const p = PAL[cls] || PAL.striker; tier = Math.max(0, Math.min(4, tier|0)); const id = ++uid;
  const bob = opt.anim ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.2s" repeatCount="indefinite"/>` : "";
  return `<svg viewBox="0 0 200 215" xmlns="http://www.w3.org/2000/svg" class="char" aria-label="${cls} ${tier}">
    ${aura(cls,tier,p,id)}
    ${backFx(cls,tier,p)}
    <ellipse cx="100" cy="206" rx="${cls==="monk"&&tier>=3?34:46}" ry="7" fill="#000" opacity=".3"/>
    <g>${cls==="monk"&&tier>=3 ? `<animateTransform attributeName="transform" type="translate" values="0 -6;0 -12;0 -6" dur="2.4s" repeatCount="indefinite"/>` : bob}
      ${body(cls,tier,p)}
      ${head(cls,tier,p)}
      ${hair(cls,tier,p)}
      ${headgear(cls,tier,p)}
      ${arms(cls,tier,p,opt.anim)}
    </g>
  </svg>`;
};
})();
