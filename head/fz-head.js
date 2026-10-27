/* fz-head.js: скрипты из HEAD сайта diski.kz, вынесены из-за лимита размера страниц товаров Tilda (журнал §196). Содержит FZB, FZO, FZP без изменений. */
/* ===== FZB ===== */
(function(){
  // Новое описание товаров на страницах брендов дисков (/catalog/<бренд>, /oem, /magnesium, …). Без ссылок.
  // Срабатывает только на шаблоне «…премиум качества любого дизайна…»; чужие описания не трогает.
  var GATE = 'премиум качества любого дизайна';
  if (window.__fzBrandDescr) return; window.__fzBrandDescr = true;
  var CSS = [
    '.fzb-descr{ font-family:"Noto Sans",Arial,sans-serif; color:#aeaeae; }',
    '.fzb-descr .fzb-intro{ font-size:17.5px; line-height:1.6; color:#aeaeae; margin:0 0 4px; }',
    '.fzb-descr .fzb-intro b{ color:#F2F0EA; font-weight:600; }',
    '.fzb-descr .fzb-section{ margin-top:22px; padding-top:20px; border-top:1px solid #262626; }',
    '.fzb-descr .fzb-section:first-of-type{ margin-top:16px; padding-top:0; border-top:none; }',
    '.fzb-descr .fzb-head{ font-size:13.5px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b6b6b; margin:0 0 13px; }',
    '.fzb-descr .fzb-diams{ display:flex; flex-wrap:wrap; gap:5px; }',
    '.fzb-descr .fzb-diam{ display:inline-flex; align-items:center; justify-content:center; min-width:44px; height:30px; padding:0 8px; border:1px solid #262626; border-radius:7px; background:#1c1c1c; color:#aeaeae; font-size:12.5px; font-weight:600; }',
    '.fzb-descr .fzb-specs{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px 24px; }',
    '.fzb-descr .fzb-spec-label{ font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6b6b6b; margin-bottom:4px; }',
    '.fzb-descr .fzb-spec-value{ font-size:15px; font-weight:600; color:#F2F0EA; line-height:1.4; }',
    '.fzb-descr .fzb-list{ display:flex; flex-direction:column; gap:9px; }',
    '.fzb-descr .fzb-item{ display:flex; align-items:flex-start; gap:8px; font-size:14.5px; line-height:1.5; color:#aeaeae; }',
    '.fzb-descr .fzb-item svg{ width:14px; height:14px; flex:none; margin-top:3px; stroke:#B3332B; fill:none; stroke-width:2.2; }',
    '.fzb-descr .fzb-steps{ display:flex; flex-direction:column; }',
    '.fzb-descr .fzb-step{ display:flex; gap:12px; padding-bottom:14px; position:relative; }',
    '.fzb-descr .fzb-step:not(:last-child)::before{ content:""; position:absolute; left:10px; top:24px; bottom:0; width:1px; background:#262626; }',
    '.fzb-descr .fzb-step-num{ width:23px; height:23px; border-radius:50%; border:1px solid #262626; background:#1c1c1c; color:#aeaeae; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex:none; }',
    '.fzb-descr .fzb-step p{ margin:0; font-size:14.5px; line-height:1.5; color:#aeaeae; padding-top:2px; }',
    '.fzb-descr .fzb-callout{ display:flex; align-items:center; gap:12px; background:rgba(179,51,43,0.12); border:1px solid rgba(179,51,43,0.35); border-left:3px solid #B3332B; border-radius:10px; padding:12px 16px; }',
    '.fzb-descr .fzb-callout svg{ width:20px; height:20px; flex:none; stroke:#B3332B; fill:none; stroke-width:1.8; }',
    '.fzb-descr .fzb-callout-text{ font-size:15px; color:#F2F0EA; }',
    '.fzb-descr .fzb-callout-text b{ color:#fff; font-weight:700; }',
    '.fzb-card{ padding:20px; border:1px solid #262626; border-radius:16px; background:#141414; }',
    '.fzb-grid{ display:flex; gap:20px; align-items:flex-start; margin-top:140px; }',
    '.fzb-grid__left{ flex:1 1 0; min-width:0; display:flex; flex-direction:column; gap:20px; }',
    '.fzb-grid__right{ flex:1 1 0; min-width:0; }',
    '@media(max-width:900px){ .fzb-grid{ flex-direction:column; margin-top:48px; } .fzb-descr .fzb-specs{ grid-template-columns:1fr; } }'
  ].join('\n');
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>';
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function item(t){ return '<div class="fzb-item">' + CHECK + '<span>' + esc(t) + '</span></div>'; }
  function step(n, t){ return '<div class="fzb-step"><div class="fzb-step-num">' + n + '</div><p>' + t + '</p></div>'; }
  function toLines(raw){
    var d = document.createElement('div');
    d.innerHTML = raw.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li)>/gi, '\n');
    return d.textContent.replace(/ /g, ' ').split('\n').map(function(s){ return s.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
  }
  function parse(raw){
    var lines = toLines(raw);
    var r = { specs:[], diams:[], options:[], benefits:[], phone:'' };
    var mode = 'head';
    lines.forEach(function(l){
      if (/^_{5,}$/.test(l)) { if (mode === 'head') mode = 'afterSpecs'; return; }
      if (/^Опции за доплату/i.test(l)) { mode = 'options'; return; }
      if (/^Преимуществ/i.test(l)) { mode = 'benefits'; return; }
      if (/^Есть вопросы/i.test(l)) { mode = 'contact'; return; }
      if (/^-\s*/.test(l) && (mode === 'options' || mode === 'benefits')) { r[mode].push(l.replace(/^-\s*/, '')); return; }
      if (mode === 'contact') { var m = l.match(/(\+?\d[\d\s()\-]{8,}\d)/); if (m) r.phone = m[1].trim(); return; }
      if (mode === 'head') {
        var kv = l.match(/^([^:]{2,30}):\s*(.+)$/);
        if (kv) {
          var k = kv[1].trim(), v = kv[2].trim();
          if (/^Диаметр/i.test(k)) { r.diams = v.split(/\s*\|\s*/).map(function(x){ return x.trim(); }).filter(Boolean); if (/^\/oem(\/|$)/.test(location.pathname)) r.diams = ['R16','R17','R18','R19','R20','R21','R22','R23','R24','R26']; }
          else r.specs.push({ label:k, value:v });
        }
      }
    });
    return r;
  }
  var BENEFITS = [
    'Любой дизайн, цвет и размер — в том числе по вашему эскизу',
    'Примерим понравившийся дизайн на ваш автомобиль через фоторедактор',
    'Предоставляем 3D-чертежи и фото изготовления',
    'Контроль и тесты по международным стандартам качества',
    'На 20–25% легче литых дисков при том же запасе прочности',
    'Кованый авиационный алюминий 6061-Т6, пресс 12 000 тонн',
    'Балансировка каждого комплекта перед отправкой'
  ];
  function buildTop(p){
    var h = '<p class="fzb-intro">Мы производим кованые диски премиум-класса <b>любого дизайна, цвета и параметров</b> для любого автомобиля.</p>';
    if (p.diams.length) h += '<div class="fzb-section"><p class="fzb-head">Диаметр</p><div class="fzb-diams">' + p.diams.map(function(d){ return '<span class="fzb-diam">' + esc(d) + '</span>'; }).join('') + '</div></div>';
    if (p.specs.length) h += '<div class="fzb-section"><p class="fzb-head">Параметры</p><div class="fzb-specs">' + p.specs.map(function(s){ return '<div><div class="fzb-spec-label">' + esc(s.label) + '</div><div class="fzb-spec-value">' + esc(s.value.charAt(0).toUpperCase() + s.value.slice(1)) + '</div></div>'; }).join('') + '</div></div>';
    return h;
  }
  function buildOptionsCard(p){
    var h = '';
    if (p.options.length) h += '<div class="fzb-section"><p class="fzb-head">Опции за доплату</p><div class="fzb-list">' + p.options.map(item).join('') + '</div></div>';
    h += '<div class="fzb-section"><p class="fzb-head">Преимущества кованых дисков от Forza Wheels</p><div class="fzb-list">' + BENEFITS.map(item).join('') + '</div></div>';
    return h;
  }
  function buildProcessCard(p){
    var phone = p.phone || '8 (701) 940-24-22';
    return '<div class="fzb-section"><p class="fzb-head">Как мы работаем</p><div class="fzb-steps">' +
      step(1, 'Уточняем цели — размеры, стиль, условия — чтобы сразу отобрать подходящие модели.') +
      step(2, 'Предлагаем варианты и «примеряем» их на ваш автомобиль в 3D ещё до производства.') +
      step(3, 'Согласовываем финальный 3D-чертёж — изготовление начинается только после вашего подтверждения.') +
      step(4, 'Присылаем фотоотчёт, организуем доставку и надёжную упаковку до вашего города.') +
      '</div></div>' +
      '<div class="fzb-section"><div class="fzb-callout"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><div class="fzb-callout-text">Есть вопросы? Звоните: <b>' + esc(phone) + '</b></div></div></div>';
  }
  var ctaHome = null;
  function moveCta(rightCol){ var card = document.querySelector('.fz-cta__card'); if (!card || !rightCol || rightCol.contains(card)) return; if (!ctaHome) ctaHome = { parent: card.parentElement, next: card.nextSibling }; rightCol.appendChild(card); }
  function restoreCta(){ if (!ctaHome) return; var card = document.querySelector('.fz-cta__card'); if (card && card.parentElement !== ctaHome.parent) { if (ctaHome.next && ctaHome.next.parentElement === ctaHome.parent) ctaHome.parent.insertBefore(card, ctaHome.next); else ctaHome.parent.appendChild(card); } ctaHome = null; }
  function sync(){
    // на странице может быть два магазина (ПК и телефон, напр. /oem) — берём ВИДИМОЕ окно товара
    var cols = Array.prototype.slice.call(document.querySelectorAll('.t-store__prod-popup__col-right'));
    var colRight = cols.filter(function(c){ return c.offsetParent; })[0] || cols[0];
    var textEl = (colRight && colRight.querySelector('.js-store-prod-all-text')) || document.querySelector('.js-store-prod-all-text');
    if (!textEl || !colRight || !colRight.offsetParent) { restoreCta(); return; }
    var raw = textEl.innerHTML;
    var parent = textEl.parentElement;
    var top = parent.querySelector(':scope > .fzb-descr');
    var productRoot = colRight.parentElement && colRight.parentElement.parentElement;
    var grid = productRoot ? productRoot.querySelector(':scope > .fzb-grid') : null;
    if (!raw || raw.indexOf(GATE) === -1) { if (top) { textEl.style.display = ''; top.style.display = 'none'; } if (grid) grid.style.display = 'none'; restoreCta(); return; }
    if (top && textEl.style.display === 'none' && top.getAttribute('data-raw') === String(raw.length) && grid && grid.style.display !== 'none') { moveCta(grid.querySelector('.fzb-grid__right')); return; }
    var p = parse(raw);
    if (!top) { top = document.createElement('div'); top.className = 'fzb-descr'; parent.appendChild(top); }
    top.innerHTML = buildTop(p); top.setAttribute('data-raw', String(raw.length)); top.style.display = '';
    textEl.style.display = 'none';
    if (productRoot) {
      if (!grid) { grid = document.createElement('div'); grid.className = 'fzb-grid'; grid.innerHTML = '<div class="fzb-grid__left"><div class="fzb-descr fzb-card fzb-opts"></div><div class="fzb-descr fzb-card fzb-proc"></div></div><div class="fzb-grid__right"></div>'; productRoot.appendChild(grid); }
      grid.querySelector('.fzb-opts').innerHTML = buildOptionsCard(p);
      grid.querySelector('.fzb-proc').innerHTML = buildProcessCard(p);
      grid.style.display = '';
      moveCta(grid.querySelector('.fzb-grid__right'));
    }
  }
  function start(){
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    sync();
    var pending = false;
    new MutationObserver(function(){ if (pending) return; pending = true; requestAnimationFrame(function(){ pending = false; sync(); }); }).observe(document.body, { childList:true, subtree:true, characterData:true });
    function later(){ setTimeout(sync, 60); setTimeout(sync, 400); }
    document.addEventListener('click', later, true);
    window.addEventListener('popstate', later);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
;
/* ===== FZO ===== */
/* FZO — фильтр-навигация «Заводские дизайны»: /oem и 7 страниц марок.
   Марка = переход на страницу марки (счётчики из API магазина), поиск — сразу по всем 8 разделам. */
(function(){
  var PATH_RE = /^\/oem(\/(audi|bmw|mb|porsche|rangerover|rr|toyota|zeekr))?\/?$/;
  if (!PATH_RE.test(location.pathname)) return;

  var PAGES = [
    {key:"oem",        label:"Готовые работы", path:"/oem",            uid:"550196093492"},
    {key:"audi",       label:"Audi",           path:"/oem/audi",       uid:"601169175691"},
    {key:"bmw",        label:"BMW",            path:"/oem/bmw",        uid:"585889023857"},
    {key:"mb",         label:"Mercedes-Benz",  path:"/oem/mb",         uid:"850446086636"},
    {key:"porsche",    label:"Porsche",        path:"/oem/porsche",    uid:"587664563754"},
    {key:"rangerover", label:"Range Rover",    path:"/oem/rangerover", uid:"970175350142"},
    {key:"rr",         label:"Rolls-Royce",    path:"/oem/rr",         uid:"489635844727"},
    {key:"toyota",     label:"Toyota",         path:"/oem/toyota",     uid:"202809832511"},
  {key:"zeekr",      label:"Zeekr",          path:"/oem/zeekr",      uid:"619985079621"}
  ];
  // синонимы: «мерс», «бмв», «ленд ровер» и т.п. находят свои диски
  var ALIASES = [
    ["bmw","бмв"],
    ["mercedes","benz","мерседес","мерс","бенц"],
    ["audi","ауди"],
    ["porsche","порше","порш"],
    ["range rover","land rover","рендж","ренж","ровер","ленд"],
    ["rolls","royce","роллс","ролс","ройс"],
    ["toyota","тойота"],
    ["lexus","лексус"],
    ["zeekr","зикр","зеекр"]
  ];
  var CACHE_KEY = "fzOemIdx_v1", CACHE_TTL = 30*60*1000;

  var curPath = location.pathname.replace(/\/+$/,"") || "/oem";
  var current = PAGES.filter(function(p){ return p.path === curPath; })[0] || PAGES[0];

  document.documentElement.classList.add("fz-oem");
  var css = ''
  // ПК: колонка-«рельс» ровно по высоте магазина, панель внутри прилипает
  + '.fz-ocf-rail{ position:absolute; left:105px; width:380px; z-index:50; background:#0e0e0e; border-right:1px solid #262626; }'
  + '.fz-ocf{ position:sticky; top:95px; max-height:calc(100vh - 95px); overflow-y:auto; padding:20px 16px 40px; box-sizing:border-box; font-family:"Noto Sans",Arial,sans-serif; }'
  + '.fz-ocf *{ box-sizing:border-box; }'
  + '.fz-ocf::-webkit-scrollbar{ width:5px; } .fz-ocf::-webkit-scrollbar-thumb{ background:#333; border-radius:3px; }'
  + '.fz-ocf__head{ display:flex; align-items:center; justify-content:space-between; }'
  + '.fz-ocf__head h3{ margin:0; font-family:"Unbounded",Arial,sans-serif; font-size:.68rem; font-weight:600; letter-spacing:.05em; text-transform:uppercase; color:#F2F0EA; }'
  + '.fz-ocf__count{ font-size:.66rem; color:#B3332B; font-weight:700; margin-left:5px; }'
  + '.fz-ocf__search{ width:100%; background:#161616; border:1px solid #1c1c1c; border-radius:6px; color:#f2f0ea; font-size:.74rem; padding:8px 10px; outline:none; margin:12px 0 8px; font-family:"Noto Sans",sans-serif; }'
  + '.fz-ocf__search:focus{ border-color:#B3332B; } .fz-ocf__search::placeholder{ color:#8a8a8a; }'
  + '.fz-ocf__list{ display:flex; flex-direction:column; gap:1px; }'
  + '.fz-ocf__sep{ height:1px; background:#1f1f1f; margin:6px 6px; }'
  + '.fz-ocf__opt{ display:flex; align-items:center; gap:9px; padding:7px 6px; border-radius:6px; cursor:pointer; text-decoration:none !important; }'
  + '.fz-ocf__opt:hover{ background:#171717; }'
  + '.fz-ocf__radio{ width:14px; height:14px; flex:none; border:1.5px solid #3a3a3a; border-radius:50%; background:#141414; position:relative; }'
  + '.fz-ocf__opt.is-current .fz-ocf__radio{ border-color:#B3332B; }'
  + '.fz-ocf__opt.is-current .fz-ocf__radio::after{ content:""; position:absolute; left:2.5px; top:2.5px; width:6px; height:6px; border-radius:50%; background:#B3332B; }'
  + '.fz-ocf__oname{ flex:1; font-size:.8rem; color:#d8d6cf; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }'
  + '.fz-ocf__opt.is-current .fz-ocf__oname{ color:#f2f0ea; font-weight:600; }'
  + '.fz-ocf__onum{ font-size:.7rem; color:#5c5c5c; flex:none; }'
  + '.fz-ocf__opt.is-hit .fz-ocf__onum{ color:#B3332B; font-weight:700; }'
  + '.fz-ocf__opt.is-empty{ opacity:.35; }'
  + '.fz-ocf__arrow{ width:6px; height:6px; flex:none; border-right:1.5px solid #3a3a3a; border-top:1.5px solid #3a3a3a; transform:rotate(45deg); }'
  + '.fz-ocf__opt:hover .fz-ocf__arrow{ border-color:#B3332B; }'
  + '.fz-ocf__opt.is-current .fz-ocf__arrow{ visibility:hidden; }'
  + '.fz-ocf__hint{ display:none; font-size:.74rem; color:#8a8a8a; padding:10px 2px 0; line-height:1.5; }'
  + '.fz-ocf__hint.is-show{ display:block; }'
  + '.fz-ocf__clear{ width:100%; background:transparent; border:1px solid #262626; color:#8a8a8a; font-family:"Noto Sans",sans-serif; font-size:.78rem; font-weight:600; padding:9px; border-radius:8px; cursor:pointer; margin-top:18px; }'
  + '.fz-ocf__clear:hover{ border-color:#B3332B; color:#f2f0ea; }'
  // старое боковое меню «ЗАВОДСКИЕ ДИЗАЙНЫ» (T830) на /oem — скрыто, заменено панелью
  + 'html.fz-oem .t830m, html.fz-oem .t830__burger, html.fz-oem .t830__panel{ display:none !important; }'
  + 'html.fz-oem .t830__allrecords_padd{ padding-left:0 !important; }'
  // одинаковые отступы на всех 8 страницах: крошки сразу под шапкой, магазин сразу за крошками
  + 'html.fz-oem .t-rec:has(> .t758){ padding-top:15px !important; }'
  + 'html.fz-oem .t-rec:has(.js-store-grid-cont){ padding-top:30px !important; }'
  + 'html.fz-oem .t-store:not(:has(.js-product)) .js-store-grid-cont-preloader{ display:block !important; opacity:1 !important; min-height:calc(100vh - 150px); }'
  + 'html.fz-oem .t-store__card__img-preloader{ background:#161616 !important; border-radius:12px; }'
  + '@media (min-width:901px){ html.fz-oem .js-store-grid-cont, html.fz-oem .js-store-grid-cont-preloader{ margin-left:505px !important; margin-right:auto !important; width:auto !important; }'
  + ' html.fz-oem .t758 .t-container{ margin-left:505px !important; max-width:1200px; } }'
  + '@media (max-width:900px){'
  + ' .fz-ocf-rail{ display:none; }'
  + ' .fz-ocf{ position:static; width:100%; max-height:none; background:#0e0e0e; border-bottom:1px solid #262626; padding:16px; }'
  + ' .fz-ocf__head h3{ font-size:.95rem; } .fz-ocf__search{ font-size:1rem; padding:12px 14px; }'
  + ' .fz-ocf__opt{ padding:10px 6px; } .fz-ocf__oname{ font-size:.95rem; } .fz-ocf__onum{ font-size:.85rem; }'
  + ' .fz-ocf__radio{ width:18px; height:18px; } .fz-ocf__opt.is-current .fz-ocf__radio::after{ left:3.5px; top:3.5px; width:8px; height:8px; }'
  + '}';
  var st = document.createElement("style");
  st.id = "fzOcfCss";
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function norm(s){
    return (s||"").toLowerCase().replace(/&amp;/g,"&").replace(/ё/g,"е").replace(/[-_/]+/g," ").replace(/\s+/g," ").trim();
  }
  function haystack(title, page){
    var t = norm(title) + " " + norm(page && page.key !== "oem" ? page.label : "");
    ALIASES.forEach(function(g){
      for (var i = 0; i < g.length; i++){ if (t.indexOf(g[i]) > -1) { t += " " + g.join(" "); return; } }
    });
    return t;
  }
  function matches(title, page, q){
    if (!q) return true;
    var h = haystack(title, page);
    return q.split(" ").every(function(w){ return h.indexOf(w) > -1; });
  }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

  function readCache(){
    try {
      var c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (c && c.t && Date.now() - c.t < CACHE_TTL && c.d) return c.d;
    } catch(e) {}
    return null;
  }
  function writeCache(d){ try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({t:Date.now(), d:d})); } catch(e) {} }

  async function fetchPart(uid){
    var hosts = ["https://store.tildaapi.pro", "https://store2.tildaapi.pro"];
    for (var h = 0; h < hosts.length; h++){
      try {
        var r = await fetch(hosts[h]+"/api/getproductslist/?storepartuid="+uid+"&recid=1&getparts=true&slice=1&size=100&flag_root=withroot");
        if (!r.ok) continue;
        var j = await r.json();
        return (j.products || []).map(function(p){ return p.title || ""; });
      } catch(e) {}
    }
    return null;
  }
  async function loadIndex(){
    var cached = readCache();
    if (cached) return cached;
    var res = await Promise.all(PAGES.map(function(p){ return fetchPart(p.uid); }));
    var d = {}, ok = true;
    PAGES.forEach(function(p, i){ if (res[i]) d[p.key] = res[i]; else ok = false; });
    if (ok) writeCache(d);
    return d;
  }

  function init(){
    if (document.getElementById("fzOcf")) return;
    var grids = Array.from(document.querySelectorAll(".js-store-grid-cont"));
    if (!grids.length) return;

    var panel = document.createElement("div");
    panel.className = "fz-ocf";
    panel.id = "fzOcf";
    panel.innerHTML = ''
      + '<div class="fz-ocf__head"><h3>Марка автомобиля<span class="fz-ocf__count" id="fzOcfCount"></span></h3></div>'
      + '<input class="fz-ocf__search" id="fzOcfSearch" placeholder="Поиск: марка или модель..." autocomplete="off">'
      + '<div class="fz-ocf__list" id="fzOcfList"></div>'
      + '<div class="fz-ocf__hint" id="fzOcfHint"></div>'
      + '<button class="fz-ocf__clear" id="fzOcfClear">Сбросить фильтры</button>';
    var rail = document.createElement("div");
    rail.className = "fz-ocf-rail";
    document.body.appendChild(rail);
    function visibleRec(){
      var vis = grids.filter(function(g){ return g.closest("[id^='rec']").offsetHeight > 0; })[0] || grids[0];
      return vis.closest("[id^='rec']");
    }
    // ПК — панель в «рельсе» рядом с видимым магазином; телефон — в потоке перед магазином (на /oem их два: для ПК и для телефона)
    function placePanel(){
      var rec = visibleRec();
      if (!rec) return;
      if (window.innerWidth > 900) {
        if (panel.parentElement !== rail) rail.appendChild(panel);
        var r = rec.getBoundingClientRect();
        rail.style.top = Math.round(r.top + window.pageYOffset) + "px";
        rail.style.height = Math.round(r.height) + "px";
      } else if (rec.parentElement && panel.nextElementSibling !== rec) {
        rec.parentElement.insertBefore(panel, rec);
      }
    }
    placePanel();

    var searchInput = panel.querySelector("#fzOcfSearch");
    var listEl = panel.querySelector("#fzOcfList");
    var countEl = panel.querySelector("#fzOcfCount");
    var hintEl = panel.querySelector("#fzOcfHint");
    var clearBtn = panel.querySelector("#fzOcfClear");
    var index = null;
    var fullyLoaded = false;

    try {
      var q0 = new URLSearchParams(location.search).get("fzq");
      if (q0) searchInput.value = q0;
    } catch(e) {}

    function query(){ return norm(searchInput.value); }
    // окно товара (.t-store__product-popup) тоже .js-product и лежит в сетке — его не трогаем
    function getCards(){ return Array.from(document.querySelectorAll(".js-store-grid-cont .js-product:not(.t-store__product-popup)")); }
    function cardTitle(c){ var t = c.querySelector(".t-store__card__title"); return t ? t.textContent : ""; }

    function countFor(p, q){
      if (!index || !index[p.key]) return null;
      return index[p.key].filter(function(t){ return matches(t, p, q); }).length;
    }

    function buildList(){
      var q = query();
      var html = "";
      var brands = 0;
      PAGES.forEach(function(p, i){
        if (p.key === "oem") return; // «Готовые работы» в списке не показываем (по просьбе), /oem — через крошки
        var n = countFor(p, q);
        brands++;
        var cls = "fz-ocf__opt" + (p === current ? " is-current" : "") + (q && n > 0 ? " is-hit" : "") + (q && n === 0 ? " is-empty" : "");
        var href = p.path + (q ? "?fzq=" + encodeURIComponent(searchInput.value.trim()) : "");
        html += '<a class="'+cls+'" href="'+esc(href)+'" data-key="'+p.key+'">'
              + '<span class="fz-ocf__radio"></span>'
              + '<span class="fz-ocf__oname">'+esc(p.label)+'</span>'
              + (n === null ? '' : '<span class="fz-ocf__onum">'+n+'</span>')
              + '<span class="fz-ocf__arrow"></span></a>';
      });
      listEl.innerHTML = html;
      countEl.textContent = " (" + brands + ")";
    }

    function revealCards(){
      getCards().forEach(function(c){
        if (c.style.display === "none") return;
        c.classList.remove("t-animate_wait");
        c.classList.add("t-animate_started");
        c.style.setProperty("opacity","1","important");
        c.style.setProperty("transform","none","important");
      });
      // карточки, поднявшиеся вверх после фильтра, иначе остаются с размытой заглушкой до прокрутки
      try { if (typeof window.t_lazyload_update === "function") window.t_lazyload_update(); } catch(e) {}
    }

    function applyFilter(){
      var q = query();
      var visible = 0;
      getCards().forEach(function(c){
        if (matches(cardTitle(c), current, q)) { c.style.removeProperty("display"); visible++; }
        else c.style.setProperty("display","none","important");
      });
      Array.from(document.querySelectorAll(".js-store-grid-cont .t-store__grid-separator")).forEach(function(s){
        if (q) s.style.setProperty("display","none","important"); else s.style.removeProperty("display");
      });
      revealCards();
      // «видимые» считаем только в видимом магазине (на /oem второй магазин скрыт)
      var shown = getCards().filter(function(c){ return c.offsetParent && c.style.display !== "none"; }).length;
      if (q && fullyLoaded && !shown) {
        var others = PAGES.filter(function(p){ return p !== current && p.key !== "oem" && countFor(p, q) > 0; });
        hintEl.innerHTML = others.length
          ? "На этой странице ничего не найдено. Совпадения есть в разделах, отмеченных красным числом выше."
          : "Ничего не найдено. Попробуйте другой запрос или напишите нам — сделаем любой дизайн.";
        hintEl.classList.add("is-show");
      } else hintEl.classList.remove("is-show");
      placePanel();
      return visible;
    }

    async function ensureFullyLoaded(){
      var steps = 0, miss = 0;
      while (steps++ < 30) {
        var total = index && index[current.key] ? index[current.key].length : null;
        var vis = grids.filter(function(g){ return g.closest("[id^='rec']").offsetHeight > 0; })[0] || grids[0];
        if (total && vis.querySelectorAll(".js-product:not(.t-store__product-popup)").length >= total) break;
        var rec = vis.closest("[id^='rec']");
        var btn = rec.querySelector(".js-store-load-more-btn");
        var wrap = rec.querySelector(".t-store__load-more-btn-wrap");
        if (!btn || !wrap || getComputedStyle(wrap).display === "none") { if (++miss >= 5) break; await sleep(400); continue; }
        miss = 0;
        var before = vis.querySelectorAll(".js-product:not(.t-store__product-popup)").length;
        btn.click();
        await sleep(600);
        if (vis.querySelectorAll(".js-product:not(.t-store__product-popup)").length === before) await sleep(700);
        applyFilter();
      }
      fullyLoaded = true;
      applyFilter();
    }

    var timer = null;
    searchInput.addEventListener("input", function(){
      clearTimeout(timer);
      timer = setTimeout(function(){
        buildList();
        applyFilter();
        try {
          var u = new URL(location.href);
          if (searchInput.value.trim()) u.searchParams.set("fzq", searchInput.value.trim()); else u.searchParams.delete("fzq");
          history.replaceState(history.state, "", u.pathname + u.search + u.hash);
        } catch(e) {}
      }, 150);
    });
    listEl.addEventListener("click", function(e){
      var a = e.target.closest(".fz-ocf__opt");
      if (a && a.getAttribute("data-key") === current.key) e.preventDefault();
    });
    // сброс = и поиск, и выбранная марка: со страницы марки возвращаемся на общую /oem
    clearBtn.addEventListener("click", function(){
      if (current.key !== "oem") { location.href = "/oem"; return; }
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
    });

    buildList();
    applyFilter();
    loadIndex().then(function(d){ index = d; buildList(); applyFilter(); return ensureFullyLoaded(); });

    var pending = false;
    var mo = new MutationObserver(function(){
      if (pending) return;
      pending = true;
      requestAnimationFrame(function(){ pending = false; applyFilter(); });
    });
    grids.forEach(function(g){ mo.observe(g, { childList:true, subtree:true }); });
    window.addEventListener("resize", placePanel);
    // высота/положение магазина меняются (картинки выше, «загрузить ещё») — рельс подстраивается
    try { new ResizeObserver(function(){ placePanel(); }).observe(document.body); } catch(e) { setInterval(placePanel, 1000); }
  }

  // магазин рендерит сетку после DOMContentLoaded — ждём появления .js-store-grid-cont
  function boot(){
    var tries = 0;
    (function wait(){
      if (document.querySelector(".js-store-grid-cont")) return init();
      if (++tries < 100) setTimeout(wait, 100);
    })();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
;
/* ===== FZP ===== */
(function(){
  if (window.__fzProjDescr) return; window.__fzProjDescr = true;
  var KEY = 'Преимущества кованых дисков от Forza Wheels';
  var BRAND_GATE = 'премиум качества любого дизайна';
  var CSS = [
    '.fzp-descr{ font-family:"Noto Sans",Arial,sans-serif; color:#aeaeae; }',
    '.fzp-descr .fzp-intro{ font-size:17.5px; line-height:1.6; color:#aeaeae; margin:0 0 4px; }',
    '.fzp-descr .fzp-intro b{ color:#F2F0EA; font-weight:600; }',
    '.fzp-descr .fzp-section{ margin-top:22px; padding-top:20px; border-top:1px solid #262626; }',
    '.fzp-descr .fzp-section:first-of-type{ margin-top:16px; padding-top:0; border-top:none; }',
    '.fzp-descr .fzp-head{ font-size:13.5px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6b6b6b; margin:0 0 13px; }',
    '.fzp-descr .fzp-diams{ display:flex; flex-wrap:wrap; gap:5px; }',
    '.fzp-descr .fzp-diam{ display:inline-flex; align-items:center; justify-content:center; min-width:44px; height:30px; padding:0 8px; border:1px solid #262626; border-radius:7px; background:#1c1c1c; color:#aeaeae; font-size:12.5px; font-weight:600; }',
    '.fzp-descr .fzp-specs{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px 24px; }',
    '.fzp-descr .fzp-spec-label{ font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#6b6b6b; margin-bottom:4px; }',
    '.fzp-descr .fzp-spec-value{ font-size:15px; font-weight:600; color:#F2F0EA; line-height:1.4; }',
    '.fzp-descr .fzp-list{ display:flex; flex-direction:column; gap:9px; }',
    '.fzp-descr .fzp-item{ display:flex; align-items:flex-start; gap:8px; font-size:14.5px; line-height:1.5; color:#aeaeae; }',
    '.fzp-descr .fzp-item svg{ width:14px; height:14px; flex:none; margin-top:3px; stroke:#B3332B; fill:none; stroke-width:2.2; }',
    '.fzp-descr .fzp-steps{ display:flex; flex-direction:column; }',
    '.fzp-descr .fzp-step{ display:flex; gap:12px; padding-bottom:14px; position:relative; }',
    '.fzp-descr .fzp-step:not(:last-child)::before{ content:""; position:absolute; left:10px; top:24px; bottom:0; width:1px; background:#262626; }',
    '.fzp-descr .fzp-step-num{ width:23px; height:23px; border-radius:50%; border:1px solid #262626; background:#1c1c1c; color:#aeaeae; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; flex:none; }',
    '.fzp-descr .fzp-step p{ margin:0; font-size:14.5px; line-height:1.5; color:#aeaeae; padding-top:2px; }',
    '.fzp-descr .fzp-callout{ display:flex; align-items:center; gap:12px; background:rgba(179,51,43,0.12); border:1px solid rgba(179,51,43,0.35); border-left:3px solid #B3332B; border-radius:10px; padding:12px 16px; }',
    '.fzp-descr .fzp-callout svg{ width:20px; height:20px; flex:none; stroke:#B3332B; fill:none; stroke-width:1.8; }',
    '.fzp-descr .fzp-callout-text{ font-size:15px; color:#F2F0EA; }',
    '.fzp-descr .fzp-callout-text b{ color:#fff; font-weight:700; }',
    '.fzp-card{ padding:20px; border:1px solid #262626; border-radius:16px; background:#141414; }',
  ,
    '.fzp-grid{ display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start; margin-top:140px; }',
    '@media(max-width:900px){ .fzp-grid{ grid-template-columns:1fr; margin-top:48px; } .fzp-descr .fzp-specs{ grid-template-columns:1fr; } }'
  ].join('\n');
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>';
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function item(t){ return '<div class="fzp-item">' + CHECK + '<span>' + esc(t) + '</span></div>'; }
  function step(n, t){ return '<div class="fzp-step"><div class="fzp-step-num">' + n + '</div><p>' + esc(t) + '</p></div>'; }
  function clean(s){ return String(s).replace(/\s+/g, ' ').trim(); }
  function parse(raw){
    var d = document.createElement('div'); d.innerHTML = raw;
    var r = { model:'', sizes:[], bullets:[], benefits:[], process:[], how:[], pay:'', phone:'' };
    var m = d.querySelector('strong, b'); if (m) r.model = clean(m.textContent);
    var text = d.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div)>/gi, '\n');
    var tmp = document.createElement('div'); tmp.innerHTML = text;
    var lines = (tmp.textContent || '').split('\n').map(clean).filter(Boolean);
    lines.forEach(function(l){
      var s = l.match(/^(Передние|Задние)\s*:\s*(.+)$/i);
      if (s) r.sizes.push({ label:s[1], value:s[2] });
      var p = l.match(/^Оплата\s*:\s*(.+)$/i); if (p) r.pay = p[1];
      var ph = l.match(/(\+?\d[\d\s()\-]{8,}\d)/); if (ph && /Свяжитесь|Есть вопросы/i.test(lines.join(' '))) r.phone = r.phone || '';
    });
    var uls = d.querySelectorAll('ul');
    for (var i = 0; i < uls.length; i++){
      var head = '', prev = uls[i].previousSibling, guard = 0;
      while (prev && guard++ < 6){ var tx = clean(prev.textContent || ''); if (tx && prev.nodeName !== 'BR') { head = tx; break; } prev = prev.previousSibling; }
      var items = [].map.call(uls[i].querySelectorAll('li'), function(li){ return clean(li.textContent); }).filter(Boolean);
      if (/^Преимущества/i.test(head)) r.benefits = items;
      else if (/^Процесс заказа/i.test(head)) r.process = items;
      else if (/^Как мы работаем/i.test(head)) r.how = items;
      else if (!r.bullets.length) r.bullets = items;
    }
    return r;
  }
  function buildTop(p){
    var h = '<p class="fzp-intro">Мы производим кованые диски премиум-класса' + (p.model ? ' для <b>' + esc(p.model) + '</b>' : '') + ' любого дизайна, размера и цвета.</p>';
    if (p.sizes.length) h += '<div class="fzp-section"><p class="fzp-head">Размеры колёс</p><div class="fzp-specs">' + p.sizes.map(function(s){ return '<div><div class="fzp-spec-label">' + esc(s.label) + '</div><div class="fzp-spec-value">' + esc(s.value) + '</div></div>'; }).join('') + '</div></div>';
    return h;
  }
  function buildLeft(p){
    var h = '';
    if (p.bullets.length) h += '<div class="fzp-section"><p class="fzp-head">Что вы получаете</p><div class="fzp-list">' + p.bullets.map(item).join('') + '</div></div>';
    if (p.benefits.length) h += '<div class="fzp-section"><p class="fzp-head">Преимущества кованых дисков от Forza Wheels</p><div class="fzp-list">' + p.benefits.map(item).join('') + '</div></div>';
    return h;
  }
  function buildRight(p){
    var h = '';
    if (p.process.length) h += '<div class="fzp-section"><p class="fzp-head">Процесс заказа</p><div class="fzp-steps">' + p.process.map(function(t, i){ return step(i + 1, t); }).join('') + '</div></div>';
    if (p.pay) h += '<div class="fzp-section"><div class="fzp-callout"><div class="fzp-callout-text">Оплата: <b>' + esc(p.pay.replace(/\.$/, '')) + '</b></div></div></div>';
    if (p.how.length) h += '<div class="fzp-section"><p class="fzp-head">Как мы работаем</p><div class="fzp-steps">' + p.how.map(function(t, i){ return step(i + 1, t); }).join('') + '</div></div>';
    h += '<div class="fzp-section"><div class="fzp-callout"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg><div class="fzp-callout-text">Есть вопросы? Звоните: <b>8 (701) 940-24-22</b></div></div></div>';
    return h;
  }
  function sync(){
    var cols = Array.prototype.slice.call(document.querySelectorAll('.t-store__prod-popup__col-right'));
    var colRight = cols.filter(function(c){ return c.offsetParent; })[0] || cols[0];
    var textEl = (colRight && colRight.querySelector('.js-store-prod-all-text')) || document.querySelector('.js-store-prod-all-text');
    if (!textEl || !colRight || !colRight.offsetParent) return;
    var raw = textEl.innerHTML;
    var parent = textEl.parentElement;
    var top = parent.querySelector(':scope > .fzp-descr');
    var productRoot = colRight.parentElement && colRight.parentElement.parentElement;
    var grid = productRoot ? productRoot.querySelector(':scope > .fzp-grid') : null;
    var ok = raw && raw.indexOf(KEY) !== -1 && raw.indexOf(BRAND_GATE) === -1;
    if (!ok) { if (top) { textEl.style.display = ''; top.style.display = 'none'; } if (grid) grid.style.display = 'none'; return; }
    if (top && textEl.style.display === 'none' && top.getAttribute('data-raw') === String(raw.length) && grid && grid.style.display !== 'none') return;
    var p = parse(raw);
    if (!top) { top = document.createElement('div'); top.className = 'fzp-descr'; parent.appendChild(top); }
    top.innerHTML = buildTop(p); top.setAttribute('data-raw', String(raw.length)); top.style.display = '';
    textEl.style.display = 'none';
    if (productRoot) {
      if (!grid) { grid = document.createElement('div'); grid.className = 'fzp-grid'; grid.innerHTML = '<div class="fzp-descr fzp-card fzp-l"></div><div class="fzp-descr fzp-card fzp-r"></div>'; productRoot.appendChild(grid); }
      grid.querySelector('.fzp-l').innerHTML = buildLeft(p);
      grid.querySelector('.fzp-r').innerHTML = buildRight(p);
      grid.style.display = '';
    }
  }
  function start(){
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    sync();
    var pending = false;
    new MutationObserver(function(){ if (pending) return; pending = true; requestAnimationFrame(function(){ pending = false; sync(); }); }).observe(document.body, { childList:true, subtree:true, characterData:true });
    function later(){ setTimeout(sync, 60); setTimeout(sync, 400); }
    document.addEventListener('click', later, true);
    window.addEventListener('popstate', later);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
;
