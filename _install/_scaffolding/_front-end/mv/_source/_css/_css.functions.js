module.exports = {
  rem: (pixels, context = 16) => {
    pixels = parseFloat(pixels);

    let result = pixels / context;

    return `${result}rem`;
  },
};