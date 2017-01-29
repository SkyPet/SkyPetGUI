import React from 'react';
import ReactDOM from 'react-dom';
import {PasswordModal, SelectAttribute, SubmitPassword, EntryForm} from './SkyPetPasswords';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><PasswordModal onPassword={()=>{}} setPassword={()=>{}} hidePasswordModal={()=>{}} askForPassword={true} /></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><SelectAttribute selection={[]} value={1} onSelect={()=>{}} /></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><SubmitPassword onCreate={()=>{}} onType={()=>{}} /></MuiThemeProvider>, div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><EntryForm 
    selection={[]} 
    selectValue={100} 
    shouldDisable={true} 
    cost={100} 
    onSelect={()=>{}} 
    onText={()=>{}} 
    onSubmit={()=>{}} 
    onPassword={()=>{}} 
    isChecked={true}
    passwordError="stuff"
    hasSubmitted={true}
    formValidation={()=>{}}
    /></MuiThemeProvider>
    , div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><EntryForm 
    selection={[]} 
    selectValue={100} 
    shouldDisable={false} 
    cost={100} 
    onSelect={()=>{}} 
    onText={()=>{}} 
    onSubmit={()=>{}} 
    onPassword={()=>{}} 
    isChecked={true}
    passwordError="stuff"
    hasSubmitted={true}
    formValidation={()=>{}}
    /></MuiThemeProvider>
    , div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><EntryForm 
    selection={[]} 
    selectValue={100} 
    shouldDisable={true} 
    cost={100} 
    onSelect={()=>{}} 
    onText={()=>{}} 
    onSubmit={()=>{}} 
    onPassword={()=>{}} 
    isChecked={true}
    passwordError="stuff"
    hasSubmitted={false}
    formValidation={()=>{}}
    /></MuiThemeProvider>
    , div);
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MuiThemeProvider muiTheme={getMuiTheme()}><EntryForm 
    selection={[]} 
    selectValue={100} 
    shouldDisable={false} 
    cost={100} 
    onSelect={()=>{}} 
    onText={()=>{}} 
    onSubmit={()=>{}} 
    onPassword={()=>{}} 
    isChecked={true}
    passwordError="stuff"
    hasSubmitted={false}
    formValidation={()=>{}}
    /></MuiThemeProvider>
    , div);
});
