export default function(to, from, savedPosition) {
  if (to.hash) {
    const element = document.querySelector(to.hash);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }
  } else if (savedPosition) {
    return savedPosition;
  } else {
    return { x: 0, y: 0 };
  }
}
