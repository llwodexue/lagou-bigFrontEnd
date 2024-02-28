## RPC

随着公司规模的扩大，以及业务量的激增，单体应用逐步演化为服务/微服务的架构模式，因此便会产生不同服务之间相互调用的情况，而服务之间的调用大多采用 rpc 的方式调用

### 概述

- RPC（Remote Procedure Call）远程过程调用。网上更多的说法RPC 是一种协议，需要满足一定的规范，因为不是说一个服务调了另一个服务就算是 RPC，比如我可以通过 restremplate 调用另一个服务的 rest 接口，这也算是一个服务调用了另一个服务，但是这不能叫 RPC。
- 举例: 在微服务的设计中，一个服务 A 如果访问另一个 Module 下的服务 B，可以采用 HTTP REST 传输数据并在两个服务之间进行序列化和反序列化操作，服务 B 把执行结果返回过来。 (后端请求微信接口)

![image-20230919100800229](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230919100800229.png)

![image-20230919100938982](https://gitee.com/lilyn/pic/raw/master/md-img/image-20230919100938982.png)

RPC 需要达到的是:客户端在不知道调用细节的情况下，调用存在于远程计算机上的某个对象，就像调用本地应用程序中的对象一样

RPC 需要满足三个条件:

- 网络协议和网络 IO 模型对其透明
- 信息格式对其透明
- 应该有跨语言能力

### Dubbo

Dubbo 是阿里巴巴开源的基于 Java 的高性能 RPC 分布式服务框架，致力于提供高性能和透明化的 RPC 远程服务调用方案，以及 SOA 服务治理方案

![image-20230919152918432](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230919152918432.png)

- 工作在传输层，使用 TCP 协议传输数据
- 利用 Netty，TCP 传输，单一、异步、长连接，适合数据量少、高并发和服务提供者远远少于消费者的场景

### Feign

- Feign 是 Spring Cloud 提供的一个声明式的伪 HTTP 客户端，封装了 HTTP 调用流程，更适合面向接口化的变成习惯，它使得调用远程服务就像调用本地服务一样简单，只需要创建一个接口并添加一个注解即可
- Nacos 注册中心很好的兼容了 Feign，Feign 默认集成了 Ribbon (Ribbon 是 Netflix开源的 基于 HTTP 和 TCP 等协议负载均衡组件)，所以在 Nacos 下使用 Fegin 默认就实现了负载均衡的效果



- 工作在应用层
- Feign 本身不支持 Spring MVC 的注解，它有一套字节的注解（`@RequestLine`），OpenFeign 是 Spring Cloud 在 Feign 的基础上支持了 Spring MVC 的注解，如 `@RequestMapping` 等等
- OpenFign 的 `@FeignClient` 可以解析 SpringMVC 的 `@RequsetMapping` 注解下的接口，并通过动态代理的方式产生类，将请求调用委托到动态代理实现类
- Feign 整体框架非常小巧，在处理请求转换和消息解析的过程中，基本上没有什么时间消耗。真正影响性能的，是处理 HTTP 请求的环节
- 通过短连接的方式进行通信，不适合高并发的访问

### 总结

- 功能上 Dubbo > Feign
- Dubbo 除了注册中心需要进行整合，负载均衡、服务治理、容错机制等等都自己实现了，而 Feign 大部分功能都是依赖全家桶组件来实现的
- SpringCloud 全家桶里面（Feign、Ribbon、Hystrix），特点是非常方便。Ribbon、Hystrix、Feign 在服务治理中，配合 Spring Cloud 坐微服务，使用上有很多优势
- 如果项目对性能要求不是很严格，可以选择使用 Feign，它会用起来更方便，如果需要提高性能，避开基于 HTTP 方式的性能瓶颈，可以使用 Dubbo