const purgecss = require('purgecss');

(async function () {
  try {
    const result = await purgecss({
      content: ['../**/*.ts'],
      css: ['../**/*.css'],
      output: './purged.css'
    })
    console.log(result)
  } catch (error) {
    console.error('Error occurred:', error)
  }
})()
