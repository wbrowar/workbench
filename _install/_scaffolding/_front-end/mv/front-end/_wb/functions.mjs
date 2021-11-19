import { default as chalk } from 'chalk';
import { default as ejs } from 'ejs';
import { default as exec } from 'child_process';
import { default as fs } from 'fs-extra';
import { default as glob } from 'glob-all';

// Synchronously run a callback for each item in and array
export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Synchronously run a function and wait for a callback to fire
export async function asyncFunction(startMessage, endMessage, func) {
  log('title', startMessage);

  const p = await new Promise((resolve) => {
    func(resolve);
  }).then(() => '');
  log('title', endMessage);
  return p;
}

// Check to see if fonts need to be generated
export function fontSettingsExist(theme, verbose = false) {
  log('verbose', `Checking for font settings in ./wb.theme.js`, verbose);

  if (Object.keys(theme.fonts).length) {
    const fontsWithFiles = Object.keys(theme.fonts).filter((font) => {
      if (theme.fonts[font].files) {
        return Object.keys(theme.fonts[font].files).length > 0;
      }

      return false;
    });
    if (fontsWithFiles.length) {
      log('verbose', `Font settings found:`, verbose);
      log('dump', theme.fonts, verbose);
      return true;
    }
  }

  return false;
}

// Compile EJS files and move them to destination directory
export function globEjs(pattern, replaceSrc, replaceDist, ejsVars, callback, verbose = false) {
  glob(pattern, { dot: true, nodir: true }, function (er, files) {
    let count = files.length;
    if (count > 0) {
      files.forEach((item) => {
        ejs.renderFile(item, ejsVars, {}, function (err, str) {
          if (err) {
            log('warn', err);
          }
          fs.outputFile(item.replace(replaceSrc, replaceDist), str, (err) => {
            if (!err) {
              log('verbose', `Compiled ${item} → ${item.replace(replaceSrc, replaceDist)}`, verbose);
              count--;
              if (count === 0) {
                callback();
              }
            }
          });
        });
      });
    } else {
      callback();
    }
  });
}

