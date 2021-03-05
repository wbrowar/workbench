//  ANIMATION
//  🖌 Global animations used around the website

import gsap from 'gsap';
import { log, warn } from './global';

export function animate(animation, el, options = {}) {
  const delay = options.delay !== undefined ? _randomFromRange(options.delay) : 0;
  const ease = options.speed !== undefined ? options.ease : 'power2';
  const speed = options.speed !== undefined ? _randomFromRange(options.speed) : 0.5;

  switch (animation) {
    case 'background-color':
      gsap.to(el, speed, {
        backgroundColor: options.color || 'transparent',
        delay,
        ease,
      });
      break;
    case 'custom':
      // eslint-disable-next-line no-case-declarations
      const props = typeof options.properties === 'string' ? JSON.parse(options.properties) : options.properties;
      props.ease = ease;
      props.yoyoEase = ease;

      gsap.to(el, speed, props);
      break;
    case 'fade-in':
      gsap.to(el, speed, {
        delay,
        ease,
        opacity: 1,
      });
      break;
    case 'fade-out':
      gsap.to(el, speed, {
        delay,
        ease,
        opacity: 0,
      });
      break;
    case 'slide-in':
      gsap.to(el, speed, {
        delay,
        ease,
        opacity: 1,
        x: 0,
        y: 0,
        startAt: {
          opacity: 0,
          x: options.x || 0,
          y: options.y || 0,
        },
      });
      break;
    default:
      warn('Animation not found in animation.js', animation);
  }

  log('Animation:', animation, options);
}

function _randomFromRange(arr) {
  return arr.constructor === Array ? Math.random() * (arr[1] - arr[0]) + arr[0] : arr;
}

// INIT FUNCTIONS
log('Animation');
