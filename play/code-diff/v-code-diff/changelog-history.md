## ChangeLog

### 1.0.0-alpha.0

1. Remove the diff2html dependency and draw the UI by self. By getting rid of the diff2html dependency, many styling
   problems have been resolved.
2. More accurate syntax highlighting and faster highlighting speed.

### 0.3.12

1. Remove prop `syncScroll` due to bug. Synchronized scrolling is now enabled by default

### 0.3.11

1. Add prop `syncScroll` to control whether the horizontal scroll bar needs to be scrolled synchronously

### 0.3.10

1. Fixed type error when exporting

### 0.3.9

1. Make the imported highlight.js style take effect only in `.d2h-wrapper` div

### 0.3.8

1. Style adjustment, hide css `d2h-file-header`, same as vue-code-diff
2. Add prop `noDiffLineFeed`, do not diff windows line feed (CRLF) and linux line feed (LF)

### 0.3.7

1. Fix the problem of displaying "File Without Change..." when isShowNoChange is true and the old and new codes are
   different,
   then show all the source code

### 0.3.6

1. Add prop `language`, make highlighting more accurate

### 0.3.5

1. In the side-by-side mode, support left and right synchronous scrolling

### 0.3.4

1. Add Prop `trim`, it will remove the blank characters before and after the string

### 0.3.3

1. Fixed the problem of highlight failure.

### 0.3.2

1. Fixed the warning for vue2 users in console

### 0.3.1

1. Fix incorrect style when comparing text

### 0.3.0

1. Performance optimization, now rendering has better performance
2. Add Prop `diffStyle` to control whether to display word-level differences or char-level differences

### 0.2.1

1. Use the function of asynchronous rendering of the highlight code, without blocking the ui, greatly improving the page
   rendering speed
2. Add hook function (before rendering, after rendering): `before-render`, `after-render`

### 0.1.0

1. Add prop `highlight` to control whether to highlight the code.

### 0.0.4

1. Fix the problem of abnormal rendering in some browsers (such as safari)

### 0.0.3

1. Prop: `context` default value changed from 5 to 10
2. fix possible line-height conflict(such as `antd.css` in [antd-vue](https://github.com/vueComponent/ant-design-vue))

### 0.0.1

First Version.
