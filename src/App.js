import React, { useState, createRef } from 'react';
import { Container, Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles'
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import Role from './containers/Role'
import Fight from './containers/Fight'
import Precious from './containers/Precious'
import ClientInfo from './containers/ClientInfo'
import Server from './containers/Server'
import ServerInfo from './containers/ServerInfo'

import AccountSelector from './AccountSelector';
import Balances from './Balances';
import BlockNumber from './BlockNumber';
import Events from './Events';
import Interactor from './Interactor';
import Metadata from './Metadata';
import NodeInfo from './NodeInfo';
import TemplateModule from './TemplateModule';
import Transfer from './Transfer';
import Upgrade from './Upgrade';

const testKeyring = require('@polkadot/keyring/testing')

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  client: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    height: '50vh',
  },
  server: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    height: '50vh',
  },
  role: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    border: '1px solid gray',
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    border: '1px solid gray',
  },
}))

function Main() {
  const classes = useStyles()
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Router>
        <div className={classes.root}>
          <div className={classes.client}>
            <div className={classes.role}>
              <Switch>
                <Route path="/role" component={() => <Role />} />
                <Route path="/fight" component={Fight} />
                <Route path="/precious" component={Precious} />
                <Route path="/" component={Role} />
              </Switch>
            </div>
            <div className={classes.info}>
              <ClientInfo />
            </div>

          </div>
          <div className={classes.server}>
            <div className={classes.role}>
              <Server />
            </div>
            <div className={classes.info}>
              <ServerInfo />
            </div>
          </div>
        </div>
      </Router>
      <DeveloperConsole />
    </div>
  );
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
