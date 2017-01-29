import React,  {  Component } from 'react';
import CryptoJS from "crypto-js";
import {PasswordModal} from "./SkyPetPasswords";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
const decrypt=(password, text)=>{ //attributeText
    var decrypted="";
    try{
      decrypted=CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
    }
    catch(e){
      console.log(e);
    }
    return decrypted;
}
export class TblRow extends Component {/*=({attributeText, isEncrypted, onDecrypt, timestamp, label, wrongPassword})=>{*/
  constructor(props){
    super(props);
    this.state={
      isEncrypted:this.props.isEncrypted,
      attributeText:this.props.attributeText,
      wrongPassword:false,
      password:"",
      showPasswordModal:false
    }
  }
  componentWillReceiveProps(nextProps){
    nextProps.isEncrypted!==this.state.isEncrypted||nextProps.attributeText!==this.state.attributeText?this.setState({
      isEncrypted:nextProps.isEncrypted,
      attributeText:nextProps.attributeText
    }):"";
  }
  onDecrypt=()=>{
    this.setState({
      showPasswordModal:true
    })
  }
  onPasswordSubmit=()=>{
    const decryptedValue=decrypt(this.state.password, this.state.attributeText);
    this.setState({
      password:"",
      wrongPassword:decryptedValue?false:true,
      attributeText:decryptedValue,
      isEncrypted:decryptedValue?false:true,
      showPasswordModal:false
    }, ()=>{
      setTimeout(()=>{this.setState({wrongPassword:false})}, this.props.msToWait)
    })
  }
  setPassword=(event, value)=>{
    this.setState({
      password:value
    })
  }
  hideModal=()=>{
    this.setState({
      showPasswordModal:false
    })
  }
  render(){
    return(
      <TableRow>   
        <PasswordModal onPassword={this.onPasswordSubmit} setPassword={this.setPassword} hidePasswordModal={this.hideModal} askForPassword={this.state.showPasswordModal}/>          
        <TableRowColumn>{this.props.timestamp}</TableRowColumn>
        <TableRowColumn>{this.props.label}</TableRowColumn>
        <TableRowColumn>{this.state.isEncrypted?this.state.wrongPassword?<RaisedButton label="Wrong Password" onClick={this.onDecrypt}/>:
            <RaisedButton disabled={!this.state.isEncrypted} label="Decrypt" onClick={this.onDecrypt}/>:
          this.state.attributeText}
        </TableRowColumn>
    </TableRow>
    );
  }
}
export const TableColumns=({success, children})=>
<Table>
    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>TimeStamp</TableHeaderColumn>
        <TableHeaderColumn>Attribute</TableHeaderColumn>
        <TableHeaderColumn>Value</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    {success?
    <TableBody displayRowCheckbox={false}>
    {children}
    </TableBody>
    :null}
</Table>


TableColumns.propTypes = {
  success: React.PropTypes.bool.isRequired,
  children: React.PropTypes.node.isRequired
};
TblRow.propTypes = {
  isEncrypted: React.PropTypes.bool.isRequired,
  attributeText: React.PropTypes.string.isRequired,
  msToWait: React.PropTypes.number.isRequired
};