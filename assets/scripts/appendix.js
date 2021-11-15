/*
  Appendix script for Bootstrap + Sass template.
  Author: Jan Prazak
  https://github.com/Amarok24/template-bootstrap-sass
*/

// Edit the YouTube video ID here! Video will be loaded on demand (page performance).
const youtubeVideoId = 'LaKT3pli5EQ';
// ID (#) of CSS where Youtube API should generate the iframe.
const videoCssId = 'customVideo';

const navBarCustomCssClass = 'navbar-js';
const pageNavWrapper = document.querySelector('#navbarMain');
const pageNavAnchors = document.querySelectorAll('#navbarMain a');
const elemVideoModal = document.querySelector('#videoModal');
const elemPlayButton = document.querySelector('.play-button');
const elemScrollToTop = document.querySelector('#arrowScrollToTop');

const intersectApiSupported = (
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window);

let bsPageNav = null;
let bsVideoModal = null;
let youtubePlayer = null;
let youtubeApiInjected = false;


if (elemVideoModal && elemPlayButton) {
  //bsVideoModal = bootstrap.Modal.getOrCreateInstance(elemVideoModal);
  bsVideoModal = new bootstrap.Modal(elemVideoModal);

  elemVideoModal.addEventListener('hidden.bs.modal', function (ev) {
    console.log('bsVideoModal has been hidden');
    if (youtubePlayer) youtubePlayer.pauseVideo();
  });

  function injectYoutubeApi(ev) {
    if (ev.type === 'keyup' && ev.key !== 'Enter') return;
    console.log('showing bsVideoModal');
    bsVideoModal.show();

    if (youtubeApiInjected) {
      console.log('playing video...');
      youtubePlayer.playVideo();
      return;
    }
    const tagScript = document.createElement('script');
    tagScript.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tagScript, firstScriptTag);
    console.log("YouTube API code injected");
    youtubeApiInjected = true;
  }

  elemPlayButton.addEventListener('click', injectYoutubeApi);
  elemPlayButton.addEventListener('keyup', injectYoutubeApi);
}


if (pageNavWrapper && pageNavAnchors) {
  //bsPageNav = new bootstrap.Collapse(pageNavWrapper, {toggle: false});
  // 'toggle:false' means it should not be toggled (opened) upon creation.
  bsPageNav = bootstrap.Collapse.getOrCreateInstance(pageNavWrapper, { toggle: false });

  function toggleHamburger() {
    if (bsPageNav) bsPageNav.toggle();
    pageNavAnchors[0].focus();
  }

  function closeHamburger() {
    if (bsPageNav) bsPageNav.hide();
  }

  for (let i = 0; i < pageNavAnchors.length; i++) {
    pageNavAnchors[i].addEventListener('click', closeHamburger);
  }

  document.addEventListener('keyup', function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') toggleHamburger();
  });
}


if (elemScrollToTop) {
  function onScrollToTopClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    document.querySelector('body').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  elemScrollToTop.addEventListener('click', onScrollToTopClick);
}


function launchObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const pageNav = document.querySelector('#pageNav');
  const customCssClass = navBarCustomCssClass;

  let observer = new IntersectionObserver(handleIntersect, options);
  let elem = document.querySelector('.header-image');

  observer.observe(elem);

  function handleIntersect(entries, observer) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    if (pageNav) {
      if (entries[0].isIntersecting) {
        pageNav.classList.remove(customCssClass);
        elemScrollToTop?.classList.add('d-none');
      } else {
        pageNav.classList.add(customCssClass);
        elemScrollToTop?.classList.remove('d-none');
      }
    }
  }
}


// Part of YT API. This event fires automatically once API is ready.
function onYouTubeIframeAPIReady() {
  console.log('onYouTubeIframeAPIReady launched');
  youtubePlayer = new YT.Player(videoCssId, {
    width: '560',
    height: '315',
    videoId: youtubeVideoId,
    playerVars: {
      // See https://developers.google.com/youtube/player_parameters
      'playsinline': 1,
      'rel': 0,
      'modestbranding': 1
    },
    events: {
      'onReady': onPlayerReady
      //'onStateChange': onPlayerStateChange
    }
  });
}

// This event fires when player has finished loading and is ready.
function onPlayerReady(ev) {
  //const embedCode = ev.target.getVideoEmbedCode();
  //ev.target.playVideo();
  console.log('onPlayerReady launched');
  youtubePlayer.playVideo();
}


function handleVisibilityChange() {
  if (youtubePlayer && document.visibilityState === "hidden") {
    youtubePlayer.pauseVideo();
  }
}


if (intersectApiSupported) launchObserver();

document.addEventListener("visibilitychange", handleVisibilityChange, false);
