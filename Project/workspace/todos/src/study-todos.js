// react、react-dom 的引用是 index.ejs 文件中 import-map 中指定的版本
import React from 'react'
import ReactDOM from 'react-dom'
// single-spa-react 用于创建使用 React框架实现的微前端应用
import singleSpaReact from 'single-spa-react'
// 用于渲染在页面中的根组件
import rootComponent from './root.component'

// 指定根组件的渲染位置
const domElementGetter = () => document.getElementById("root")
// 错误边界函数
const errorBoundary = () => <div>发生错误时此处内容将会被渲染</div>

// 指定根组件在页面中的根组件
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent,
  domElementGetter,
  errorBoundary
})

// 暴露必要的生命周期函数
export const { bootstrap, mount, unmount } = lifecycles
