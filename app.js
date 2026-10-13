"use strict";
const $=s=>document.querySelector(s), app=()=>$("#app");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const KEY="tasteDNA.v1";
let S=JSON.parse(localStorage.getItem(KEY)||"null")||{step:"intro",q:{uses:[],feel:null,mode:null,dens:null,least:null},votes:{},seen:{},nope:[],cat:0};
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const fam=(name,g)=>`'${name.replace(/ Black$/,"")}',${F[g]||F.sans}`;
// ---------- categories
const CATS=[
 {k:"vibe",zh:"整體氣質",hint:"先抓大方向：哪種畫面讓你想多看一眼？",items:VIBES,n:12},
 {k:"pal",zh:"配色",hint:"只看顏色感覺，不用管它原本給什麼產業用。",items:GEN.pal,n:12},
 {k:"font",zh:"字體搭配",hint:"字體就是說話的口氣。",items:GEN.fonts,n:12},
 {k:"dens",zh:"版面密度",hint:"同一份內容，你喜歡怎麼排？",items:DENS,n:4},
 {k:"tex",zh:"細節質感",hint:"圓角、陰影、線條、漸層：最容易露出 AI 味的地方。",items:TEX,n:16},
 {k:"slide",zh:"簡報版型",hint:"你會想用哪些版型？",items:SLIDES,n:10,need:"簡報"},
 {k:"social",zh:"社群圖文",hint:"你會想發哪種貼文？",items:SOCIAL,n:10,need:"社群圖"},
 {k:"web",zh:"網頁與介面",soon:1,need:"網頁"},{k:"img",zh:"圖像風格",soon:1,need:"生圖"},{k:"motion",zh:"動態與影片",soon:1,need:"影片"}];
const activeCats=()=>CATS.filter(c=>!c.soon&&(!c.need||S.q.uses.includes(c.need)));
const byId={};CATS.forEach(c=>(c.items||[]).forEach(it=>{it.cat=c.k;byId[it.id]=it}));
// ---------- vector
function vec(){const v=DIMS.map(()=>0);const add=(t,w)=>t.forEach((x,i)=>v[i]+=x*w);
 if(S.q.feel)S.q.feel.forEach(f=>add(QUIZ_FEEL[f],1.5));
 if(S.q.mode)v[0]+=S.q.mode=="亮"?3:S.q.mode=="暗"?-3:0;
 if(S.q.dens){const d=DENS.find(x=>x.id==S.q.dens);add(d.tags,1.5)}
 if(S.q.least){const e=EXTREMES.find(x=>x.id==S.q.least);add(byId[e.vibe].tags,-1.5)}
 for(const[id,vt]of Object.entries(S.votes)){const it=byId[id];if(it&&vt)add(it.tags,vt)}return v}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), norm=a=>Math.sqrt(dot(a,a))||1;
const cos=(a,b)=>dot(a,b)/norm(a)/norm(b);
function nextCard(c){const seen=S.seen[c.k]||[];if(seen.length>=Math.min(c.n,c.items.length))return null;
 const pool=c.items.filter(i=>!seen.includes(i.id));if(c.k=="dens"||c.k=="tex")return pool[0];
 const v=vec(),contrast=seen.length%4==3;pool.sort((a,b)=>contrast?dot(v,a.tags)-dot(v,b.tags):dot(v,b.tags)-dot(v,a.tags));return pool[0]}
// ---------- theme from current picks
function best(cat,fallback){const c=CATS.find(x=>x.k==cat),v=vec();const liked=c.items.filter(i=>S.votes[i.id]==1);
 const pool=liked.length?liked:(fallback?c.items.filter(i=>S.votes[i.id]!=-1):[]);if(!pool.length)return null;
 return pool.slice().sort((a,b)=>dot(v,b.tags)-dot(v,a.tags))[0]}
function texLv(aspect){const v=vec();const l=TEX.filter(t=>t.aspect==aspect&&S.votes[t.id]==1);
 if(l.length)return l.sort((a,b)=>dot(v,b.tags)-dot(v,a.tags))[0];
 const ok=TEX.filter(t=>t.aspect==aspect&&S.votes[t.id]!=-1);return (ok.length?ok:TEX.filter(t=>t.aspect==aspect)).sort((a,b)=>dot(v,b.tags)-dot(v,a.tags))[0]}
function theme(){const p=best("pal",1),f=best("font",1);const dark=S.q.mode=="暗";
 let [bg,fg,pr,se,ac]=p.c; if(dark&&lumi(bg)>.5){[bg,fg]=["#0e0f12","#f1f1f3"]}
 if(cr(pr,bg)<3){const alt=[ac,se,fg].sort((x,y)=>cr(y,bg)-cr(x,bg))[0];[pr,ac]=[alt,pr]}if(cr(fg,bg)<7)fg=lumi(bg)<.5?"#F4F4F5":"#18181B";
 return {bg,fg,pr,se,ac,hf:fam(f.h,f.hg),bf:fam(f.b,f.bg),font:f,pal:p,r:texLv("radius").val,sh:texLv("shadow").val,ln:texLv("line").val,gr:texLv("gradient"),dens:(DENS.find(d=>S.votes[d.id]==1)||DENS.find(d=>d.id==S.q.dens)||DENS[1])}}
