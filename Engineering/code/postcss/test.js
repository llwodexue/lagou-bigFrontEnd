const colors = {
  C01: '#eee',
  C02: '#111'
}
const groups = {
  G01: ['C01', 'C02']
}

const postcss = require('postcss')

const css = `
  .btn {
    color: cc(G01);
  }
`

postcss([require('./postcss-theme-colors')({ colors, groups })]).process(css, { from: undefined }).then(result => {
  console.log(result.css)
})
