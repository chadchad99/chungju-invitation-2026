(() => {
  'use strict';
  const EVENT_DAY = Date.UTC(2026, 10, 19);
  const dayFormatter = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'});
  const badge = document.getElementById('d-day');
  let dayTimer;
  function refreshDay() {
    const now = new Date();
    const parts = dayFormatter.formatToParts(now);
    const part = name => Number(parts.find(item => item.type === name).value);
    const today = Date.UTC(part('year'), part('month') - 1, part('day'));
    const days = Math.round((EVENT_DAY - today) / 86400000);
    const label = days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : '행사 종료';
    if (badge.textContent !== label) badge.textContent = label;
    badge.classList.toggle('event-today', days === 0);
    badge.classList.toggle('completed', days < 0);
    const midnight = today + 86400000 - 9 * 3600000;
    clearTimeout(dayTimer);
    dayTimer = setTimeout(refreshDay, Math.max(100, Math.min(60000, midnight - now.getTime() + 100)));
  }
  refreshDay();
  window.addEventListener('pageshow', refreshDay);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDay(); });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toastElement = document.getElementById('toast');
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    toastElement.textContent = message;
    toastElement.classList.add('visible');
    toastTimer = setTimeout(() => toastElement.classList.remove('visible'), 3400);
  }
  async function copy(value, success, heading) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      toast(success);
    } catch {
      const dialog = document.getElementById('copy-dialog');
      document.getElementById('copy-title').textContent = heading;
      document.getElementById('copy-description').textContent = '아래 내용을 길게 누르거나 선택하여 복사해 주세요.';
      const input = document.getElementById('copy-value');
      input.value = value;
      dialog.showModal();
      input.focus();
      input.select();
      input.setSelectionRange(0, value.length);
    }
  }
  document.getElementById('copy-address').addEventListener('click', () => copy('충북 충주시 금봉대로 544', '주소를 복사했습니다.', '주소 복사'));
  document.getElementById('share-invitation').addEventListener('click', async () => {
    const url = new URL(window.location.href);
    url.hash = 'top';
    url.search = '';
    if (url.protocol === 'file:' || ['localhost','127.0.0.1','[::1]'].includes(url.hostname)) {
      toast('게시 후 초대장 링크를 공유할 수 있어요.');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({title:'2026 운영보고대회 & 제11회 꿈드림 졸업식',text:'2026년 11월 19일(목) 오후 2시\n충주시청소년문화의집 숨&뜰',url:url.href});
        return;
      } catch (error) { if (error.name === 'AbortError') return; }
    }
    await copy(url.href,'초대장 링크를 복사했습니다.','초대장 링크 복사');
  });

  const cover = document.querySelector('.cover');
  const coverButton = document.querySelector('.cover-cta');
  const letter = document.getElementById('invitation');
  if (coverButton && cover && letter) {
    coverButton.addEventListener('click', event => {
      event.preventDefault();
      if (!reducedMotion) cover.classList.add('is-opening');
      const target = Math.max(0, window.scrollY + letter.getBoundingClientRect().top - 69);
      history.replaceState(history.state, '', '#invitation');
      window.scrollTo({top:target,behavior:reducedMotion ? 'instant' : 'smooth'});
      setTimeout(() => cover.classList.remove('is-opening'), 1500);
    });
  }
  const links = Array.from(document.querySelectorAll('.section-nav a'));
  const sections = Array.from(document.querySelectorAll('.paper-section'));
  const footer = document.querySelector('.footer');
  function updateNavigation() {
    const marker = Math.min(170, window.innerHeight * 0.28);
    let active = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= marker) active = `#${section.id}`; });
    links.forEach(link => {
      if (link.getAttribute('href') === active) {
        if (link.getAttribute('aria-current') !== 'location') link.setAttribute('aria-current','location');
      } else link.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.08,rootMargin:'0px 0px -22px 0px'});
    const reveals = document.querySelectorAll('.chapter-label,.paper-section h2,.letter-copy,.letter-date,.signature,.date-large,.date-time,.calendar-wrap,.date-section>.button,.section-note,.timeline li,.venue,.address,.map-link,.map-buttons,.contact,.footer-title,.organizers');
    reveals.forEach(element => { element.classList.add('reveal'); observer.observe(element); });
    document.documentElement.classList.add('motion-ready');
  }
  let pending = false;
  function updateScene() {
    const root = document.documentElement;
    const maximum = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--reading-progress', `${maximum > 0 ? Math.min(100,Math.max(0,window.scrollY/maximum*100)) : 0}%`);
    updateNavigation();
    if (!reducedMotion) {
      if (cover) {
        const height = cover.getBoundingClientRect().height;
        const progress = Math.min(1,Math.max(0,window.scrollY / Math.max(1,height)));
        cover.style.setProperty('--cover-pan', `${progress*22}px`);
        cover.style.setProperty('--cover-scale', `${1+progress*.024}`);
        cover.style.setProperty('--cover-opacity', `${1-progress*.22}`);
      }
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
          const progress = (window.innerHeight-rect.top)/(window.innerHeight+rect.height);
          section.style.setProperty('--scene-pan', `${(Math.min(1,Math.max(0,progress))-.5)*32}px`);
        }
      });
    }
    pending = false;
  }
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(updateScene); } }, {passive:true});
  window.addEventListener('resize', updateScene);
  window.addEventListener('pageshow', updateScene);
  updateScene();
})();
