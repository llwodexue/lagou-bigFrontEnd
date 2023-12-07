# Nexus搭建npm私库

## 安装Nexus

### 官网下载

> [https://www.sonatype.com/products/sonatype-nexus-oss-download](https://www.sonatype.com/products/sonatype-nexus-oss-download)

进入官网下载，最新下载方式需要输入个人信息才能下载了

![image-20231206140429489](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206140429489.png)

选择对应的系统进行下载

- **Windows 推荐也下载 UNIX 版本**（Windows 版本配置比较难改）

![image-20231206135901989](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206135901989.png)

如果没有下载，点一下 click here 重新下载，下载还是很快的

![image-20231206140624901](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206140624901.png)

### Windows安装

linux 安装步骤与启动方式跟 windows 是一样的，解压后如下图

![image-20231206141655045](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206141655045.png)

```bash
$ tar -zxvf nexus-3.63.0-01-unix.tar.gz
$ cd nexus-3.63.0-01/bin
$ ./nexus /run
```

**注意**：nexus 必须使用 Java1.8，我现在用的是 Java17，提示信息让咱们配置 `INSTALL4J_JAVA_HOME`

![image-20231206145305323](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206145305323.png)

```bash
$ vim nexus
INSTALL4J_JAVA_HOME_OVERRIDE=/d/Develop/Java/jdk1.8.0_161
```

![image-20231206150123385](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206150123385.png)

显示这个之后访问：`http://localhost:8081/`，点击 Sign In

- 账号为 admin，密码粘贴 `sonatype-work/nexus3/admin.password` 里面的密码，登录成功会提示你改密码

![image-20231206150205067](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206150205067.png)

如果想更改启动端口，可以修改 `etc/nexus-default.properties` 文件

![image-20231206150804664](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206150804664.png)

### docker安装nexus

> nexus3 安装参考：
>
> - [docker-nexus3 GitHub](https://github.com/sonatype/docker-nexus3)

镜像说明：

- `sonatype/nexus` 是 nexus2 版本
- `sonatype/nexus3` 是 nexus3 版本

```bash
$ docker pull sonatype/nexus3
$ docker run -d -p 8081:8081 --name nexus sonatype/nexus

# 查看 nexus 日志
$ docker logs -f nexus
```

注意：已经有的容器，直接 docker start 即可

- `-d`：在 docker 守护线程运行这个镜像
- `-p`：绑定端口，前面的端口表示宿主机端口，后面的表示容器端口
- `--restart=always`：指定 docker 重启启动容器，当服务器或者 docker 进程重启之后，nexus 容器会在 docker 守护进程启动后由 docker 守护进程启动容器
- `--name <container-name>`：这里是指定了`容器`建立后的名称
- `sonatype/nexus3` 是镜像名

查看是否启动成功

```bash
docker ps
```

报内存不够的话输入这个

```bash
Memory: 4k page, physical 1006968k(877280k free), swap 0k(0k free)

$ docker run -d -p 8081:8081 --name nexus3 --restart=always --platform linux/amd64 -e INSTALL4J_ADD_VM_PARAMS="-Xms256M -Xmx256M -XX:MaxDirectMemorySize=2048M" sonatype/nexus3
```

用户权限不够的话输入如下内容，之后即可启动成功

```bash
WARNING: ************************************************************
WARNING: Detected execution as "root" user.  This is NOT recommended!
WARNING: ************************************************************
$ cd /opt/sonatype/nexus/bin
$ vi nexus.rc
run_as_user=root
$ vi /etc/profile
export RUN_AS_USER=root
$ vi nexus
run_as_root=true -> run_as_root=false
```

## 创建仓库

### 仓库管理

Nexus 仓库类型分为如下几种

1. hosted：本地仓库，通常我们会部署自己的构件到这一类型的仓库，如公司的第二方库
2. proxy：代理仓库，它们被用来代理远程的公共仓库，如 Maven 中央仓库
3. group：仓库组，用来合并多个 hosted/proxy 仓库，当你的项目希望在多个 repository 使用资源时就不需要多次引用了，只需要引用一个 group 即可

在创建 repository 之前，最好再创建 Blob Stores 便于统一管理，默认的是 default

![image-20231206151333577](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206151333577.png)

选择 File，名字填写为 npm

![image-20231206151428449](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206151428449.png)

### 创建仓库

之后即可创建仓库

![image-20231206151933100](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206151933100.png)

一会儿会创建 npm(group)、npm(hosted)、npm(proxy) 这几个仓库

![image-20231206151758355](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206151758355.png)

### 创建npm(hosted)

`hosted` 宿主仓库：主要用于部署无法从公共仓库获取的构件以及自己或第三方的项目构件

- 如果是内网情况（无法访问互联网）即可当 npm 总仓库
- 是否允许重复推送可以根据自己项目情况来考虑

![image-20231206153443838](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206153443838.png)

### 创建npm(proxy)

`proxy` 代理仓库：代理公共的远程仓库

![image-20231206152954330](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206152954330.png)

### 创建npm(group)

`group` 仓库组：通过仓库组统一管理多个仓库，这样我们在项目中直接请求仓库组即可请求到仓库组管理的多个仓库

- hosted 和 proxy 这两个都弄好了之后，在通过 group 聚合提供统一的访问地址

![image-20231206153604374](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206153604374.png)

### 测试

指定 npm 的 registry 为自己的 group 地址，安装 express 依赖

![image-20231206155638015](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206155638015.png)

proxy 地址由于没有对应依赖会去镜像源地址下载，之后 proxy 仓库就有对应依赖了

![image-20231206155807939](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206155807939.png)

## 创建推送包角色

### 添加角色用户

点击 Roles，添加角色权限，搜索 npm- 之后点击 `Transfer All` 把所有权限都附上即可

- 可以根据对应需求赋对应权限，比如只让上传不让修改只赋 edit 即可

![image-20231206161750869](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206161750869.png)

之后创建对应用户，并设置对应权限

![image-20231206161935295](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206161935295.png)

点击 Realms，添加 `npm Bearer Token Realm`，不然 npm publish 会报 401

![image-20231206164136875](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206164136875.png)

### 添加推送账号

> [https://blog.sonatype.com/using-sonatype-nexus-repository-3-part-2-npm-packages](https://blog.sonatype.com/using-sonatype-nexus-repository-3-part-2-npm-packages)

添加推送账号，常用如下两种方法

**npm adduser**

示例：使用 `npm adduser` 方法

```bash
$ npm adduser
Username: admin
Password: admin123
Email: (this IS public): any@email.com
```

推荐：加 `--scope` 限制作用域，加 `--registry` 限制仓库地址

```bash
$ npm adduser --registry=http://localhost:8081/repository/npm_hosted/ --scope=@mynpm
npm notice Log in on http://localhost:8081/repository/npm_hosted/
Username: npm
Email: (this IS public) ll@123.com
Logged in to scope @mynpm on http://localhost:8081/repository/npm_hosted/.
```

```bash
$ npm publish --scope=@mynpm
```

![image-20231206170241797](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206170241797.png)

### 使用.npmrc

不添加推送账号也可以使用 `.npmrc`，创建 `.npmrc` 文件，将私库地址粘贴过来

- 如果想免密登陆推送可以加上 _auth，加密规则：`user:password -> base64`

```bash
registry=http://localhost:8081/repository/npm_hosted/
# 只是举例，不推荐使用 admin 用户
_auth=YWRtaW46YWRtaW4xMjM=
email=any@email.com
```

`_auth` 加密方式：

- 可以使用浏览器自带的方法 `window.btoa` 或 `window.atob`

  ![image-20230613101343312](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230613101343312-16956948588061.png)

- 还可以使用 linux base64 命令

  ![image-20230613101349194](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230613101349194.png)

registry 也可以通过配置 package.json 来实现

```json
{
  "publishConfig": {
    "registry": "http://localhost:8081/repository/npm_hosted/"
  }
}
```

## 下载依赖包

### python下载

- 根据 `resolved` 字段进行下载

```python
# -*-coding:utf-8-*-
import json
import os
import urllib.request
from pathlib import Path

def node_modules(file_dir):
    # 通过递归遍历 node_modules 每个子包的 package.json 解析下载链接
    links = []
    for root, dirs, files in os.walk(file_dir):
        if 'package.json' in files:
            package_json_file = os.path.join(root, 'package.json')
            try:
                with open(package_json_file, 'r', encoding='UTF-8') as load_f:
                    load_dict = json.load(load_f)
                    if '_resolved' in load_dict.keys():
                        links.append(load_dict['_resolved'])
            except Exception as e:
                print(package_json_file)
                print('Error:', e)
    return links

def package_lock(package_lock_path):
    # 通过递归遍历 package-lock.json 解析下载链接
    links = []
    with open(package_lock_path, 'r', encoding='UTF-8') as load_f:
        load_dict = json.load(load_f)
        search(load_dict, "resolved", links)
    return links

def search(json_object, key, links):
    # 遍历查找指定的key
    for k in json_object:
        if k == key:
            links.append(json_object[k])
        if isinstance(json_object[k], dict):
            search(json_object[k], key, links)
        if isinstance(json_object[k], list):
            for item in json_object[k]:
                if isinstance(item, dict):
                    search(item, key, links)


def download_file(path, store_path, flag):
    # 根据下载链接下载
    if not Path(store_path).exists():
        os.makedirs(store_path, int('0755'))
    links = []
    if path.endswith("package-lock.json"):
        links = package_lock(path)
    else:
        links = node_modules(path)
    print("link resolved number:" + str(len(links)))

    for url in links:
        try:
            filename = url.split('/')[-1]
            index = filename.find('?')
            # 去掉 ? 参数和 # 哈希
            if index > 0:
                filename = filename[:index]
            index = filename.find('#')
            if index > 0:
                filename = filename[:index]
            filepath = os.path.join(store_path, filename)
            if not Path(filepath).exists():
                print("download:" + url)
                # 以防以后对请求头做限制
                opener = urllib.request.build_opener()
                opener.addheaders = [('User-agent', 'Mozilla/5.0')]
                urllib.request.install_opener(opener)
                if flag:
                    new_path = os.path.join(os.getcwd(), 'nodes')
                    if not Path(new_path).exists():
                        os.makedirs(new_path, int('0755'))
                    filepath = os.path.join(new_path, filename)
                urllib.request.urlretrieve(url, filepath)
            # else:
            # print("file already exists:", filename)
        except Exception as e:
            print('Error Url:' + url)
            print('Error:', e)


if __name__ == '__main__':
    # 通过 xxx 文件解析对应依赖树
    download_link = os.path.join(os.getcwd(), 'package-lock.json')
    # 下载文件存放的路径
    download_path = os.path.join(os.getcwd(), 'node')
    # 下载文件是否存放到一个新的路径里，默认存放到 nodes 里
    download_flag = True
    download_file(download_link, download_path, download_flag)
    print("ok")
```

### node下载

- 使用 `npm pack` 命令，下载 `.tgz` 文件

```js
const shell = require('shelljs')
const fs = require('fs')

function download(fileNames = []) {
  shell.cd('download')
  let count = 0
  fileNames.forEach(fileName => {
    const fileExec = shell.exec(`npm pack ${fileName}`, { async: true, silent: true })
    fileExec.stdout
      .on('data', () => {
        ++count
        shell.echo(`>>> ${fileName} 下载完成...`)
        if (count === fileNames.length) {
          shell.cd('..')
          shell.exit(0)
        }
      })
      .on('err', () => {
        ++count
        shell.echo(`>>> ${fileName} 下载失败！！！...`)
        if (count === fileNames.length) {
          shell.cd('..')
          shell.exit(0)
        }
      })
  })
}

function downloadByPackageJsonLockFile(depLockJsonFile = {}) {
  const nMap = new Map()
  const NotMap = new Map()
  // 总的nodes文件夹，方便下次避免重复下载
  const downloadedDir = './nodes'
  const downloadedArr = fs.readdirSync(downloadedDir)

  function getAllList(depJson) {
    if (depJson) {
      Object.keys(depJson).forEach(dep => {
        const depWithVersion = `${dep}@${depJson[dep].version}`
        let tgzFormat = `${dep}-${depJson[dep].version}.tgz`
        // eg: @babel/code-frame-7.14.5.tgz -> babel-code-frame-7.14.5.tgz
        tgzFormat = dep.startsWith('@')
          ? tgzFormat.split('/').join('-').slice(1)
          : tgzFormat
        if (!nMap.has(depWithVersion) && !downloadedArr.includes(tgzFormat)) {
          nMap.set(depWithVersion, true)
          getAllList(depJson[dep].dependencies)
        } else if (downloadedArr.includes(tgzFormat) && !NotMap.has(tgzFormat)) {
          NotMap.set(tgzFormat, true)
        }
      })
    }
  }

  getAllList(depLockJsonFile.dependencies)
  shell.echo(
    `一共${
      Array.from(NotMap.keys()).length
    }个依赖包已在${downloadedDir}目录下存在，不需要重复下载：\n`
  )
  shell.echo(`>>> 无需下载列表： \n - ${Array.from(NotMap.keys()).join('\n - ')}...\n`)
  shell.echo(`一共${Array.from(nMap.keys()).length}个依赖包待下载\n`)
  shell.echo(`>>> 待下载列表： \n - ${Array.from(nMap.keys()).join('\n - ')}...`)
  download(Array.from(nMap.keys()))
}

const pkgLock = require('./package-lock')
downloadByPackageJsonLockFile(pkgLock)
```

## 推送依赖包

### shell单线程推送

- 只使用一个线程推送，我比较常用，一般推送的包不会很多

```bash
#!/bin/bash
# 待publish文件夹地址
PACKAGE_PATH=./download
# 前端私库地址
REPOSITORY=http://localhost:8081/repository/npm_hosted/
npm login --registry=$REPOSITORY
for file in $PACKAGE_PATH/*.tgz; do
 npm publish --registry=$REPOSITORY $file
done
```

### node多线程推送

多线程推送，上传包较多可以使用，如果包过多可能会导致电脑卡死

```js
let fs = require('fs')
let path = require('path')
const { exec } = require('child_process')

// 前端私库地址
const registry = 'http://localhost:8081/repository/npm_hosted/'
const publishPosition = `npm publish --registry=${registry}`
// 待publish文件夹地址
const filesDir = './download'

fs.readdir(filesDir, (errs, files) => {
  files.forEach(file => {
    fs.stat(filesDir + file, function (err, stats) {
      if (stats.isFile()) {
        const fullFilePath = path.resolve(__dirname, filesDir + file)
        console.log(fullFilePath + ' publish 开始')
        exec(publishPosition + ' ' + fullFilePath, function (error, stdout, stderr) {
          if (error) {
            console.error(fullFilePath + ' publish 失败')
          } else {
            console.error(fullFilePath + ' publish 成功')
          }
        })
      }
    })
  })
})
```

### nexus API上传

> 官网信息见： [https://help.sonatype.com/repomanager3/rest-and-integration-api/components-api](https://help.sonatype.com/repomanager3/rest-and-integration-api/components-api)

```bash
#!/bin/bash
# 待publish文件夹地址
PACKAGE_PATH=./download
# 前端私库服务地址
PUBLISH_RESTFUL=http://localhost:8081/service/rest/v1/components?repository=npm_hosted

echo ">>> 文件所在目录：$PACKAGE_PATH <<<"
dir=$(ls -l $PACKAGE_PATH | awk '/.tgz$/ {print $NF}')
cd $PACKAGE_PATH

for file in $dir
do
  echo ">>> $PACKAGE_PATH/$file 上传开始 \n"
  ret=`curl -u admin:admin123 -X POST "$PUBLISH_RESTFUL" -H "Accept: application/json" -H "Content-Type: multipart/form-data" -F "npm.asset=@$file;type=application/x-compressed"`
  echo $ret
  echo ">>> $PACKAGE_PATH/$file 上传完成 \n"
done
```

## 问题

### 内网上传问题

1. 分析依赖锁时，有些包命名重复，导致下载错误

   比如：下载 `parse-json@4.0.0` 链接，既有可能下载的是 `@types/parse-json` 也有可能下载就是 `parse-json`，如果按文件名进行覆盖则会导致少传包

2. 上传包时，有些包的 `package.json` 里面配置 `publishConfig`

   ![image-20230823160618665](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230823160618665.png)

   - 比如：`archiver-5.0.0` 里面配置了如上 publishConfig。在内网情况下，使用 `npm i --registry=xx`，是会报错的，内网无法访问到 `https://registry.npmjs.org/`
     - 目前我想到的解决方案是：把 `archiver-5.0.0.tgz` 解压，之后解压 `archiver-5.0.0.tar`，修改 `package.json` 里面的 publishConfig，之后执行 npm publish
   - 比如：`builtins@1.0.3` 里面也配置了 publishConfig
   - 比如：`ahooks@3.7.8`、`ahooks-v3-count-1.0.0`、`hoist-non-react-statics@3.3.2`（react-redux@8 的依赖）

   **特殊**

   - 比如：`simple-update-notifier@2.0.0` 也是里面配置了 publishConfig，这个包里 scripts 命令里还会有 prepare 钩子，需要先把它去掉
   - 比如：`@ant-design/icons@4.8.1` 这个比较有特殊性，它依赖了 `@ant-design/icons-svg@4.3.1`，这两个包都配置了 publishConfig，所以需要单独推送，但是这个包里 scripts 命令里配置了 prepublishOnly 钩子，需要先把它去掉
   - 比如：`antd@5.8.4`、`antd@4.24.13` 同时配置了 prepare、prepublishOnly、postpublish 钩子，需要先把它们去掉

3. 分析依赖锁时，包下载不下来，这个就只能用笨方法（缺什么依赖，npm i 之后把对应包 tgz 包下载下来）

   比如：

   - `@vue/cli` 需要 `@types/inquirer@8.1.3`、`@types/accepts@1.3.5` 、`body-parser@1.19.2`、`qs@6.9.7`、`@vitejs/plugin-react@4.0.3`、`@types/html-minifier-terser@6.0.0`、`serve-index@1.9.1`
   - 其实这个是和第一个原因是一样的都是名重复了，导致下载不下来

### 其他问题

#### E400

仓库不允许重复推送会报 400，改为 allow redeploy

![image-20231206165353153](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206165353153.png)

#### E401

没有权限涉及情况较多：

1. 账号密码不对
2. 检查对应角色是否有对应权限
3. 比如 npm 推送以什么方式校验，`npm Bearer Token Realm`
4. token 是否过期，去根目录修改 `.npmrc` 文件，将过期 token 删除

![image-20231206162906061](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206162906061.png)

#### E403

禁止上传，group 仓库禁止上传，上传到 hosted 即可

![image-20231206164947825](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206164947825.png)

#### E503

仓库离线，改为在线即可

![image-20231206165252356](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231206165252356.png)
