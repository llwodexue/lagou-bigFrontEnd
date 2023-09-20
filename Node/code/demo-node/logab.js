const { spawn } = require('child_process')

const child1 = spawn('node', ['./a.js'])
const child2 = spawn('node', ['./b.js'])

child1.stdout.on('data', data => console.log(data.toString()))
child2.stdout.on('data', data => console.log(data.toString()))
