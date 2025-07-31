报错：CSS minification error: Lexical error on line 1: Unrecognized text.

```bash
 ERROR  Error: CSS minification error: Lexical error on line 1: Unrecognized text.

  Erroneous area:
1: $lg-search * 2
^..^. File: css/app.6b37d1b6.css
Error: CSS minification error: Lexical error on line 1: Unrecognized text.

  Erroneous area:
1: $lg-search * 
```

使用下图写法导致打包出错：css 的错误，不能识别的文本

![image-20241015102433158](https://gitee.com/lilyn/pic/raw/master/md-img/image-20241015102433158.png)

解决方案：scss 中 calc 中的变量需要以 `#{变量名}` 的方式使用

![image-20241015102641708](https://gitee.com/lilyn/pic/raw/master/md-img/image-20241015102641708.png)