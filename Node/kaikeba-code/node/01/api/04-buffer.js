// 创建一个长度为10字节以0填充的Buffer
const buf1 = Buffer.alloc(10)
console.log(buf1) // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 创建一个Buffer包含ascii.
const buf2 = Buffer.from('a')
console.log(buf2, buf2.toString()) // <Buffer 61> a

// 创建Buffer包含UTF-8字节
const buf3 = Buffer.from('中文')
console.log(buf3) // <Buffer e4 b8 ad e6 96 87>

// 合并Buffer
const buf4 = Buffer.concat([buf2, buf3])
console.log(buf4, buf4.toString()) // <Buffer 61 e4 b8 ad e6 96 87> a中文