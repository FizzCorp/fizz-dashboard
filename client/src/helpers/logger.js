// globals
const contextTextColor = '#FF8C00';
const disable = process.env.NODE_ENV === 'production';
const prefixStyling = 'color: ' + contextTextColor + '; font-weight: normal; font-size: small';

// helper methods
function debugLocal(context) {
  if (disable) return () => { };
  return Function.prototype.bind.call(console.debug, console, context);
}

function logLocal(context, color) {
  if (disable) return () => { };

  let style = prefixStyling;
  if (color) {
    style = style.replace(contextTextColor, color);
  }
  return Function.prototype.bind.call(console.log, console, '%c' + context, style);
}

function warnLocal(context, color) {
  if (disable) return () => { };

  let style = prefixStyling;
  if (color) {
    style = style.replace(contextTextColor, color);
  }
  return Function.prototype.bind.call(console.warn, console, '%c' + context, style);
}

function infoLocal(context, color) {
  if (disable) return () => { };

  let style = prefixStyling;
  if (color) {
    style = style.replace(contextTextColor, color);
  }
  return Function.prototype.bind.call(console.info, console, '%c' + context, style);
}

function errorLocal(context, color) {
  if (disable) return () => { };

  let style = prefixStyling;
  if (color) {
    style = style.replace(contextTextColor, color);
  }
  return Function.prototype.bind.call(console.error, console, '%c' + context, style);
}

// exports
export default function Logger(prefix, color) {
  const context = prefix + ' ==> \n';

  this.log = logLocal(context, color);
  this.warn = warnLocal(context, color);
  this.info = infoLocal(context, color);
  this.error = errorLocal(context, color);
  this.debug = debugLocal(context, color);
}