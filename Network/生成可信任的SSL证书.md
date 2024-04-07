# 生成可信任的SSL证书

## 自签SSL证书

### 证书可信三要素

什么 SSL 证书才是安全的证书？**证书可信三要素：**

1. 由可信的 CA 机构签发
2. 访问的地址跟证书认证地址相符
3. 证书在有效期内

不满足会展示如下提示信息：

![image-20240318171426780](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240318171426780.png)

CA(Certification Authority) 机构签发 SSL 证书。SSL 证书根据验证级别分为三种类型

1. DV SSL，域名验证型

   只验证网站域名所有权的简易型 SSL 证书，此类证书仅能起到网站机密信息加密的作用，无法向用户证明网站的真实身份

2. OV SSL，组织验证型

   需要验证网站所有单位的真实身份的标准型 SSL 证书，此类证书也就是正常的 SSL 证书，不仅能起到网站机密信息加密的作用，而且能向用户证明网站的真实身份

3. EV SSL，扩展增强型

   遵循全球统一的严格身份验证标准颁发的 SSL 证书，是目前业界最高安全级别的 SSL 证书

![image-20240319091137253](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240319091137253.png)

公网：很容易在线免费申请 SSL 证书，在阿里云、腾讯云上申请即可，他们都提供了 Nginx、Apache 等格式的文件，非常方便

内网：可信三要素里第一要素很难满足，内网没有可信的 CA 机构，需要冒充可信的 CA 机构

- 让操作系统认可你自己是可信赖的 CA 机构，然后你再来签发 SSL 证书，那么你自签的 SSL 证书，本地的浏览器就认为你自签的 SSL 证书是安全的
- 如果要局域网所有的浏览器都认可你签发的 SSL 证书，就需要让局域网所有的电脑都安装你的 CA 根证书

### 生成自签证书

