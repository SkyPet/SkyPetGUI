import React from 'react';
import ReactDOM from 'react-dom';
import {AboutComponent, AboutModal} from './SkyPetAbout';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><AboutComponent contractAddress="MyAddress" blockChainView="myView" /></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><AboutModal hideModal={false} onClick={()=>{}} contractAddress="MyAddress" blockChainView="myView" /></MuiThemeProvider>, div);
});


