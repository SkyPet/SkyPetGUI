import React from 'react';
import ReactDOM from 'react-dom';
import {GethLogin} from './SkyPetCreateAccount';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
it('renders without crashing', () => {
  const div = document.createElement('div');
  
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><GethLogin msToWait={1000} text="myText" /></MuiThemeProvider>, div);
});
