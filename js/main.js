
  let currentLang = 'pt';

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = (lang === 'pt') ? 'pt-PT' : 'en';
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', lang === 'pt'
      ? 'Lisa Beauty — salão de unhas em Cascais e Algés. Manicure, pedicure, extensões de gel e acrílico, nail art e extensões de pestanas. Marque pelo WhatsApp: +351 936 693 839.'
      : 'Lisa Beauty — nail salon in Cascais and Algés, Portugal. Manicure, pedicure, gel & acrylic extensions, nail art and lash extensions. Book via WhatsApp: +351 936 693 839.');
    document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    document.querySelectorAll('[data-pt][data-en]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (!val) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.tagName === 'OPTION') {
        el.textContent = val;
      } else {
        el.innerHTML = val;
      }
    });
  }

  function showTab(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  async function sendWhatsApp() {
    const name = document.getElementById('f-name').value;
    const phone = document.getElementById('f-phone').value;
    const email = document.getElementById('f-email') ? document.getElementById('f-email').value : '';
    const service = document.getElementById('f-service').value;
    const date = document.getElementById('f-date').value;
    const hour = document.getElementById('f-hour').value;
    const min = document.getElementById('f-min').value;
    const notes = document.getElementById('f-notes').value;
    const time = (hour && min) ? `${hour}:${min}` : (hour ? `${hour}:00` : 'N/A');
    const msg = currentLang === 'pt'
      ? `Olá Lisa Beauty! Gostaria de marcar uma consulta.\n\nNome: ${name||'N/A'}\nTelefone: ${phone||'N/A'}\nServiço: ${service||'N/A'}\nData: ${date||'N/A'}\nHora: ${time}\nNotas: ${notes||'Nenhuma'}`
      : `Hello Lisa Beauty! I'd like to book an appointment.\n\nName: ${name||'N/A'}\nPhone: ${phone||'N/A'}\nService: ${service||'N/A'}\nDate: ${date||'N/A'}\nTime: ${time}\nNotes: ${notes||'None'}`;
    const waUrl = 'https://wa.me/351936693839?text=' + encodeURIComponent(msg);

    // STEP A - Enhanced Conversions: normalize + SHA-256 hash the
    // customer's email/phone/name BEFORE any event is sent (Step 3)
    try { await lbSetEnhancedUserData({ name: name, phone: phone, email: email }); } catch (e) {}

    // STEP B - fire the click conversions (beacon survives navigation)
    gtag_report_conversion();

    // STEP C - open WhatsApp in a NEW tab with the pre-filled message
    window.open(waUrl, '_blank');

    // STEP D - remember the visitor's language, then send the CURRENT
    // tab to the thank-you page (obrigado.html). Safe to redirect this
    // tab because WhatsApp already opened in its own tab in Step C.
    try { sessionStorage.setItem('lb_lang', currentLang); } catch (e) {}
    window.location.href = 'obrigado.html';
  }


  let lbImages = [], lbIdx = 0;
  function lbInit() {
    lbImages = Array.from(document.querySelectorAll('.gallery-item img'));
    lbImages.forEach((img, i) => {
      img.parentElement.addEventListener('click', () => openLightbox(i));
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lbInit);
  } else {
    lbInit();
  }
  function openLightbox(i) {
    lbIdx = i;
    document.getElementById('lightbox-img').src = lbImages[i].src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(e) {
    if (e.target === document.getElementById('lightbox')) closeLightboxBtn();
  }
  function closeLightboxBtn() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  function lightboxNav(dir) {
    lbIdx = (lbIdx + dir + lbImages.length) % lbImages.length;
    document.getElementById('lightbox-img').src = lbImages[lbIdx].src;
  }
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'Escape') closeLightboxBtn();
  });


  function applyLegalLang(){
    var en = (typeof currentLang !== 'undefined' && currentLang === 'en');
    var pt = document.querySelector('.legal-pt');
    var enBlock = document.querySelector('.legal-en');
    if (pt) pt.style.display = en ? 'none' : 'block';
    if (enBlock) enBlock.style.display = en ? 'block' : 'none';
  }
  function openLegal(){
    applyLegalLang();
    document.getElementById('legalModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLegal(){
    document.getElementById('legalModal').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { closeLegal(); closeLocModal(); } });
  // Keep the privacy text in sync when the visitor switches language
  if (typeof setLang === 'function') {
    var _lbSetLang = setLang;
    setLang = function(l){ _lbSetLang(l); applyLegalLang(); };
  }

  // LOCATION CHOICE MODAL (Book Online -> Cascais/Fresha or Algés/Sheerme)
  function openLocModal(e){
    if (e) e.preventDefault();
    document.getElementById('locModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    return false;
  }
  function closeLocModal(){
    var m = document.getElementById('locModal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }
