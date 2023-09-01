const replace = require('replace-in-file')
const optionsCSS = {
  files: './out/_next/static/css/*.css',
  from: [/webpack:\/\/\/mini-css-extract-plugin\/_next\//g, /shadow.svg/g],
  to: ['https://namesys-eth.github.io/ccip2-eth-client/_next/', 'ccip2-eth-client/shadow.svg'],
};
const optionsJS = {
  files: ['./out/_next/static/chunks/*.js', './out/_next/static/chunks/pages/*.js'],
  from: [/_next\//g, /ens-red.png/g, /href=\"\//g],
  to: ['ccip2-eth-client/_next/', 'ccip2-eth-client/ens-red.png', 'href="/ccip2-eth-client/'],
};
const optionsHTML = {
  files: './out/*.html',
  from: [/_next\/static/g, /ens-red.png/g],
  to: ['ccip2-eth-client/_next/static', 'ccip2-eth-client/ens-red.png'],
};
(async function () {
  try {
    const resultsCSS = await replace(optionsCSS)
    console.log('Replacement results:', resultsCSS)
  } catch (error) {
    console.error('Error occurred:', error)
  }
  try {
    const resultsJS = await replace(optionsJS)
    console.log('Replacement results in JS:', resultsJS)
  } catch (error) {
    console.error('Error occurred in JS replacement:', error)
  }
  try {
    const resultsHTML = await replace(optionsHTML)
    console.log('Replacement results in HTML:', resultsHTML)
  } catch (error) {
    console.error('Error occurred in HTML replacement:', error)
  }
})()
