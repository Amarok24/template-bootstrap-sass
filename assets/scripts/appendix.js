const intersectApiSupported = (
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window);

const pageNavWrapper = document.querySelector('#navbarControlled');
const pageNavAnchors = document.querySelectorAll('#navbarControlled a');
let bsPageNav = null;

if (pageNavWrapper && pageNavAnchors) {
  //bsPageNav = new bootstrap.Collapse(pageNavWrapper, {toggle: false});
  bsPageNav = bootstrap.Collapse.getOrCreateInstance(pageNavWrapper, { toggle: false });

  function closeHamburger() {
    if (bsPageNav) bsPageNav.hide();
  }

  for (let i = 0; i < pageNavAnchors.length; i++) {
    pageNavAnchors[i].addEventListener('click', closeHamburger);
  }

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') closeHamburger();
  });
}


function launchObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const pageNav = document.querySelector('#pageNav');
  const customCssClass = 'bg-extra-dark';

  let observer = new IntersectionObserver(handleIntersect, options);
  let elem = document.querySelector('.header-image');

  observer.observe(elem);

  function handleIntersect(entries, observer) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    if (pageNav) {
      if (entries[0].isIntersecting) {
        pageNav.classList.remove(customCssClass);
      } else {
        pageNav.classList.add(customCssClass);
      }
    }
  }
}


if (intersectApiSupported) launchObserver();
