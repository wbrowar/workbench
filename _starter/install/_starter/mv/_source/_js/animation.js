//  ANIMATION
//  🖌 Global animations used around the website

import { log, warn } from './global.js';
import { TweenMax, Power0, Power1 } from 'gsap/TweenMax';

export function animate(animation, el, options) {
  const delay = options.delay !== undefined ? _randomFromRange(options.delay) : 0,
    speed = options.speed !== undefined ? _randomFromRange(options.speed) : 0.5;

  switch (animation) {
    case 'background-color':
      TweenMax.to(el, speed, {
        backgroundColor: options.color || 'transparent',
        delay: delay,
        ease: Power1.easeOut,
      });
      break;
    case 'custom':
      let props = JSON.parse(options.properties);
      props.ease = Power0.easeNone;
      props.yoyoEase = Power0.easeNone;

      TweenMax.to(el, speed, props);
      break;
    case 'fade-in':
      TweenMax.to(el, speed, {
        delay: delay,
        ease: Power1.easeOut,
        opacity: 1,
      });
      break;
    case 'fade-out':
      TweenMax.to(el, speed, {
        delay: delay,
        ease: Power1.easeOut,
        opacity: 0,
      });
      break;
    case 'slide-in':
      TweenMax.to(el, speed, {
        delay: delay,
        ease: Power1.easeOut,
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
