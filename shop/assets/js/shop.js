/* ============================================================
   MapShop — shop.js
   ============================================================ */

(function(){try{var s=document.createElement('style');s.textContent='.glightbox-container .gslide-image img.zoomable,.glightbox-container .gslide-image img{cursor:zoom-out!important}.glightbox-container .gslide-image .zoomed,.glightbox-container .gslide-image img.zoomed{cursor:zoom-out!important}';(document.head||document.documentElement).appendChild(s);}catch(e){}})();

/* ── GLightbox mobile portrait title functions (unchanged from original) ── */
function resetGlightboxTitleMobilePortrait(descs){descs.forEach(function(d){if(d.classList)d.classList.remove('ms-title-ready');d.style.position='';d.style.left='';d.style.right='';d.style.top='';d.style.bottom='';d.style.transform='';d.style.width='';d.style.maxWidth='';d.style.margin='';d.style.boxSizing='';d.style.zIndex='';d.style.display='';d.style.visibility='';d.style.opacity='';});}
function prepareGlightboxTitleMobilePortrait(){try{var lb=document.querySelector('.glightbox-container');if(!lb)return;var descs=lb.querySelectorAll('.gslide-description.description-bottom');var isPortraitMobile=window.matchMedia&&window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;if(!isPortraitMobile){resetGlightboxTitleMobilePortrait(descs);return;}descs.forEach(function(d){if(d.classList)d.classList.remove('ms-title-ready');});}catch(e){}}
function alignGlightboxTitleMobilePortrait(reveal){try{var lb=document.querySelector('.glightbox-container');if(!lb)return;var descs=lb.querySelectorAll('.gslide-description.description-bottom');var isPortraitMobile=window.matchMedia&&window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;if(!isPortraitMobile){resetGlightboxTitleMobilePortrait(descs);return;}var slide=lb.querySelector('.gslide.current');if(!slide)return;var img=slide.querySelector('.gslide-image img');var desc=slide.querySelector('.gslide-description.description-bottom');if(!img||!desc)return;var imgRect=img.getBoundingClientRect();if(!imgRect.width||!imgRect.height)return;descs.forEach(function(d){if(d!==desc)resetGlightboxTitleMobilePortrait([d]);});desc.style.position='fixed';desc.style.left=Math.round(imgRect.left)+'px';desc.style.right='auto';desc.style.top=Math.round(imgRect.bottom)+'px';desc.style.bottom='auto';desc.style.transform='none';desc.style.width=Math.round(imgRect.width)+'px';desc.style.maxWidth='calc(100vw - 32px)';desc.style.margin='0';desc.style.boxSizing='border-box';desc.style.zIndex='99999';desc.style.display='block';desc.style.visibility='visible';desc.style.opacity='1';if(reveal!==false&&desc.classList)desc.classList.add('ms-title-ready');}catch(e){}}
function scheduleGlightboxTitleMobilePortrait(){prepareGlightboxTitleMobilePortrait();if(window.requestAnimationFrame){requestAnimationFrame(function(){alignGlightboxTitleMobilePortrait(false);});requestAnimationFrame(function(){requestAnimationFrame(function(){alignGlightboxTitleMobilePortrait(true);});});}else{alignGlightboxTitleMobilePortrait(true);}[80,180,320,520,760].forEach(function(ms){setTimeout(function(){alignGlightboxTitleMobilePortrait(true);},ms);});}

var SHOP_CONFIG = {
  BIN_ID:     '69e8800536566621a8dc1cef',
  ACCESS_KEY: '$2a$10$SWsRO4Th4FloGOPvYZPgpew9JY8oA5GYVCiVoKhSubcpmx08/BUim',  /* read-only, safe to be public */
  SHOP_NAME:  'MapShop',
  CURRENCY:   'USD',
};

var allProducts=[], allBundles=[], allServices=[], tagColors={};
var activeFilter='all', activeSort='newest', searchQuery='';
var currentDetailProduct=null, currentDetailIsService=false, currentVariantIdx=-1;
var glightboxInst=null;

/* ── Particles ── */
(function(){try{var cvs=document.getElementById('particles');if(!cvs)return;var ctx=cvs.getContext('2d');var COLS=['rgba(0,255,127,','rgba(0,229,255,','rgba(0,204,90,'];var CHARS=['■','▪','◆','▸','⬡'];var W,H,P;function rsz(){W=cvs.width=innerWidth;H=cvs.height=innerHeight;}function mp(){return{x:Math.random()*(W||800),y:Math.random()*-(H||600),sz:Math.random()*8+3,sp:Math.random()*.4+.1,al:Math.random()*.25+.03,col:COLS[0|Math.random()*COLS.length],ch:CHARS[0|Math.random()*CHARS.length],dr:(Math.random()-.5)*.2,rot:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.006};}function ip(){P=[];var n=Math.max(20,0|(W*H/20000));for(var i=0;i<n;i++){var p=mp();p.y=Math.random()*H;P.push(p);}}function dp(){ctx.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var p=P[i];ctx.save();ctx.globalAlpha=p.al;ctx.fillStyle=p.col+p.al+')';ctx.font=p.sz+'px monospace';ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillText(p.ch,0,0);ctx.restore();p.y+=p.sp;p.x+=p.dr;p.rot+=p.rs;if(p.y>H+20){Object.assign(p,mp());p.y=-20;}}requestAnimationFrame(dp);}rsz();ip();dp();window.addEventListener('resize',function(){rsz();ip();});}catch(e){}})();

