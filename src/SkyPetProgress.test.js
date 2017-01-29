import React from 'react';
import ReactDOM from 'react-dom';
import {MyProgressBar, SyncWrap} from './SkyPetProgress';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><MyProgressBar value={1000} /></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><SyncWrap isSyncing={true} progress={10} children={<div></div>}/></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><SyncWrap isSyncing={false} progress={10} children={<div></div>} /></MuiThemeProvider>, div);
});