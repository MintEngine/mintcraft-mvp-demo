import React, { useEffect, useState } from 'react';
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

export default function Loginfo(props) {
  const classes = useStyles()
  const { api } = useSubstrate();
  const [content, setContent] = useState('')

  // 服务端监听event事件，若接收到打印结果
  useEffect(() => {
    const unsubscribe = api.query.system.events((events) => {
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log('xxxx')
        console.log(method)
        console.log(section)
        console.log(data)
        // if (section === 'dungeons' && method === 'DungeonStarted') {
        //   let newInfo = data.toJSON()
        //   EventUtil.emit('game_start', newInfo)
        //   setContent(info.join('\n'))
        // }
      });
    });
  }, [Loginfo])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
    }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