var fy=document.getElementById('footer-year');if(fy)fy.textContent=new Date().getFullYear();
function toast(msg,ok){try{var c=document.getElementById('toast-container'),t=document.createElement('div');t.className='toast '+(ok!==false?'toast-ok':'toast-err');t.innerHTML='<i class="bi bi-'+(ok!==false?'check-circle-fill':'exclamation-triangle-fill')+'"></i> '+msg;c.appendChild(t);setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .4s';setTimeout(function(){t.remove();},450);},3000);}catch(e){}}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ── Load ── */
function loadShop(){
  fetch('https://api.jsonbin.io/v3/b/'+SHOP_CONFIG.BIN_ID+'/latest',{headers:{'X-Access-Key':SHOP_CONFIG.ACCESS_KEY}})
  .then(function(r){return r.json();})
  .then(function(data){
    var rec=data.record||{};
    allProducts=rec.products||[];allBundles=rec.bundles||[];allServices=rec.services||[];tagColors=rec.tag_colors||{};
    updateStats();buildFilters();renderProducts();updateSeoLD();
  })
  .catch(function(){allProducts=[];allBundles=[];allServices=[];tagColors={};renderProducts();});
}

function updateStats(){
  var sm=document.getElementById('stat-maps'),st=document.getElementById('stat-tags');
  if(sm)sm.textContent=allProducts.length;
  if(st){var tags={};allProducts.forEach(function(p){(p.tags||[]).forEach(function(t){tags[t]=1;});});st.textContent=Object.keys(tags).length;}
}

function tagStyle(name){
  var col=tagColors[name];if(!col)return'';
  var r=parseInt(col.slice(1,3),16),g=parseInt(col.slice(3,5),16),b=parseInt(col.slice(5,7),16);
  return'style="color:'+col+';border-color:'+col+'55;background:rgba('+r+','+g+','+b+',.1)"';
}
function renderTag(name){return'<span class="tag tag-default" '+tagStyle(name)+'>'+esc(name)+'</span>';}

/* ── Build filters — products tags only; single "Services" button ── */
function buildFilters(){
  var bar=document.getElementById('filters-bar');if(!bar)return;
  /* Remove all dynamic buttons */
  bar.querySelectorAll('.filter-btn:not([data-filter="all"])').forEach(function(b){b.remove();});

  /* Collect tags from PRODUCTS ONLY (not services) */
  var tags={};
  allProducts.forEach(function(p){(p.tags||[]).forEach(function(t){tags[t]=1;});});
  var sel=document.getElementById('sort-select');

  Object.keys(tags).sort().forEach(function(tag){
    var b=document.createElement('button');b.className='filter-btn';b.setAttribute('data-filter',tag);
    b.innerHTML='<i class="bi bi-tag-fill"></i> '+esc(tag);bar.insertBefore(b,sel);
  });

  /* Add single "Services" button (violet) if any services exist */
  if(allServices.length>0){
    var sb=document.createElement('button');
    sb.className='filter-btn filter-btn-services';
    sb.setAttribute('data-filter','services');
    sb.innerHTML='<i class="bi bi-stars"></i> Services';
    bar.insertBefore(sb,sel);
  }

  bar.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      bar.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');activeFilter=btn.getAttribute('data-filter');renderProducts();
    });
  });
}

/* ── Visible items — services ONLY when filter="services" ── */
function getVisible(){
  /* "Services" filter — show only services */
  if(activeFilter==='services'){
    var svc=allServices.slice();
    if(searchQuery){var q=searchQuery.toLowerCase();svc=svc.filter(function(s){return(s.title||'').toLowerCase().indexOf(q)!==-1;});}
    return svc.map(function(s){return Object.assign({},s,{_isService:true});});
  }

  /* "All" or tag filter — show maps + bundles ONLY (no services) */
  var maps=allProducts.slice();
  var bundles=allBundles.slice();
  if(activeFilter!=='all'){
    maps=maps.filter(function(p){return(p.tags||[]).indexOf(activeFilter)!==-1;});
    bundles=[];
  }
  if(searchQuery){
    var q2=searchQuery.toLowerCase();
    maps=maps.filter(function(p){return(p.title||'').toLowerCase().indexOf(q2)!==-1||(p.description||'').replace(/<[^>]+>/g,'').toLowerCase().indexOf(q2)!==-1;});
    bundles=bundles.filter(function(b){return(b.title||'').toLowerCase().indexOf(q2)!==-1;});
  }
  var all=maps.concat(bundles.map(function(b){return Object.assign({},b,{_isBundle:true});}));
  all.sort(function(a,b2){
    if(activeSort==='newest')return new Date(b2.created_at||0)-new Date(a.created_at||0);
    if(activeSort==='oldest')return new Date(a.created_at||0)-new Date(b2.created_at||0);
    if(activeSort==='price-asc')return parseFloat(a.price||0)-parseFloat(b2.price||0);
    if(activeSort==='price-desc')return parseFloat(b2.price||0)-parseFloat(a.price||0);
    if(activeSort==='featured')return(b2.featured?1:0)-(a.featured?1:0);
    return 0;
  });
  return all;
}

/* ── Bundle composite cover ── */
function buildBundleCover(bundle){
  var imgs=(bundle.bundle_items||[]).slice(0,4).map(function(bid){var mp=allProducts.find(function(x){return x.id===bid;});return mp&&mp.images&&mp.images[0]?mp.images[0]:null;}).filter(Boolean);
  if(bundle.images&&bundle.images.length)imgs=bundle.images.slice(0,4);
  if(!imgs.length)return'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;opacity:.2">🗺</div>';
  var cls='b'+Math.min(imgs.length,4);
  return'<div class="bundle-composite '+cls+'">'+imgs.slice(0,4).map(function(s){return'<img src="'+esc(s)+'" loading="lazy" decoding="async">';}).join('')+'</div>';
}

