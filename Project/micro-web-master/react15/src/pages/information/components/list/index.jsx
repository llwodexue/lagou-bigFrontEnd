import React from 'react'
import './index.scss'

// 列表元素
import InformationItem from '../item/index.jsx'

// 分页组件
import InformationPagination from '../pagination/index.jsx';

class InformationList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: true
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
        {
          img: 'https://youjia-image.cdn.bcebos.com/modelImage/ad1c9ae9fd2d4afa9ab5164ed215dd70/1625553531324910972d.JPG@!thumbnail',
          title: '爱在大草原 吉利豪越的设计师一定是个暖男',
          number: '3026',
          type: '导购',
          status: false
        },
      ],
      page: 1,
      limit: 10,
      total: 200,
    }
  }

  setItem() {

  }

  setPage(page) {
    this.setState({
      page
    })
  }

  render() {
    const { noPagination = false } = this.props
    const { list, page, limit, total } = this.state
    return (
      <div className="information-list-container">
        {
          list.map((item, index) => {
            return (
              <InformationItem data={item} setItem={() => this.setItem()}/>
            )
          })
        }

        {/* 分页组件 */}
        {
          noPagination ? <div> </div> : <InformationPagination
            data={{
              page,
              limit,
              total
            }}
            setPage={(page) => this.setPage(page)}
          />
        }
      </div>
    )
  }
}

export default InformationList
