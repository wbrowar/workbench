//  ANIMATION
//  🖌 Global animations used around the website

import { log, warn } from './global.js';
import { TweenMax, Power1 } from 'gsap/TweenMax';

export function introduceElement(el, args) {
    const delay = args.delay !== undefined ? (args.delay.constructor === Array ? Math.random() * (args.delay[1] - args.delay[0]) + args.delay[0] : args.delay) : 0;
    const effect = args.effect || '';
    const speed = args.speed || 0.5;

    switch (effect) {
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
    }

    log('Animation', effect, speed, delay);
}

// INIT FUNCTIONS
log('Animation');