/* ── Render products ── */
function renderProducts(){
  var grid=document.getElementById('products-grid');if(!grid)return;
  grid.innerHTML='';
  var visible=getVisible();
  if(!visible.length){grid.innerHTML='<div class="empty-state"><span class="empty-icon">🗺</span><h3>No items found</h3><p>Try a different filter or search term.</p></div>';return;}

  visible.forEach(function(p,idx){
    var isBundle=!!p._isBundle, isService=!!p._isService;
    var images=p.images&&p.images.length?p.images:[];
    var thumb=images[0]||'';
    var pid=String(p.id||idx);

    var card=document.createElement('div');
    card.className='product-card'+(p.featured?' featured':'')+(isBundle?' bundle-card':'')+(isService?' service-card':'');
    card.style.opacity='0';card.style.transform='translateY(14px)';

    if(p.featured&&!isBundle&&!isService)card.innerHTML+='<div class="featured-badge"><i class="bi bi-star-fill"></i> Featured</div>';
    if(isBundle)card.innerHTML+='<div class="bundle-badge"><i class="bi bi-gift-fill"></i> Bundle</div>';
    if(isService)card.innerHTML+='<div class="service-badge"><i class="bi bi-stars"></i> Service</div>';

    var inner=document.createElement('div');
    inner.className='product-card-inner';

    /* Gallery */
    var galleryHtml='<div class="card-gallery">';
    if(isBundle){galleryHtml+=buildBundleCover(p);}
    else if(thumb){galleryHtml+='<img src="'+esc(thumb)+'" alt="'+esc(p.title||'')+'" loading="lazy" decoding="async">';}
    else{galleryHtml+='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;opacity:.2">'+(isService?'⚙':'🗺')+'</div>';}
    if(!isService&&images.length>1)galleryHtml+='<div class="img-count"><i class="bi bi-images"></i>'+images.length+'</div>';
    galleryHtml+='<div class="glb-links">';
    if(!isService)images.forEach(function(src,i){var cap=esc(p.title||'')+(images.length>1?' ('+(i+1)+'/'+images.length+')':'');galleryHtml+='<a href="'+esc(src)+'" data-gallery="g-'+esc(pid)+'" data-glightbox="title: '+cap+'" data-type="image"></a>';});
    galleryHtml+='</div></div>';

    /* Card body */
    var tagsHtml=(p.tags||[]).map(function(t){return renderTag(t);}).join('');
    var shortText=(p.description||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
    if(shortText.length===160)shortText+='…';

    /* Bundle includes */
    var bundleDescHtml='';
    if(isBundle){
      var bDesc=(p.description||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
      if(bDesc)bundleDescHtml='<div class="card-desc">'+esc(bDesc)+'</div>';
      var rows=(p.bundle_items||[]).map(function(bid){var mp=allProducts.find(function(x){return x.id===bid;});if(!mp)return'';var price=parseFloat(mp.price||0);return'<div class="bundle-map-row"><i class="bi bi-map-fill"></i><span>'+esc(mp.title||'Untitled')+'</span>'+(price>0?'<span class="bundle-map-row-price">'+price.toFixed(2)+'</span>':'<span class="bundle-map-row-price" style="color:var(--cyan)">Free</span>')+'</div>';}).join('');
      bundleDescHtml+='<div class="bundle-includes"><div class="bundle-includes-title"><i class="bi bi-collection-fill"></i> Included Maps</div>'+rows+'</div>';
    }

    /* Service card body — no price, Discord hint */
    var serviceBodyHtml='';
    if(isService){
      serviceBodyHtml='<div class="card-desc">'+shortText+'</div>';
      if(p.variants&&p.variants.length>0){
        serviceBodyHtml+='<div class="service-variant-hint"><i class="bi bi-layers-fill"></i> '+(p.variants.length+1)+' versions available</div>';
      }
      serviceBodyHtml+='<div class="service-card-discord"><i class="bi bi-discord"></i><span>Contact via Discord</span></div>';
    }

    /* Price — services show nothing on card (price_range only in details) */
    var priceHtml='';
    if(!isService&&!isBundle){
      var pval=parseFloat(p.price||0);
      priceHtml='<div class="card-price"><span class="price-label">Price</span><span class="price-value">'+(pval>0?esc(String(p.price))+'<span class="price-currency">'+esc(SHOP_CONFIG.CURRENCY)+'</span>':'<span style=\'color:var(--cyan)\'>Free</span>')+'</span></div>';
    }else if(isBundle){
      var orig=calcBundleOrig(p);
      var finalP=parseFloat(p.price||0)||(orig*(1-(p.bundle_discount||0)/100));
      priceHtml='<div class="card-price"><span class="price-label">Bundle</span>'+(orig>0?'<span class="price-original">'+orig.toFixed(2)+'</span><span class="price-discount">-'+(p.bundle_discount||0)+'%</span>':'')+'<span class="price-value">'+(finalP>0?finalP.toFixed(2)+'<span class="price-currency">'+esc(SHOP_CONFIG.CURRENCY)+'</span>':'<span style=\'color:var(--cyan)\'>Free</span>')+'</span></div>';
    }

    /* Buttons */
    var ppid=p.paypal_id;
    var buyBtn=(!isService&&ppid)?'<a href="https://www.paypal.com/ncp/payment/'+esc(ppid)+'" target="_blank" rel="noopener" class="btn-buy"><i class="bi bi-bag-check-fill"></i> Buy Now</a>':'';
    var hasFull=!!(p.full_description&&p.full_description.trim()&&p.full_description!=='<p><br></p>');
    var hasVariants=!!(p.variants&&p.variants.length>0);
    var showDetails=(hasFull||images.length>0||hasVariants);
    var detBtn=showDetails?'<button class="btn-details'+(isService?' btn-details-service':'')+'" data-pid="'+esc(pid)+'" data-bundle="'+(isBundle?'1':'0')+'" data-service="'+(isService?'1':'0')+'"><i class="bi bi-eye-fill"></i> '+(isService?'Learn More':'Details')+'</button>':'';

    inner.innerHTML=galleryHtml+
      '<div class="card-body">'+
        '<div class="card-tags">'+tagsHtml+'</div>'+
        '<div class="card-title">'+esc(p.title||'Untitled')+'</div>'+
        (isBundle?bundleDescHtml:(isService?serviceBodyHtml:'<div class="card-desc">'+shortText+'</div>'))+
        '<div class="card-meta">'+(isService?'':priceHtml)+'<div class="card-actions">'+buyBtn+detBtn+'</div></div>'+
      '</div>';

    card.appendChild(inner);grid.appendChild(card);
    setTimeout(function(){card.style.opacity='1';card.style.transform='translateY(0)';card.style.transition='opacity .35s,transform .35s';},30+idx*55);
  });

  initGlightbox();
  initDetailBtns();
}

function calcBundleOrig(b){return(b.bundle_items||[]).reduce(function(s,bid){var mp=allProducts.find(function(x){return x.id===bid;});return s+(mp&&mp.price?parseFloat(mp.price):0);},0);}

/* ── GLightbox ── */
function initGlightbox(){
  if(typeof GLightbox==='undefined')return;
  if(glightboxInst){try{glightboxInst.destroy();}catch(e){}}
  glightboxInst=GLightbox({selector:'.glb-links a',touchNavigation:true,loop:true,autoplayVideos:false,skin:'clean'});
}

function initDetailBtns(){
  document.querySelectorAll('.btn-details,.btn-details-service').forEach(function(btn){
    btn.addEventListener('click',function(){
      var pid=btn.getAttribute('data-pid'),isBundle=btn.getAttribute('data-bundle')==='1',isService=btn.getAttribute('data-service')==='1';
      var p;
      if(isService){p=allServices.find(function(s){return String(s.id)===pid;});}
      else if(isBundle){p=allBundles.find(function(b){return String(b.id)===pid;});}
      else{p=allProducts.find(function(x){return String(x.id)===pid;});}
      if(p)openDetailModal(p,isBundle,isService);
    });
  });
}

/* ============================================================
   DETAIL MODAL
   ============================================================ */
var detailAutoplayTimer=null;
var detailSlideIdx=0;
var detailSlideImages=[];
var detailDragStartX=0,detailDragging=false,detailCurrentTranslate=0,detailPrevTranslate=0;
var detailPrevIdx=-1;
var detailGlightbox=null;
var detailNavLock=false;

function queueDetailSlide(targetIdx){if(detailNavLock)return;detailNavLock=true;slideTo(targetIdx,true);setTimeout(function(){detailNavLock=false;},120);}
function openDetailLightbox(realIdx){stopAutoplay();if(detailGlightbox&&typeof detailGlightbox.openAt==='function'){detailGlightbox.openAt(realIdx);return;}if(detailGlightbox&&typeof detailGlightbox.setIndex==='function'){detailGlightbox.setIndex(realIdx);if(typeof detailGlightbox.open==='function')detailGlightbox.open();return;}var links=document.querySelectorAll('.glb-links-detail a');if(links[realIdx])links[realIdx].click();}

function openDetailModal(p, isBundle, isService){
  currentDetailProduct=p;
  currentDetailIsService=!!isService;
  currentVariantIdx=-1; /* -1 = base product */

  /* Tags */
  document.getElementById('detail-tags').innerHTML=(p.tags||[]).map(function(t){return renderTag(t);}).join('');

  /* Title */
  document.getElementById('detail-title').textContent=p.title||'';

  /* Badges — price for maps/bundles, price_range for services */
  var badgesEl=document.getElementById('detail-badges');
  badgesEl.innerHTML='';
  if(isService){
    /* Price range only in details, from base service */
    if(p.price_range){
      badgesEl.innerHTML='<span class="service-price-range"><i class="bi bi-currency-dollar"></i>'+esc(p.price_range)+'</span>';
    }
  }else{
    var pval=parseFloat(p.price||0);
    if(pval>0){badgesEl.innerHTML='<span class="detail-badge-price">'+pval.toFixed(2)+' '+esc(SHOP_CONFIG.CURRENCY)+'</span>';}
    else{badgesEl.innerHTML='<span class="detail-badge-price" style="color:var(--cyan)">Free</span>';}
    if(p.featured&&!isBundle)badgesEl.innerHTML+='<span style="color:var(--gold);font-family:var(--fp);font-size:8px;display:inline-flex;align-items:center;gap:4px"><i class="bi bi-star-fill"></i> Featured</span>';
    if(isBundle&&p.bundle_discount)badgesEl.innerHTML+='<span style="color:var(--red);font-family:var(--fu);font-size:14px;font-weight:700">-'+p.bundle_discount+'% Bundle</span>';
  }

  /* Variant dropdown — show below badges if variants exist */
  var varRow=document.getElementById('detail-variant-row');
  if(varRow){
    var hasVariants=!!(p.variants&&p.variants.length>0);
    if(hasVariants&&!isBundle){
      varRow.style.display='block';
      buildVariantDropdown(p, isService);
    }else{
      varRow.style.display='none';
      varRow.innerHTML='';
    }
  }

  /* Description */
  var descEl=document.getElementById('detail-desc');
  var fullDesc=p.full_description||'';
  var hasFull=fullDesc.trim()&&fullDesc!=='<p><br></p>';
  descEl.innerHTML=hasFull?fullDesc:(p.description||'<em style="color:var(--muted)">No description.</em>');

  /* Footer */
  renderDetailFooter(p, isService, -1);

  /* Gallery */
  buildDetailSlideshow(p.images||[], p.title);

  document.getElementById('detail-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  attachDetailKeyboard();
}

/* ── Render detail footer based on current variant ── */
function renderDetailFooter(p, isService, varIdx){
  var footerEl=document.getElementById('detail-footer');
  footerEl.innerHTML='';

  if(isService){
    /* Discord CTA button */
    var discordId=p.discord_id||'806610398924636200';
    footerEl.innerHTML=
      '<a href="https://discord.com/users/'+esc(discordId)+'" target="_blank" rel="noopener" class="btn-discord-cta">'+
        '<i class="bi bi-discord"></i> Get in Touch'+
      '</a>'+
      '<div class="detail-discord-username"><i class="bi bi-at"></i> waapno</div>';
  }else{
    var variant=varIdx>=0&&p.variants&&p.variants[varIdx]?p.variants[varIdx]:null;
    var ppid=variant?variant.paypal_id:p.paypal_id;
    var price=variant?parseFloat(variant.price||0):parseFloat(p.price||0);
    if(ppid){
      footerEl.innerHTML='<a href="https://www.paypal.com/ncp/payment/'+esc(ppid)+'" target="_blank" rel="noopener" class="btn-buy"><i class="bi bi-bag-check-fill"></i> Buy Now'+(price>0?' — '+price.toFixed(2)+' '+esc(SHOP_CONFIG.CURRENCY):' — Free')+'</a>';
    }
    var imgs=variant&&variant.images&&variant.images.length?variant.images:(p.images||[]);
    if(imgs.length>1)footerEl.innerHTML+='<span style="color:var(--muted);font-family:var(--fu);font-size:12px"><i class="bi bi-images"></i> '+imgs.length+' images · swipe or use arrows</span>';
  }
}

/* ============================================================
   VARIANT DROPDOWN — below price badge
   Maps: full switch (images + desc + price + paypal)
   Services: switch only price_range + cover image
   ============================================================ */
function buildVariantDropdown(p, isService){
  var varRow=document.getElementById('detail-variant-row');
  varRow.innerHTML='';

  /* Label for base product */
  var baseLabel=isService?'Base Version':'Base Edition';
  var basePrice=isService?(p.price_range||''):(parseFloat(p.price||0)>0?parseFloat(p.price||0).toFixed(2)+' '+SHOP_CONFIG.CURRENCY:'Free');

  /* All options: base (-1) + variants */
  var options=[{idx:-1, label:baseLabel, price:basePrice}];
  (p.variants||[]).forEach(function(v,i){
    var vLabel=isService?(v.name||'Version '+(i+1)):(v.label||'Variant '+(i+1));
    var vPrice=isService?(v.price_range||''):(parseFloat(v.price||0)>0?parseFloat(v.price||0).toFixed(2)+' '+SHOP_CONFIG.CURRENCY:'Free');
    options.push({idx:i, label:vLabel, price:vPrice});
  });

  /* Build dropdown */
  var wrap=document.createElement('div');
  wrap.className='vs-wrap'+(isService?' vs-wrap-service':'');

  var btn=document.createElement('button');
  btn.className='vs-trigger';
  btn.id='vs-trigger';
  btn.setAttribute('aria-expanded','false');
  btn.innerHTML=
    '<i class="bi bi-layers-half vs-icon"></i>'+
    '<span class="vs-label" id="vs-label">'+esc(baseLabel)+'</span>'+
    (basePrice?'<span class="vs-price-tag" id="vs-price-tag">'+esc(basePrice)+'</span>':'')+
    '<i class="bi bi-chevron-down vs-chevron" id="vs-chevron"></i>';
  wrap.appendChild(btn);

  var menu=document.createElement('div');
  menu.className='vs-menu';menu.id='vs-menu';
  options.forEach(function(opt){
    var item=document.createElement('button');
    item.className='vs-item'+(opt.idx===-1?' vs-active':'');
    item.setAttribute('data-idx',opt.idx);
    item.innerHTML=
      '<i class="bi bi-check2 vs-check" style="'+(opt.idx===-1?'':'opacity:0')+'"></i>'+
      '<div class="vs-item-info">'+
        '<span class="vs-item-name">'+esc(opt.label)+'</span>'+
        (opt.price?'<span class="vs-item-price">'+esc(opt.price)+'</span>':'')+
      '</div>';
    item.addEventListener('click',function(){
      if(isService){switchServiceVariant(p, opt.idx, options);}
      else{switchMapVariant(p, opt.idx, options);}
      updateDropdownLabel(opt.label, opt.price, opt.idx);
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.getElementById('vs-chevron').style.transform='';
    });
    menu.appendChild(item);
  });
  wrap.appendChild(menu);
  varRow.appendChild(wrap);

  /* Toggle dropdown */
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var open=menu.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    document.getElementById('vs-chevron').style.transform=open?'rotate(180deg)':'';
  });
  /* Close on outside click */
  document.addEventListener('click',function closeVs(e){
    if(!wrap.contains(e.target)){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');var ch=document.getElementById('vs-chevron');if(ch)ch.style.transform='';}
  });
}

function updateDropdownLabel(label, price, idx){
  var lbl=document.getElementById('vs-label'),ptag=document.getElementById('vs-price-tag');
  if(lbl)lbl.textContent=label;
  if(ptag){ptag.textContent=price;ptag.style.display=price?'':'none';}
  /* Update active state */
  document.querySelectorAll('.vs-item').forEach(function(item){
    var isActive=parseInt(item.getAttribute('data-idx'))===idx;
    item.classList.toggle('vs-active',isActive);
    var check=item.querySelector('.vs-check');
    if(check)check.style.opacity=isActive?'1':'0';
  });
}

/* ── Switch map variant — full content update with smooth fade ── */
function switchMapVariant(p, varIdx, options){
  if(currentVariantIdx===varIdx)return;
  currentVariantIdx=varIdx;
  var modal=document.querySelector('.detail-modal');
  if(!modal)return;

  /* Fade out */
  modal.classList.add('detail-transitioning');

  setTimeout(function(){
    var variant=varIdx>=0&&p.variants&&p.variants[varIdx]?p.variants[varIdx]:null;

    /* Update price badge */
    var badgesEl=document.getElementById('detail-badges');
    var price=variant?parseFloat(variant.price||0):parseFloat(p.price||0);
    var priceBdg='';
    if(price>0){priceBdg='<span class="detail-badge-price">'+price.toFixed(2)+' '+esc(SHOP_CONFIG.CURRENCY)+'</span>';}
    else{priceBdg='<span class="detail-badge-price" style="color:var(--cyan)">Free</span>';}
    if(p.featured)priceBdg+='<span style="color:var(--gold);font-family:var(--fp);font-size:8px;display:inline-flex;align-items:center;gap:4px"><i class="bi bi-star-fill"></i> Featured</span>';
    badgesEl.innerHTML=priceBdg;

    /* Update description */
    var descEl=document.getElementById('detail-desc');
    var fullDesc=variant&&variant.full_description?variant.full_description:(p.full_description||'');
    var hasFull=fullDesc.trim()&&fullDesc!=='<p><br></p>';
    descEl.innerHTML=hasFull?fullDesc:(p.description||'<em style="color:var(--muted)">No description.</em>');

    /* Update footer */
    renderDetailFooter(p, false, varIdx);

    /* Update gallery with variant images (or base if idx=-1) */
    var imgs=variant&&variant.images&&variant.images.length?variant.images:(p.images||[]);
    detailSlideImages=imgs;
    detailSlideIdx=0;detailPrevIdx=-1;
    buildDetailSlideshow(imgs, variant?(variant.label||p.title):p.title);

    /* Fade in */
    modal.classList.remove('detail-transitioning');
  }, 230);
}

/* ── Switch service variant — only price_range + cover image ── */
function switchServiceVariant(p, varIdx, options){
  if(currentVariantIdx===varIdx)return;
  currentVariantIdx=varIdx;

  var variant=varIdx>=0&&p.variants&&p.variants[varIdx]?p.variants[varIdx]:null;
  var modal=document.querySelector('.detail-modal');

  /* Fade gallery + price */
  if(modal)modal.classList.add('detail-transitioning-light');

  setTimeout(function(){
    /* Update price range badge */
    var badgesEl=document.getElementById('detail-badges');
    var priceRange=variant?(variant.price_range||''):(p.price_range||'');
    if(priceRange){
      badgesEl.innerHTML='<span class="service-price-range"><i class="bi bi-currency-dollar"></i>'+esc(priceRange)+'</span>';
    }else{
      badgesEl.innerHTML='';
    }

    /* Update cover image if variant has one */
    var varImage=variant&&variant.image?variant.image:null;
    var baseImages=p.images||[];
    var imgs=varImage?[varImage].concat(baseImages.slice(1)):(baseImages);
    detailSlideImages=imgs;
    detailSlideIdx=0;detailPrevIdx=-1;
    buildDetailSlideshow(imgs, p.title);

    if(modal)modal.classList.remove('detail-transitioning-light');
  }, 230);
}

/* ── Build detail slideshow ── */
function buildDetailSlideshow(images, title){
  var gallery=document.getElementById('detail-gallery');
  gallery.innerHTML='';
  gallery.setAttribute('data-count',images.length);
  stopAutoplay();

  if(!images.length){
    gallery.innerHTML='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;opacity:.2">🗺</div>';
    return;
  }

  var track=document.createElement('div');
  track.className='detail-gallery-track';
  track.id='dg-track';

  var glbLinksDiv=document.createElement('div');
  glbLinksDiv.className='glb-links-detail';glbLinksDiv.style.display='none';
  images.forEach(function(src,i){
    var cap=esc(title||'')+(images.length>1?' ('+(i+1)+'/'+images.length+')':'');
    var a=document.createElement('a');a.href=esc(src);a.setAttribute('data-gallery','dg-detail');a.setAttribute('data-glightbox','title: '+cap);a.setAttribute('data-type','image');
    glbLinksDiv.appendChild(a);
  });
  gallery.appendChild(glbLinksDiv);

  var isDragging=false,startX=0,currentX=0,animationID=0,hasMoved=false,suppressClickUntil=0;
  function getPositionX(e){return e.type.includes('mouse')?e.clientX:e.touches[0].clientX;}

  function createSlideEl(src,realIdx,isVirtual){
    var div=document.createElement('div');
    div.className='detail-gimg'+(realIdx===0&&!isVirtual?' dg-active':'');
    div.setAttribute('data-idx',realIdx);
    if(isVirtual)div.setAttribute('data-virtual','true');
    var img=document.createElement('img');img.src=src;img.alt='Slide '+(realIdx+1);img.loading='lazy';img.decoding='async';div.appendChild(img);
    div.addEventListener('click',function(e){if(isVirtual||hasMoved||Date.now()<suppressClickUntil)return;e.stopPropagation();e.preventDefault();openDetailLightbox(realIdx);});
    return div;
  }

  track.appendChild(createSlideEl(images[images.length-1],images.length-1,true));
  images.forEach(function(src,i){track.appendChild(createSlideEl(src,i,false));});
  track.appendChild(createSlideEl(images[0],0,true));
  gallery.appendChild(track);

  if(images.length>1){
    var prev=document.createElement('button');prev.className='dg-arrow dg-arrow-prev';prev.innerHTML='<i class="bi bi-chevron-left"></i>';
    prev.addEventListener('mousedown',function(e){e.preventDefault();e.stopPropagation();});
    prev.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();queueDetailSlide(detailSlideIdx-1);});
    var next=document.createElement('button');next.className='dg-arrow dg-arrow-next';next.innerHTML='<i class="bi bi-chevron-right"></i>';
    next.addEventListener('mousedown',function(e){e.preventDefault();e.stopPropagation();});
    next.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();queueDetailSlide(detailSlideIdx+1);});
    gallery.appendChild(prev);gallery.appendChild(next);
    var dots=document.createElement('div');dots.className='dg-dots';dots.id='dg-dots';
    images.forEach(function(_,i){var d=document.createElement('div');d.className='dg-dot'+(i===0?' active':'');d.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();queueDetailSlide(i);});dots.appendChild(d);});
    gallery.appendChild(dots);
  }

  function touchStart(e){isDragging=true;hasMoved=false;startX=getPositionX(e);track.classList.add('dragging');cancelAnimationFrame(animationID);stopAutoplay();}
  function touchMove(e){if(!isDragging)return;currentX=getPositionX(e);var diff=currentX-startX;if(Math.abs(diff)>5)hasMoved=true;track.style.transform='translateX('+(detailPrevTranslate+diff)+'px)';}
  function touchEnd(){if(!isDragging)return;isDragging=false;track.classList.remove('dragging');var movedBy=currentX-startX;if(hasMoved)suppressClickUntil=Date.now()+220;if(hasMoved&&movedBy<-100)slideTo(detailSlideIdx+1,true);else if(hasMoved&&movedBy>100)slideTo(detailSlideIdx-1,true);else if(hasMoved)slideTo(detailSlideIdx,true);}
  track.addEventListener('mousedown',touchStart);track.addEventListener('mousemove',touchMove);window.addEventListener('mouseup',touchEnd);
  track.addEventListener('touchstart',touchStart,{passive:true});track.addEventListener('touchmove',touchMove,{passive:false});track.addEventListener('touchend',touchEnd);

  if(typeof GLightbox!=='undefined'){
    if(detailGlightbox){try{detailGlightbox.destroy();}catch(e){}}
    detailGlightbox=GLightbox({selector:'.glb-links-detail a',touchNavigation:true,loop:true,autoplayVideos:false,skin:'clean',closeOnOutsideClick:true,closeOnSlideClick:false,moreLength:0,keyboardNavigation:true});
    detailGlightbox.on('open',function(){
      setTimeout(function(){
        var lb=document.querySelector('.glightbox-container');if(!lb)return;
        lb.querySelectorAll('.gslide-image img,.gslide-media').forEach(function(el){
          el.style.cursor='zoom-out';if(el.classList)el.classList.remove('zoomable');el.removeAttribute('data-style');
          ['click','dblclick'].forEach(function(evt){el.addEventListener(evt,function(ev){if(ev.target&&ev.target.closest&&ev.target.closest('.gnext,.gprev,.gclose,.gbtn'))return;ev.preventDefault();ev.stopPropagation();detailGlightbox.close();});});
        });
        /* Mobile close wiring */
        var overlay=lb.querySelector('.goverlay');
        if(overlay&&!overlay._msCloseBound){overlay._msCloseBound=true;overlay.addEventListener('touchend',function(ev){if(ev.target===overlay){ev.preventDefault();detailGlightbox.close();}},{passive:false});}
        var closeBtn=lb.querySelector('.gclose');
        if(closeBtn&&!closeBtn._msCloseBound){closeBtn._msCloseBound=true;closeBtn.addEventListener('touchend',function(ev){ev.preventDefault();detailGlightbox.close();},{passive:false});}
        scheduleGlightboxTitleMobilePortrait();
      },30);
      scheduleGlightboxTitleMobilePortrait();
    });
    detailGlightbox.on('close',function(){if(document.getElementById('detail-overlay').classList.contains('open'))startAutoplay();});
    detailGlightbox.on('slide_changed',function(){scheduleGlightboxTitleMobilePortrait();});
    window.removeEventListener('resize',scheduleGlightboxTitleMobilePortrait);
    window.addEventListener('resize',scheduleGlightboxTitleMobilePortrait);
  }

  requestAnimationFrame(function(){requestAnimationFrame(function(){slideTo(0,false);startAutoplay();});});
}

