const purgecss = require('purgecss')

const result = await purgecss({
  content: ['../**/*.ts'],
  css: ['../**/*.css']
})

console.log(result)
