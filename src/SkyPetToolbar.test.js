import React from 'react';
import ReactDOM from 'react-dom';
import {CustomToolBar} from './SkyPetToolbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><CustomToolBar account="myAccount" moneyInAccount={100} contractAddress="myAddress" blockChainView="myView" /></MuiThemeProvider>, div);
});

