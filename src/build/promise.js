// We only target browsers that natively support Promises, so we replace
// Babel's Promise helper with a reference to the native promise.
module.exports = {default: global.Promise};