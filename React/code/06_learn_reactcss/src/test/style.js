import styled from 'styled-components'
import { primaryColor, largeSize } from './style/variables'

// 1.基本使用
export const AppWrapper = styled.div`
  .footer {
    border: 1px solid orange;
  }
`

// 2.子元素单独抽取到一个样式组件
export const SectionWrapper = styled.div.attrs({
  tColor: (props => props.color) || 'blue'
})`
  border: 1px solid red;

  .title {
    font-size: ${props => props.size}px;
    color: ${props => props.tColor}px;

    &:hover {
      background-color: purple;
    }
  }

  .content {
    font-size: ${largeSize}px;
    color: ${primaryColor};
  }
`
