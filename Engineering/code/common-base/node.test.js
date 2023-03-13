// const AnimalApi = require('./index.js')
const AnimalApi = require('./lib/index').default

AnimalApi.getCat().then(animal => {
  console.log(animal)
})
