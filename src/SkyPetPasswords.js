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
  {selection.map((val, index)=>(
    <MenuItem key={index} value={index} primaryText={val}/>
  ))}
</SelectField>

export const SubmitPassword=({onCreate, onType, hasSubmitted=false, error=""})=>
<form onSubmit={(e)=>{e.preventDefault();onCreate();}}>
    <TextField autoFocus floatingLabelText="Password" type="password" onChange={onType}/>
    {hasSubmitted?<CircularProgress size={40}/>:error?<RaisedButton type="submit" primary={true} label={error} />:
    <RaisedButton type="submit" primary={true} label="Submit"/>}
</form>



 export const EntryForm =({selection, selectValue, shouldDisable, cost, onSelect, onText, onCheck, onSubmit, onPassword, passwordError, hasSubmitted, formValidation})=>
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
  <TextField 
    disabled={shouldDisable} 
    fullWidth={true} 
    floatingLabelText="SkyPet Password" 
    type="password" 
    onChange={onPassword}
  />
  {hasSubmitted?<CircularProgress size={40}/>:
  <RaisedButton 
    fullWidth={true}
    disabled={formValidation()} 
    type="submit"
    primary={true}
   label={passwordError?passwordError:`Submit New Result (costs ${cost} Ether)`}
   onClick={onSubmit}/>}
</form>          

PasswordModal.propTypes = {
  onPassword:React.PropTypes.func.isRequired,
  setPassword:React.PropTypes.func.isRequired,
  hidePasswordModal:React.PropTypes.func.isRequired,
  askForPassword:React.PropTypes.bool.isRequired
};
SelectAttribute.propTypes = {
  selection:React.PropTypes.array.isRequired, 
  value:React.PropTypes.number.isRequired, 
  onSelect:React.PropTypes.func.isRequired
};
SubmitPassword.propTypes = {
  onCreate:React.PropTypes.func.isRequired,
  onType:React.PropTypes.func.isRequired,
  hasSubmitted:React.PropTypes.bool, 
  error:React.PropTypes.string
};
EntryForm.propTypes = {
  selection:React.PropTypes.array.isRequired, 
  selectValue:React.PropTypes.number.isRequired, 
  shouldDisable:React.PropTypes.bool.isRequired, 
  cost:React.PropTypes.number.isRequired, 
  onSelect:React.PropTypes.func.isRequired, 
  onText:React.PropTypes.func.isRequired, 
  onCheck:React.PropTypes.func.isRequired, 
  onSubmit:React.PropTypes.func.isRequired, 
  onPassword:React.PropTypes.func.isRequired, 
  passwordError:React.PropTypes.string.isRequired, 
  hasSubmitted:React.PropTypes.bool.isRequired, 
  formValidation:React.PropTypes.func.isRequired
};