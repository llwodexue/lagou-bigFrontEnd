import React, { PureComponent } from 'react'
import logRenderTime from '../hoc/log_render_time'

export class Detail extends PureComponent {
  render() {
    return (
      <div>
        <h2>Detail Page</h2>
        <ul>
          <li>数据列表1</li>
          <li>数据列表2</li>
          <li>数据列表3</li>
        </ul>
      </div>
    )
  }
}

export default logRenderTime(Detail)