function hx6(h){h=h.replace("#","");return h.length==3?h.split("").map(c=>c+c).join(""):h}
function rl(h){h=hx6(h);return .2126*ch(h,0)+.7152*ch(h,2)+.0722*ch(h,4)}function ch(h,i){const c=parseInt(h.substr(i,2),16)/255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)}
function cr(a,b){const x=rl(a),y=rl(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function lumi(h){h=hx6(h);const n=[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255);return .299*n[0]+.587*n[1]+.114*n[2]}
const on=bg=>cr(bg,"#111111")>=cr(bg,"#ffffff")?"#111":"#fff";
const NEUTRAL={bg:"#f7f6f3",fg:"#18181b",pr:"#e4572e",se:"#2d6cdf",ac:"#e4572e",hf:fam("Noto Sans TC","sans"),bf:fam("Noto Sans TC","sans"),r:10,sh:"0 6px 18px rgba(0,0,0,.08)",ln:"1px solid #e4e4e7"};
// ---------- card previews (all render inside .pv 4:3, sized with cqw)
const VCOPY={V01:["形式追隨功能","Grid／Type／Order","Atelier"],V02:["在黑暗中<br>專注","為夜貓子打造的工具","Nocturne"],V03:["清透，<br>但有層次","光線穿過的介面","Prism"],V04:["不修飾<br>就是態度","RAW・NO・FILTER","BRUT"],V05:["好玩的<br>生產力","把待辦變成遊戲","Pop!"],V06:["下一代<br>AI 工作台","從想法到上線，一步到位","Aurora"],V07:["一眼看完<br>所有重點","模組化的資訊排版","Bento"],V08:["軟軟的<br>很好按","每個按鈕都想戳一下","Mochi"],V09:["觸感<br>介面","光影做出的凹凸","Soft"],V10:["系統<br>已接管","NEON CITY 2077","NEXUS"],V11:["> 部署完成_","build passed in 2.4s","~/term"],V12:["慢讀<br>的美學","第 42 期｜城市與光","Quarterly"],V13:["少，<br>但更好","限量典藏系列","MAISON"],V14:["形狀<br>與顏色","回到最基本的構成","Bauhaus"],V15:["千禧<br>回來了","閃亮亮的數位夢","Y2K"],V16:["永遠的<br>1987","A E S T H E T I C","VAPOR"],V17:["與自然<br>共生","慢慢生長的品牌","Moss"],V18:["像紙一樣<br>安靜","只留下文字本身","Paper"],V19:["規則<br>是拿來打破的","Memphis Milano","Memphis"],V20:["即時營收<br>NT$2.4M","本週 +18.2%","Metrics"],V21:["按 START<br>開始","LEVEL 1・READY","8-BIT"],V22:["底片<br>的溫度","Kodak Portra 400","Analog"],V23:["簡單<br>而周到","為每天的工作設計","Calm"],V24:["做得<br>更少","",""]};
function pvVibe(v){const fx={glass:`<i class="fx-glass"></i>`,aurora:`<i class="fx-aurora"></i>`,scan:`<i class="fx-scan"></i>`,grid:`<i class="fx-grid"></i>`,blob:`<i class="fx-blob"></i>`,grain:`<i class="fx-grain"></i>`,memphis:`<i class="fx-memphis"></i>`,bauhaus:`<i class="fx-bauhaus"></i>`}[v.fx]||"";
 const f=F[v.font],box=`border-radius:${v.r}px;box-shadow:${v.sh};border:${v.bd}`;const[h,p,brand]=VCOPY[v.id]||["讓想法<br>被看見","",""];
 const big=v.fx=="bigtype",center=["V03","V06","V09","V23"].includes(v.id);
 return `<div class="pv" style="background:${v.bg};color:${v.fg};font-family:${f}">${fx}
 <div class="pv-in${center?" v-center":""}"><div class="v-nav"><span class="v-brand"><b style="color:${v.ac}">●</b> ${brand||"Studio"}</span><span class="v-links">作品　關於　聯絡</span></div>
 <div class="v-h" style="${big?'font-size:15cqw;line-height:.9;font-weight:900':''}">${h}</div>
 ${p?`<p class="v-p">${p}</p>`:""}
 <div class="v-row"><span class="v-btn" style="background:${v.ac};color:${on(v.ac)};${box}">開始使用</span>
 ${center?"":v.fx=="bars"?`<span class="v-bars">${[40,70,55,90,65].map(h=>`<i style="height:${h}%;background:${v.ac}"></i>`).join("")}</span>`:`<span class="v-card" style="${box};background:${v.fx=='glass'?'rgba(255,255,255,.25)':'transparent'}">2026<br><small>精選作品</small></span>`}</div></div></div>`}
function pvPal(p){const[bg,fg,pr,se,ac]=p.c;return `<div class="pv" style="background:${bg};color:${fg};font-family:${F.sans}">
 <div class="p-sw">${p.c.map(c=>`<i style="background:${c}"></i>`).join("")}</div>
 <div class="pv-in p-in"><div class="p-h">本週重點</div><div class="p-row"><span class="p-btn" style="background:${pr};color:${on(pr)}">主要按鈕</span><span class="p-tag" style="background:${se};color:${on(se)}">次要</span><span class="p-tag" style="background:${ac};color:${on(ac)}">強調</span></div>
 <div class="p-hex">${p.c.map(c=>c.toUpperCase()).join("　")}</div></div></div>`}
function pvFont(f){return `<div class="pv" style="background:#faf9f6;color:#151515"><div class="pv-in f-in">
 <div class="f-h" style="font-family:${fam(f.h,f.hg)};${/Black/.test(f.h)?"font-weight:900":""}">${f.cjk?"審美是看得見的態度":"Taste is visible"}</div>
 <div class="f-h2" style="font-family:${fam(f.h,f.hg)}">${f.cjk?"Aa 永 123":"審美是看得見的態度"}</div>
 <p class="f-p" style="font-family:${fam(f.b,f.bg)}">好的字體會替你說話。標題定調，內文負責讓人讀得舒服、讀得下去。The quick brown fox.</p>
 <div class="f-meta">${esc(f.h)} ／ ${esc(f.b)}</div></div></div>`}
function pvDens(d){const t=NEUTRAL,n=[1,3,4,8][d.lv<0?d.lv+2:d.lv+1];const items=["定位","受眾","內容","節奏","數據","回顧","預算","下一步"].slice(0,n);
 return `<div class="pv" style="background:${t.bg};color:${t.fg};font-family:${t.bf}"><div class="pv-in d-${d.id}">
 <div class="d-h" style="font-family:${d.id=='N3'?F.serif:t.hf}">${d.id=="N1"?"只講<br>一件事":"內容規劃"}</div>${d.id=="N1"?`<p class="d-sub">把最重要的訊息放大，其餘都留白。</p>`:""}
 <div class="d-g">${items.map((x,i)=>`<div class="d-c"><b style="color:${t.pr}">0${i+1}</b>${x}${d.lv>=1?`<small>重點說明與補充文字，讓資訊更完整。</small>`:""}</div>`).join("")}</div></div></div>`}
function pvTex(x){const base=`background:#fff;border-radius:10px;box-shadow:0 1px 2px rgba(0,0,0,.06);border:1px solid #e7e5e4`;let card=base,btn="background:#18181b;color:#fff;border-radius:8px";
 if(x.aspect=="radius"){card=`background:#fff;border-radius:${x.val}px;border:1px solid #e4e4e7`;btn=`background:#18181b;color:#fff;border-radius:${x.val}px`}
 if(x.aspect=="shadow"){card=`background:#fff;border-radius:10px;box-shadow:${x.val};${x.lv==3?'border:2px solid #111':''}`}
 if(x.aspect=="line"){card=`background:#fff;border-radius:6px;border:${x.val}`;btn=`background:#fff;color:#111;border:${x.val=='none'?'1px solid transparent':x.val};border-radius:6px`}
 if(x.aspect=="gradient"){btn=`background:${x.lv==3?"#0b1020":x.val};color:#fff;border-radius:8px`;card=`background:${x.val};color:#fff;border-radius:12px`}
 return `<div class="pv" style="background:${x.aspect=='shadow'?'#f1f0ee':'#f7f6f3'};color:#18181b;font-family:${F.sans}"><div class="pv-in t-in">
 <div class="t-card" style="${card}"><b>每月報告</b><span>營收成長 24%</span></div>
 <div class="t-row"><span class="t-btn" style="${btn}">確認</span><span class="t-chip" style="border-radius:${x.aspect=='radius'?x.val:999}px">${esc(x.aspectZh)}</span></div></div></div>`}
function pvSlide(s,t=NEUTRAL){const H=`font-family:${t.hf}`,acc=t.pr;const L={
 center:`<div class="s-c"><small style="color:${acc}">2026 Q4</small><h3 style="${H}">年度品牌策略</h3><p>從定位到內容的完整藍圖</p></div>`,
 left:`<div class="s-l"><small style="color:${acc}">問題</small><h3 style="${H}">八成的貼文<br>沒人看完</h3><p>不是內容不好，是第一眼沒抓住人。</p></div>`,
 metric:`<div class="s-c"><h3 style="${H};font-size:22cqw;color:${acc}">3.2×</h3><p>導入設計規範後的互動率</p></div>`,
 cols3:`<h4 style="${H}">三個核心</h4><div class="s-3">${["定位","內容","節奏"].map((x,i)=>`<div style="border-top:2px solid ${acc}"><b>0${i+1}</b>${x}</div>`).join("")}</div>`,
 split:`<div class="s-sp"><div><h4 style="${H}">看得見的<br>品牌感</h4><p>每個畫面都像同一個人做的。</p></div><i style="background:linear-gradient(135deg,${acc},${t.se})"></i></div>`,
 timeline:`<h4 style="${H}">上線時程</h4><div class="s-tl">${["盤點","設計","測試","上線"].map(x=>`<span><i style="background:${acc}"></i>${x}</span>`).join("")}</div>`,
 quote:`<div class="s-q"><b style="color:${acc}">“</b><h4 style="font-family:${F.serif}">簡單，是最終極的複雜。</h4><small>— 達文西</small></div>`,
 compare:`<h4 style="${H}">有 vs. 沒有</h4><div class="s-cmp"><div><b>沒有規範</b>風格不一<br>每次重講</div><div style="background:${acc};color:${on(acc)}"><b>有審美 DNA</b>一致<br>一次到位</div></div>`,
 chart:`<h4 style="${H}">互動成長</h4><div class="s-ch">${[30,45,40,62,58,80,92].map(h=>`<i style="height:${h}%;background:${acc}"></i>`).join("")}</div>`,
 bento:`<div class="s-be"><div style="background:${acc};color:${on(acc)}"><b>+48%</b>觸及</div><div><b>12k</b>追蹤</div><div><b>4.9</b>評分</div><div><b>86</b>貼文</div></div>`,
 statement:`<div class="s-st" style="background:${t.fg};color:${t.bg}"><h3 style="${H}">少即是多。</h3></div>`,
 cta:`<div class="s-c"><h3 style="${H}">一起開始</h3><span class="s-btn" style="background:${acc};color:${on(acc)};border-radius:${t.r}px">預約討論 →</span></div>`}[s.lay];
 return `<div class="pv slide" style="background:${t.bg};color:${t.fg};font-family:${t.bf}"><div class="pv-in">${L}</div><span class="s-pg">${s.id.slice(1)}</span></div>`}
function pvSocial(g,t=NEUTRAL){const H=`font-family:${t.hf}`,acc=t.pr;const L={
 poster:`<div class="g-po" style="background:${acc};color:${on(acc)}"><h3 style="${H}">別再<br>亂配色</h3></div>`,
 tweet:`<div class="g-tw" style="background:#fff;color:#0f1419;border-radius:${t.r}px"><div class="g-av"><i style="background:${acc}"></i><b>先知到</b><span>@0xianzdao</span></div><p>AI 做的東西都長一樣，是因為你沒告訴它你的審美。</p><small>下午 9:41 · 2.4 萬次瀏覽</small></div>`,
 carousel:`<div class="g-ca"><small style="color:${acc}">1 / 6</small><h3 style="${H}">5 個讓簡報<br>變高級的細節</h3><span>左滑看完 →</span></div>`,
 data:`<div class="g-da"><small>本月觸及</small><h3 style="${H};color:${acc}">128,400</h3><div class="g-sp">${[20,35,28,50,44,70,88].map(h=>`<i style="height:${h}%;background:${acc}"></i>`).join("")}</div></div>`,
 quote:`<div class="g-qu"><b style="color:${acc};font-family:${F.serif}">“</b><h4 style="font-family:${F.serif}">品味不是天生的，<br>是選出來的。</h4></div>`,
 list:`<div class="g-li"><h4 style="${H}">新手必裝 5 個工具</h4>${["Cursor","Figma","Notion","Raycast","Arc"].map((x,i)=>`<div><b style="color:${acc}">${i+1}</b>${x}</div>`).join("")}</div>`,
 beforeafter:`<div class="g-ba"><div><small>Before</small><i class="g-x"></i></div><div style="background:${acc};color:${on(acc)}"><small>After</small><b>✓</b></div></div>`,
 meme:`<div class="g-me"><div><span>我以為的 AI 設計</span></div><div style="background:${acc};color:${on(acc)}"><span>加了審美 DNA 後</span></div></div>`,
 mag:`<div class="g-mg"><b style="font-family:${F.serif}">TASTE</b><h4 style="font-family:${F.serif}">審美的 12 種樣子</h4><small>2026 秋季號</small></div>`,
 note:`<div class="g-no" style="font-family:${F.kai}"><p>今天學到的事：<br>留白不是浪費。</p></div>`,
 term:`<div class="g-te"><span>$ taste --dna</span><span style="color:#39ff88">✔ 已載入 23 項偏好</span><span>▌</span></div>`,
 icon:`<div class="g-ic"><i style="border-color:${acc}"></i><h4 style="${H}">專注</h4></div>`}[g.lay];
 return `<div class="pv social" style="background:${t.bg};color:${t.fg};font-family:${t.bf}"><div class="pv-in">${L}</div></div>`}
function preview(it,t){return {vibe:pvVibe,pal:pvPal,font:pvFont,dens:pvDens,tex:pvTex,slide:x=>pvSlide(x,t),social:x=>pvSocial(x,t)}[it.cat](it)}
const label=it=>it.zh||it.name;
const sub=it=>({vibe:"風格原型："+it.src,pal:it.src,font:it.cjk?"中文字體搭配":esc(it.h)+" ＋ "+esc(it.b),dens:"版面密度",tex:"細節質感・"+it.aspectZh,slide:SLIDESUB[it.lay],social:SOCSUB[it.lay]})[it.cat];
// ---------- screens
function shell(inner,progress){app().innerHTML=`<header class="top"><a class="logo" href="#" onclick="go('intro');return false">審美 DNA</a>${progress!=null?`<div class="bar"><i style="width:${progress}%"></i></div>`:""}<button class="ghost sm" onclick="resetAll()">重新開始</button></header><main>${inner}</main>${footer()}`;window.scrollTo(0,0)}
function footer(){return `<footer><a href="https://0xianzdao.github.io/taste-dna/">0xianzdao.github.io/taste-dna</a>（預覽版）・資料來源（MIT）：<a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill">ui-ux-pro-max-skill</a>・<a href="https://github.com/Leonxlnx/taste-skill">taste-skill</a>・<a href="https://github.com/VoltAgent/awesome-design-md">awesome-design-md</a>。整理、繁中化與介面設計：@0xianzdao。文中提及的品牌名稱均屬各自所有者，僅作為設計風格的描述參考，與本工具無任何關聯或背書。所有選擇只存在你的瀏覽器，不上傳、不需登入。</footer>`}
function go(s){S.step=s;save();render()}
function resetAll(){if(confirm("要清除所有選擇、重新開始嗎？")){localStorage.removeItem(KEY);location.reload()}}
const QS=[
 {k:"uses",t:"你最常叫 AI 做什麼？",d:"可複選，決定之後要挑哪些成品類型。",multi:1,opts:["簡報","社群圖","網頁","生圖","影片"]},
 {k:"feel",t:"你希望作品給人什麼感覺？",d:"最多選兩個。",multi:2,opts:Object.keys(QUIZ_FEEL)},
 {k:"mode",t:"亮色還是暗色？",opts:["亮","暗","都可以"]},
 {k:"dens",t:"你喜歡畫面空一點，還是滿一點？",vis:DENS},
 {k:"least",t:"哪一張「最不像你」？",d:"選中的風格會直接放進地雷清單。",vis:EXTREMES}];
function render(){const st=S.step;
 if(st=="intro")return shell(`<section class="hero"><p class="eyebrow">7 分鐘・免費・不用登入</p><h1>找到你的<br><em>審美 DNA</em></h1><p class="lead">看圖、按喜歡或不要。系統會越選越懂你，最後給你一份白話審美報告、一張分享圖，加上一份貼給 AI 就能用的 DESIGN.md。</p><button class="primary" onclick="go('q0')">開始測驗</button><div class="hero-cards">${["V12","V02","V07"].map(id=>`<div class="hc">${preview(byId[id])}</div>`).join("")}</div></section>`);
 if(st[0]=="q"){const i=+st.slice(1),q=QS[i];const val=S.q[q.k];
  const opts=q.vis?`<div class="vgrid">${q.vis.map(o=>{const it=o.vibe?byId[o.vibe]:o;return `<button class="vopt ${val==o.id?"sel":""}" onclick="pickQ('${q.k}','${o.id}')"><div class="pvw">${preview(it)}</div><span>${o.name}</span></button>`}).join("")}</div>`
  :`<div class="chips">${q.opts.map(o=>{const sel=q.multi?(val||[]).includes(o):val==o;return `<button class="chip ${sel?"sel":""}" onclick="pickQ('${q.k}','${o}')">${o}</button>`}).join("")}</div>`;
  const ok=q.multi?(val||[]).length>0:!!val;
  return shell(`<section class="quiz"><p class="eyebrow">快速定調 ${i+1} / 5</p><h2>${q.t}</h2>${q.d?`<p class="muted">${q.d}</p>`:""}${opts}<div class="nav"><button class="ghost" onclick="go('${i?"q"+(i-1):"intro"}')">上一步</button><button class="primary" ${ok?"":"disabled"} onclick="go('${i<4?"q"+(i+1):"pick"}')">下一步</button></div></section>`,(i+1)*8)}
 if(st=="pick")return renderPick();
 if(st=="nope")return renderNope();
 if(st=="result")return renderResult()}
function pickQ(k,v){const q=QS.find(x=>x.k==k);if(q.multi){let a=S.q[k]||[];a=a.includes(v)?a.filter(x=>x!=v):[...a,v];if(a.length>(q.multi==2?2:9))a.shift();S.q[k]=a}else S.q[k]=v;save();render()}
function renderPick(){const cats=activeCats();let ci=S.cat;
 while(ci<cats.length&&!nextCard(cats[ci]))ci++;
 if(ci>=cats.length){S.cat=ci;return go("nope")}S.cat=ci;save();
 const c=cats[ci],it=nextCard(c),seen=(S.seen[c.k]||[]).length,tot=Math.min(c.n,c.items.length);
 const done=cats.slice(0,ci).reduce((s,x)=>s+Math.min(x.n,x.items.length),0)+seen,all=cats.reduce((s,x)=>s+Math.min(x.n,x.items.length),0);
 const soon=CATS.filter(x=>x.soon&&S.q.uses.includes(x.need));
 const t=(c.k=="slide"||c.k=="social")?theme():undefined;
 shell(`<section class="pick"><div class="tabs">${cats.map((x,i)=>`<span class="${i==ci?"on":i<ci?"done":""}">${x.zh}</span>`).join("")}${soon.map(x=>`<span class="soon">${x.zh}・即將推出</span>`).join("")}</div>
 <p class="eyebrow">${c.zh}　${seen+1} / ${tot}</p><p class="muted">${c.hint}</p>
 <div class="stage"><div class="big">${preview(it,t)}</div><div class="cap"><b>${esc(label(it))}</b><small>${esc(sub(it))}</small></div></div>
 <div class="vote"><button class="no" onclick="vote('${it.id}',-1)" aria-label="不要">✕<span>不要</span></button><button class="skip" onclick="vote('${it.id}',0)">略過</button><button class="yes" onclick="vote('${it.id}',1)" aria-label="喜歡">♥<span>喜歡</span></button></div>
 <p class="keys">鍵盤：← 不要　↓ 略過　→ 喜歡</p></section>`,10+done/all*80)}
function vote(id,v){const it=byId[id];S.votes[id]=v;(S.seen[it.cat]=S.seen[it.cat]||[]).push(id);save();render()}
document.addEventListener("keydown",e=>{if(S.step!="pick")return;const b={ArrowLeft:".no",ArrowRight:".yes",ArrowDown:".skip"}[e.key];if(b){e.preventDefault();$(b)&&$(b).click()}});
function renderNope(){shell(`<section class="nope"><p class="eyebrow">最後一步</p><h2>你最受不了哪些 AI 套版感？</h2><p class="muted">整理自 taste-skill 的反模板規則。勾越多，AI 越知道要避開什麼。</p><div class="nl">${NOPE.map(([k,t])=>`<label class="${S.nope.includes(k)?"sel":""}"><input type="checkbox" ${S.nope.includes(k)?"checked":""} onchange="tg('${k}')"><span>${t}</span></label>`).join("")}</div><div class="nav"><button class="ghost" onclick="S.cat=0;go('pick')">回去挑選</button><button class="primary" onclick="go('result')">看我的審美 DNA</button></div></section>`,95)}
function tg(k){S.nope=S.nope.includes(k)?S.nope.filter(x=>x!=k):[...S.nope,k];save();renderNope()}
// ---------- result
function dna(){const v=vec(),t=theme();const KW_W={bright:.6,tech:.8,contrast:.8,sat:.9};const order=DIMS.map((d,i)=>[d,v[i]]).sort((a,b)=>Math.abs(b[1])*(KW_W[b[0]]||1)-Math.abs(a[1])*(KW_W[a[0]]||1));
 const kw=order.slice(0,3).map(([d,x])=>DZH[d][x>=0?0:1]);
 const vibes=VIBES.filter(x=>S.votes[x.id]==1).sort((a,b)=>dot(v,b.tags)-dot(v,a.tags)).slice(0,3);
 const vb=vibes.length?vibes:[VIBES.slice().sort((a,b)=>dot(v,b.tags)-dot(v,a.tags))[0]];
 const brands=GEN.brands.map(b=>[b,cos(v,b.tags)+(BRAND_FIX[b.name]?.08:0)+(S.q.mode=="暗"&&lumi(b.c[0])<.3?.15:0)]).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]);
 const dislikedV=VIBES.filter(x=>S.votes[x.id]==-1).map(x=>x.name);const ext=S.q.least&&byId[EXTREMES.find(e=>e.id==S.q.least).vibe].name;
 if(ext&&!dislikedV.includes(ext))dislikedV.unshift(ext);
 const nopes=NOPE.filter(n=>S.nope.includes(n[0])).map(n=>n[1]);
 const slides=SLIDES.filter(s=>S.votes[s.id]==1),socials=SOCIAL.filter(s=>S.votes[s.id]==1);
 const name=kw[0]+"・"+vb[0].name;
 const sum=`你喜歡${kw[0]}、${kw[1]}的畫面，整體偏向「${vb.map(x=>x.name).join("、")}」，再帶一點${kw[2]}；配色以「${t.pal.zh}」為底，用「${t.font.zh}」說話。`;
 return {v,t,kw,vb,brands,dislikedV,nopes,slides,socials,name,sum}}
