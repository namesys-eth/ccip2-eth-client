const replace = require("replace-in-file");
const optionsCSS = {
  files: "./out/_next/static/css/*.css",
  from: [/webpack:\/\/\/mini-css-extract-plugin\/_next\//g, /shadow.svg/g],
  to: [
    "https://namesys-eth.github.io/ccip2-eth-client/_next/",
    "ccip2-eth-client/shadow.svg",
  ],
};
const optionsJS = {
  files: [
    "./out/_next/static/chunks/*.js",
    "./out/_next/static/chunks/pages/*.js",
  ],
  from: [/_next\//g, /ens-red.png/g, /href=\"\//g],
  to: [
    "ccip2-eth-client/_next/",
    "ccip2-eth-client/ens-red.png",
    'href="/ccip2-eth-client/',
  ],
};
const optionsHTML = {
  files: "./out/*.html",
  from: [/_next\/static/g, /ens-red.png/g],
  to: ["ccip2-eth-client/_next/static", "ccip2-eth-client/ens-red.png"],
};
(async function () {
  try {
    const resultsCSS = await replace(optionsCSS);
  } catch (error) {}
  try {
    const resultsJS = await replace(optionsJS);
  } catch (error) {}
  try {
    const resultsHTML = await replace(optionsHTML);
  } catch (error) {}
})();
