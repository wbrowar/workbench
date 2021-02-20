import wb from 'JS/automated/settings.js';

// LOGGING FUNCTIONS
export function dir(...args: any[]) {
  logger('dir', args);
}
export function error(...args: any[]) {
  logger('error', args);
}
export function log(...args: any[]) {
  logger('log', args);
}
export function table(...args: any[]) {
  logger('log', args);
}
export function warn(...args: any[]) {
  logger('warn', args);
}
function logger(type: string, args: any[]) {
  const spirit = '🚀';

  if (wb.devMode) {
    for (let i = 0; i < args.length; i++) {
      const spacer = i > 0 ? '◉ ' : '';
      switch (type) {
        case 'dir':
          if (typeof args[i] === 'string') {
            // eslint-disable-next-line no-console
            console.dir(spacer + spirit + ' ' + args[i]);
          } else {
            // eslint-disable-next-line no-console
            console.dir(args[i]);
          }
          break;
        case 'error':
          // eslint-disable-next-line no-console
          console.error(spacer + spirit, args[i]);
          break;
        case 'log':
          // eslint-disable-next-line no-console
          console.log(spacer + spirit, args[i]);
          break;
        case 'table':
          // eslint-disable-next-line no-console
          console.table(args[i]);
          break;
        case 'warn':
          // eslint-disable-next-line no-console
          console.warn(spacer + spirit, args[i]);
          break;
      }
    }
  }
}

// UTILITY FUNCTIONS
export function addClass(el: Element, className: string) {
  if (!hasClass(el, className)) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }
}
export function classToggle(selector: string, getClass: string) {
  const query = document.querySelectorAll(selector);
  query.forEach((el) => {
    if (hasClass(el, getClass)) {
      removeClass(el, getClass);
    } else {
      addClass(el, getClass);
    }
  });
}
export function gaTrack(category: string, action: string, label: string) {
  if (!wb.devMode) {
    if (typeof window.ga === 'function') {
      window.ga('send', 'event', category, action, label);
    } else {
      warn('Google Analytics is not set up.');
    }
  } else {
    log('GA Tracking Preview: ', category, action, label);
  }
}
export function hasClass(el: Element, className: string) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}
export function processIsClient() {
  let isClient = true;

  switch (wb.projectType) {
    case 'gridsome':
      isClient = typeof process !== 'undefined' ? process.isClient : true;
      break;
  }

  return isClient;
}
export function removeClass(el: Element, className: string) {
  if (hasClass(el, className)) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
    }
  }
}
export function slugify(text: string) {
  /* eslint-disable */
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  /* eslint-enable */
}
export function snake(text: string) {
  /* eslint-disable */
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '_') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  /* eslint-enable */
}

// INIT FUNCTIONS
log('Global');
