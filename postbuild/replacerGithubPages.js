const replace = require('replace-in-file')
const optionsCss = {
  files: './out/_next/static/css/*.css',
  from: [/webpack:\/\/\/mini-css-extract-plugin\/_next\//g, /shadow.svg/g],
  to: ['https://namesys-eth.github.io/ccip2-eth-client/_next/', 'ccip2-eth-client/shadow.svg'],
};
const optionsJs = {
  files: ['./out/_next/static/chunks/*.js', './out/_next/static/chunks/pages/*.js'],
  from: [/_next\//g, /ens-red.png/g, /href=\"\//g],
  to: ['ccip2-eth-client/_next/', 'ccip2-eth-client/ens-red.png', 'href="/ccip2-eth-client/'],
};
const optionsHtml = {
  files: './out/*.html',
  from: [/_next\/static/g, /ens-red.png/g],
  to: ['ccip2-eth-client/_next/static', 'ccip2-eth-client/ens-red.png'],
};
(async function () {
  try {
    const resultsCss = await replace(optionsCss)
    console.log('Replacement results:', resultsCss)
  } catch (error) {
    console.error('Error occurred:', error)
  }
  try {
    const resultsJs = await replace(optionsJs)
    console.log('Replacement results in JS:', resultsJs)
  } catch (error) {
    console.error('Error occurred in JS replacement:', error)
  }
  try {
    const resultsHtml = await replace(optionsHtml)
    console.log('Replacement results in HTML:', resultsHtml)
  } catch (error) {
    console.error('Error occurred in HTML replacement:', error)
  }
})()
