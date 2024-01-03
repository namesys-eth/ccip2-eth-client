const replace = require('replace-in-file')
const optionsCSS = {
  files: './out/_next/static/css/*.css',
  from: [/webpack:\/\/\/mini-css-extract-plugin\/_next\//g],
  to: ['https://app.namesys.xyz/_next/'],
};
(async function () {
  try {
    const resultsCSS = await replace(optionsCSS)
  } catch (error) {
  }
})()
