1. `<Suspense>`（react） 不能套在 `Provider`（react-redux）外面

   - 比如：折叠面板从 redux 取值部分时候会失效

   ```jsx
   // 错误写法
   <Suspense fallback={ <Spin /> }>
     <Provider store={store}>...</Provider>
   </Suspense>
   ```

   原理待研究！

2. craco 执行时 `craco.config.js` 里是不能直接拿到 env 配置的（没有使用 dotenv 加载），加载 env 配置是 create-react-app 做的

   - 比如：你想在 `craco.config.js` 的 proxy 配置里使用 env 变量，直接使用是不行的

   解决方法：

   - 可以使用 [https://github.com/sholladay/envy](https://github.com/sholladay/envy) 或 [https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)
   - 在执行脚本时加上 env 变量，`cross-env REACT_APP_BASE_API=/api craco start`

3. antd4 升级至 antd5

   [从 v4 到 v5](https://ant.design/docs/react/migration-v5-cn/)

4. 打包注意

   - 默认情况 `?.`（可选链运算符） 和 `??`（空值合并运算符）不会向下编译，转为兼容写法

5. useState 改变值不能立刻获取到最新的状态

   解决方案：

   - [react 函数组件中使用 useState 改变值后立刻获取最新值](https://segmentfault.com/a/1190000039365818)

     react 合成事件中改变状态是异步的，出于减少 render 次数，react 会收集所有状态变更，然后对比优化，最后做一次变更
   
   比如：分页组件，设置完 pageNumber 和 pageSize 的值后立即请求列表接口，这样拿到的值其实是上一次的值
   
   ```js
   const [pageNumber, setPageNumber] = useState(1)
   const [pageSize, setPageSize] = useState(10)
   
   const onPageChange = (pageNumber, pageSize) => {
     setPageNumber(pageNumber)
     setPageSize(pageSize)
     getList()
   }
   ```
   
   正确写法如下
   
   ```js
   const page = useRef({
     pageNumber: 1,
     pageSize: 10
   })
   
   const onPageChange = (pageNumber, pageSize) => {
     page.current = {
       pageNumber,
       pageSize
     }
     getList()
   }
   ```
   
   

