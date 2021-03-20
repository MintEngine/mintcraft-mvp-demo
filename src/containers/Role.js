import React, { useEffect, useState } from 'react';
import { useSubstrate } from '../substrate-lib';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { hex2a } from '../util/string.util'

const _ = require('lodash')

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

export default function Main(props) {
  const classes = useStyles()
  const { api, keyring } = useSubstrate();
  const [roleName, setRoleName] = useState('')
  const [equip, setEquip] = useState([])
  const [roleAttr, setRoleAttr] = useState([])

  useEffect(() => {
    const alice = keyring.find(o => o.meta.name === 'alice');
    let unsubscribeAll = null;

    api.query.actor.actors(alice.address, ret => {
      let { name, equipments } = ret.value
      setRoleName(hex2a(name))
      setEquip(equipments)
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring]);

  useEffect(() => {
    const alice = keyring.find(o => o.meta.name === 'alice');
    const queryAsset = [[0, alice.address], [1, alice.address], [2, alice.address], [3, alice.address]]
    let unsubscribeAll = null;

    api.query.featuredAssets.account
      .multi(queryAsset, ret => {
        let featuredAssets = ret.map(o => o = o.toJSON())
        setRoleAttr([...featuredAssets])
      }).then(unsub => {
        unsubscribeAll = unsub;
      }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring]);

  return (
    <div style={{ margin: '8px', display: 'flex', flexDirection: 'column', height: '15px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <div>角色名:&nbsp;&nbsp;</div>
          <div>{roleName}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h2>装备:&nbsp;&nbsp;</h2>
          {
            equip.length > 0 &&
            equip.map((o, index) => {
              return (
                <span key={index}>{o}&bnsp;</span>
              )
            })
          }
        </div>
      </div>

      <div style={{
        height: '50vh - 50px', display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid gray', borderBottom: '1px solid gray'
      }}>
        {
          roleAttr.length > 0 &&
          roleAttr.map((o, index) => {
            return (
              <div key={index} style={{display: 'flex', flexDirection: 'row'}}>
                <div>Asset{index}:&nbsp;&nbsp;</div>
                <div>{o.balance}</div>
              </div>
            )
          })
        }
      </div>

      <div style={{ height: '30px', display: 'flex', flexDirection: 'row' }}>
        <Link to={`/role`} className={classes.link}>角色</Link>
        <Link to={`/fight`} className={classes.link}>历练</Link>
        <Link to={`/precious`} className={classes.link}>炼宝</Link>
      </div>

    </div>
  );
}