function onDetailGlightboxClose(){if(document.getElementById('detail-overlay').classList.contains('open'))startAutoplay();}

var detailKeyHandler=null;
function attachDetailKeyboard(){
  if(detailKeyHandler)document.removeEventListener('keydown',detailKeyHandler);
  detailKeyHandler=function(e){if(!document.getElementById('detail-overlay').classList.contains('open'))return;if(e.key==='ArrowLeft'){e.preventDefault();queueDetailSlide(detailSlideIdx-1);}if(e.key==='ArrowRight'){e.preventDefault();queueDetailSlide(detailSlideIdx+1);}};
  document.addEventListener('keydown',detailKeyHandler);
}
function detachDetailKeyboard(){if(detailKeyHandler){document.removeEventListener('keydown',detailKeyHandler);detailKeyHandler=null;}}

function slideTo(idx,userTriggered){
  var images=detailSlideImages;if(!images.length)return;
  idx=((idx%images.length)+images.length)%images.length;
  var track=document.getElementById('dg-track');if(!track)return;
  var slides=track.querySelectorAll('.detail-gimg');
  var gallery=document.getElementById('detail-gallery');
  var domIdx=idx+1;
  var containerW=gallery.offsetWidth;
  var activeSlide=slides[domIdx];if(!activeSlide)return;
  var slideW=activeSlide.offsetWidth;
  var slideCenter=activeSlide.offsetLeft+(slideW/2);
  var galleryCenter=containerW/2;
  var targetTranslate=galleryCenter-slideCenter;
  var isWrappingForward=(detailPrevIdx===images.length-1&&idx===0);
  var isWrappingBackward=(detailPrevIdx===0&&idx===images.length-1);
  if(isWrappingForward){var vf=slides[slides.length-1];detailPrevTranslate=galleryCenter-(vf.offsetLeft+vf.offsetWidth/2);track.style.transition='none';track.style.transform='translateX('+detailPrevTranslate+'px)';track.offsetHeight;track.style.transition='transform .55s cubic-bezier(.4,0,.2,1)';track.style.transform='translateX('+targetTranslate+'px)';detailCurrentTranslate=targetTranslate;detailPrevTranslate=targetTranslate;}
  else if(isWrappingBackward){var vb=slides[0];detailPrevTranslate=galleryCenter-(vb.offsetLeft+vb.offsetWidth/2);track.style.transition='none';track.style.transform='translateX('+detailPrevTranslate+'px)';track.offsetHeight;track.style.transition='transform .55s cubic-bezier(.4,0,.2,1)';track.style.transform='translateX('+targetTranslate+'px)';detailCurrentTranslate=targetTranslate;detailPrevTranslate=targetTranslate;}
  else{detailCurrentTranslate=targetTranslate;detailPrevTranslate=targetTranslate;track.style.transform='translateX('+detailCurrentTranslate+'px)';}
  detailSlideIdx=idx;detailPrevIdx=idx;
  slides.forEach(function(s,i){if(s.getAttribute('data-virtual'))return;s.classList.toggle('dg-active',i-1===idx);});
  var dots=document.querySelectorAll('#dg-dots .dg-dot');dots.forEach(function(d,i){d.classList.toggle('active',i===idx);});
  if(userTriggered)resetAutoplay();
}

