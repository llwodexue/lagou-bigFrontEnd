## 1.docker 启动 nexus

> nexus3 安装参考：
>
> - [docker-nexus3 GitHub](https://github.com/sonatype/docker-nexus3)
> - [【Nexus】通过Nexus搭建Npm私库](https://blog.csdn.net/qq_31635851/article/details/109333231)
> - [Docker快速部署Nexus3](https://blog.csdn.net/nthack5730/article/details/84347849?spm=1001.2014.3001.5501)

```bash
$ docker pull sonatype/nexus3
$ docker run -d -p 8081:8081 -p 8082:8082 --name nexus3 --restart=always sonatype/nexus3

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

用户权限不够的话输入这个

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

> nexus2 安装参考：
>
> - [docker 搭建 maven 私服 nexus2](https://blog.csdn.net/wsjzzcbq/article/details/89035941)
> - [nexus2架设npm私服](https://blog.csdn.net/weixin_34120274/article/details/88744322)

```bash
$ docker pull sonatype/nexus
$ docker run -d -p 8081:8081 --name nexus sonatype/nexus
```

访问 [http://localhost:8081/nexus](http://localhost:8081/nexus) 即可进入，默认账户密码：admin/admin123

## 2.设置三个 npm 库

**创建 npmHost**

![image-20221019162837106](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221019162837106.png)

**创建 npmProxy**

![image-20221019162711202](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221019162711202.png)

**创建 npmGroup**

![image-20221019163139357](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221019163139357.png)