function renderResult(){const d=dna(),t=d.t;const css=`--onpr:${on(t.pr)};--bg:${t.bg};--fg:${t.fg};--pr:${t.pr};--se:${t.se};--ac:${t.ac};--hf:${t.hf};--bf:${t.bf};--r:${t.r}px;--sh:${t.sh};--ln:${t.ln};--gr:${t.gr.lv&&t.gr.lv<3?t.gr.val.replace(/#4f46e5|#5b54ec|#4338ca/g,t.pr):t.pr}`;
 shell(`<section class="result"><p class="eyebrow">你的審美 DNA</p><h1 class="rname">${esc(d.name)}</h1><p class="sum">${esc(d.sum)}</p><div class="kws">${d.kw.map(k=>`<span>#${k}</span>`).join("")}</div>
 <div class="rgrid"><div class="rc"><h3>配色</h3><div class="sw">${t.pal.c.map((c,i)=>`<div><i style="background:${c}"></i><small>${["背景","文字","主色","輔色","強調"][i]}<br>${c.toUpperCase()}</small></div>`).join("")}</div><p class="muted">${esc(t.pal.zh)}</p></div>
 <div class="rc"><h3>字體</h3><div class="fh" style="font-family:${t.hf}">標題 ${esc(t.font.h)}</div><div class="fb" style="font-family:${t.bf}">內文 ${esc(t.font.b)}：讀起來舒服的段落。</div><p class="muted">${esc(t.font.zh)}・密度：${t.dens.name}</p></div>
 <div class="rc"><h3>設計靈感相近的品牌</h3>${d.brands.map(b=>`<div class="br"><i style="background:${b.c[0]}"></i><i style="background:${b.c[1]}"></i><b>${esc(b.disp)}</b></div>`).join("")}<p class="muted fine">你的偏好和這些品牌公開的設計語言相近，僅供參考。品牌名稱屬各自所有者，本工具與其無任何關聯、合作或背書；比對資料來自開源專案 awesome-design-md（MIT）。</p></div>
 <div class="rc"><h3>地雷清單</h3><ul class="nlist">${[...d.dislikedV.map(x=>"風格："+x),...d.nopes].slice(0,10).map(x=>`<li>${esc(x)}</li>`).join("")||"<li>（沒有勾選）</li>"}</ul></div></div>
 <h2 class="sec">套用你的 DNA</h2><div class="live" style="${css}">
  <div class="lv-slide"><small>簡報頁</small><div class="ls"><span class="k">2026 提案</span><h3>讓 AI 懂你的審美</h3><p>一份檔案，所有作品風格一致。</p><span class="btn">了解更多</span></div></div>
  <div class="lv-social"><small>社群卡</small><div class="lsc"><h3>我的審美<br>DNA 是</h3><b>${esc(d.kw[0])}</b><span>@0xianzdao</span></div></div>
  <div class="lv-web"><small>網頁卡片</small><div class="lw"><div class="lw-img"></div><h4>精選作品</h4><p>${esc(d.kw.join("・"))}</p><div class="lw-row"><span class="btn">查看</span><span class="ln">收藏</span></div></div></div></div>
 <h2 class="sec">帶走你的 DNA</h2><div class="acts"><button class="primary" onclick="copyMd('design')">複製 DESIGN.md</button><button onclick="dl('design')">下載 DESIGN.md</button><button onclick="copyMd('skill')">複製 SKILL.md</button><button onclick="dl('skill')">下載 SKILL.md</button><button onclick="sharePng()">下載分享圖</button></div>
 <p class="muted" id="tok"></p><details><summary>預覽 DESIGN.md</summary><pre id="mdpre"></pre></details>
 <div class="nav"><button class="ghost" onclick="S.cat=0;go('pick')">回去修改</button></div></section>`,100);
 $("#mdpre").textContent=designMd(d);const all=designMd(d)+skillMd();$("#tok").textContent=`兩份檔案合計約 ${estTok(all).toLocaleString()} tokens，貼給任何 AI 都不吃記憶。`}
function estTok(s){const cjk=(s.match(/[\u3000-\u9fff\uff00-\uffef]/g)||[]).length;const rest=s.replace(/[\u3000-\u9fff\uff00-\uffef]/g," ");return Math.round(cjk*1.1+rest.length/4)}
function designMd(d){d=d||dna();const t=d.t,c=t.pal.c,dn=t.dens;
 const sp={N1:"區塊間距 96px，內距 48px，一屏只放 1 個重點",N2:"區塊間距 64px，內距 32px，一屏 2–3 個重點",N3:"區塊間距 48px，內距 24px，用欄線和小標分層，像雜誌",N4:"區塊間距 32px，內距 16px，一屏可放 6–8 個資訊塊，靠網格對齊"}[dn.id];
 const L=[`# DESIGN.md — 我的審美 DNA：${d.name}`,"",`> ${d.sum}`,"",`關鍵字：${d.kw.join("、")}｜氣質參考：${d.vb.map(x=>x.name+"（"+x.src+"）").join("、")}`,"",
 "## 1. 配色",`- 背景 ${c[0]}｜文字 ${c[1]}`,`- 主色 ${c[2]}（按鈕、重點）｜輔色 ${c[3]}｜強調 ${c[4]}（每畫面最多一處）`,`- 模式：${S.q.mode=="暗"?"暗色為主":S.q.mode=="亮"?"亮色為主":"亮暗皆可，維持同一組主色"}`,"",
 "## 2. 字體",`- 標題：${t.font.h}（粗 700，字級 40/32/24px，行高 1.2）`,`- 內文：${t.font.b}（400，16px，行高 1.7）`,"- 中文後備：Noto Sans TC／Noto Serif TC，全形標點，中英之間加半形空格","",
 "## 3. 細節數值",`- 圓角：${texLv("radius").name}（${t.r}px，大元素可 ×1.5）`,`- 陰影：${texLv("shadow").name}（${t.sh}）`,`- 線條：${texLv("line").name}（${t.ln}）`,`- 漸層：${t.gr.name}`,`- 間距基準 8px；${sp}`,"",
 `## 4. 版面密度：${dn.name}`,`- ${sp}`,"- 對齊靠網格，不要全部置中；只留一個視覺焦點",""];
 if(d.slides.length)L.push("## 5. 簡報",`- 偏好版型：${d.slides.map(s=>s.name).join("、")}`,"- 一頁一個訊息，標題寫結論，不寫主題","");
 if(d.socials.length)L.push(`## ${d.slides.length?6:5}. 社群圖文`,`- 偏好模式：${d.socials.map(s=>s.name).join("、")}`,"- 1080×1350，大標 3 秒內讀完，品牌色固定出現在同一位置","");
 L.push("## 地雷（不要做）",...d.dislikedV.map(x=>"- 風格："+x),...d.nopes.map(x=>"- "+x),"","## 設計靈感參考",`- 設計語言近似：${d.brands.map(b=>b.disp).join("、")}（只參考精神；不得使用其商標、標誌或照抄。品牌名稱屬各自所有者，與本檔無關聯）`,"","---","本檔由「審美 DNA」產生。資料來源皆為 MIT 授權：","- ui-ux-pro-max-skill © nextlevelbuilder — https://github.com/nextlevelbuilder/ui-ux-pro-max-skill","- taste-skill © Leonxlnx — https://github.com/Leonxlnx/taste-skill","- awesome-design-md © VoltAgent — https://github.com/VoltAgent/awesome-design-md","Permission is hereby granted, free of charge, to any person obtaining a copy of this software… (MIT License; full text in each repository.)");
 return L.join("\n")}
