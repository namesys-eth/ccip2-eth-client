const replace = require('replace-in-file')
const optionsCSS = {
  files: './out/_next/static/css/*.css',
  from: [/webpack:\/\/\/mini-css-extract-plugin\/_next\//g],
  to: ['https://namesys.eth.limo/_next/'],
};
(async function () {
  try {
    const resultsCSS = await replace(optionsCSS)
    console.log('Replacement results:', resultsCSS)
  } catch (error) {
    console.error('Error occurred:', error)
  }
})()
