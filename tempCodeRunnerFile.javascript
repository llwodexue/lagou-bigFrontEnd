// 勾选的数组转换为16进制数字
const decimalNumber = (arr = []) => {
  const valSeq = new Array(32).fill(0)
  for (const k of arr) {
    // 判断是否是数字
    if (!isNaN(k)) {
      valSeq[k] = '1'
    } else {
      // 字母的情况
      const tempI = k.charCodeAt(0)
      valSeq[tempI - 55] = '1'
    }
  }
  const valStr = valSeq.reverse().join('')
  return parseInt(valStr, 2).toString(16)
}
// 16进制数字转换为数组
const echoChecked = value => {
  const checked = []
  const binSeq = parseInt(value, 16).toString(2)
  if (isNaN(binSeq)) return checked
  const binRev = binSeq.split('').reverse().join('')
  for (let i = 0; i < 63; i++) {
    if (binRev.charAt(i) === '1') {
      // 判断是否是数字
      if (i < 10) {
        checked.push(i.toString())
      } else {
        // 字母的情况
        const tempI = i + 55
        checked.push(String.fromCharCode(tempI))
      }
    }
  }
  return checked
}

// 按后端制定规则生成16进制字符串
const convertListToGate = arr => {
	if (!arr) return "";
	if (!Array.isArray(arr) || arr.length === 0) return "";
	const maxLength = Math.max(...arr);
	// 填充最大数的数据量长度，且必须是4的倍数
	const binArr = new Array(Math.ceil(maxLength / 4) * 4).fill(0);
	// 找到对应的数字就填充为1，生成对应的二进制数据
	arr.forEach(item => (binArr[Number(item) - 1] = 1));
	// 二进制翻转
	const binStr = binArr.reverse().join("");
	// 二进制数据转16进制数据
	const result = parseInt(binStr, 2).toString(16);
	return result;
};

console.log(echoChecked('40007fff'))