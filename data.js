// curated, hand-tagged. Tag order matches D.
const DIMS=["bright","sat","radius","serif","dense","contrast","play","lux","tech","warm","bold","retro","organic","depth","structure"];
const DZH={bright:["明亮","暗色"],sat:["鮮豔","低飽和"],radius:["圓潤","俐落直角"],serif:["襯線古典","無襯線現代"],dense:["資訊密集","大量留白"],contrast:["高對比","柔和"],play:["玩味","沉穩"],lux:["高級精緻","平實親民"],tech:["科技感","人文感"],warm:["溫暖","冷靜"],bold:["大膽","克制"],retro:["復古","當代"],organic:["自然有機","幾何理性"],depth:["立體層次","扁平"],structure:["網格秩序","自由隨性"]};
function T(o){return DIMS.map(d=>o[d]||0)}
const F={sans:`'Noto Sans TC','PingFang TC','Microsoft JhengHei',system-ui,sans-serif`,serif:`'Noto Serif TC','Songti TC','PMingLiU',Georgia,serif`,mono:`'JetBrains Mono','Noto Sans Mono','Noto Sans TC',ui-monospace,monospace`,kai:`'LXGW WenKai TC','Kaiti TC','DFKai-SB',KaiTi,serif`};
const VIBES=[
["極簡瑞士","Minimalism & Swiss Style","#ffffff","#111","#e30613","sans",0,"none","2px solid #111","",T({bright:2,structure:2,contrast:2,dense:-1,radius:-2,serif:-1,organic:-2})],
["暗黑 OLED","Dark Mode (OLED)","#000","#f2f2f2","#22d3ee","sans",10,"none","1px solid #222","",T({bright:-2,tech:2,contrast:2,sat:0})],
["玻璃擬態","Glassmorphism","linear-gradient(135deg,#6ee7f9,#a78bfa)","#0f1d3a","#fff","sans",18,"0 8px 30px rgba(0,0,0,.15)","1px solid rgba(255,255,255,.6)","glass",T({radius:2,depth:2,sat:1,tech:1,bright:1})],
["粗野主義","Brutalism","#fffb00","#000","#ff2d2d","mono",0,"6px 6px 0 #000","3px solid #000","",T({bold:2,contrast:2,play:1,radius:-2,lux:-2,structure:-1})],
["新粗野","Neubrutalism","#ffe8d6","#111","#7c5cff","sans",12,"5px 5px 0 #111","2px solid #111","",T({bold:2,play:2,contrast:1,sat:1,depth:1})],
["極光漸層","Aurora UI","#0b1020","#fff","#7cf5c4","sans",16,"0 0 40px rgba(124,245,196,.35)","1px solid #223","aurora",T({bright:-1,sat:1,tech:1,lux:1,radius:1,depth:1})],
["便當格","Bento Box Grid","#f5f5f7","#1d1d1f","#0071e3","sans",20,"0 1px 3px rgba(0,0,0,.08)","none","bento",T({structure:2,radius:2,bright:2,dense:1,tech:1})],
["黏土擬態","Claymorphism","#f4f1fa","#3b2a5a","#ff8fab","sans",26,"inset -6px -6px 12px rgba(0,0,0,.08),8px 8px 16px rgba(120,90,200,.18)","none","",T({radius:2,play:2,warm:1,depth:2,sat:1})],
["新擬物","Neumorphism","#e6e9ef","#4a5568","#5a67d8","sans",22,"8px 8px 16px #c5c8ce,-8px -8px 16px #fff","none","",T({radius:2,depth:2,contrast:-2,sat:-1})],
["賽博龐克","Cyberpunk UI","#0a0014","#00ff9c","#ff00e6","mono",0,"0 0 14px #ff00e6","1px solid #00ff9c","scan",T({bright:-2,tech:2,sat:2,bold:2,retro:1,radius:-2})],
["終端機","Terminal CLI","#0c0c0c","#33ff66","#33ff66","mono",0,"none","1px dashed #33ff66","",T({bright:-2,tech:2,dense:1,retro:1,radius:-2,lux:-1})],
["雜誌編輯","Editorial Grid / Magazine","#faf7f2","#141414","#b4232a","serif",0,"none","1px solid #141414","rule",T({serif:2,lux:1,structure:2,contrast:1,bright:1})],
["奢華黑金","Exaggerated Minimalism","#0d0d0d","#e9e2d0","#c9a14a","serif",0,"none","1px solid #c9a14a","",T({lux:2,bright:-2,serif:2,dense:-2,contrast:1})],
["包浩斯","Bauhaus","#f2ece0","#111","#1d4ed8","sans",0,"none","3px solid #111","bauhaus",T({structure:2,bold:2,sat:2,retro:1,organic:-2})],
["Y2K 千禧","Y2K Aesthetic","linear-gradient(135deg,#e0e7ff,#fbcfe8)","#3b0764","#ff4fd8","sans",30,"0 4px 0 #a855f7","2px solid #fff","",T({play:2,sat:2,retro:2,radius:2,depth:1})],
["蒸氣波","Vaporwave","linear-gradient(180deg,#2b1055,#d53a9d)","#fff","#01cdfe","mono",4,"none","1px solid #01cdfe","grid",T({retro:2,sat:2,play:1,bright:-1,tech:1})],
["自然有機","Organic Biophilic","#eef2e6","#2f3e2c","#7a9a5b","serif",28,"none","none","blob",T({organic:2,warm:1,radius:2,sat:-1,tech:-2})],
["紙本墨水","E-Ink / Paper","#f4f1ea","#222","#222","serif",2,"none","1px solid #bbb","",T({sat:-2,contrast:1,serif:1,tech:-1,dense:1,lux:0})],
["孟菲斯","Memphis Design","#fff","#111","#ff5c8a","sans",8,"4px 4px 0 #111","2px solid #111","memphis",T({play:2,sat:2,retro:2,bold:1,structure:-2})],
["資料儀表板","Data-Dense Dashboard","#0f172a","#e2e8f0","#38bdf8","sans",8,"none","1px solid #1e293b","bars",T({dense:2,tech:2,bright:-1,structure:2})],
["像素遊戲","Pixel Art","#1b1b3a","#fff","#ffcc00","mono",0,"4px 4px 0 #000","3px solid #fff","",T({retro:2,play:2,tech:1,bright:-1,radius:-2})],
["復古底片","Vintage Analog / Retro Film","#efe2c8","#3a2a1a","#c0562d","serif",6,"none","1px solid #3a2a1a","grain",T({retro:2,warm:2,organic:1,sat:-1})],
["柔和現代","Soft UI Evolution","#fbfbfd","#1f2937","#10b981","sans",14,"0 10px 30px rgba(17,24,39,.08)","1px solid #eef","",T({radius:1,bright:2,contrast:-1,depth:1,lux:1})],
["大膽字體","Bold Typography","#0a0a0a","#fafafa","#dfe104","sans",0,"none","none","bigtype",T({bold:2,contrast:2,bright:-1,dense:-1})]
].map((v,i)=>({id:"V"+String(i+1).padStart(2,"0"),name:v[0],src:v[1],bg:v[2],fg:v[3],ac:v[4],font:v[5],r:v[6],sh:v[7],bd:v[8],fx:v[9],tags:v[10]}));
const DENS=[
{id:"N1",name:"極簡留白",lv:-2,tags:T({dense:-2,lux:1})},{id:"N2",name:"平衡",lv:-1,tags:T({dense:0})},
{id:"N3",name:"雜誌感",lv:1,tags:T({dense:1,serif:1,structure:1})},{id:"N4",name:"資訊密集",lv:2,tags:T({dense:2,tech:1})}];
const TEX=[];
DETAIL_PRESETS.forEach(p=>TEX.push({id:"X"+(TEX.length+1),aspect:"detail",aspectZh:"細節組合",name:p.name,k:p.k,r:p.r,sh:p.sh,ln:p.ln,val:p.r,lv:0,tags:T(p.tags)}));
[["純色","#4f46e5",{structure:1}],["同色微漸層","linear-gradient(180deg,#5b54ec,#4338ca)",{lux:1}],["雙色漸層","linear-gradient(135deg,#06b6d4,#a855f7)",{sat:2,play:1}]].forEach(([n,v,t],i)=>TEX.push({id:"X"+(TEX.length+1),aspect:"gradient",aspectZh:"漸層",name:"漸層・"+n,val:v,lv:i,tags:T(t)}));
const SLIDES=[
["標題封面","Title Slide","center",T({dense:-2,bold:1})],["問題陳述","Problem Statement","left",T({contrast:1,bold:1})],
["大數字","Big Number / Metric","metric",T({bold:2,dense:-1,tech:1})],["三欄重點","Three Column","cols3",T({structure:2,dense:1})],
["左文右圖","Split Image","split",T({structure:1,lux:1})],["時間軸","Timeline","timeline",T({structure:2,dense:1,tech:1})],
["引言頁","Quote Slide","quote",T({serif:2,lux:2,dense:-2})],["比較表","Comparison","compare",T({dense:2,structure:2})],
["圖表頁","Chart Slide","chart",T({dense:1,tech:2})],["便當格摘要","Bento Summary","bento",T({structure:2,dense:2,radius:1})],
["滿版大字","Full-bleed Statement","statement",T({bold:2,contrast:2,dense:-2})],["結尾 CTA","Closing CTA","cta",T({play:1,bold:1})]
].map((s,i)=>({id:"S"+String(i+1).padStart(2,"0"),name:s[0],src:s[1],lay:s[2],tags:s[3]}));
const SOCIAL=[
["大字報","poster",T({bold:2,contrast:2,dense:-2})],["推文截圖卡","tweet",T({tech:1,dense:0,radius:1})],
["輪播首張","carousel",T({structure:1,bold:1})],["數據卡","data",T({tech:2,dense:1})],["引言卡","quote",T({serif:2,lux:2})],
["清單卡","list",T({dense:2,structure:2})],["前後對比","beforeafter",T({structure:1,play:1})],["迷因雙格","meme",T({play:2,lux:-2})],
["雜誌封面","mag",T({serif:2,lux:1,bold:1})],["手寫便條","note",T({warm:2,organic:1,play:1,tech:-1})],
["終端機卡","term",T({tech:2,bright:-2,retro:1})],["極簡圖示","icon",T({dense:-2,structure:1,lux:1})]
].map((s,i)=>({id:"G"+String(i+1).padStart(2,"0"),name:s[0],lay:s[1],tags:s[2]}));
// dislikes checklist: condensed from taste-skill anti-template rules
const NOPE=[
["ai-purple","AI 紫藍光暈漸層（預設紫色按鈕發光、隨機霓虹漸層）"],
["inter-only","全部都用 Inter／系統字，沒有字體個性"],
["llm-serif","AI 最愛的展示襯線字（Fraunces、Instrument Serif）當預設"],
["beige-brass","米色底＋黃銅／赭紅＋咖啡字的「高級感」套版配色"],
["hero-3cards","置中大標＋三張功能卡的制式首頁"],
["emoji-icon","用 emoji 當圖示"],
["glass-everywhere","到處都是毛玻璃卡片"],
["pure-black","純黑 #000 配純白字的刺眼高對比"],
["shadow-glow","彩色陰影、外發光按鈕"],
["center-all","所有內容都置中對齊"],
["stock-people","假笑商務圖庫照片"],
["fake-stats","「99.9% 滿意度」這類假數字、假評價"],
["same-radius","每個元素同一個大圓角，看起來像樣板"],
["filler-copy","「釋放潛能」「重新定義」這類空泛行銷詞"],
["over-anim","過多進場動畫與滾動特效"]
];
const QUIZ_FEEL={"專業可信":T({structure:2,contrast:1,play:-1}),"親切溫暖":T({warm:2,radius:1,organic:1}),"前衛酷炫":T({tech:2,bold:2,bright:-1}),"高級精緻":T({lux:2,serif:1,dense:-1}),"好玩活潑":T({play:2,sat:2,radius:1})};
const EXTREMES=[{id:"E1",vibe:"V15",name:"Y2K 粉紫"},{id:"E2",vibe:"V04",name:"粗野黃黑"},{id:"E3",vibe:"V13",name:"奢華黑金"},{id:"E4",vibe:"V17",name:"自然有機"}];
const PALZH=["SaaS 信任藍","數據儀表板","公共服務","Web3 霓虹","電動車綠能","在地生活","旅遊度假","線上課程","物流速遞","居家職人","寵物診所","雜誌部落格","數位商品","程式訓練營","量子介面","個人理財","料理食譜","學習卡片","文件掃描","翻譯工具","益智問答","短影音剪輯","穿搭衣櫥","禮物清單","用藥提醒","程式挑戰","財經儀表板","電競遊戲","金融加密","Web3 暗夜"];
const FONTZH={"Classic Elegant":"經典優雅","Minimal Swiss":"極簡瑞士","Developer Mono":"開發者等寬","Friendly SaaS":"友善科技","Brutalist Raw":"粗野打字機","Vietnamese Friendly":"圓潤人文","Legal Professional":"法律專業","Restaurant Menu":"餐廳菜單","Gaming Bold":"電競粗體","Academic/Research":"學術研究","Kids/Education":"童趣教育","Sports/Fitness":"運動壓縮","Neubrutalist Bold":"新粗野粗體"};
GEN.pal.forEach((p,i)=>p.zh=PALZH[i]);
GEN.fonts=GEN.fonts.filter(f=>f.name!="Chinese Simplified");
GEN.fonts.forEach(f=>f.zh=FONTZH[f.name]||f.name);
GEN.fonts.push({id:"F21",name:"黑體配英文襯線",zh:"黑體配英文襯線",h:"Playfair Display",b:"Noto Sans TC",hg:"serif",bg:"sans",cjk:1,tags:T({serif:1,lux:2,structure:1})});
// ---- v2: curated palettes (deduped from ui-ux-pro-max colors.csv + brand palettes from awesome-design-md)
GEN.pal=[
["信任藍橘","#F8FAFC","#1E293B","#2563EB","#93C5FD","#EA580C",{bright:2,structure:1,warm:-1},"ui-ux-pro-max・SaaS"],
["石墨單色","#FAFAFA","#09090B","#18181B","#A1A1AA","#EC4899",{bright:2,sat:-2,contrast:2,lux:1},"ui-ux-pro-max・雜誌"],
["深海青綠","#ECFEFF","#164E63","#0891B2","#67E8F9","#16A34A",{bright:2,warm:-2,organic:1},"ui-ux-pro-max・綠能"],
["薄荷森林","#ECFDF5","#064E3B","#059669","#6EE7B7","#EA580C",{bright:2,organic:2,warm:-1},"ui-ux-pro-max・在地生活"],
["暖陽琥珀","#FFFBEB","#1C1917","#C2410C","#FDBA74","#059669",{bright:2,warm:2,organic:1,retro:1},"ui-ux-pro-max・食譜"],
["靛紫學院","#EEF2FF","#312E81","#6366F1","#C7D2FE","#16A34A",{bright:2,sat:1,warm:-1,play:1},"ui-ux-pro-max・數位商品"],
["玫瑰甜心","#FDF2F8","#3F0D23","#BE185D","#F9A8D4","#D97706",{bright:2,warm:2,play:2,sat:1},"ui-ux-pro-max・穿搭"],
["櫻桃紅","#FFF1F2","#1F1315","#DC2626","#FECACA","#0F172A",{bright:2,warm:2,bold:2,sat:1},"ui-ux-pro-max・禮物"],
["夜空紫金","#0F0F23","#F8FAFC","#8B5CF6","#4C1D95","#FBBF24",{bright:-2,sat:1,tech:1,lux:1},"ui-ux-pro-max・Web3"],
["駭客綠","#020617","#E2E8F0","#22C55E","#14532D","#38BDF8",{bright:-2,tech:2,contrast:2},"ui-ux-pro-max・程式訓練營"],
["量子霓虹","#050510","#E0E0FF","#00FFFF","#7B61FF","#FF00FF",{bright:-2,sat:2,tech:2,play:1,retro:1},"ui-ux-pro-max・量子介面"],
["電競紫紅","#0F0F23","#E2E8F0","#7C3AED","#312E81","#F43F5E",{bright:-2,sat:2,bold:2,play:1,tech:1},"ui-ux-pro-max・遊戲"],
["午夜粉","#0F172A","#FFFFFF","#EC4899","#831843","#38BDF8",{bright:-2,sat:2,play:1,warm:1},"ui-ux-pro-max・短影音"],
["金融黃金","#0F172A","#F8FAFC","#F59E0B","#78350F","#8B5CF6",{bright:-2,lux:1,warm:1,tech:1},"ui-ux-pro-max・加密金融"],
["黑金典藏","#0B0B0C","#EDE6D6","#C9A14A","#3A3226","#8C2F39",{bright:-2,lux:2,serif:1,sat:-1,warm:1},"品牌參考・Bugatti"],
["Stripe 漸層紫","#FFFFFF","#0A2540","#635BFF","#00D4FF","#FF7A59",{bright:2,sat:1,tech:1,lux:1},"品牌參考・Stripe"],
["Linear 夜藍","#08090A","#F7F8F8","#5E6AD2","#26272B","#4EA7FC",{bright:-2,tech:2,lux:1,sat:-1,contrast:1},"品牌參考・Linear"],
["Vercel 黑白","#FFFFFF","#000000","#000000","#EAEAEA","#0070F3",{bright:2,sat:-2,contrast:2,tech:1,structure:1},"品牌參考・Vercel"],
["法拉利紅","#FFFFFF","#181818","#DA291C","#FFF200","#181818",{bright:2,bold:2,sat:2,warm:2,lux:1},"品牌參考・Ferrari"],
["Spotify 綠","#121212","#FFFFFF","#1ED760","#282828","#B3B3B3",{bright:-2,sat:1,play:1,bold:1},"品牌參考・Spotify"],
["星巴克墨綠","#F2F0EB","#1E3932","#00704A","#D4E9E2","#CBA258",{bright:1,warm:1,organic:2,lux:1},"品牌參考・Starbucks"],
["Notion 紙白","#FFFFFF","#37352F","#37352F","#F1F1EF","#EB5757",{bright:2,sat:-2,warm:1,dense:1,tech:-1},"品牌參考・Notion"],
["Airbnb 珊瑚","#FFFFFF","#222222","#FF385C","#F7F7F7","#00A699",{bright:2,warm:2,play:1,radius:1},"品牌參考・Airbnb"],
["Claude 陶土","#F5F4ED","#141413","#C96442","#E8E6DC","#5E5D59",{bright:1,warm:2,organic:1,serif:1,sat:-1},"品牌參考・Claude"],
["NVIDIA 螢光綠","#000000","#FFFFFF","#76B900","#1A1A1A","#FFFFFF",{bright:-2,tech:2,bold:2,contrast:2},"品牌參考・NVIDIA"],
["Figma 五色","#FFFFFF","#1E1E1E","#A259FF","#0ACF83","#F24E1E",{bright:2,sat:2,play:2},"品牌參考・Figma"],
["Mercury 霧藍","#F4F5F9","#171721","#5266EB","#DDE1F2","#1B1B2A",{bright:1,lux:2,sat:-1,warm:-1},"品牌參考・Mercury"],
["Oura 沙丘","#F3EFE8","#1C1C1C","#8C7B6B","#D9D0C1","#2F3A35",{bright:1,lux:2,organic:2,sat:-2,warm:1},"品牌參考・Oura"],
["瑞士紅","#FFFFFF","#111111","#E30613","#F2F2F2","#111111",{bright:2,contrast:2,structure:2,bold:1},"ui-ux-pro-max・瑞士風格"],
["包浩斯原色","#F2ECE0","#111111","#1D4ED8","#F4C430","#E63946",{bright:1,sat:2,bold:2,retro:1,structure:2},"ui-ux-pro-max・包浩斯"]
].map((p,i)=>({id:"P"+String(i+1).padStart(2,"0"),zh:p[0],name:p[0],c:p.slice(1,6),tags:T(p[6]),src:p[7]}));
// ---- v2: curated brand tags (override auto-derived dims)
const BRAND_FIX={"Apple":["Apple",{bright:2,lux:2,dense:-2,sat:-1,radius:1,tech:1}],"Stripe":["Stripe",{bright:2,lux:1,tech:1,sat:1,depth:1}],"Linear App":["Linear",{bright:-2,tech:2,lux:1,sat:-1,structure:1}],"Vercel":["Vercel",{contrast:2,sat:-2,tech:2,structure:2,dense:-1}],"Notion":["Notion",{bright:2,sat:-2,warm:1,play:1,tech:-1}],"Airbnb":["Airbnb",{bright:2,warm:2,radius:2,play:1,organic:1}],"Ferrari":["Ferrari",{lux:2,bold:2,sat:2,warm:2,contrast:1}],"Lamborghini":["Lamborghini",{bright:-2,lux:2,bold:2,structure:1,radius:-2}],"Bugatti":["Bugatti",{bright:-2,lux:2,serif:1,dense:-2,sat:-1}],"Bmw":["BMW",{lux:1,structure:2,tech:1,sat:-1}],"Bmw M":["BMW M",{bright:-2,bold:2,tech:1,sat:1}],"Spotify":["Spotify",{bright:-2,play:1,bold:1,sat:1,radius:2}],"Nike":["Nike",{bold:2,contrast:2,sat:-1,dense:-1}],"Figma":["Figma",{play:2,sat:2,bright:2,radius:1}],"Miro":["Miro",{play:2,warm:1,bright:2,radius:2,sat:1}],"Nintendo 2001":["Nintendo（2001）",{play:2,retro:2,sat:2,radius:1}],"Dell 1996":["Dell（1996）",{retro:2,dense:1,structure:1}],"Wired":["WIRED",{serif:1,bold:2,contrast:2,dense:2,structure:2}],"Theverge":["The Verge",{bold:2,sat:2,play:1,dense:1}],"Starbucks":["Starbucks",{warm:1,organic:2,lux:1,radius:1}],"Claude":["Claude",{warm:2,serif:1,organic:1,sat:-1,lux:1}],"Oura":["Oura",{lux:2,organic:2,sat:-2,dense:-2,warm:1}],"Mercury":["Mercury",{lux:2,tech:1,sat:-1,dense:-1}],"Tesla":["Tesla",{lux:1,tech:2,dense:-2,sat:-2,contrast:1}],"Spacex":["SpaceX",{bright:-2,tech:2,lux:1,dense:-2,contrast:2}],"Warp":["Warp",{bright:-2,tech:2,sat:1,dense:1}],"Raycast":["Raycast",{bright:-2,tech:2,depth:1,lux:1}],"Cursor":["Cursor",{bright:-1,tech:2,sat:-1,structure:1}],"Nvidia":["NVIDIA",{bright:-2,tech:2,bold:2,sat:1}],"Clickhouse":["ClickHouse",{bright:-2,tech:2,dense:2,bold:1}],"Supabase":["Supabase",{bright:-2,tech:2,organic:0,sat:1}],"Lovable":["Lovable",{play:2,warm:1,sat:2,radius:2}],"Pinterest":["Pinterest",{warm:2,play:1,radius:2,organic:1}],"Revolut":["Revolut",{tech:1,bold:1,lux:1,radius:2}],"Ibm":["IBM",{structure:2,tech:1,dense:1,sat:-1}],"Uber":["Uber",{contrast:2,sat:-2,bold:1,structure:1}],"Mastercard":["Mastercard",{warm:2,radius:2,lux:1}],"Playstation":["PlayStation",{bright:-1,tech:1,bold:1,depth:1}],"Coinbase":["Coinbase",{bright:2,tech:1,structure:1}],"Webflow":["Webflow",{tech:1,bold:1,sat:1}],"Framer":["Framer",{bright:-2,tech:1,bold:2,play:1}],"Slack":["Slack",{play:1,warm:1,sat:1,radius:1}],"Mistral Ai":["Mistral AI",{warm:2,bold:1,sat:2,retro:1}],"Zapier":["Zapier",{warm:2,play:1,bright:2}],"Elevenlabs":["ElevenLabs",{lux:1,sat:-2,bright:2,dense:-1}],"Hashicorp":["HashiCorp",{bright:-1,tech:2,structure:2}],"X Ai":["xAI",{bright:-2,tech:2,sat:-2,contrast:2,dense:-2}],"Posthog":["PostHog",{play:2,warm:1,retro:1,dense:1}],"Dji":["DJI",{tech:1,lux:1,dense:-1}],"Aljazeera":["Al Jazeera",{dense:2,structure:2,warm:1}]};
GEN.brands.forEach(b=>{const f=BRAND_FIX[b.name];if(f){b.disp=f[0];DIMS.forEach((d,i)=>{if(d in f[1])b.tags[i]=f[1][d]})}else b.disp=b.name.replace(/\b\w/g,c=>c.toUpperCase()).replace(/ Ai$/," AI")});
// natural zh subtitles for slides
const SLIDESUB={center:"開場定調",left:"點出痛點",metric:"一個數字說故事",cols3:"並列重點",split:"圖文對半",timeline:"進度與里程碑",quote:"名言或見證",compare:"前後比較",chart:"趨勢圖表",bento:"關鍵數據總覽",statement:"一句話主張",cta:"收尾行動呼籲"};
const SOCSUB={poster:"一句話抓住滑動的手",tweet:"把觀點包成截圖",carousel:"多頁教學的第一張",data:"成績、成長數字",quote:"金句、名言",list:"工具或步驟整理",beforeafter:"改造前後",meme:"反差梗圖",mag:"像雜誌封面的質感",note:"隨手筆記感",term:"工程師風格",icon:"單一概念、極簡"};
