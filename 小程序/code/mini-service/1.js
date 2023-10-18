const menu = {
  inboundOverview: 'Entrance of the day Overview',
  outboundOverview: 'Exit of the day Overview'
}

Object.keys(menu).forEach(i => {
  if (typeof menu[i] !== 'string') return
  const fin = menu[i].split(' ').map(item => {
    return item.substr(0, 1).toUpperCase() + item.slice(1)
  })
  menu[i] = fin.join(' ')
})
console.log(menu)
