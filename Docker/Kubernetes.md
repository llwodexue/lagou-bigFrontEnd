## Docker

> [https://docker.easydoc.net/](https://docker.easydoc.net/)

**编写 Dockerfile**

```dockerfile
FROM node:11
MAINTAINER easydoc.net

# 复制代码
ADD . /app

# 设置容器启动后的默认运行目录
WORKDIR /app

# 运行命令，安装依赖
# RUN 命令可以有多个，但是可以用 && 连接多个命令来减少层级。
# 例如 RUN npm install && cd /app && mkdir logs
RUN npm install --registry=https://registry.npm.taobao.org

# CMD 指令只能一个，是容器启动后执行的命令，算是程序的入口。
# 如果还需要运行其他命令可以用 && 连接，也可以写成一个shell脚本去执行。
# 例如 CMD cd /app && ./start.sh
CMD node app.js
```

**制作自己的镜像**

- `-t` 设置镜像名和版本号
- `-p` 映射容器内端口到宿主机
- `--name` 容器名字
- `-d` 后台运行

```bash
git clone https://github.com/gzyunke/test-docker.git
docker build -t test:v1 .
docker run -p 9090:9090 --name test-hello test:v1
```

**几种挂载方式**

- `bind mount` 直接把宿主机目录映射到容器内，适合挂代码目录和配置文件。可挂到多个容器上
- `volume` 由容器创建和管理，创建在宿主机，所以删除容器不会丢失，官方推荐，更高效，Linux 文件系统，适合存储数据库数据。可挂到多个容器上
- `tmpfs mount` 适合存储临时文件，存宿主机内存中。不可多容器共享

bind mount 方式用绝对路径 `-v D:/code:/app`

volume 方式，只需要一个名字 `-v db-data:/app`

```bash
docker run -p 8080:8080 --name test-hello -v D:/code:/app -d test:v1
```

**多容器通信**

创建一个名为`test-net`的网络：

```bash
docker network create test-net
```

运行 Redis 在 `test-net` 网络中，别名`redis`

```bash
docker run -d --name redis --network test-net --network-alias redis redis:latest
```

运行 Web 项目，使用同个网络

```bash
docker run -p 8080:8080 --name test -v D:/test:/app --network test-net -d test:v1
```

- `docker ps` 查看当前运行中的容器
- `docker images` 查看镜像列表
- `docker rm container-id` 删除指定 id 的容器
- `docker stop/start container-id` 停止/启动指定 id 的容器
- `docker rmi image-id` 删除指定 id 的镜像
- `docker volume ls` 查看 volume 列表
- `docker network ls` 查看网络列表

**Docker-Compose**

```yaml
version: "3.7"

services:
  app:
    build: ./
    ports:
      - 80:8080
    volumes:
      - ./:/app
    environment:
      - TZ=Asia/Shanghai
  redis:
    image: redis:5.0.13
    volumes:
      - redis:/data
    environment:
      - TZ=Asia/Shanghai

volumes:
  redis:
```

- 在后台运行只需要加一个 -d 参数`docker-compose up -d`
- 查看运行状态：`docker-compose ps`
- 停止运行：`docker-compose stop`
- 重启：`docker-compose restart`
- 重启单个服务：`docker-compose restart service-name`
- 进入容器命令行：`docker-compose exec service-name sh`
- 查看容器运行log：`docker-compose logs [service-name]`

## Kubernetes

> [https://k8s.easydoc.net/](https://k8s.easydoc.net/)

它是一个为 **容器化** 应用提供集群部署和管理的开源工具，由 Google 开发

**Kubernetes** 这个名字源于希腊语，意为“舵手”或“飞行员”。k8s 这个缩写是因为 k 和 s 之间有八个字符的关系。 Google 在 2014 年开源了 Kubernetes 项目

**主要特性：**

- 高可用，不宕机，自动灾难恢复
- 灰度更新，不影响业务正常运转
- 一键回滚到历史版本
- 方便的伸缩扩展（应用伸缩，机器加减）、提供负载均衡
- 有一个完善的生态

**Kubernetes 集群架构**

![部署示意图](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/kwob90mh.png)

**master**

主节点，控制平台，不需要很高性能，不跑任务，通常一个就行了，也可以开多个主节点来提高集群可用度。

**worker**

工作节点，可以是虚拟机或物理计算机，任务都在这里跑，机器性能需要好点；通常都有很多个，可以不断加机器扩大集群；每个工作节点由主节点管理

**重要概念 Pod**

豆荚，K8S 调度、管理的最小单位，一个 Pod 可以包含一个或多个容器，每个 Pod 有自己的虚拟IP。一个工作节点可以有多个 pod，主节点会考量负载自动调度 pod 到哪个节点运行

![集群示意图.png](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/kwoccq7d.jpeg)