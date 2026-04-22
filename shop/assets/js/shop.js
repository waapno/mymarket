/* ============================================================
   MapShop — shop.js
   ============================================================ */

var SHOP_CONFIG = {
  BIN_ID:     '69e8800536566621a8dc1cef',
  ACCESS_KEY: '$2a$10$SWsRO4Th4FloGOPvYZPgpew9JY8oA5GYVCiVoKhSubcpmx08/BUim',  /* read-only, safe to be public */
  SHOP_NAME:  'MapShop',
  CURRENCY:   'USD',
};

var allProducts = [], allBundles = [], tagColors = {};
var activeFilter = 'all', activeSort = 'newest', searchQuery = '';
var glightboxInst = null;

/* ── Particles ── */
(function(){
  try{
    var cvs=document.getElementById('particles');if(!cvs)return;
    var ctx=cvs.getContext('2d');
    var COLS=['rgba(0,255,127,','rgba(0,229,255,','rgba(0,204,90,'];
    var CHARS=['■','▪','◆','▸','⬡'];
    var W,H,P;
    function rsz(){W=cvs.width=innerWidth;H=cvs.height=innerHeight;}
    function mp(){return{x:Math.random()*(W||800),y:Math.random()*-(H||600),sz:Math.random()*8+3,sp:Math.random()*.4+.1,al:Math.random()*.25+.03,col:COLS[0|Math.random()*COLS.length],ch:CHARS[0|Math.random()*CHARS.length],dr:(Math.random()-.5)*.2,rot:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.006};}
    function ip(){P=[];var n=Math.max(20,0|(W*H/20000));for(var i=0;i<n;i++){var p=mp();p.y=Math.random()*H;P.push(p);}}
    function dp(){ctx.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var p=P[i];ctx.save();ctx.globalAlpha=p.al;ctx.fillStyle=p.col+p.al+')';ctx.font=p.sz+'px monospace';ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillText(p.ch,0,0);ctx.restore();p.y+=p.sp;p.x+=p.dr;p.rot+=p.rs;if(p.y>H+20){Object.assign(p,mp());p.y=-20;}}requestAnimationFrame(dp);}
    rsz();ip();dp();window.addEventListener('resize',function(){rsz();ip();});
  }catch(e){}
})();

var fy=document.getElementById('footer-year');if(fy)fy.textContent=new Date().getFullYear();

function toast(msg,ok){try{var c=document.getElementById('toast-container'),t=document.createElement('div');t.className='toast '+(ok!==false?'toast-ok':'toast-err');t.innerHTML='<i class="bi bi-'+(ok!==false?'check-circle-fill':'exclamation-triangle-fill')+'"></i> '+msg;c.appendChild(t);setTimeout(function(){t.style.opacity='0';t.style.transition='opacity .4s';setTimeout(function(){t.remove();},450);},3000);}catch(e){}}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ── Load ── */
function loadShop(){
  fetch('https://api.jsonbin.io/v3/b/'+SHOP_CONFIG.BIN_ID+'/latest',{headers:{'X-Access-Key':SHOP_CONFIG.ACCESS_KEY}})
  .then(function(r){return r.json();})
  .then(function(data){
    var rec=data.record||{};
    allProducts=rec.products||[];allBundles=rec.bundles||[];tagColors=rec.tag_colors||{};
    updateStats();buildFilters();renderProducts();updateSeoLD();
  })
  .catch(function(){allProducts=[];allBundles=[];tagColors={};renderProducts();});
}

function updateStats(){
  var sm=document.getElementById('stat-maps'),st=document.getElementById('stat-tags');
  if(sm)sm.textContent=allProducts.length+allBundles.length;
  if(st){var tags={};allProducts.forEach(function(p){(p.tags||[]).forEach(function(t){tags[t]=1;});});st.textContent=Object.keys(tags).length;}
}

