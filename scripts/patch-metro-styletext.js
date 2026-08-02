/**
 * Metro 0.84+ calls util.styleText (Node >= 20.12).
 * Older Node (e.g. 20.9) crashes release bundling. Polyfill styleText in Metro.
 */
const fs = require('fs');
const path = require('path');

const metroLib = path.join(__dirname, '..', 'node_modules', 'metro', 'src');
const POLYFILL_MARKER = '/* metro-styletext-polyfill */';
const POLYFILL = `${POLYFILL_MARKER}
if (typeof _util.default.styleText !== "function") {
  _util.default.styleText = function styleText(_format, text) {
    return text;
  };
}
`;

const files = [
  path.join(metroLib, 'lib', 'reporting.js'),
  path.join(metroLib, 'lib', 'logToConsole.js'),
  path.join(metroLib, 'lib', 'TerminalReporter.js'),
  path.join(metroLib, 'index.flow.js'),
];

const utilRequire =
  /var _util = _interopRequireDefault\(require\("util"\)\);/;

let patched = 0;
for (const file of files) {
  if (!fs.existsSync(file)) {
    continue;
  }
  let src = fs.readFileSync(file, 'utf8');
  if (src.includes(POLYFILL_MARKER)) {
    continue;
  }
  if (!utilRequire.test(src)) {
    console.warn(`[patch-metro-styletext] no util import in ${path.basename(file)}; skip`);
    continue;
  }
  src = src.replace(utilRequire, match => `${match}\n${POLYFILL}`);
  fs.writeFileSync(file, src);
  patched += 1;
  console.log(`[patch-metro-styletext] patched ${path.relative(path.join(__dirname, '..'), file)}`);
}

if (patched === 0) {
  console.log('[patch-metro-styletext] already patched or nothing to do');
}
