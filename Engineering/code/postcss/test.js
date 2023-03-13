const colors = {
  C01: '#eee',
  C02: '#111'
}
const groups = {
  G01: ['C01', 'C02']
}

postcss([require('./postcss-theme-colors')({ colors, groups })]).process(css)