// Move files to destination directory
export function globMove(pattern, replaceSrc, replaceDist, callback, verbose = false) {
  glob(pattern, { dot: true, nodir: true }, function (er, files) {
    let count = files.length;
    if (count > 0) {
      files.forEach((item) => {
        fs.move(item, item.replace(replaceSrc, replaceDist), { overwrite: true }).then(() => {
          log('verbose', `Moved ${item} → ${item.replace(replaceSrc, replaceDist)}`, verbose);
          count--;
          if (count === 0) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  });
}

export async function globMvFromList(list, callback, verbose = false) {
  await asyncForEach(list, async (item) => {
    globMove(item.pattern, item.src, item.dist, callback, verbose);
  });
}

// Remove files
export function globRemove(pattern, callback, verbose = false) {
  glob(pattern, { dot: true, nodir: true }, function (er, files) {
    let count = files.length;
    if (count > 0) {
      files.forEach((item) => {
        fs.remove(item).then(() => {
          log('verbose', `Removed ✄ ${item}`, verbose);
          count--;
          if (count === 0) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  });
}

// display a message in the command line
export function log(type = 'message', message, verbose = false) {
  switch (type) {
    case 'app':
      console.log(chalk.bgRgb(230, 20, 20)(`  ${message}  `));
      break;
    case 'dump':
      if (verbose) {
        console.log(chalk.magenta.bold(`📦 ${JSON.stringify(message, null, 2)}`));
      }
      break;
    case 'running':
      console.log(chalk.green.bold(`💻 ${chalk.green(message)}`));
      break;
    case 'title':
      console.log(chalk.blue.bold(`🛠 ${message}`));
      break;
    case 'verbose':
      if (verbose) {
        console.log(chalk.keyword('orange')(`👓 ${message}`));
      }
      break;
    case 'warn':
      console.warn(chalk.red.bold(`❗️ ${message}`));
      break;
    default:
      console.log(message);
  }
}

// parse process arguments into an array format
export function parseArgv() {
  let args = [];
  let options = {};

  process.argv.forEach(function (arg, i) {
    if (i > 1) {
      if (arg.substr(0, 2) === '--') {
        // remove leading dashes
        const str = arg.substr(2);

        // split out to key/value pairs
        if (str.indexOf('=') !== -1) {
          const strSplit = str.split('=');
          if (strSplit[1] === 'true') {
            options[strSplit[0]] = true;
          } else if (strSplit[1] === 'false') {
            options[strSplit[0]] = false;
          } else {
            options[strSplit[0]] = strSplit[1];
          }
        } else {
          options[str] = true;
        }
      } else {
        args.push(arg);
      }
    }
  });

  return {
    args: args,
    options: options,
  };
}

// Parse color object into Tailwind config and color schemes
function _getRgbValuesFromCssRgbValue(color) {
  return color.startsWith('rgb(') && color.endsWith(')') ? color.substr(4, color.length - 5) : color;
}
export function parseThemeColors(themeColors, verbose = false) {
  const colors = {
    tailwind: {},
    schemes: {},
  };

  Object.entries(themeColors).forEach(([key1, value1]) => {
    if (typeof value1 === 'string') {
      // Set strings directly to Tailwind values
      colors.tailwind[`${key1}-val`] = value1;
      colors.tailwind[key1] = value1;
    } else if (typeof value1 === 'object' && value1?.value !== undefined) {
      // Set values for top-level scheme objects
      Object.entries(value1).forEach(([schemeKey, schemeValue]) => {
        if (schemeKey === 'value') {
          colors.tailwind[`${key1}-val`] = value1.value;
          colors.tailwind[key1] = ({ opacityVariable, opacityValue }) => {
            if (opacityValue !== undefined) {
              return `rgba(var(--color-${key1}), ${opacityValue})`
            }
            if (opacityVariable !== undefined) {
              return `rgba(var(--color-${key1}), var(${opacityVariable}, 1))`
            }
            return `rgb(var(--color-${key1}))`
          };
        } else {
          if (colors.schemes[schemeKey] === undefined) {
            colors.schemes[schemeKey] = {};
          }
          colors.schemes[schemeKey][key1] = _getRgbValuesFromCssRgbValue(schemeValue);
        }
      });
    } else if (typeof value1 === 'object') {
      // Set values for shade-level scheme objects
      Object.entries(value1).forEach(([key2, value2]) => {
        if (typeof value2 === 'string') {
          // Set strings directly to Tailwind values
          if (key2 === 'DEFAULT') {
            colors.tailwind[`${key1}-val`] = value2;
            colors.tailwind[key1][key2] = value2;
          } else {
            if (colors.tailwind[key1] === undefined) {
              colors.tailwind[key1] = {};
            }
            colors.tailwind[key1][`${key2}-val`] = value2;
            colors.tailwind[key1][key2] = value2;
          }
        } else if (typeof value2 === 'object' && value2?.value !== undefined) {
          // Set values for top-level scheme objects
          Object.entries(value2).forEach(([schemeKey, schemeValue]) => {
            if (schemeKey === 'value') {
              if (key2 === 'DEFAULT') {
                colors.tailwind[`${key1}-val`] = value2.value;
                colors.tailwind[key1][key2] = ({ opacityVariable, opacityValue }) => {
                  if (opacityValue !== undefined) {
                    return `rgba(var(--color-${key1}), ${opacityValue})`;
                  }
                  if (opacityVariable !== undefined) {
                    return `rgba(var(--color-${key1}), var(${opacityVariable}, 1))`;
                  }
                  return `rgb(var(--color-${key1}))`;
                };
              } else {
                if (colors.tailwind[key1] === undefined) {
                  colors.tailwind[key1] = {};
                }
                colors.tailwind[key1][`${key2}-val`] = value2.value;
                colors.tailwind[key1][key2] = ({ opacityVariable, opacityValue }) => {
                  if (opacityValue !== undefined) {
                    return `rgba(var(--color-${key1}-${key2}), ${opacityValue})`
                  }
                  if (opacityVariable !== undefined) {
                    return `rgba(var(--color-${key1}-${key2}), var(${opacityVariable}, 1))`
                  }
                  return `rgb(var(--color-${key1}-${key2}))`
                };
              }
            } else {
              if (colors.schemes[schemeKey] === undefined) {
                colors.schemes[schemeKey] = {};
              }
              if (key2 === 'DEFAULT') {
                colors.schemes[schemeKey][key1] = _getRgbValuesFromCssRgbValue(schemeValue);
              } else {
                colors.schemes[schemeKey][`${key1}-${key2}`] = _getRgbValuesFromCssRgbValue(schemeValue);
              }
            }
          });
        }
      });
    }
  });

  return colors;
}

// Usage: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
export function randomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function snake(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with _
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '_') // Replace multiple - with single _
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// Determine if a command should be displayed in terminal when running shell commands
export function verboseExec(command, verbose = false, showOutput = false) {
  if (verbose) {
    log('running', command);
    exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
  } else if (showOutput) {
    exec.spawnSync(command, [], { stdio: 'inherit', shell: true });
  } else {
    exec.execSync(`${command} > /dev/null 2>&1`);
  }
}
