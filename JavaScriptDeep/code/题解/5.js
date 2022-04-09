Object.defineProperty(String.prototype, 'queryURLParams', {
  value: function (attr) {
    let obj = {}
    this.replace(/#([^?&=#]+)/g, (_, $1) => (obj['HASH'] = $1))
    this.replace(/([^?&=#]+)=([^?&=#]+)/g, (_, $1, $2) => (obj[$1] = $2))
    return typeof attr !== 'undefined' ? obj[attr] : obj
  },
})
let url = 'http://www.baidu.com?lx=1&name=bird#animals'
console.log(url.queryURLParams())