function startAutoplay(){clearInterval(detailAutoplayTimer);if(detailSlideImages.length<=1)return;detailAutoplayTimer=setInterval(function(){slideTo(detailSlideIdx+1,false);},4200);}
function resetAutoplay(){clearInterval(detailAutoplayTimer);startAutoplay();}
function stopAutoplay(){clearInterval(detailAutoplayTimer);}

function closeDetailModal(){stopAutoplay();detachDetailKeyboard();document.getElementById('detail-overlay').classList.remove('open');document.body.style.overflow='';}

/* ── SEO ── */
function updateSeoLD(){var el=document.getElementById('ld-products');if(!el)return;var items=allProducts.slice(0,10).map(function(p,i){return{"@type":"ListItem","position":i+1,"item":{"@type":"Product","name":p.title||'','description':(p.description||'').replace(/<[^>]+>/g,'').slice(0,160),"image":(p.images&&p.images[0])||'','offers':{"@type":"Offer","price":p.price||"0","priceCurrency":SHOP_CONFIG.CURRENCY,"availability":"https://schema.org/InStock"}}};});try{var ld=JSON.parse(el.textContent);ld.itemListElement=items;el.textContent=JSON.stringify(ld);}catch(e){}}

/* ── Search & Sort ── */
var si=document.getElementById('search-input');if(si){var deb;si.addEventListener('input',function(){clearTimeout(deb);deb=setTimeout(function(){searchQuery=si.value.trim();renderProducts();},220);});}
var ss=document.getElementById('sort-select');if(ss)ss.addEventListener('change',function(){activeSort=ss.value;renderProducts();});

/* ── Close detail modal ── */
var dc=document.getElementById('detail-close');if(dc)dc.addEventListener('click',closeDetailModal);
var dov=document.getElementById('detail-overlay');if(dov)dov.addEventListener('click',function(e){if(e.target===this)closeDetailModal();});
document.addEventListener('keydown',function(e){if(!document.getElementById('detail-overlay').classList.contains('open'))return;if(e.key==='Escape')closeDetailModal();});
document.addEventListener('glightbox_open',function(){stopAutoplay();});
document.addEventListener('glightbox_close',function(){if(document.getElementById('detail-overlay').classList.contains('open'))startAutoplay();});

document.addEventListener('DOMContentLoaded',loadShop);
