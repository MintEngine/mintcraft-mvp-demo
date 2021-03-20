/* eslint-disable */
import React, { useState, useRef } from 'react'
import Icon from './Icon'
import OutSideClickDetector from '../components/OutSideClickDetector'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    minWidth: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    borderRadius: '4px',
    fontSize: '14px',
    // background: 'rgba(249,250,253,1)',
    width: '100%',
    '&:focus': {
      outline: 'none',
      // background: 'rgba(255,255,255,1)',
      // boxShadow: '0px 0px 0px 0px red',
      // border: '1px solid red',
    },
  },
  left: {
    display: 'flex',
    flexGrow: 1,
    height: '40px',
    alignItems: 'center',
    marginLeft: '16px',
    cursor: 'pointer',
  },
  right: {
    marginRight: '12px',
  },
  tagWrapper: {
    margin: '8px 4px 8px 16px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  select: {
    zIndex: 10,
    display: 'flex',
    maxHeight: '250px',
    overflowY: 'auto',
    flexDirection: 'column',
    position: 'absolute',
    top: '50px',
    width: '100%',
    // height: '300px',
    background: 'rgba(255,255,255,1)',
    boxShadow: '0px 6px 10px 0px rgba(69,73,91,0.2)',
    borderRadius: '4px',
  },
  inputWrapper: {
    margin: '16px',
  },
  input: {
    display: 'flex'
  },
  listsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: '56px',
    cursor: 'pointer',
    background: 'rgba(255,255,255,1)',
    boxShadow: 'inset 0px -1px 0px 0px rgba(244,245,250,1)',
    '&:hover': {
      background: 'rgba(249,250,253,1)',
      // background: 'white',
      // boxShadow: '0px 6px 10px 0px rgba(69,73,91,.8)',
    },
  },
  listLeft: {
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    margin: '20px 0 20px 16px',
    height: '16px',
    fontSize: '14px',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    color: 'rgba(70,72,85,1)',
    lineHeight: '16px',
  },
  listRight: {
    margin: '16px',
  },
  tag: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '24px',
    background: 'rgba(93,189,234,0.15)',
    borderRadius: '4px',
    margin: '2px 4px',
  },
  tagItem: {
    padding: '6px 4px 6px 10px',
    height: '12px',
    fontSize: '12px',
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    color: 'rgba(70,72,85,1)',
    lineHeight: '12px',
  },
  tagIcon: {
    paddingRight: '4px',
  }
}))

export default function PlotDrowndown(props) {
  const classes = useStyles()
  const innerRef = useRef(null)
  const [showSelect, setShowSelect] = useState(false)
  OutSideClickDetector(innerRef, ret => showSelect && ret ? setShowSelect(false) : null)

  const handleShowSelect = () => {
    if (props.disabled) return
    setShowSelect(!showSelect)
  }

  let className = []
  className.push(classes.root)
  if (props.className) {
    className.push(props.className)
  }
  const handleOnClick = obj => {
    if (!props.option || obj.key !== props.option.key) {
      props.onChange(obj)
    }
    if (showSelect) setShowSelect(false)
  }

  let style = showSelect ? { background: 'rgba(255,255,255,1)', boxShadow: '-1px 1px 8px 0px rgba(126,114,242,0.3)', border: '1px solid rgba(137,142,255,1)', } : null
  if (props.style) {
    style = {...style, ...props.style}
  }

  return (
    <div className={className.join(' ')} tabIndex={1} ref={innerRef} style={style}>
      {
        showSelect &&
        <div className={classes.select}>
          {
            props.options ? props.options.map((obj, index) => {
              return (
                <React.Fragment key={index}>
                  <div className={classes.list} onClick={() => handleOnClick(obj)}>
                    <div className={classes.listLeft}>
                      {obj.name}
                    </div>
                  </div>
                </React.Fragment>
              )
            })
              :
              null
          }
        </div>
      }
      <div className={classes.left} onClick={handleShowSelect}>
        {props.option && props.option.name ? props.option.name : ''}
      </div>
      <Icon disabled={props.disabled} color='#c0c4d3' className={classes.right} name={showSelect ? 'up_arrow' : 'down_arrow'} onClick={handleShowSelect} />
    </div>
  )
}