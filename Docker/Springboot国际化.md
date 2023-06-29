## 后端以前实现方式

1. **编写国际化配置文件**
2. 使用 ResourceBundleMessageSource 管理国际化资源文件
3. 在页面使用 fmt:message 取出国际化内容

步骤：

1. 编写国际化配置文件，抽取页面需要显示的国际化消息

   ```properties
   user.jcaptcha.error=验证码错误
   user.jcaptcha.expire=验证码已失效
   user.not.exists=用户不存在/密码错误
   ```

2. SpringBoot 自动配置好了管理国际化资源文件的组件

3. 去页面获取国际化的值

   `<h1 th:text="#{user.not.exists}" />`、`[[#{user.jcaptcha.error}]]`

原理：

- 国际化 Locale（区域信息对象）；LocaleResolver（获取区域信息对象）

```java
@Configuration
public class LocaleConfig {
  /** 
 	*	默认解析器 其中locale表示默认语言,当请求中未包含语种信息，则设置默认语种
 	*	当前默认为 China zh_CN
 	*/
	@Bean
	public SessionLocaleResolver localeResolver() {
		SessionLocaleResolver localeResolver = new SessionLocaleResolver();
		localeResolver.setDefaultLocale(Locale.CHINA);
		return localeResolver;
	}
}
```

也可以自己实现解析器，比如根据地址进行判断：

- `https://element.eleme.cn?local=en-US/`
- `https://element.eleme.cn?local=zh-CN/`

```java
public class MyLocaleResolver implements localeResolver {
  @Override
  public Local resolveLocale(HttpServletRequest request) {
    String seq = request.getParameter("local");
    Locale locale = Locale.getDefault();
    if(!StringUtils.isEmpty(seq)){
      String[] split = seq.split("=");
      locale = new Locale(split[0], split[1]);
    }
    return locale
  }
}
```

## 后端现在实现方式

```java
public class Constants {
    public static final String Accept_Language = "Accept-Language";
}
```

获取语言标识 `Accept-Language`

![image-20230629104724342](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230629104724342.png)

消息提示处理

![image-20230629105045925](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230629105045925.png)

## 前端展示层

新增时存储 3 种语言数据

![image-20230629091508852](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230629091508852.png)

切换语言操作

![image-20230629091609877](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230629091609877.png)

前端设置 Accept-Language 请求头

- 剩下工作：多语言组件封装、多语言插件（i18n）的封装、多语言文字提取

![image-20230629091819259](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230629091819259.png)