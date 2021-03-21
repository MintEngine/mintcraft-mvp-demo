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

export default function Server(props) {
  const classes = useStyles()
  const { api } = useSubstrate();
  const [content, setContent] = useState('')

  // 服务端启动dungeons start事件
  const serverRoll = result => {
    try {
      const subscription = api.tx.dungeons
        .start(result[2])
        .signAndSend(bob, ({ events = [], status }) => {
          if (status.isInBlock) {
            EventUtil.emit('server_events', { hex: status.asInBlock.toHex(), action: 'start_dungeon', type: 'server' })

            events.forEach(({ phase, event: { data, method, section } }) => {
              if (section === 'dungeons' && method === 'DungeonStarted') {
                let newInfo = data.toJSON()
                EventUtil.emit('game_start', newInfo)
                let info = [
                  '<div>Player start game:</div>',
                  `<div>Address: ${newInfo[1]}</div>`,
                  `<div>Ticket number: ${newInfo[3]}</div>`,
                  `<div>Server Address: ${newInfo[2]}</div>`
                ]
                setContent(info.join('\n'))
              }
            });
            // subscription();
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  // 服务端监听ticket bought事件，若接收到激活server roll
  useEffect(() => {
    EventUtil.addListener(Server, 'ticket_bought', result => {
      let info = [
        '<div>Player start game:</div>',
        `<div>Address: ${result[1]}</div>`,
        `<div>Ticket number: ${result[2]}</div>`
      ]
      setContent(info.join('\n'))
      serverRoll(result)
    })
  }, [Server])

  // 服务端监听game end事件，若接收到打印结果
  useEffect(() => {
    EventUtil.addListener(Server, 'game_end', result => {
      // console.log('server receive game end event')
      setContent(result.join('\n'))
    })
  }, [Server])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      marginTop: '4px',
      marginLeft: '4px'
    }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
