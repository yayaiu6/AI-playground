/**
 * Shared Dependency Configuration
 * 
 * Single source of truth for all external libraries.
 * To switch between CDN and local, change USE_CDN below.
 * No style file should hardcode CDN URLs directly.
 */
(() => {
  const USE_CDN = true;

  const CDN = 'https://cdn.jsdelivr.net/npm';
  const LOCAL = '/shared/vendor';

  const LIBRARIES = {
    'anime': {
      cdn: CDN + '/animejs@4.0.2/dist/anime.min.js',
      local: LOCAL + '/animejs@4.0.2/dist/anime.min.js'
    },
    'three': {
      cdn: CDN + '/three@0.170.0/build/three.module.min.js',
      local: LOCAL + '/three@0.170.0/build/three.module.min.js'
    },
    'gsap': {
      cdn: CDN + '/gsap@3.12.5/dist/gsap.min.js',
      local: LOCAL + '/gsap@3.12.5/dist/gsap.min.js'
    },
    'gsap-scrolltrigger': {
      cdn: CDN + '/gsap@3.12.5/dist/ScrollTrigger.min.js',
      local: LOCAL + '/gsap@3.12.5/dist/ScrollTrigger.min.js'
    }
  };

  window.getDeps = function(name) {
    var lib = LIBRARIES[name];
    if (!lib) return null;
    return USE_CDN ? lib.cdn : lib.local;
  };

  window.loadDep = function(name, callback) {
    var url = window.getDeps(name);
    if (!url) { if (callback) callback(null); return; }
    var existing = document.querySelector('script[data-dep="' + name + '"]');
    if (existing) { if (callback) callback(url); return; }
    var s = document.createElement('script');
    s.src = url;
    s.dataset.dep = name;
    s.onload = function() { if (callback) callback(url); };
    s.onerror = function() { if (callback) callback(null); };
    document.head.appendChild(s);
  };
})();
