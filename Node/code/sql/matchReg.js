const sql = 'SELECT * FROM table WHERE condition1 AND condition2 AND condition3'
const regex = /and\s+(\w+)/gi
const matches = sql.match(regex)

console.log(matches) // 输出 ["AND condition2", "AND condition3"]