可以使用 [https://www.lddgo.net/encrypt/ssl](https://www.lddgo.net/encrypt/ssl) 网站生成证书，输入域名或 IP 勾选自己需要的参数

1. 生成 CA

   生成 CA 私钥(`ca.key`)，如下步骤都会涉及输入密码

   ```bash
   $ openssl genrsa -des3 -out ca.key 2048
   openssl genrsa -des3 -out ca.key 2048
   Generating RSA private key, 2048 bit long modulus (2 primes)
   ...................+++++
   ...................................+++++
   e is 65537 (0x010001)
   Enter pass phrase for ca.key:
   Verifying - Enter pass phrase for ca.key:
   ```

   生成 CA 证书签名请求(`ca.csr`)

   - 输入国家、省份、城市、企业、部门、邮箱，这里我只输入了国家为 CN。输入存储密码（改为你自己的）即可

   ```bash
   $ openssl req -new -key ca.key -out ca.csr
   Country Name (2 letter code) [XX]:CN
   State or Province Name (full name) []:
   Locality Name (eg, city) [Default City]:
   Organization Name (eg, company) [Default Company Ltd]:
   Organizational Unit Name (eg, section) []:
   Common Name (eg, your name or your server's hostname) []:127.0.0.1
   Email Address []:
   
   Please enter the following 'extra' attributes
   to be sent with your certificate request
   A challenge password []:
   An optional company name []:
   ```

   生成自签名 CA 证书(`ca.cert`)

   - 创建一个为期 10 年的根证书

   ```bash
   $ openssl x509 -req -days 3650 -in ca.csr -signkey ca.key -out ca.crt 
   Signature ok
   subject=C = CN, L = Default City, O = Default Company Ltd, CN = 127.0.0.1
   Getting Private key
   ```

2. 如下是 openssl 的 bug，需要修改一些配置，并创建一些文件

   > [openssl生成证书链多级证书](https://www.cnblogs.com/gsls200808/p/4502044.html)
   >
   > [CA签名是报的错误及解决方法](https://blog.csdn.net/n_u_l_l_/article/details/103536588)

   - 修改 `openssl.cnf`，将如下这三个由 `match` 改为 `optional`
   - 缺少 `private` 文件夹，创建 `/etc/pki/CA/private`
     - 缺少 CA 私钥，生成对应 `cakey.pem`
   - 缺少 `newcerts` 文件夹，创建 `/etc/pki/CA/newcerts`
   - 缺少索引文件，创建 `/etc/pki/CA/index.txt`
   - 缺少序列化文件，创建 `/etc/pki/CA/serial`

   ```bash
   $ vim /etc/pki/tls/openssl.cnf
   [ policy_match ]
   countryName		= optional
   stateOrProvinceName	= optional
   organizationName	= optional
   $ mkdir /etc/pki/CA/private
   $ openssl genrsa 1024 > /etc/pki/CA/private/cakey.pem
   $ mkdir /etc/pki/CA/newcerts
   $ touch /etc/pki/CA/index.txt
   $ echo 01 > /etc/pki/CA/serial
   ```

3. 生成服务端证书，根据上面一样的步骤

   这里生成私钥换了一个方法，为了是无需输密码

   ```bash
   # 生成服务端私钥(server.key)
   $ openssl genrsa -out server.key 2048
   # 生成服务端证书签名请求(server.csr)
   $ openssl req -new -key server.key -out server.csr
   # 使用ca证书签署服务端csr以生成服务端证书(server.cert)
   $ openssl ca -days 3650 -in server.csr -out server.crt -cert ca.crt -keyfile ca.key
   ```

   生成服务端证书，有一个确定是否生成证书这一步骤，连着输入两个 y 即可

   ![image-20240319150527795](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240319150527795.png)

   会生成如下 6 个文件

   - `server.crt` 和 `server.key` 粘贴到 nginx 证书目录下并配置如下信息，之后重启 nginx 即可

     ```nginx
     ssl_certificate cert/server.crt;
     ssl_certificate_key cert/server.key;
     ```

   ![image-20240319144955998](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240319144955998.png)

注意：在 ChormeV58 版本之后，自签证书就只认 SAN（使用者可选名称，subject alternative name） 不认 CommonName 了，如何添加，可以参考这篇文章 [使用Openssl生成自签证书](https://blog.csdn.net/luo15242208310/article/details/108127638)。这里就不演示了，基本上使用 mkcert 这个工具，非常简单

这里有一个加密算法是 RSA 非对称加密，是使用最广泛的公钥密码算法

- 公钥进行加密、验签

  公钥是分享给他人使用，他人使用公钥可以加密，可以验签（验证私钥加签，这样私钥无法抵赖，这样如果不是私钥加密的内容，公钥就可以认为返回的信息是被篡改的，从而验证了服务器）

- 私钥进行解密、加签

  私钥是自己保存，自己使用私钥可以将公钥加密的内容解密，也可以对内容进行加签

## 使用mkcert生成SSL证书

使用 mkcert 工具，该工具用于制作本地信任的开发证书，mkcert 在系统存储中自动创建并安装本地 CA，并生成本地信任证书

进入Github [https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)，点击 Releases，下载对应系统的包，如下以 Windows 为例 

### 安装mkcert并生成证书

```bash
$ mkcert-v1.4.4-windows-amd64.exe -install                    
Created a new local CA
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in Java's trust store! ☕️  
```

安装时会提示创建一个新的本地 CA，点击 是(<u>Y</u>)

- CA 安装在系统信任存储中

![image-20240318172511481](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240318172511481.png)

生成自签证书

```bash
$ mkcert-v1.4.4-windows-amd64.exe 127.0.0.1 ::1 localhost 192.168.x.x yourwebsite.com
```

会生成如下两个文件

![image-20240319091615744](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240319091615744.png)

将两个文件放入 cert 文件夹中，之后配置 nginx 即可（这里我就不改名字了）

```nginx
ssl_certificate cert/127.0.0.1+1.pem;
ssl_certificate_key cert/127.0.0.1+1-key.pem;
```

重启 Nginx，页面连接变安全了

![image-20240319153836078](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240319153836078.png)

### 查看CA证书存放位置

```bash
$ mkcert-v1.4.4-windows-amd64.exe -CAROOT
```

![image-20240318173256832](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240318173256832.png)

按 `Win + R` 调出运行框，输入 `certmgr.msc` 命令

![image-20240318173443173](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240318173443173.png)

可以看到证书控制台里面有 mkcert 证书，可以将该证书导出

![image-20240318173542434](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240318173542434.png)

之后在局域网为所有电脑安装证书，局域网所有的机器的浏览器才是安全的 SSL 访问

- 如果机器太多，可以在入域的时候配置或在云桌面上做预设