function skillMd(){return `---
name: taste-dna
description: 依使用者的審美 DNA 產出設計（簡報、社群圖、網頁、圖像）。任何設計任務開始前使用。
---
# taste-dna：照我的審美做

## 動手前
1. 先讀專案裡的 DESIGN.md。那是我的審美，優先級高於你的預設偏好。
2. 沒有 DESIGN.md 就先問我要，不要自己猜一套。
3. 用 DESIGN.md 的色票 hex、字體、圓角、陰影、間距數值，不要換成「差不多」的值。

## 反模板規則（整理自 taste-skill）
- 不用紫藍漸層、發光按鈕、隨機霓虹當預設。中性底色＋一個高對比強調色。
- 不要所有東西都置中。用網格、不對稱和留白建立層次。
- 不要「大標＋三張功能卡」的制式首頁；換成便當格、編輯式、分欄或大字版面。
- 字體要有個性。不要全部 Inter；標題和內文要有對比（字重、字級或字族）。
- 不用 emoji 當圖示；圖示用同一套線條粗細。
- 不要寫假數據、假評價、「釋放潛能」「重新定義」這類空話。用具體、真實的內容。
- 圓角、陰影只用 DESIGN.md 的那一組，不要每個元素都不一樣，也不要全部同一個大圓角。
- 陰影要低調；除非 DESIGN.md 指定，不用彩色陰影或外發光。
- 不要純黑 #000 配純白；用帶色偏的深色與米白。
- 一個畫面只有一個視覺焦點，強調色每畫面最多出現一處大面積。
- 動畫只用在有意義的地方，避免滿版進場動畫。
- 中文排版：全形標點、中英之間半形空格、行高 1.6–1.8、每行 15–30 字。
- 間距一律用 8 的倍數。

## 交付前自查
- [ ] 色票、字體、數值都來自 DESIGN.md
- [ ] 沒踩到 DESIGN.md 的「地雷」任何一條
- [ ] 換掉品牌名後，這份作品還認得出是我的風格，而不是 AI 預設樣板
- [ ] 手機寬度 390px 下文字不溢出、不裁切

來源：taste-skill（MIT, © Leonxlnx）的反模板規則，經整理與繁中化。`}
function blob(k){const s=k=="design"?designMd():skillMd();return s}
function copyMd(k){const s=blob(k);(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>toast("已複製，貼給你的 AI 吧")).catch(()=>{const ta=document.createElement("textarea");ta.value=s;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();toast("已複製")})}
function dl(k){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([blob(k)],{type:"text/markdown"}));a.download=k=="design"?"DESIGN.md":"SKILL.md";a.click()}
function toast(m){const e=document.createElement("div");e.className="toast";e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2000)}
async function sharePng(ret){const d=dna(),t=d.t,W=1080,H=1350,cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d");
 const sans="'Noto Sans TC',sans-serif",mono="'JetBrains Mono',monospace";
 await Promise.all([document.fonts.load(`900 100px ${t.hf}`,d.name),document.fonts.load(`700 30px ${sans}`,"審美"),document.fonts.load(`400 20px ${mono}`,"#0")]).catch(()=>{});await document.fonts.ready;
 const bg=t.bg,fg=t.fg,dark=lumi(bg)<.5,M=88;
 x.fillStyle=bg;x.fillRect(0,0,W,H);
 let g=x.createRadialGradient(W-120,140,0,W-120,140,760);g.addColorStop(0,t.pr+(dark?"40":"26"));g.addColorStop(1,t.pr+"00");x.fillStyle=g;x.fillRect(0,0,W,H);
 g=x.createRadialGradient(80,H-80,0,80,H-80,600);g.addColorStop(0,t.se+(dark?"30":"20"));g.addColorStop(1,t.se+"00");x.fillStyle=g;x.fillRect(0,0,W,H);
 const A=(o)=>x.globalAlpha=o;
 // header
 x.fillStyle=fg;x.font=`900 30px ${sans}`;x.fillText("審美 DNA",M,M+20);A(.5);x.font=`400 22px ${mono}`;x.textAlign="right";
 const no="No."+String(Math.abs(d.v.reduce((s,y,i)=>s*31+Math.round(y*10)+i,7))%10000).padStart(4,"0");x.fillText(no,W-M,M+18);x.textAlign="left";A(1);
 x.fillStyle=fg;A(.15);x.fillRect(M,M+48,W-2*M,2);A(1);
 // title
 A(.65);x.font=`500 34px ${sans}`;x.fillText("我的審美 DNA 是",M,250);A(1);
 const parts=d.name.split("・");parts.forEach((l,k)=>{let s=128;x.font=`900 ${s}px ${t.hf}`;while(x.measureText(l).width>W-2*M&&s>60){s-=4;x.font=`900 ${s}px ${t.hf}`}x.fillStyle=k?t.pr:fg;x.fillText(l,M,390+k*150)});
 // DNA barcode
 const bx=M,by=700,bw=W-2*M,bh=120,n=DIMS.length,gap=10,w=(bw-gap*(n-1))/n,mx=Math.max(...d.v.map(Math.abs),1);
 d.v.forEach((y,k)=>{const h=Math.max(10,Math.abs(y)/mx*bh);x.fillStyle=t.pal.c[2+(k%3)];if(cr(x.fillStyle,bg)<1.6)x.fillStyle=fg;A(y>=0?1:.35);rr(x,bx+k*(w+gap),by+bh-h,w,h,w/2);x.fill()});A(1);
 A(.45);x.font=`400 18px ${mono}`;x.fillStyle=fg;x.fillText("15 個審美維度",bx,by+bh+34);x.textAlign="right";x.fillText(d.kw.map(k=>"#"+k).join("  "),W-M,by+bh+34);x.textAlign="left";A(1);
 // summary
 x.fillStyle=fg;A(.85);x.font=`400 32px ${sans}`;wrap(x,d.sum,M,930,W-2*M,52,3);A(1);
 // palette strip
 const py=1068,pw=(W-2*M)/5;t.pal.c.forEach((c,k)=>{x.fillStyle=c;x.beginPath();x.rect(M+k*pw,py,pw+1,96);x.fill()});
 x.strokeStyle=fg;A(.18);x.lineWidth=2;x.strokeRect(M,py,W-2*M,96);A(.6);x.fillStyle=fg;x.font=`400 18px ${mono}`;t.pal.c.forEach((c,k)=>x.fillText(c.toUpperCase(),M+k*pw,py+126));A(1);
 // footer
 x.fillStyle=fg;x.font=`700 28px ${sans}`;x.fillText("設計靈感近似　"+d.brands.map(b=>b.disp).join("・"),M,1262);
 A(.55);x.font=`500 22px ${sans}`;x.textAlign="right";x.fillText("@0xianzdao",W-M,1262);A(.5);x.font=`400 20px ${mono}`;x.fillText("0xianzdao.github.io/taste-dna",W-M,1306);x.textAlign="left";A(1);
 if(ret)return cv.toDataURL();const a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download="my-taste-dna.png";a.click()}
function rr(x,a,b,w,h,r){x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)}
function wrap(x,s,a,b,w,lh,max){const NB="、，。；：」）！？";let line="",n=0,chs=[...s];for(let k=0;k<chs.length;k++){const ch=chs[k];if(x.measureText(line+ch).width>w&&!NB.includes(ch)){if(NB.includes(chs[k])){line+=ch;continue}x.fillText(line,a,b+n*lh);n++;line=ch;if(n>=max)return}else line+=ch}x.fillText(line,a,b+n*lh)}
render();
