(() => {
  'use strict';
  let userActed = false;
  try {
    history.scrollRestoration = 'manual';
    if (location.hash && location.hash !== '#top') {
      const entryUrl = new URL(location.href);
      entryUrl.hash = 'top';
      history.replaceState(history.state, '', entryUrl.href);
    }
  } catch {}
  function releaseToUser() { userActed = true; }
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(name => window.addEventListener(name, releaseToUser, {passive:true}));
  function showCover() {
    if (userActed) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({top:0,left:0,behavior:'instant'});
    requestAnimationFrame(() => {
      if (!userActed) window.scrollTo({top:0,left:0,behavior:'instant'});
      root.style.scrollBehavior = previous;
    });
  }
  showCover();
  document.addEventListener('DOMContentLoaded', showCover, {once:true});
  window.addEventListener('load', showCover, {once:true});
  window.addEventListener('pageshow', event => {
    if (event.persisted) userActed = false;
    showCover();
  });
})();
