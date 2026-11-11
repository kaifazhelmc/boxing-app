/* 拳擊跟練：職業角色繪圖（原創 Q 版拳手，SVG 程式繪製）
 * charSVG(cls, tier, {anim}) → SVG 字串
 * cls: striker | swift | guard | monk　tier: 0–4
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

// SpriteCook 生成的角色圖（img/chars/{cls}-{tier}.png）。有列在這裡的階級用 PNG，其餘沿用 SVG；PNG 載入失敗也會自動換回 SVG。
const PNG_TIERS = { striker:[1], swift:[1], guard:[1], monk:[1] };
window.charSVG = function(cls, tier, opt={}){
  const t = Math.max(0, Math.min(4, tier|0));
  if ((PNG_TIERS[cls]||[]).includes(t)) {
    return `<img src="img/chars/${cls}-${t}.png" class="char charimg${opt.anim?" bob":""}" alt="${cls} ${t}" draggable="false" onerror="this.outerHTML=window.charSVGRaw('${cls}',${t},{anim:${!!opt.anim}})">`;
  }
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
