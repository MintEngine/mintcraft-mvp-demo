import React, { useEffect, useState, Component } from 'react';
import { useSubstrate } from '../substrate-lib';
import { makeStyles } from '@material-ui/core/styles'
import EventUtil from '../util/event.util'
const testKeyring = require('@polkadot/keyring/testing')

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
    float: 'left',
    background: '#0F173B',
  }
}))

const defaultKeyrings = testKeyring.createTestKeyring({ type: 'sr25519' })
const pairs = defaultKeyrings.getPairs()
const alice = pairs.find(one => one.meta.name === 'alice')
const bob = pairs.find(one => one.meta.name === 'bob')

const shortString = key => {
  return key.substring(0, 4) + '...' + key.substr(key.length - 4)
}

class Loginfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: []
    }
  }

  updateContent(o) {
    if (!o) return
    let newContent = [...this.state.content, o]
    this.setState({ content: newContent })
  }

  componentDidMount() {
    EventUtil.addListener(Loginfo, this.props.event, ret => {
      this.updateContent(ret)
    })
  }

  getContent() {
    let { content } = this.state
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', marginTop: '4px',
        marginLeft: '4px'
      }}>
        {
          content.map((o, index) =>
            <div key={index} style={{
              marginBottom: '10px', display: 'flex', flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <div>{o.action}:&nbsp;&nbsp;</div>
              <div>{o.hex}</div>
            </div>)
        }
      </div>
    )
  }

  render() {
    let { content } = this.state
    return (
      <div style={{
        borderTop: '1px solid gray', borderBottom: '1px solid gray',
        background: '#ddd', display: 'flex', flexDirection: 'column',
        width: '100%',
      }}>
        <div style={{ borderBottom: '1px solid gray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <div>交易列表:&nbsp;&nbsp;</div>
            <div></div>
          </div>
          <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <div>&nbsp;&nbsp;地址:&nbsp;&nbsp;</div>
            <div>{shortString(this.props.account.address)}</div>
          </div>
        </div>
        {
          this.getContent()
        }
      </div>
    )
  }
}

export default Loginfo
// export default function Loginfo(props) {
//   const classes = useStyles()
//   const { api } = useSubstrate();
//   const [content, setContent] = useState([])

//   // 服务端监听event事件，若接收到打印结果
//   useEffect(() => {
//     EventUtil.addListener(Loginfo, props.event, ret => {
//       console.log('hear event')
//       console.log(ret)
//       console.log(content)
//       let newArr = [...content, ret]
//       setContent(old => [...old, ret])
//       console.log(content)
//     })
//   }, [Loginfo, setContent, content, props.event])

//   return (
//     <div style={{
//       borderTop: '1px solid gray', borderBottom: '1px solid gray',
//       background: '#ddd', display: 'flex', flexDirection: 'column',
//       width: '100%',
//     }}>
//       <div style={{ borderBottom: '1px solid gray', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//         <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//           <div>交易列表:&nbsp;&nbsp;</div>
//           <div></div>
//         </div>
//         <div style={{ marginRight: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//           <div>&nbsp;&nbsp;地址:&nbsp;&nbsp;</div>
//           <div>{shortString(props.account.address)}</div>
//         </div>
//         {
//           content && content.length > 0
//             ?
//             content.map((o, index) => {
//               <div>
//                 <div key={index}>
//                   {o.action}
//                 </div>
//                 <div key={index}>
//                   {o.hex}
//                 </div>
//               </div>
//             })
//             : null
//         }
//       </div>
//     </div>
//   );
// }
