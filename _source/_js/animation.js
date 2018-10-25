//  ANIMATION
//  🖌 Global animations used around the website

import { log, warn } from './global.js';
import { TweenMax, Power1 } from 'gsap/TweenMax';

export function animate(animation, el, args) {
    const delay = args.delay !== undefined ? _randomFromRange(args.delay) : 0,
          speed = args.speed !== undefined ? _randomFromRange(args.speed) : 0.5;

    switch (animation) {
        case 'background-color':
            TweenMax.to(el, speed, {
                backgroundColor: args.color || 'transparent',
                delay: delay,
                ease: Power1.easeOut,
            });
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
                    x: args.x || 0,
                    y: args.y || 0,
                },
            });
            break;
        default:
            warn('Animation not found in animation.js', animation);
    }

    log('Animation:', animation, args);
}

function _randomFromRange(arr) {
    return arr.constructor === Array ? Math.random() * (arr[1] - arr[0]) + arr[0] : arr;
}

// INIT FUNCTIONS
log('Animation');