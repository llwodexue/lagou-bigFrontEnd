import ScrollView from '@/base-ui/scroll-view'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { memo, useState } from 'react'
import { TabsWrapper } from './style'

const SectionTabs = memo(props => {
  const { tabNames = [], tabClick } = props
  tabNames.push('abc')
  tabNames.push('asd')
  tabNames.push('zxc')
  tabNames.push('rty')
  tabNames.push('hll')

  const [currentIndex, setCurrentIndex] = useState(0)

  const itemClickHandle = (index, name) => {
    setCurrentIndex(index)
    tabClick(index, name)
  }
  return (
    <TabsWrapper>
      <ScrollView>
        {tabNames.map((item, index) => {
          return (
            <div
              key={index}
              className={classNames('item', { active: index === currentIndex })}
              onClick={e => itemClickHandle(index, item)}
            >
              {item}
            </div>
          )
        })}
      </ScrollView>
    </TabsWrapper>
  )
})

SectionTabs.propTypes = {
  tabNames: PropTypes.array
}

export default SectionTabs
