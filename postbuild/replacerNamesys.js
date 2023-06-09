const replace = require('replace-in-file')
const optionsCss = {
  files: './out/_next/static/css/*.css',
  from: [/webpack:\/\/\/mini-css-extract-plugin\/_next\//g],
  to: ['https://namesys.eth.limo/_next/'],
};
(async function () {
  try {
    const resultsCss = await replace(optionsCss)
    console.log('Replacement results:', resultsCss)
  } catch (error) {
    console.error('Error occurred:', error)
  }
})()
