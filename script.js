(() => {
  'use strict';
  const address = '충북 충주시 금봉대로 544';
  const title = '2026 운영보고대회 · 제11회 꿈드림 졸업식';
  const invitationText = '2026년 11월 19일(목) 오후 2시\n충주시청소년문화의집 숨&뜰\n꿈드림 친구들의 졸업과 새로운 출발에 함께해 주세요.';
  const toastElement = document.getElementById('toast');
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    toastElement.textContent = message;
    toastElement.classList.add('visible');
    toastTimer = setTimeout(() => toastElement.classList.remove('visible'), 3500);
  }
  function manualCopy(value, heading, description) {
    const dialog = document.getElementById('copy-dialog');
    document.getElementById('copy-title').textContent = heading;
    document.getElementById('copy-description').textContent = description;
    const input = document.getElementById('copy-value');
    input.value = value;
    dialog.showModal();
    input.focus();
    input.select();
    input.setSelectionRange(0, value.length);
  }
  async function copy(value, success, heading) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      toast(success);
    } catch {
      manualCopy(value, heading, '아래 내용을 길게 누르거나 선택하여 복사해 주세요.');
    }
  }
  document.getElementById('copy-address').addEventListener('click', () => copy(address, '주소를 복사했습니다.', '주소 복사'));
  document.getElementById('share-invitation').addEventListener('click', async () => {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    if (url.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
      toast('미리보기 화면입니다. 게시 후 초대장 링크를 공유할 수 있어요.');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({title, text: invitationText, url: url.href});
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    await copy(url.href, '초대장 링크를 복사했습니다. 카카오톡 등에 붙여 넣어 주세요.', '초대장 링크 복사');
  });
  function updateDayBadge() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const part = type => Number(parts.find(item => item.type === type).value);
    const today = Date.UTC(part('year'), part('month') - 1, part('day'));
    const difference = Math.round((Date.UTC(2026, 10, 19) - today) / 86400000);
    const badge = document.getElementById('d-day');
    badge.classList.toggle('completed', difference < 0);
    const label = difference > 0 ? `D-${difference}` : difference === 0 ? 'D-DAY' : '행사 종료';
    if (badge.textContent !== label) badge.textContent = label;
  }
  updateDayBadge();
  setInterval(updateDayBadge, 30000);
  window.addEventListener('pageshow', updateDayBadge);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDayBadge(); });
  const navigationLinks = Array.from(document.querySelectorAll('.section-nav a'));
  const navigationSections = Array.from(document.querySelectorAll('.paper-section'));
  function updateNavigation() {
    const marker = Math.min(170, window.innerHeight * 0.28);
    let active = '';
    navigationSections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) active = `#${section.id}`;
    });
    navigationLinks.forEach(link => {
      if (link.getAttribute('href') === active) {
        if (link.getAttribute('aria-current') !== 'location') link.setAttribute('aria-current', 'location');
      } else if (link.hasAttribute('aria-current')) link.removeAttribute('aria-current');
    });
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const reveals = document.querySelectorAll('.paper-section h2, .letter-copy, .letter-date, .signature, .date-large, .date-time, .calendar-wrap, .date-section .button, .timeline li, .venue, .address, .map-link, .map-buttons, .contact, .footer-title, .organizers');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1, rootMargin: '0px 0px -30px 0px'});
    reveals.forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
    document.documentElement.classList.add('motion-ready');
  }
  let progressPending = false;
  function updateProgress() {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maximum > 0 ? Math.min(100, Math.max(0, window.scrollY / maximum * 100)) : 0;
    document.documentElement.style.setProperty('--reading-progress', `${progress}%`);
    updateNavigation();
    progressPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!progressPending) { progressPending = true; requestAnimationFrame(updateProgress); }
  }, {passive: true});
  window.addEventListener('resize', updateProgress);
  updateProgress();

})();
