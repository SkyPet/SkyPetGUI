import React from 'react';
import ReactDOM from 'react-dom';
import {TblRow, TableColumns} from './SkyPetTable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><TableColumns success={true} children={<div></div>} /></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><TblRow isEncrypted={true} attributeText="hello" msToWait={1000} /></MuiThemeProvider>, div);
});