function tagStyle(name){
  var col=tagColors[name];if(!col)return'';
  var r=parseInt(col.slice(1,3),16),g=parseInt(col.slice(3,5),16),b=parseInt(col.slice(5,7),16);
  return'style="color:'+col+';border-color:'+col+'55;background:rgba('+r+','+g+','+b+',.1)"';
}
function renderTag(name){return'<span class="tag tag-default" '+tagStyle(name)+'>'+esc(name)+'</span>';}

function buildFilters(){
  var bar=document.getElementById('filters-bar');if(!bar)return;
  bar.querySelectorAll('.filter-btn:not([data-filter="all"])').forEach(function(b){b.remove();});
  var tags={};allProducts.forEach(function(p){(p.tags||[]).forEach(function(t){tags[t]=1;});});
  var sel=document.getElementById('sort-select');
  Object.keys(tags).sort().forEach(function(tag){
    var b=document.createElement('button');b.className='filter-btn';b.setAttribute('data-filter',tag);
    b.innerHTML='<i class="bi bi-tag-fill"></i> '+esc(tag);bar.insertBefore(b,sel);
  });
  bar.querySelectorAll('.filter-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      bar.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
      btn.classList.add('active');activeFilter=btn.getAttribute('data-filter');renderProducts();
    });
  });
}

function getVisible(){
  var maps=allProducts.slice(),bundles=allBundles.slice();
  if(activeFilter!=='all'){maps=maps.filter(function(p){return(p.tags||[]).indexOf(activeFilter)!==-1;});bundles=[];}
  if(searchQuery){var q=searchQuery.toLowerCase();maps=maps.filter(function(p){return(p.title||'').toLowerCase().indexOf(q)!==-1||(p.description||'').replace(/<[^>]+>/g,'').toLowerCase().indexOf(q)!==-1;});bundles=bundles.filter(function(b){return(b.title||'').toLowerCase().indexOf(q)!==-1;});}
  var all=maps.concat(bundles.map(function(b){return Object.assign({},b,{_isBundle:true});}));
  all.sort(function(a,b){
    if(activeSort==='newest')return new Date(b.created_at||0)-new Date(a.created_at||0);
    if(activeSort==='oldest')return new Date(a.created_at||0)-new Date(b.created_at||0);
    if(activeSort==='price-asc')return parseFloat(a.price||0)-parseFloat(b.price||0);
    if(activeSort==='price-desc')return parseFloat(b.price||0)-parseFloat(a.price||0);
    if(activeSort==='featured')return(b.featured?1:0)-(a.featured?1:0);
    return 0;
  });
  return all;
}

/* ── Bundle composite cover ── */
function buildBundleCover(bundle){
  var imgs=(bundle.bundle_items||[]).slice(0,4).map(function(bid){
    var mp=allProducts.find(function(x){return x.id===bid;});
    return mp&&mp.images&&mp.images[0]?mp.images[0]:null;
  }).filter(Boolean);
  if(bundle.images&&bundle.images.length)imgs=bundle.images.slice(0,4);
  if(!imgs.length)return'<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:52px;opacity:.2">🗺</div>';
  var cls='b'+Math.min(imgs.length,4);
  return'<div class="bundle-composite '+cls+'">'+imgs.slice(0,4).map(function(s){return'<img src="'+esc(s)+'" loading="lazy" decoding="async">';}).join('')+'</div>';
}

