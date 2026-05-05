/**
 * waapno Portfolio — main.js
 * Bulletproof: DOMContentLoaded, capture-phase delegation, full try/catch, safe localStorage
 */

/* ============================================================
   TRANSLATIONS
   ============================================================ */
var T = {
  en: {
    'nav-home': '🏠 Home', 'nav-about': '👤 About', 'nav-visual': '🎨 Visual', 'nav-contact': '📱 Contact',
    'header-sub': 'Minecraft Dev & Visual Artist',
    'about-title-small': 'About', 'about-title-big': 'Learn more about me',
    'about-h3': 'Hey! I\'m <span class="name-highlight">waapno</span>',
    'about-tagline': 'I develop Minecraft servers and create visual content. Every project gets my full attention.',
    'label-discord': 'Discord', 'label-web': 'Market', 'label-country': 'Country',
    'val-country': '🇨🇿 Czech Republic', 'label-age': 'Age', 'label-commission': 'Commission',
    'val-commission': '✓ Open', 'label-email': 'Email',
    'about-desc': 'Freelancer focused on Minecraft server development and visual content creation. From server configuration and custom maps to photo retouching, video editing, and AI-assisted artwork.',
    'market-inline-btn': 'Visit my Market',
    'counts-clients': 'Happy Clients', 'counts-projects': 'Completed Projects',
    'counts-hours': 'Support Hours', 'counts-years': 'Years Experience',
    'skills-title-small': 'Skills', 'skills-title-big': 'My Skills',
    'skill-server': '⚙ Server Management', 'skill-firewall': '🔥 Firewall',
    'skill-maps': '🗺 Map Making', 'skill-plugins': '🔌 Plugin Configuration',
    'testimonials-title-small': 'Testimonials', 'testimonials-title-big': 'Previous experiences',
    'testimonial-1': 'Professional approach and fast communication. I recommend to everyone!',
    'testimonial-1-role': 'Client',
    'testimonial-2': 'Great work, everything was done exactly as agreed and on time.',
    'testimonial-2-role': 'Client',
    'testimonial-3': 'Professional approach and fast communication. I recommend to everyone!',
    'testimonial-3-role': 'Client', 'testimonial-anon': 'Anonymous Client',
    'visual-title-small': 'Creative', 'visual-title-big': 'Visual Services',
    'services-intro': 'Beyond servers — professional visual work where every pixel matters.',
    'service-ps-title': 'Photoshop Editing',
    'service-ps-desc': 'Compositing, color grading, scene builds — quick fix or full creative piece.',
    'service-rt-title': 'Photo Retouching',
    'service-rt-desc': 'Skin, light, detail — refined edits that look natural, not overprocessed.',
    'service-mt-title': 'Video Editing',
    'service-mt-desc': 'Professional video cutting, transitions, color grading, motion graphics and effects. Clean, dynamic and on-beat every time.',
    'service-ai-title': 'AI-Assisted Creation',
    'service-ai-desc': 'Generative workflows, upscaling, concept art, prompt crafting.',
    'services-cta-text': "Interested? Let's talk.", 'services-cta-btn': 'Get in touch →',
    'gallery-title-small': 'Portfolio', 'gallery-title-big': 'My Work',
    'gallery-intro': 'Selected pieces of my previous work.',
    'gf-all': 'All', 'gf-ps': 'Photoshop', 'gf-rt': 'Retouch', 'gf-mt': 'Video', 'gf-ai': 'AI',
    'gallery-empty': 'No work added yet — check back soon!',
    'contact-title-small': 'Contact', 'contact-title-big': 'Get in touch',
    'contact-social': 'Social Links',
    'cta-h3': 'Visit my Market',
    'cta-p': 'Ready-made maps, plugins and configurations for download — neatly in one place.',
    'cta-btn': 'Go to Market', 'profile-status': 'Online',
  },
  cs: {
    'nav-home': '🏠 Domů', 'nav-about': '👤 O mně', 'nav-visual': '🎨 Vizuální', 'nav-contact': '📱 Kontakt',
    'header-sub': 'Minecraft Dev & Vizuální Tvůrce',
    'about-title-small': 'O mně', 'about-title-big': 'Zjisti o mně více',
    'about-h3': 'Ahoj! Já jsem <span class="name-highlight">waapno</span>',
    'about-tagline': 'Vyvíjím Minecraft servery a tvořím vizuální obsah. Každý projekt beru jako svůj vlastní.',
    'label-discord': 'Discord', 'label-web': 'Market', 'label-country': 'Země',
    'val-country': '🇨🇿 Česká republika', 'label-age': 'Věk', 'label-commission': 'Provize',
    'val-commission': '✓ Volná', 'label-email': 'Email',
    'about-desc': 'Freelancer zaměřený na vývoj Minecraft serverů a tvorbu vizuálního obsahu. Od konfigurace serverů a vlastních map po retušování fotek, střih videí a AI-asistovanou tvorbu.',
    'market-inline-btn': 'Navštivte můj Market',
    'counts-clients': 'Spokojení Klienti', 'counts-projects': 'Dokončené Projekty',
    'counts-hours': 'Hodin Podpory', 'counts-years': 'Roky Zkušeností',
    'skills-title-small': 'Zkušenosti', 'skills-title-big': 'Moje dovednosti',
    'skill-server': '⚙ Správa serverů', 'skill-firewall': '🔥 Firewall',
    'skill-maps': '🗺 Tvorba Map', 'skill-plugins': '🔌 Konfigurace Pluginů',
    'testimonials-title-small': 'Reference', 'testimonials-title-big': 'Předchozí zkušenosti',
    'testimonial-1': 'Profesionální přístup a rychlá komunikace. Doporučuji každému!',
    'testimonial-1-role': 'Klient',
    'testimonial-2': 'Profesionální přístup a rychlá komunikace. Doporučuji každému!',
    'testimonial-2-role': 'Klient',
    'testimonial-3': 'Profesionální přístup a rychlá komunikace. Doporučuji každému!',
    'testimonial-3-role': 'Klient', 'testimonial-anon': 'Anonymní Klient',
    'visual-title-small': 'Kreativní', 'visual-title-big': 'Vizuální Služby',
    'services-intro': 'Kromě serverů nabízím profesionální vizuální práci. Na každém pixelu záleží.',
    'service-ps-title': 'Photoshop Editace',
    'service-ps-desc': 'Kompozice, ladění barev, tvorba scén — rychlá úprava nebo plnohodnotný výstup.',
    'service-rt-title': 'Retušování Fotek',
    'service-rt-desc': 'Pleť, světlo, detail — úpravy, které vypadají přirozeně.',
    'service-mt-title': 'Střih videa',
    'service-mt-desc': 'Profesionální střih videa, přechody, color grading, motion graphics a efekty. Čistý, dynamický a na beat přesný.',
    'service-ai-title': 'AI-Asistovaná Tvorba',
    'service-ai-desc': 'Generativní postupy, upscaling, concept art, tvorba promptů.',
    'services-cta-text': 'Zájem? Pojďme to probrat!', 'services-cta-btn': 'Kontaktovat →',
    'gallery-title-small': 'Portfolio', 'gallery-title-big': 'Moje Práce',
    'gallery-intro': 'Vybrané ukázky mé předchozí práce.',
    'gf-all': 'Vše', 'gf-ps': 'Photoshop', 'gf-rt': 'Retuš', 'gf-mt': 'Video', 'gf-ai': 'AI',
    'gallery-empty': 'Zatím nic nepřidáno — brzy se vrať!',
    'contact-title-small': 'Kontakt', 'contact-title-big': 'Kontaktujte mě',
    'contact-social': 'Sociální sítě',
    'cta-h3': 'Navštivte můj Market',
    'cta-p': 'Hotové mapy, pluginy a konfigurace ke stažení — přehledně na jednom místě.',
    'cta-btn': 'Přejít na Market', 'profile-status': 'Online',
  }
};

