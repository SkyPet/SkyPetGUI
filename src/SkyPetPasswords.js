import React from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
export const PasswordModal=({onPassword, setPassword, hidePasswordModal, askForPassword})=>
<Dialog
  title="Enter Password"
  open={askForPassword}
  onRequestClose={hidePasswordModal}
>
  <SubmitPassword onCreate={onPassword} onType={setPassword}/>
</Dialog>

export const SelectAttribute=({selection, value, onSelect})=>
<SelectField 
  floatingLabelText="Select Attribute"
  onChange={onSelect}
  value={value}
  defaultValue={0}
  fullWidth={true}
>
  {selection.map((val, index)=>{
      return(<MenuItem key={index} value={index} primaryText={val}/>);
  })}
</SelectField>

export const SubmitPassword=({onCreate, onType, hasSubmitted=false, error=""})=>
<form onSubmit={(e)=>{e.preventDefault();onCreate();}}>
    <TextField autoFocus floatingLabelText="Password" type="password" onChange={onType}/>
    {hasSubmitted?<CircularProgress size={40}/>:error?<RaisedButton primary={true} label={error} />:
    <RaisedButton primary={true} label="Submit"/>}
</form>


export const EntryForm=({selection, selectValue, shouldDisable, cost, onSelect, onText, onCheck, onSubmit, onPassword, isChecked, passwordError, hasSubmitted, formValidation, onGethPassword})=>
<form onSubmit={(e)=>{e.preventDefault();formValidation()?onSubmit():"";}}>
  <SelectAttribute selection={selection} value={selectValue} onSelect={onSelect}/>
  <br/>
  <TextField
    autoFocus
    fullWidth={true}
    floatingLabelText="Value"
    disabled={shouldDisable}  onChange={onText}
  />
  <br/>
  <Checkbox 
    disabled={shouldDisable}  
    label="Add Encryption" 
    defaultChecked={true} 
    onCheck={onCheck}/>
  <br/>
  <TextField disabled={shouldDisable} fullWidth={true} floatingLabelText="SkyPet Password" type="password" onChange={onPassword}/>
  {hasSubmitted?<CircularProgress size={40}/>:
  <RaisedButton 
    fullWidth={true}
    disabled={formValidation()} 
    type="submit"
    primary={true}
   label={passwordError?passwordError:`Submit New Result (costs ${cost} Ether)`}
   onClick={onSubmit}/>}
</form>          