/* ── Render ── */
function renderProducts(){
  var grid=document.getElementById('products-grid');if(!grid)return;
  grid.innerHTML='';
  var visible=getVisible();
  if(!visible.length){grid.innerHTML='<div class="empty-state"><span class="empty-icon">🗺</span><h3>No maps found</h3><p>Try a different filter or search term.</p></div>';return;}

  visible.forEach(function(p,idx){
    var isBundle=!!p._isBundle;
    var images=p.images&&p.images.length?p.images:[];
    var thumb=images[0]||'';
    var pid=String(p.id||idx);

    var card=document.createElement('div');
    card.className='product-card'+(p.featured?' featured':'')+(isBundle?' bundle-card':'');
    card.style.opacity='0';card.style.transform='translateY(14px)';

    if(p.featured&&!isBundle)card.innerHTML+='<div class="featured-badge"><i class="bi bi-star-fill"></i> Featured</div>';
    if(isBundle)card.innerHTML+='<div class="bundle-badge"><i class="bi bi-gift-fill"></i> Bundle</div>';

    var inner=document.createElement('div');
    inner.className='product-card-inner';

    /* Gallery cell */
    var galleryHtml='<div class="card-gallery">';
    if(isBundle){galleryHtml+=buildBundleCover(p);}
    else if(thumb){galleryHtml+='<img src="'+esc(thumb)+'" alt="'+esc(p.title||'')+'" loading="lazy" decoding="async">';}
    else{galleryHtml+='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;opacity:.2">🗺</div>';}
    if(images.length>1)galleryHtml+='<div class="img-count"><i class="bi bi-images"></i>'+images.length+'</div>';

    /* Hidden GLightbox anchors */
    galleryHtml+='<div class="glb-links">';
    images.forEach(function(src,i){
      var cap=esc(p.title||'')+(images.length>1?' ('+(i+1)+'/'+images.length+')':'');
      galleryHtml+='<a href="'+esc(src)+'" data-gallery="g-'+esc(pid)+'" data-glightbox="title: '+cap+'" data-type="image"></a>';
    });
    galleryHtml+='</div></div>';

    /* Body */
    var tagsHtml=(p.tags||[]).map(function(t){return renderTag(t);}).join('');

    /* Short desc text */
    var shortHtml=p.description||'';
    var shortText=shortHtml.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
    if(shortText.length===160)shortText+='…';

    /* Bundle description */
    var bundleDescHtml='';
    if(isBundle){
      var bDesc=(p.description||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
      if(bDesc)bundleDescHtml='<div class="card-desc">'+esc(bDesc)+'</div>';

      /* Vertical map list */
      var rows=(p.bundle_items||[]).map(function(bid){
        var mp=allProducts.find(function(x){return x.id===bid;});
        if(!mp)return'';
        var price=parseFloat(mp.price||0);
        return'<div class="bundle-map-row">'+
          '<i class="bi bi-map-fill"></i>'+
          '<span>'+esc(mp.title||'Untitled')+'</span>'+
          (price>0?'<span class="bundle-map-row-price">'+price.toFixed(2)+'</span>':
            '<span class="bundle-map-row-price" style="color:var(--cyan)">Free</span>')+
        '</div>';
      }).join('');

      bundleDescHtml+='<div class="bundle-includes">'+
        '<div class="bundle-includes-title"><i class="bi bi-collection-fill"></i> Included Maps</div>'+
        rows+
      '</div>';
    }

    /* Price */
    var priceHtml='';
    if(isBundle){
      var orig=calcBundleOrig(p);
      var final=parseFloat(p.price||0)||(orig*(1-(p.bundle_discount||0)/100));
      priceHtml='<div class="card-price"><span class="price-label">Bundle</span>'+(orig>0?'<span class="price-original">'+orig.toFixed(2)+'</span><span class="price-discount">-'+(p.bundle_discount||0)+'%</span>':'')+'<span class="price-value">'+(final>0?final.toFixed(2)+'<span class="price-currency">'+esc(SHOP_CONFIG.CURRENCY)+'</span>':'<span style=\'color:var(--cyan)\'>Free</span>')+'</span></div>';
    }else{
      var pval=parseFloat(p.price||0);
      priceHtml='<div class="card-price"><span class="price-label">Price</span><span class="price-value">'+(pval>0?esc(String(p.price))+'<span class="price-currency">'+esc(SHOP_CONFIG.CURRENCY)+'</span>':'<span style=\'color:var(--cyan)\'>Free</span>')+'</span></div>';
    }

    var ppid=p.paypal_id;
    var buyBtn=ppid?'<a href="https://www.paypal.com/ncp/payment/'+esc(ppid)+'" target="_blank" rel="noopener" class="btn-buy"><i class="bi bi-bag-check-fill"></i> Buy Now</a>':'';
    var hasFull=!!(p.full_description&&p.full_description.trim()&&p.full_description!=='<p><br></p>');
    var detBtn=(hasFull||images.length>0)
      ?'<button class="btn-details" data-pid="'+esc(pid)+'" data-bundle="'+(isBundle?'1':'0')+'"><i class="bi bi-eye-fill"></i> Details</button>':'';

    inner.innerHTML=galleryHtml+
      '<div class="card-body">'+
        '<div class="card-tags">'+tagsHtml+'</div>'+
        '<div class="card-title">'+esc(p.title||'Untitled')+'</div>'+
        (isBundle?bundleDescHtml:'<div class="card-desc">'+shortText+'</div>')+
        '<div class="card-meta">'+priceHtml+'<div class="card-actions">'+buyBtn+detBtn+'</div></div>'+
      '</div>';

    card.appendChild(inner);
    grid.appendChild(card);
    setTimeout(function(){card.style.opacity='1';card.style.transform='translateY(0)';card.style.transition='opacity .35s,transform .35s';},30+idx*55);
  });

  initGlightbox();
  initDetailBtns();
}

function calcBundleOrig(b){
  return(b.bundle_items||[]).reduce(function(s,bid){var mp=allProducts.find(function(x){return x.id===bid;});return s+(mp&&mp.price?parseFloat(mp.price):0);},0);
}

/* ── GLightbox ── */
function initGlightbox(){
  if(typeof GLightbox==='undefined')return;
  if(glightboxInst){try{glightboxInst.destroy();}catch(e){}}
  glightboxInst=GLightbox({selector:'.glb-links a',touchNavigation:true,loop:true,autoplayVideos:false,skin:'clean'});
}

/* ── Detail modal buttons ── */
function initDetailBtns(){
  document.querySelectorAll('.btn-details').forEach(function(btn){
    btn.addEventListener('click',function(){
      var pid=btn.getAttribute('data-pid'),isBundle=btn.getAttribute('data-bundle')==='1';
      var p=isBundle?allBundles.find(function(b){return String(b.id)===pid;}):allProducts.find(function(x){return String(x.id)===pid;});
      if(p)openDetailModal(p,isBundle);
    });
  });
}

/* ── Detail modal with Slideshow ── */
var detailAutoplayTimer=null;
var detailSlideIdx=0;
var detailSlideImages=[];
var detailDragStartX=0,detailDragging=false;

function openDetailModal(p,isBundle){
  var overlay=document.getElementById('detail-overlay');
  var images=p.images||[];
  detailSlideImages=images;
  detailSlideIdx=0;

  /* Tags */
  document.getElementById('detail-tags').innerHTML=(p.tags||[]).map(function(t){return renderTag(t);}).join('');

  /* Title */
  document.getElementById('detail-title').textContent=p.title||'';

  /* Badges */
  var pval=parseFloat(p.price||0);
  var badgesEl=document.getElementById('detail-badges');
  var bdg='';
  if(pval>0)bdg+='<span class="detail-badge-price">'+esc(String(p.price))+' '+esc(SHOP_CONFIG.CURRENCY)+'</span>';
  else bdg+='<span class="detail-badge-price" style="color:var(--cyan)">Free</span>';
  if(p.featured)bdg+='<span style="color:var(--gold);font-family:var(--fp);font-size:8px;display:inline-flex;align-items:center;gap:4px"><i class="bi bi-star-fill"></i> Featured</span>';
  if(isBundle&&p.bundle_discount)bdg+='<span style="color:var(--red);font-family:var(--fu);font-size:14px;font-weight:700">-'+p.bundle_discount+'% Bundle</span>';
  badgesEl.innerHTML=bdg;

  /* Description */
  var descEl=document.getElementById('detail-desc');
  var fullDesc=p.full_description||'';
  var hasFull=fullDesc.trim()&&fullDesc!=='<p><br></p>';
  descEl.innerHTML=hasFull?fullDesc:(p.description||'<em style="color:var(--muted)">No description.</em>');

  /* Footer */
  var footerEl=document.getElementById('detail-footer');
  footerEl.innerHTML='';
  if(p.paypal_id){footerEl.innerHTML+='<a href="https://www.paypal.com/ncp/payment/'+esc(p.paypal_id)+'" target="_blank" rel="noopener" class="btn-buy"><i class="bi bi-bag-check-fill"></i> Buy Now'+(pval>0?' — '+esc(String(p.price))+' '+esc(SHOP_CONFIG.CURRENCY):' — Free')+'</a>';}
  if(images.length>1)footerEl.innerHTML+='<span style="color:var(--muted);font-family:var(--fu);font-size:12px"><i class="bi bi-images"></i> '+images.length+' images · swipe or use arrows</span>';

  /* Build slideshow gallery */
  buildDetailSlideshow(images,p.id);

  overlay.classList.add('open');
  document.body.style.overflow='hidden';
}

function buildDetailSlideshow(images, pid){
  var gallery=document.getElementById('detail-gallery');
  gallery.innerHTML='';
  gallery.setAttribute('data-count',images.length);

  if(!images.length){
    gallery.innerHTML='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:56px;opacity:.2">🗺</div>';
    return;
  }

  /* Track */
  var track=document.createElement('div');
  track.className='detail-gallery-track';
  track.id='dg-track';

  images.forEach(function(src,i){
    var div=document.createElement('div');
    div.className='detail-gimg'+(i===0?' dg-active':'');
    div.setAttribute('data-idx',i);
    var img=document.createElement('img');
    img.src=src;img.alt='Slide '+(i+1);img.loading='lazy';img.decoding='async';
    div.appendChild(img);
    /* Click active slide → open GLightbox at this image */
    div.addEventListener('click',function(){
      if(!div.classList.contains('dg-active'))return;
      var pids=String(pid||'');
      var anchors=document.querySelectorAll('.glb-links a[data-gallery="g-'+pids+'"]');
      if(anchors[i]&&glightboxInst)anchors[i].click();
    });
    track.appendChild(div);
  });

  gallery.appendChild(track);

  /* Prev / Next */
  if(images.length>1){
    var prev=document.createElement('button');prev.className='dg-arrow dg-arrow-prev';prev.innerHTML='<i class="bi bi-chevron-left"></i>';prev.setAttribute('aria-label','Previous');
    prev.addEventListener('click',function(){slideTo(detailSlideIdx-1,true);});
    var next=document.createElement('button');next.className='dg-arrow dg-arrow-next';next.innerHTML='<i class="bi bi-chevron-right"></i>';next.setAttribute('aria-label','Next');
    next.addEventListener('click',function(){slideTo(detailSlideIdx+1,true);});
    gallery.appendChild(prev);gallery.appendChild(next);

    /* Dots */
    var dots=document.createElement('div');dots.className='dg-dots';dots.id='dg-dots';
    images.forEach(function(_,i){
      var d=document.createElement('div');d.className='dg-dot'+(i===0?' active':'');
      d.addEventListener('click',function(){slideTo(i,true);});
      dots.appendChild(d);
    });
    gallery.appendChild(dots);
  }

  /* Touch / drag */
  track.addEventListener('mousedown',function(e){detailDragStartX=e.clientX;detailDragging=true;track.classList.add('dragging');});
  window.addEventListener('mouseup',function(e){
    if(!detailDragging)return;
    detailDragging=false;track.classList.remove('dragging');
    var dx=e.clientX-detailDragStartX;
    if(Math.abs(dx)>40){slideTo(dx<0?detailSlideIdx+1:detailSlideIdx-1,true);}
  },{passive:true});
  track.addEventListener('touchstart',function(e){detailDragStartX=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-detailDragStartX;
    if(Math.abs(dx)>40){slideTo(dx<0?detailSlideIdx+1:detailSlideIdx-1,true);}
  },{passive:true});

  /* Initial position */
  slideTo(0,false);
  startAutoplay();
}

function slideTo(idx,userTriggered){
  var images=detailSlideImages;
  if(!images.length)return;
  idx=((idx%images.length)+images.length)%images.length;
  detailSlideIdx=idx;

  var track=document.getElementById('dg-track');
  if(!track)return;
  var slides=track.querySelectorAll('.detail-gimg');
  var gallery=document.getElementById('detail-gallery');
  var containerW=gallery?gallery.offsetWidth:600;

  /* Calculate slide width (74% of container on desktop, overridden by CSS on mobile) */
  var slideW=slides.length?slides[0].offsetWidth:containerW*0.74;
  var gap=10;
  var paddingLeft=gallery?parseFloat(getComputedStyle(gallery).paddingLeft)||containerW*0.13:containerW*0.13;

  /* Offset so active slide is centered:
     translateX = paddingLeft - idx*(slideW+gap) */
  var offsetX=paddingLeft-idx*(slideW+gap);
  track.style.transform='translateX('+offsetX+'px)';

  /* Active class */
  slides.forEach(function(s,i){s.classList.toggle('dg-active',i===idx);});

  /* Dots */
  var dots=document.querySelectorAll('#dg-dots .dg-dot');
  dots.forEach(function(d,i){d.classList.toggle('active',i===idx);});

  if(userTriggered)resetAutoplay();
}

function startAutoplay(){
  clearInterval(detailAutoplayTimer);
  if(detailSlideImages.length<=1)return;
  detailAutoplayTimer=setInterval(function(){slideTo(detailSlideIdx+1,false);},4200);
}
function resetAutoplay(){clearInterval(detailAutoplayTimer);startAutoplay();}
function stopAutoplay(){clearInterval(detailAutoplayTimer);}

function closeDetailModal(){
  stopAutoplay();
  var overlay=document.getElementById('detail-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow='';
}

/* ── SEO JSON-LD ── */
function updateSeoLD(){
  var el=document.getElementById('ld-products');if(!el)return;
  var items=allProducts.slice(0,10).map(function(p,i){return{"@type":"ListItem","position":i+1,"item":{"@type":"Product","name":p.title||'','description':(p.description||'').replace(/<[^>]+>/g,'').slice(0,160),"image":(p.images&&p.images[0])||'','offers':{"@type":"Offer","price":p.price||"0","priceCurrency":SHOP_CONFIG.CURRENCY,"availability":"https://schema.org/InStock"}}};});
  try{var ld=JSON.parse(el.textContent);ld.itemListElement=items;el.textContent=JSON.stringify(ld);}catch(e){}
}

/* ── Search & Sort ── */
var si=document.getElementById('search-input');
if(si){var deb;si.addEventListener('input',function(){clearTimeout(deb);deb=setTimeout(function(){searchQuery=si.value.trim();renderProducts();},220);});}
var ss=document.getElementById('sort-select');
if(ss)ss.addEventListener('change',function(){activeSort=ss.value;renderProducts();});

/* ── Close detail modal ── */
var dc=document.getElementById('detail-close');if(dc)dc.addEventListener('click',closeDetailModal);
var dov=document.getElementById('detail-overlay');if(dov)dov.addEventListener('click',function(e){if(e.target===this)closeDetailModal();});
document.addEventListener('keydown',function(e){
  if(!document.getElementById('detail-overlay').classList.contains('open'))return;
  if(e.key==='Escape')closeDetailModal();
  if(e.key==='ArrowLeft')slideTo(detailSlideIdx-1,true);
  if(e.key==='ArrowRight')slideTo(detailSlideIdx+1,true);
});

/* Pause autoplay when overlay opens lightbox */
document.addEventListener('glightbox_open',function(){stopAutoplay();});
document.addEventListener('glightbox_close',function(){if(document.getElementById('detail-overlay').classList.contains('open'))startAutoplay();});

document.addEventListener('DOMContentLoaded',loadShop);