/* ============================================================
   GALLERY — add your work here
   ────────────────────────────────────────────────────────────
   RECOMMENDED FORMAT: WebP
     • 25-35% smaller than PNG/JPG at same visual quality
     • 97%+ browser support
     • Export from Photoshop: File > Export > Export As > WebP
     • Free online converter: squoosh.app
     • CLI: cwebp input.png -q 82 -o output.webp
   PNG is also fine for sharp graphics / transparency.
   Place files in:  assets/img/gallery/
   ────────────────────────────────────────────────────────────
   Each entry: { src: 'path', title: 'Name', cat: 'ps|rt|mt|ai' }
   ============================================================ */
var GALLERY = [
  /* ── Photoshop ─────────────────────────────────────────── */
  // { src: 'assets/img/gallery/ps-art.webp',    title: 'Cover Art',         cat: 'ps' },
  // { src: 'assets/img/gallery/ps-scene.webp',        title: 'Scene Composite',   cat: 'ps' },
  // { src: 'assets/img/gallery/ps-poster.webp',       title: 'Event Poster',      cat: 'ps' },

  /* ── Retouch ────────────────────────────────────────────── */
  // { src: 'assets/img/gallery/rt-portrait.webp',     title: 'Portrait Retouch',  cat: 'rt' },
   { src: 'assets/img/gallery/workflow.webp',      title: 'Product Clean-up',  cat: 'rt' },

  /* ── Video ──────────────────────────────────────────────── */
  // { src: 'assets/img/gallery/mt-thumbnail.webp',    title: 'Video Thumbnail',   cat: 'mt' },
  // { src: 'assets/img/gallery/mt-frame.webp',        title: 'Grade Still',       cat: 'mt' },

  /* ── AI ─────────────────────────────────────────────────── */
  { src: 'assets/img/gallery/vectorize.webp',      title: 'AI Vectorize',    cat: 'ai' },
  // { src: 'assets/img/gallery/ai-upscale.webp',      title: 'AI Upscale',        cat: 'ai' },
];

