import { log, warn } from './global.js';

const TxtType = function(el, toRotate, speed, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.speed = parseInt(speed, 10) || 150;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    const that = this;
    let delta = this.speed - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

let elements = document.querySelectorAll('[data-typewriter]');
for (let i=0; i<elements.length; i++) {
    const toRotate = elements[i].getAttribute('data-typewriter-list');
    const period = elements[i].getAttribute('data-typewriter-period');
    const speed = elements[i].getAttribute('data-typewriter-speed');

    if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), speed, period);
    }
}

// INIT FUNCTIONS
log('Typewriter');
