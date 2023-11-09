# 对称加密

对称加密一大缺点是密钥的管理与分配，换句话说，如何把密钥发送到需要解密你的消息的人的手里是一个问题。在发送密钥的过程中，密钥有很大的风险会被黑客拦截。现实中通常的做法是将对称加密的密钥进行非对称加密，然后传送给需要它的人

彩虹表是对于散列函数做逆运算的表（空间换时间），密码安全度比较低是可以用彩虹表碰撞去破解的，可以在 [Free Rainbow Tables](https://freerainbowtables.com/) 上下载进行试验，如果试图解密，可以使用 [CMD5](https://cmd5.com/) 进行解密

## 不可逆加密（MD5 SHA）

node 中有原生 crypto 模块，该模块提供了 hash、hmac、加密解密等一整套封装。因为是 node 中的模块，所以需要使用 `const crypto = require('crypto')` 来引入

MD5、SHA1 也成散列算法

### crypto 进行 MD5 SHA 加密

hash 算法又称摘要算法，该算法可以将任意长度的数据，转换为固定长度的 hash 值，且具有不可逆性

```js
const crypto = require('crypto')

console.log(crypto.getHashes())
```

使用 `getHashes` 方法，可以获取到所有支持 hash 算法的一个数组

```js
[
  'RSA-MD4', 'RSA-MD5', 'RSA-MDC2',
  'RSA-RIPEMD160', 'RSA-SHA1', 'RSA-SHA1-2',
  'RSA-SHA224', 'RSA-SHA256', 'RSA-SHA3-224',
  'RSA-SHA3-256', 'RSA-SHA3-384', 'RSA-SHA3-512',
  'RSA-SHA384', 'RSA-SHA512', 'RSA-SHA512/224',
  'RSA-SHA512/256', 'RSA-SM3', // ....
  'md5', 'md5-sha1', 'md5WithRSAEncryption', // ...
  'sha1', 'sha1WithRSAEncryption', 'sha224',
  'sha224WithRSAEncryption', 'sha256', 'sha256WithRSAEncryption',
  'sha3-224', 'sha3-256', 'sha3-384',
  'sha3-512', 'sha384', 'sha384WithRSAEncryption',
  'sha512', 'sha512-224', 'sha512-224WithRSAEncryption',
  'sha512-256', 'sha512-256WithRSAEncryption', 'sha512WithRSAEncryption',
  // ...
]
```

这些 hash 算法，我们平常用的比较多的是：`md5`、`sha1`、`sha256` 等。这里我们可以简单封装一下，根据不同摘要算法生成不同 hash 值

```js
const crypto = require('crypto')

const createHash = (type, str) => crypto.createHash(type).update(str).digest('hex')

['md5', 'sha1', 'sha256'].forEach(type => {
  createHash(type, '123')
})
/*
md5 202cb962ac59075b964b07152d234b70
sha1 40bd001563085fc35165329ea1ff5c5ecbdbbeef
sha256 a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
*/
```

### * 上面版本的加盐和 hmac 算法

如果密码安全强度过低，是很容易被彩虹表碰撞上的，所以一般还会做一层加盐加字符串的处理，这样碰撞成功的概率就大大减少了

这里以 MD5 加密方式举例：

```js
const crypto = require('crypto')

const createHash = (type, str) => crypto.createHash(type).update(str).digest('hex')

const psw = '123'
const md5 = str => createHash('md5', str)
const encryptPassword = (salt, password) => md5(salt + '@3#!8^k.j$0#qr' + password)
const salt = Math.random() * 99999 + new Date().getTime()

encryptPassword(salt, psw) // 5927975bb4e8453b54e244ae4640426f
```

crypto 里有 `createHmac()` 方法，hmac 类似加盐版 hash 算法，hmac 是密钥相关的哈希运算消息认证码（Hash-basees Message Authentication Code）

```js
const crypto = require('crypto')

const salt = (Math.random() * 99999).toString() + new Date().getTime()
const createHmac = (type, str) => crypto.createHmac(type, salt).update(str).digest('hex')

const psw = '123'
const md5 = str => createHmac('md5', str)

console.log(md5(salt, psw)) // c9bce0c58ec62881aa5774a7d304b40a
```

### blueimp-md5 进行 MD5 加密

接下来简单说一下其他可能会用到的加密包

- 注意：使用两次 md5 加密也是不安全的，也能被彩虹表碰撞到

```js
/* npm i blueimp-md5 */
import md5 from 'blueimp-md5'

const txt = '123'

function passTrans(pass) {
  return md5(pass)
}

console.log(passTrans(txt)) // 202cb962ac59075b964b07152d234b70
```

### sha 进行 SHA 加密

SHA 家族的五个算法，分别是 SHA-1、SHA-224、SHA-256、SHA-384，和 SHA-512，由美国国家安全局（NSA）所规划，并由美国国家规范与技能研究院（NIST）发布，这里只对 SHA-1 和 SHA-256 进行演示

- SHA-1

```js
/* npm i js-sha1 */
import sha1 from 'js-sha1'

const txt = '123'

function passTrans(pass) {
  return sha1(pass)
}

console.log(passTrans(txt)) // 40bd001563085fc35165329ea1ff5c5ecbdbbeef
```

- SHA-256

```js
/* npm i js-sha256 */
import { sha256 } from 'js-sha256'

const txt = '123'

function passTrans(pass) {
  return sha256(pass)
}

console.log(passTrans(txt)) // a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
```



## 可逆加密（AES DES BASE64）

### crypto 进行 AES 加密

上述这些方法都是不可逆 hash 加密算法，接下来说一下可加密解密的算法。常见的有 `AES`、`DES`、`BASE64`

```js
const crypto = require('crypto')

console.log(crypto.getCiphers())
```

使用 `getCiphers` 方法，可以获取到所有支持 cipher 算法的一个数组

```js
[
  'aes-128-cbc', 'aes-128-ccm', 'aes-128-cfb',
  'aes-128-cfb1', 'aes-128-cfb8', 'aes-128-ctr',
  'aes-128-ecb', 'aes-128-gcm', 'aes-128-ocb',
  'aes-128-ofb', 'aes-128-xts', 'aes-192-cbc',
  'aes-192-ccm', 'aes-192-cfb', 'aes-192-cfb1',
  'aes-192-cfb8', 'aes-192-ctr', 'aes-192-ecb',
  'aes-192-gcm', 'aes-192-ocb', 'aes-192-ofb',
  'aes-256-cbc', 'aes-256-ccm', 'aes-256-cfb',
  'aes-256-cfb1', 'aes-256-cfb8', 'aes-256-ctr',
  'aes-256-ecb', 'aes-256-gcm', 'aes-256-ocb',
  'aes-256-ofb', 'aes-256-xts', 'aes128',
  'aes128-wrap', 'aes192',      'aes192-wrap',
  'aes256',      'aes256-wrap', 'aria-128-cbc',
  // ....
]
```

cryoto 模块中提供了 `createCipheriv` 和 `createDecipheriv` 来进行加密和解密的功能，这两个方法都接收 3 个参数：

1. algorithm 同于指定加密算法

   `aes-128-cbc`  算法是 128

2. key：加密解密的密钥，密钥必须是 `8/16/32` 位

   如果加密算法是 128，对应密钥是 16 位

   如果加密算法是 256，对应密钥是 32 位

3. iv：参数可选，用于指定加密时所用的向量，规则与 key 一样

常用的模式是：ECB、CBC、CFB、OFB。详细可见：[块加密 工作模式 ECB、CBC、PCBC、CFB、OFB、CTR](https://blog.csdn.net/jerry81333/article/details/78336616)

```js
const crypto = require('crypto')

const AES_ALGORITHM = 'aes-128-cbc'

const key = 'encode@3#!8^k.j$'
const iv = 'vector@3#!8^k.j$'
const txt = '123'

function encrypt(data) {
  let encrypted = ''
  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv)
  encrypted += cipher.update(data, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

function decrypt(data) {
  let decrypted = ''
  const cipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv)
  decrypted += cipher.update(data, 'base64', 'utf8')
  decrypted += cipher.final('utf8')
  return decrypted
}

const sign = encrypt(txt)
const _src = decrypt(sign)

console.log('加密：', sign)
console.log('解密：', _src)
/*
加密： lVKUZlJeTrkHc3Qf5s0KPw==
解密： 123
*/
```

### * crypto-js 进行 AES 加密

由于 crypto 是 node 原生的，很多人可能又不习惯，下面介绍另一款 crypto-js 。这个需要 npm 下载，也可以直接去 [crypto-js GitHub](https://github.com/brix/crypto-js) 下载

CryptoJS 在处理前需要对参数进行一下处理

```js
const wordArray = CryptoJS.enc.Utf8.parse(utf8String)
const wordArray = CryptoJS.enc.Latin1.parse(latin1String)
const wordArray = CryptoJS.enc.Hex.parse(hexString)
const wordArray = CryptoJS.enc.Base64.parse(base64String)
```

CryptoJS 加密出的结果是一个对象：`CryptoJs.AES.encrypt(src, key, { iv, mode, padding })` ，所以需要对其进行文本处理 `toString()` 或 `+ ''`

- key 是密钥，可以是接口返回的

- iv 是密钥偏移量，一般都是接口返回的

- mode：支持 CBC、CFB、CTR、ECB、OFB，默认 CBC

  详细可见：[块加密 工作模式 ECB、CBC、PCBC、CFB、OFB、CTR](https://blog.csdn.net/jerry81333/article/details/78336616)

  ECB 模式下，向量 iv 是没有用的。ECB 加密原理：根据加密块的大小分成若干块，之后将每块使用相同的秘钥单独加密即可

  CBC 模式下，向量 iv 是有用的。CBC 加密原理：每个明文块进行异或后再进行加密，每个密文块都依赖前面的所有明文块

- padding ：支持 Pkcs7、AnsiX923、Iso10126、NoPadding、ZeroPadding，默认 Pkcs7

CryptoJS 解密密文必须是 BASE64 编码

> 详细原理可以参考：[AES加密算法的详细介绍与实现](https://blog.csdn.net/qq_28205153/article/details/55798628)
>

```js
/* npm i crypto-js */
// import CryptoJS from 'crypto-js'
const CryptoJS = require('crypto-js')

const keyStr = 'encode@3#!8^k.j$'
const ivStr = 'vector@3#!8^k.j$'
const txt = '123'

function encrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const src = CryptoJS.enc.Utf8.parse(data)
  const cipher = CryptoJS.AES.encrypt(src, key, {
    iv: iv, // 初始向量
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7, // 填充方式
  })
  const encrypted = cipher.toString()
  return encrypted
}

function decrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const cipher = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decrypted = cipher.toString(CryptoJS.enc.Utf8) // 返回的是加密之前的原始数据->字符串类型
  return decrypted
}

const sign = encrypt(txt)
const _src = decrypt(sign)

console.log('加密：', sign)
console.log('解密：', _src)
/*
加密： lVKUZlJeTrkHc3Qf5s0KPw==
解密： 123
*/
```

### crypto-js 进行 DES 加密

DES -> TripleDES -> RC4 -> AES（安全性会更高一些）

- DES 其实只是把之前写 AES 的部分改成 DES
- https （SSL 使用 40 位关键字作为 RC4 流加密算法）

```js
/* npm i crypto-js */
// import CryptoJS from 'crypto-js'
const CryptoJS = require('crypto-js')

const keyStr = 'encode@3#!8^k.j$'
const ivStr = 'vector@3#!8^k.j$'
const txt = '123'

function encrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const src = CryptoJS.enc.Utf8.parse(data)
  return CryptoJS.DES.encrypt(src, key, {
    iv: iv, // 初始向量
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7, // 填充方式
  }).toString()
}

function decrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  return CryptoJS.DES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8)
}

const sign = encrypt(txt)
const _src = decrypt(sign)

console.log('加密：', sign)
console.log('解密：', _src)
/*
加密： OaCOFkaXIUc=
解密： 123
*/
```

### crypto-js 进行 BASE64 加密

可以使用 window 自带的方法，不过使用这个是有缺陷的（无法处理中文）：

- `window.btoa` 对字符串进行 BASE64 编码（注意：不能编码中文）
- `window.atob` 对 BASE64 字符串进行解码（注意：转换含有中文的 BASE64 编码是不能正确解码的）

```js
/* npm i crypto-js */
// import CryptoJS from 'crypto-js'
const CryptoJS = require('crypto-js')

const txt = '123算法'

function encrypt(data) {
  const encrypted = CryptoJS.enc.Utf8.parse(data)
  const cipher = CryptoJS.enc.Base64.stringify(encrypted)
  return cipher
}

function decrypt(data) {
  const decrypted = CryptoJS.enc.Base64.parse(data)
  const cipher = decrypted.toString(CryptoJS.enc.Utf8)
  return cipher
}

const sign = encrypt(txt)
const _src = decrypt(sign)

console.log('加密：', sign)
console.log('解密：', _src)
/* 
加密： MTIz566X5rOV
解密： 123算法
*/
```

#  非对称加密

非对称加密会产生一对密钥（公钥负责加密、私钥负责解密），私钥无法解开说明公钥无效（抗抵赖性）。常见算法 RSA（大质数 ）、Elgamal、背包算法、Rabin、D-H、ECC（椭圆曲线加密算法）

如下只对 RSA 算法进行说明

## jsencrypt 进行 RSA 加密

加密算法分为对称加密和非对称加密，AES 是对称加密，RSA 是非对称加密

- 接口加密一般会使用 AES，之所以用 AES 加密是因为效率高
- RSA 会慢一些，一般会用做签名认证操作，防止请求被篡改

> 参考：[RSA算法原理（一）](http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html)
>
> 只能被 1 和本身整除的数叫质数，例如 13，质数是无穷多的，得到两个巨大质数的乘积是简单的事，但想要从该乘积反推出这两个巨大质数却没有任何有效的办法，这种不可逆的单向数学关系，是国际数学界公认的质因数分解难题
>
> Rivest(R)、Shamir(S) 和 Adleman(A) 三人巧妙利用这一假说，设计出 RSA 公钥加密算法的基本原理：
>
> 1. 让计算机随机生成两个大质数 p 和 q，得出乘积 n
> 2. 利用 p 和 q 有条件的生成加密密钥 e
> 3. 通过一系列计算，得到与 n 互为质数的解密密钥 d，置于操作系统才知道的地方
> 4. 操作系统将 n 和 e 共同作为公钥对外发布，将私钥 d 秘密保存，把初始质数 p 和 q 秘密丢弃

接下来需要生成一下 RSA 密钥对： [生成 RSA 密钥对](http://web.chacuo.net/netrsakeypair)，将生成的公钥私钥复制过去（一般复制公钥即可，私钥给后端）

![](https://gitee.com/lilyn/pic/raw/master/company-img/rsa%E5%85%AC%E9%92%A5%E7%A7%81%E9%92%A5.jpg)

jsencrypt 包没有处理 node 中的情况，所以这里就不演示代码了，大家可以去 vue 里尝试一下

```js
/* npm i jsencrypt */
import JSEncrypt from 'jsencrypt/bin/jsencrypt'

const publicKey = `非对称加密公钥`
const privateKey = `非对称加密私钥`
const txt = '123'

/* 加密 */
function encrypt(pass) {
  const encrypted = new JSEncrypt() // 创建加密对象实例
  encrypted.setPublicKey(publicKey) // 设置公钥
  return encrypted.encrypt(pass) // 对内容进行加密
}

/* 解密 */
function decrypt(pass) {
  const decrypted = new JSEncrypt() // 创建解密对象实例
  decrypted.setPrivateKey(privateKey) // 设置私钥
  return decrypted.decrypt(pass) // 拿私钥解密内容
}

console.log(decrypt(encrypt(txt))) // '123'
```

## node-rsa 进行 RSA 加密

前端一般用 jsencrypt 做加密，后端（Node）一般用 node-rsa 解密

```js
const publicKey = key.exportKey('pkcs8-public').toString('base64') // 可以给前端的公钥
const privateKey = key.exportKey('pkcs8-private').toString('base64') // 私钥
```

为了增强数据交换的安全性，一般会进行签名和验证操作：

- 由于客户端的公钥是公开的，发送请求被拦截（中间人）， **中间人是可以使用公钥对参数加密，替换拦截到的参数密文，发送给服务端** ，这样就导致服务端无法判断得到的请求是否是可信的客户端发送的了（请求头是对的，但是参数被中间人替换了）

```js
const nodeRSA = require('node-rsa')

// 生成一个1024长度的密钥对
const key = new nodeRSA({ b: 1024 })
const publicKey = key.exportKey('pkcs8-public') // 公钥
const privateKey = key.exportKey('pkcs8-private') // 私钥
const txt = '123'

// 使用公钥加密
function encrypt(data) {
  const pubKey = new nodeRSA(publicKey, 'pkcs8-public')
  return pubKey.encrypt(Buffer.from(data), 'base64')
}

// 使用私钥解密
function decrypt(data) {
  const priKey = new nodeRSA(privateKey, 'pkcs8-private')
  return priKey.decrypt(Buffer.from(data, 'base64'), 'utf8')
}

const sign = encrypt(txt)
const _src = decrypt(sign)

console.log('加密：', sign)
console.log('解密：', _src)
/* 
加密： fBaBFVPv+96I/r6a2tfPbYWa0yjgJKQ+K2/E9obGNo0dYBOSBzW2PgnPOHX+/pq0wUZPxJzcwt5YcMtOsUNuZAYpaPZJ9o6IOEKj823HBNbyerDMUfU3rINCk2FilRuxFpQPmBZTbSvSumKligdtsh1Vz02DwdRgbJHp5bm4Hjk=
解密： 123
*/

// 使用私钥对消息签名
function signRSA(data) {
  const priKey = new nodeRSA(privateKey, 'pkcs8-private')
  return priKey.sign(Buffer.from(data), 'hex')
}

// 使用公钥验证签名
function verifyRSA(decrypt, signs) {
  const pubKey = new nodeRSA(publicKey, 'pkcs8-public')
  return pubKey.verify(Buffer.from(decrypt), signs, 'utf8', 'hex')
}

const signature = signRSA(sign)

console.log('私钥签名：' + signature)
console.log('公钥验证：' + verifyRSA(sign, signature))
/* 
私钥签名：873ae60fa3a5a89850185632b53e54b7c9919d146f2464a857f83679d9862e0612973c891994f6f576d4c04913a8b0a17b9b3adaa3577fcb81d637b2ede0c4a1cffadcaa99b81d09a7edfa69a813cd9f87fe52d96c371f6af533dd5577fdc0f6f7dc6857e1a78d425c0be71f7c440e44e8f932c4ed8890dba007721d10832e92
公钥验证：true
*/
```

# 前后端接口加密

前端需要做的就是 2 件事情：

1. 统一处理数据的响应，在渲染到页面之前进行解密操作

   ```js
   service.interceptors.response.use(
     response => {
       if (response.config.responseType === 'blob') {
         return response
       }
       const res = response.data
       if (typeof res === 'string') {
         // 对response.data进行处理
       }
       return res
     }
   )
   ```

2. 请求的数据发出时，统一加密

   get 请求对 data 进行加密

   post 请求对 param 进行加密

   ```js
   service.interceptors.request.use(
     config => {
       if (config.method === 'post') {
         const data = config.data
         if (data) {
           // 对config.data进行处理
         }
       } else if (config.method === 'get') {
         const params = config.params
         if (params) {
           if (Object.keys(params).length !== 0) {
             // 对config.params进行处理
           }
         }
       }
       return config
     }
   )
   ```

> 前后端请求加密操作可以参考：[前后端API交互加密解密（js、Java）](https://www.cnblogs.com/wangweizhang/p/12883671.html)

到此为止前后端交互通信已经做了加密操作，接下来最重要的就是如何保证加密的 key 不泄露？

- 服务端啊安全性较高，可以存储在数据库文件或配置文件中，前端就很危险了

下面是动态获取加密 key 的方式：

- 用 RSA 加密传输 AES 的秘钥，用 AES 加密数据，两者相互结合优势互补

![](https://gitee.com/lilyn/pic/raw/master/js-img/%E6%9C%8D%E5%8A%A1%E7%AB%AF%E5%92%8C%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%8F%A3%E5%8A%A0%E5%AF%86.png)

1. 客户端发送请求，服务端用 RSA 生成一对公钥和私钥 pub1、pri1，将公钥 pub1 返给客户端
2. 客户端拿到服务端返回的公钥 pub1 后，先用 RSA 算法生成一对公钥和私钥 pub2、pri2，之后用公钥 pub1 对 pub2 加密，加密之后传输给服务端
3. 服务端收到客户端传输的密文，用私钥 pri1 解密（数据是用 pub1 加密的）拿到客户端生成的公钥 pub2
4. 服务端用 AES 生成加密 key 用公钥 pub2 加密，返给客户端，客户端用 pri2 进行解密。以后服务端数据都通过 AES 加密，客户端用对应的 key 进行解密即可