var CAT_LABEL = { ps: 'Photoshop', rt: 'Retouch', mt: 'Video', ai: 'AI' };
var CAT_CLASS  = { ps: 'gcat-ps',  rt: 'gcat-rt',  mt: 'gcat-mt',  ai: 'gcat-ai' };

/* ── Safe storage ── */
function sGet(k, fb) { try { return localStorage.getItem(k) || fb; } catch(e) { return fb; } }
function sSet(k, v)  { try { localStorage.setItem(k, v); } catch(e) {} }

var lang = sGet('waapno-lang', 'en');

function applyLang(l) {
  try {
    lang = l; sSet('waapno-lang', l);
    document.documentElement.setAttribute('lang', l);
    document.documentElement.setAttribute('data-lang', l);
    var t = T[l] || T.en;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var k = el.getAttribute('data-i18n');
      if (t[k] !== undefined) el.textContent = t[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var k = el.getAttribute('data-i18n-html');
      if (t[k] !== undefined) el.innerHTML = t[k];
    });
    document.querySelectorAll('.lang-opt').forEach(function(o) {
      o.classList.toggle('lang-active', o.getAttribute('data-l') === l);
    });
  } catch(e) {}
}

applyLang(lang);

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {

  applyLang(lang);

  /* ── Lang toggles ── */
  ['lang-toggle', 'lang-toggle-nav'].forEach(function(id) {
    try {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', function() { applyLang(lang === 'en' ? 'cs' : 'en'); });
      btn.querySelectorAll('.lang-opt').forEach(function(o) {
        o.addEventListener('click', function(e) { e.stopPropagation(); applyLang(o.getAttribute('data-l')); });
      });
    } catch(e) {}
  });

  /* ============================================================
     PARTICLE CANVAS
     ============================================================ */
  try {
    var cvs = document.getElementById('particles-canvas');
    if (cvs) {
      var ctx = cvs.getContext('2d');
      var COLS  = ['rgba(0,255,127,','rgba(0,229,255,','rgba(0,204,90,','rgba(0,180,200,'];
      var CHARS = ['■','▪','◆','▸','⬡','▣'];
      var W, H, parts;
      function rsz() { W = cvs.width = innerWidth; H = cvs.height = innerHeight; }
      function mp() {
        return { x:Math.random()*(W||800), y:Math.random()*-(H||600),
          sz:Math.random()*9+4, sp:Math.random()*.5+.15,
          al:Math.random()*.35+.04, col:COLS[0|Math.random()*COLS.length],
          ch:CHARS[0|Math.random()*CHARS.length],
          dr:(Math.random()-.5)*.25, rot:Math.random()*Math.PI*2,
          rs:(Math.random()-.5)*.008 };
      }
      function ip() {
        parts=[];
        var n=Math.max(30,0|(W*H/16000));
        for(var i=0;i<n;i++){var p=mp();p.y=Math.random()*H;parts.push(p);}
      }
      function dp() {
        ctx.clearRect(0,0,W,H);
        for(var i=0;i<parts.length;i++){
          var p=parts[i];
          ctx.save();ctx.globalAlpha=p.al;ctx.fillStyle=p.col+p.al+')';
          ctx.font=p.sz+'px monospace';ctx.translate(p.x,p.y);ctx.rotate(p.rot);
          ctx.fillText(p.ch,0,0);ctx.restore();
          p.y+=p.sp;p.x+=p.dr;p.rot+=p.rs;
          if(p.y>H+20){Object.assign(p,mp());p.y=-20;}
        }
        requestAnimationFrame(dp);
      }
      rsz();ip();dp();
      window.addEventListener('resize',function(){rsz();ip();});
    }
  } catch(e) {}

  /* ============================================================
     NAVIGATION
     ============================================================ */
  var header = document.getElementById('header');
  var navbar = document.getElementById('navbar');

  function allSections() { return document.querySelectorAll('section'); }
  function hideAll() { allSections().forEach(function(s){s.classList.remove('section-show');}); }
  function showSection(el) { hideAll(); el.classList.add('section-show'); }

  function closeMobileNav() {
    if (!navbar) return;
    navbar.classList.remove('navbar-mobile');
    var tog = document.querySelector('.mobile-nav-toggle');
    if (tog) { tog.classList.add('bi-list'); tog.classList.remove('bi-x'); }
  }

  function setActive(a) {
    document.querySelectorAll('#navbar .nav-link').forEach(function(x){x.classList.remove('active');});
    if (a) a.classList.add('active');
  }

  document.addEventListener('click', function(e) {
    try {
      var tog = e.target.closest('.mobile-nav-toggle');
      if (!tog) return;
      e.preventDefault(); e.stopPropagation();
      if (!navbar) return;
      navbar.classList.toggle('navbar-mobile');
      tog.classList.toggle('bi-list');
      tog.classList.toggle('bi-x');
    } catch(er) {}
  }, true);

  document.addEventListener('click', function(e) {
    try {
      var link = e.target.closest('.nav-link');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (!hash || hash.charAt(0) !== '#') return;
      e.preventDefault(); e.stopPropagation();
      closeMobileNav();
      setActive(link);
      if (hash === '#header') {
        if (header) header.classList.remove('header-top');
        hideAll();
        return;
      }
      var target = document.querySelector(hash);
      if (!target) return;
      if (header && !header.classList.contains('header-top')) {
        header.classList.add('header-top');
        setTimeout(function(){ showSection(target); }, 350);
      } else {
        showSection(target);
      }
      try { window.scrollTo({top:0,behavior:'smooth'}); } catch(se){ window.scrollTo(0,0); }
    } catch(er) {}
  }, true);

  try {
    if (window.location.hash) {
      var it = document.querySelector(window.location.hash);
      if (it) {
        if (header) header.classList.add('header-top');
        var il = document.querySelector('#navbar a[href="'+window.location.hash+'"]');
        setActive(il);
        setTimeout(function(){ showSection(it); }, 350);
      }
    }
  } catch(e) {}

  /* ============================================================
     SKILLS
     ============================================================ */
  try {
    var sc = document.querySelector('.skills-content');
    if (sc) {
      function animBars() {
        document.querySelectorAll('.progress-bar-wrap .progress-bar').forEach(function(b){
          b.style.width = (b.getAttribute('aria-valuenow')||0)+'%';
        });
      }
      if (typeof Waypoint !== 'undefined') {
        new Waypoint({element:sc, offset:'80%', handler:animBars});
      } else {
        setTimeout(animBars, 500);
      }
    }
  } catch(e) {}

  /* ============================================================
     SWIPER
     ============================================================ */
  try {
    if (typeof Swiper !== 'undefined') {
      if (document.querySelector('.testimonials-slider .swiper-wrapper')) {
        new Swiper('.testimonials-slider', {
          speed:600, loop:true,
          autoplay:{delay:5000, disableOnInteraction:false},
          slidesPerView:'auto',
          pagination:{el:'.swiper-pagination', type:'bullets', clickable:true},
          breakpoints:{320:{slidesPerView:1,spaceBetween:20},1200:{slidesPerView:3,spaceBetween:20}}
        });
      }
      if (document.querySelector('.portfolio-details-slider')) {
        new Swiper('.portfolio-details-slider', {
          speed:400, loop:true,
          autoplay:{delay:5000, disableOnInteraction:false},
          pagination:{el:'.swiper-pagination', type:'bullets', clickable:true}
        });
      }
    }
  } catch(e) {}

  /* ============================================================
     ISOTOPE
     ============================================================ */
  try {
    var pc = document.querySelector('.portfolio-container');
    if (pc && typeof Isotope !== 'undefined') {
      var iso = new Isotope(pc, {itemSelector:'.portfolio-item', layoutMode:'fitRows'});
      document.addEventListener('click', function(e) {
        var fb = e.target.closest('#portfolio-flters li');
        if (!fb) return;
        e.preventDefault();
        document.querySelectorAll('#portfolio-flters li').forEach(function(el){el.classList.remove('filter-active');});
        fb.classList.add('filter-active');
        iso.arrange({filter:fb.getAttribute('data-filter')});
      });
    }
  } catch(e) {}

  /* ============================================================
     GLIGHTBOX — base
     ============================================================ */
  try {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({selector:'.portfolio-lightbox'});
      GLightbox({selector:'.portfolio-details-lightbox', width:'90%', height:'90vh'});
    }
  } catch(e) {}

  /* ============================================================
     PURECOUNTER
     ============================================================ */
  try { if (typeof PureCounter !== 'undefined') new PureCounter(); } catch(e) {}

  /* ============================================================
     DISCORD POPUPS
     ============================================================ */
  function fallbackCopy(txt) {
    try {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    } catch(e) {}
  }

  function makePopup(triggerId, popupId, copyId) {
    try {
      var trg = document.getElementById(triggerId);
      var pop = document.getElementById(popupId);
      if (!trg || !pop) return;
      var open = false;
      trg.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        open = !open; pop.classList.toggle('open', open);
      });
      document.addEventListener('click', function(e) {
        if (!open) return;
        if (pop.contains(e.target) || trg.contains(e.target)) return;
        open = false; pop.classList.remove('open');
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && open) { open = false; pop.classList.remove('open'); }
      });
      var cb = document.getElementById(copyId);
      if (cb) {
        cb.addEventListener('click', function(e) {
          e.stopPropagation();
          var uEl = pop.querySelector('.discord-popup-username');
          var u = uEl ? uEl.textContent : 'waapno#5250';
          var ic = this.querySelector('i');
          function done() { if(ic){ic.className='bi bi-check2'; setTimeout(function(){ic.className='bi bi-clipboard';},2000);} }
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(u).then(done).catch(function(){ fallbackCopy(u); done(); });
          } else { fallbackCopy(u); done(); }
        });
      }
    } catch(e) {}
  }

  makePopup('discord-trigger-header',  'discord-popup-header',  'discord-copy-header');
  makePopup('discord-trigger-contact', 'discord-popup-contact', 'discord-copy-contact');

  /* ============================================================
     GALLERY ENGINE
     ============================================================ */
  try {
    var grid    = document.getElementById('gallery-grid');
    var emptyEl = document.getElementById('gallery-empty');
    var filters = document.getElementById('gallery-filters');
    if (!grid) return;

    var activeFilter   = 'all';
    var glightboxInst  = null;

    function buildGallery() {
      grid.innerHTML = '';
      var items = activeFilter === 'all'
        ? GALLERY
        : GALLERY.filter(function(i){ return i.cat === activeFilter; });

      if (items.length === 0) {
        if (emptyEl) emptyEl.style.display = 'flex';
        return;
      }
      if (emptyEl) emptyEl.style.display = 'none';

      items.forEach(function(item, idx) {
        /* Wrapper */
        var el = document.createElement('div');
        el.className = 'gallery-item gi-loading';
        el.setAttribute('data-cat', item.cat);

        /* GLightbox anchor */
        var anchor = document.createElement('a');
        anchor.href = item.src;
        anchor.className = 'glightbox-gallery';
        anchor.setAttribute('data-gallery', 'gallery');
        anchor.setAttribute('data-glightbox', 'title: ' + (item.title || ''));
        anchor.setAttribute('data-type', 'image');

        /* <picture> — WebP source + original fallback */
        var picture = document.createElement('picture');
        var extMatch = item.src.match(/\.(png|jpe?g|avif|gif)$/i);
        if (extMatch) {
          var srcWebp = document.createElement('source');
          srcWebp.type    = 'image/webp';
          srcWebp.srcset  = item.src.replace(extMatch[0], '.webp');
          picture.appendChild(srcWebp);
        }
        var img = document.createElement('img');
        img.src      = item.src;
        img.alt      = item.title || '';
        img.loading  = 'lazy';    /* native browser lazy-load — zero JS weight */
        img.decoding = 'async';
        img.width    = 400;
        img.height   = 300;
        img.addEventListener('load',  function(){ el.classList.remove('gi-loading'); });
        img.addEventListener('error', function(){ el.classList.remove('gi-loading'); el.classList.add('gi-error'); });
        picture.appendChild(img);
        anchor.appendChild(picture);

        /* Overlay */
        var ov = document.createElement('div');
        ov.className = 'gallery-overlay';
        ov.innerHTML =
          '<span class="gallery-overlay-title">' + (item.title || '') + '</span>' +
          '<span class="gallery-overlay-cat ' + (CAT_CLASS[item.cat] || '') + '">' +
            (CAT_LABEL[item.cat] || item.cat) +
          '</span>';
        anchor.appendChild(ov);

        /* Expand icon */
        var exp = document.createElement('span');
        exp.className = 'gallery-expand';
        exp.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
        anchor.appendChild(exp);

        el.appendChild(anchor);
        grid.appendChild(el);

        /* Staggered IntersectionObserver entrance */
        if ('IntersectionObserver' in window) {
          (function(el_, idx_) {
            var obs = new IntersectionObserver(function(entries, o) {
              entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                setTimeout(function(){ el_.classList.add('gi-visible'); }, idx_ * 45);
                o.unobserve(entry.target);
              });
            }, { threshold: 0.05 });
            obs.observe(el_);
          }(el, idx));
        } else {
          el.classList.add('gi-visible');
        }
      });

      /* Re-init GLightbox */
      if (typeof GLightbox !== 'undefined') {
        if (glightboxInst) { try { glightboxInst.destroy(); } catch(e){} }
        glightboxInst = GLightbox({
          selector: '.glightbox-gallery',
          touchNavigation: true,
          loop: true,
          autoplayVideos: false,
          skin: 'clean'
        });
      }
    }

    /* Filter button clicks */
    if (filters) {
      filters.addEventListener('click', function(e) {
        var btn = e.target.closest('.gf-btn');
        if (!btn) return;
        filters.querySelectorAll('.gf-btn').forEach(function(b){ b.classList.remove('gf-active'); });
        btn.classList.add('gf-active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        buildGallery();
      });
    }

    buildGallery();

  } catch(galleryErr) { /* gallery errors never kill the rest */ }

}); /* end DOMContentLoaded */
